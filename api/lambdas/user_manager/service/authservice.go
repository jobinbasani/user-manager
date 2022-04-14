package service

import (
	"context"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/util"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
)

type AuthService interface {
	GetUserInfo(ctx context.Context) (openapi.User, error)
}

type CognitoService struct {
	cfg    *config.Config
	client *cognitoidentityprovider.Client
}

func (c CognitoService) GetUserInfo(ctx context.Context) (openapi.User, error) {
	userOutput, err := c.client.GetUser(ctx, &cognitoidentityprovider.GetUserInput{
		AccessToken: aws.String(util.GetUserAccessTokenFromContext(ctx)),
	})
	if err != nil {
		return openapi.User{}, err
	}
	return openapi.User{
		Id: *userOutput.Username,
	}, nil
}

func NewAuthService(cfg *config.Config) AuthService {

	return CognitoService{
		cfg:    cfg,
		client: cognitoidentityprovider.NewFromConfig(cfg.AwsConfig),
	}
}
