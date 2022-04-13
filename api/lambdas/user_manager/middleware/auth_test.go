package middleware

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"encoding/json"
	"fmt"
	"lambdas/user_manager/config"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/lestrrat-go/jwx/v2/jwk"
	"github.com/stretchr/testify/require"
)

func Test(t *testing.T) {

	rsaKey, err := rsa.GenerateKey(rand.Reader, 2048)
	require.NoError(t, err)

	key, err := jwk.FromRaw(rsaKey)
	err = key.Set(jwk.KeyIDKey, "testkey")
	require.NoError(t, err)

	buf, err := json.MarshalIndent(key, "", "  ")
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

	jwksUrl := fmt.Sprintf("http://%s/.well-known/jwks.json", u.Host)

	req, err := http.NewRequest(http.MethodGet, "/test/request", nil)
	require.NoError(t, err)

	rr := httptest.NewRecorder()

	cfg := &config.Config{}
	var userManagerJwkCache config.UserManagerJwkCache
	err = userManagerJwkCache.Set(jwksUrl)
	cfg.JwkCache = &userManagerJwkCache
	require.NoError(t, err)

	DoAuth(context.Background(), cfg)(nil).ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	req.Header.Add("Authorization", "Bearer abc")

	DoAuth(context.Background(), cfg)(nil).ServeHTTP(rr, req)
}
