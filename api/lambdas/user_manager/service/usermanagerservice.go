package service

import (
	"context"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
)

type UserManagerService struct {
	openapi.UserManagementApiService
	config *config.Config
}

func (u *UserManagerService) GetUser(ctx context.Context) (openapi.ImplResponse, error) {
	user := openapi.User{DisplayName: "Jobin"}
	return openapi.ImplResponse{
		Code: 200,
		Body: user,
	}, nil
}

func NewUserManagerService(cfg *config.Config) openapi.UserManagementApiServicer {
	return &UserManagerService{
		config: cfg,
	}
}
