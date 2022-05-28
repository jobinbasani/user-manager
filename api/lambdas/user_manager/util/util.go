package util

import (
	"context"
	"github.com/lestrrat-go/jwx/v2/jwt"
)

// ContextKey can be used as a key to add values to Context
type ContextKey string

// UserAccessTokenContextKey is the key used to set the user access token in Context
const UserAccessTokenContextKey = "UserAccessToken"

// UserAccessTokenParsedContextKey is the Go representation of the access token
const UserAccessTokenParsedContextKey = "UserAccessTokenParsed"

func GetUserIDFromContext(ctx context.Context) string {
	token := ctx.Value(UserAccessTokenParsedContextKey).(jwt.Token)
	return token.Subject()
}

func GetUserAccessTokenFromContext(ctx context.Context) string {
	accessToken := ctx.Value(UserAccessTokenContextKey).(string)
	return accessToken
}
