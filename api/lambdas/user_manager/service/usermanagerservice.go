package service

import (
	"context"
	"errors"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
	"log"
	"net/http"
)

// UserManagerService represents the various operations related to User management
type UserManagerService struct {
	openapi.UserManagementApiService
	openapi.FamilyManagementApiService
	config      *config.Config
	authService AuthService
	dataService DataService
}

// GetUser returns the user profile
func (u *UserManagerService) GetUser(ctx context.Context) (openapi.ImplResponse, error) {
	user, err := u.authService.GetUserInfoByAccessToken(ctx)
	if err != nil {
		log.Println(err)
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

func (u *UserManagerService) AddUpdateUserFamily(ctx context.Context, userData []openapi.UserData) (openapi.ImplResponse, error) {

	return openapi.ImplResponse{}, nil
}

// NewUserManagerService creates a new UserManagerService
func NewUserManagerService(cfg *config.Config, authService AuthService, dataService DataService) openapi.UserManagementApiServicer {
	return &UserManagerService{
		config:      cfg,
		authService: authService,
		dataService: dataService,
	}
}
