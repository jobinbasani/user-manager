package service

import (
	"context"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
)

// UserManagerService represents the various operations related to User management
type UserManagerService struct {
	openapi.UserManagementApiService
	config *config.Config
}

// GetUser returns the user profile
func (u *UserManagerService) GetUser(ctx context.Context) (openapi.ImplResponse, error) {
	user := openapi.User{DisplayName: "Jobin"}
	return openapi.ImplResponse{
		Code: 200,
		Body: user,
	}, nil
}

// NewUserManagerService creates a new UserManagerService
func NewUserManagerService(cfg *config.Config) openapi.UserManagementApiServicer {
	return &UserManagerService{
		config: cfg,
	}
}
