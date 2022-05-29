package middleware

import (
	"context"
	"fmt"
	"lambdas/user_manager/config"
	"lambdas/user_manager/util"
	"net/http"
	"strings"

	"github.com/lestrrat-go/jwx/v2/jwt"
)

// BearerSchema represents the schema that should be included in the Authorization header
const (
	BearerSchema = "Bearer "
	apiBasePath  = "/api/v1/"
	adminGroup   = "admin"
	groupsClaim  = "cognito:groups"
)

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
			adminAPIPath := apiBasePath + adminGroup
			if strings.HasPrefix(r.URL.Path, adminAPIPath) {
				claims := t.PrivateClaims()
				groups, exists := claims[groupsClaim]
				if !exists {
					http.Error(w, "No permissions", http.StatusForbidden)
					return
				}
				allGroups, ok := groups.([]interface{})
				if ok {
					userGroups := make(map[string]bool)
					for _, g := range allGroups {
						userGroups[fmt.Sprintf("%v", g)] = true
					}
					_, isAdmin := userGroups[adminGroup]
					if !isAdmin {
						http.Error(w, "No permissions", http.StatusForbidden)
						return
					}
				} else {
					http.Error(w, "Unable to read groups from token", http.StatusForbidden)
					return
				}
			}
			ctx := context.WithValue(r.Context(), util.UserAccessTokenParsedContextKey, t)
			ctx = context.WithValue(ctx, util.UserAccessTokenContextKey, token)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
