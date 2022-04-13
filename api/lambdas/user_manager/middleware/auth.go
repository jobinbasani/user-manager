package middleware

import (
	"context"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/util"
	"net/http"

	"github.com/lestrrat-go/jwx/v2/jwt"
)

// BearerSchema represents the schema that should be included in the Authorization header
const BearerSchema = "Bearer "

// DoAuth verifies that a Bearer token is provided and is valid
func DoAuth(ctx context.Context, config *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if len(authHeader) < len(BearerSchema) {
				http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
				return
			}
			token := authHeader[len(BearerSchema):]
			jwks, err := config.JwkCache.Get(ctx)
			if err != nil || jwks == nil || jwks.Len() == 0 {
				http.Error(w, "Couldn't load JWT Signature validation keys", http.StatusInternalServerError)
				return
			}
			t, err := jwt.Parse([]byte(token), jwt.WithKeySet(jwks), jwt.WithValidate(true))
			if err != nil {
				http.Error(w, "Invalid token", http.StatusForbidden)
				return
			}
			userInfo := openapi.User{
				Id: t.Subject(),
			}
			ctx := context.WithValue(r.Context(), util.UserInfoContextKey, userInfo)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
