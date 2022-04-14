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
	"time"

	"github.com/lestrrat-go/jwx/v2/jwa"
	"github.com/lestrrat-go/jwx/v2/jwt"

	"github.com/lestrrat-go/jwx/v2/jwk"
	"github.com/stretchr/testify/require"
)

func TestBearerTokenAuth(t *testing.T) {

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

	values := []struct {
		testName           string
		jwksURL            string
		bearerTokenFunc    func() string
		expectedStatusCode int
	}{
		{
			testName: "test empty bearer token",
			jwksURL:  "http://invalid-jwks-url",
			bearerTokenFunc: func() string {
				return ""
			},
			expectedStatusCode: http.StatusUnauthorized,
		},
		{
			testName: "test invalid bearer token",
			jwksURL:  fmt.Sprintf("http://%s/.well-known/jwks.json", u.Host),
			bearerTokenFunc: func() string {
				return "Bearer abc"
			},
			expectedStatusCode: http.StatusForbidden,
		},
		{
			testName: "test invalid JWKS url",
			jwksURL:  "http://invalid-jwks-url",
			bearerTokenFunc: func() string {
				return "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
			},
			expectedStatusCode: http.StatusInternalServerError,
		},
		{
			testName: "test bearer token with invalid signature",
			jwksURL:  fmt.Sprintf("http://%s/.well-known/jwks.json", u.Host),
			bearerTokenFunc: func() string {
				return "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
			},
			expectedStatusCode: http.StatusForbidden,
		},
		{
			testName: "test bearer token with correct signature",
			jwksURL:  fmt.Sprintf("http://%s/.well-known/jwks.json", u.Host),
			bearerTokenFunc: func() string {
				testJwt, err := jwt.NewBuilder().
					Subject("test_sub").
					IssuedAt(time.Now()).
					Expiration(time.Now().Add(time.Hour * 2)).
					Build()
				require.NoError(t, err)

				signed, err := jwt.Sign(testJwt, jwt.WithKey(jwa.RS256, key))
				require.NoError(t, err)
				return fmt.Sprintf("Bearer %s", string(signed))
			},
			expectedStatusCode: http.StatusOK,
		},
	}

	for _, v := range values {
		t.Logf("Executing test case '%s'", v.testName)

		req, err := http.NewRequest(http.MethodGet, "/test/request", nil)
		require.NoError(t, err)
		req.Header.Add("Authorization", v.bearerTokenFunc())

		rr := httptest.NewRecorder()

		cfg := &config.Config{}
		var userManagerJwkCache config.UserManagerJwkCache
		err = userManagerJwkCache.Set(v.jwksURL)
		require.NoError(t, err)
		cfg.JwkCache = &userManagerJwkCache

		DoAuth(context.Background(), cfg)(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {})).ServeHTTP(rr, req)
		require.Equalf(t, rr.Code, v.expectedStatusCode, "Received wrong status code")
	}

}
