package middleware

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"encoding/json"
	"fmt"
	"github.com/lestrrat-go/jwx/v2/jwa"
	"github.com/lestrrat-go/jwx/v2/jwt"
	"lambdas/user_manager/config"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
	"time"

	"github.com/lestrrat-go/jwx/v2/jwk"
	"github.com/stretchr/testify/require"
)

func Test(t *testing.T) {

	rsaKey, err := rsa.GenerateKey(rand.Reader, 2048)
	require.NoError(t, err)

	key, err := jwk.FromRaw(rsaKey)
	err = key.Set(jwk.KeyIDKey, "testkey")
	require.NoError(t, err)
	err = key.Set(jwk.AlgorithmKey, jwa.RS256)
	require.NoError(t, err)
	publicKey, err := key.PublicKey()
	require.NoError(t, err)
	buf, err := json.MarshalIndent(publicKey, "", "  ")
	require.NoError(t, err)

	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		_, err := w.Write(buf)
		require.NoError(t, err)
	}))
	defer srv.Close()

	u, err := url.Parse(srv.URL)
	require.NoError(t, err)

	jwksURL := fmt.Sprintf("http://%s/.well-known/jwks.json", u.Host)

	req, err := http.NewRequest(http.MethodGet, "/test/request", nil)
	require.NoError(t, err)

	rr := httptest.NewRecorder()

	cfg := &config.Config{}

	DoAuth(context.Background(), cfg)(nil).ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	var userManagerJwkCache config.UserManagerJwkCache
	err = userManagerJwkCache.Set("http://invalid-jwks-url")
	cfg.JwkCache = &userManagerJwkCache

	req, err = http.NewRequest(http.MethodGet, "/test/request", nil)
	req.Header.Add("Authorization", "Bearer abc")

	DoAuth(context.Background(), cfg)(nil).ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	err = userManagerJwkCache.Set(jwksURL)
	require.NoError(t, err)

	DoAuth(context.Background(), cfg)(nil).ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	req, err = http.NewRequest(http.MethodGet, "/test/request", nil)
	req.Header.Add("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")

	DoAuth(context.Background(), cfg)(nil).ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	testJwt, err := jwt.NewBuilder().
		Subject("test_sub").
		IssuedAt(time.Now()).
		Expiration(time.Now().Add(time.Hour * 2)).
		Build()
	require.NoError(t, err)

	signed, err := jwt.Sign(testJwt, jwt.WithKey(jwa.RS256, key))
	require.NoError(t, err)

	req, err = http.NewRequest(http.MethodGet, "/test/request", nil)
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", string(signed)))

	DoAuth(context.Background(), cfg)(nil).ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

}
