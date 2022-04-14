package util

import (
	"context"
)

// ContextKey can be used as a key to add values to Context
type ContextKey string

// UserIDContextKey is the key used to set the user id in Context
const UserIDContextKey = "UserInfo"
const UserAccessTokenContextKey = "UserAccessToken"

func GetUserIDFromContext(ctx context.Context) string {
	userID := ctx.Value(UserIDContextKey).(string)
	return userID
}

func GetUserAccessTokenFromContext(ctx context.Context) string {
	accessToken := ctx.Value(UserAccessTokenContextKey).(string)
	return accessToken
}
