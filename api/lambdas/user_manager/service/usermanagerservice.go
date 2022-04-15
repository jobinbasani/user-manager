package service

import (
	"context"
	"errors"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
	"net/http"
)

// UserManagerService represents the various operations related to User management
type UserManagerService struct {
	openapi.UserManagementApiService
	config      *config.Config
	authService AuthService
}

// GetUser returns the user profile
func (u *UserManagerService) GetUser(ctx context.Context) (openapi.ImplResponse, error) {
	user, err := u.authService.GetUserInfoByAccessToken(ctx)
	if err != nil {
		return openapi.ImplResponse{
			Code: http.StatusNotFound,
			Body: nil,
		}, errors.New("unable to lookup user information")
	}
	return openapi.ImplResponse{
		Code: http.StatusOK,
		Body: user,
	}, nil
}

// NewUserManagerService creates a new UserManagerService
func NewUserManagerService(cfg *config.Config, authService AuthService) openapi.UserManagementApiServicer {
	return &UserManagerService{
		config:      cfg,
		authService: authService,
	}
}
