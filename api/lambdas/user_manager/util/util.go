package util

import (
	"context"
)

// ContextKey can be used as a key to add values to Context
type ContextKey string

// UserIdContextKey is the key used to set the user id in Context
const UserIdContextKey = "UserInfo"
const UserAccessTokenContextKey = "UserAccessToken"

func GetUserIdFromContext(ctx context.Context) string {
	userId := ctx.Value(UserIdContextKey).(string)
	return userId
}

func GetUserAccessTokenFromContext(ctx context.Context) string {
	accessToken := ctx.Value(UserAccessTokenContextKey).(string)
	return accessToken
}
