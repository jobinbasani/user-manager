package service

import (
	"context"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/util"
	"log"

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
		log.Println(err)
		return openapi.User{}, err
	}
	var user openapi.User
	for _, attr := range userOutput.UserAttributes {
		switch *attr.Name {
		case "sub":
			user.Id = *attr.Value
		case "given_name":
			user.FirstName = *attr.Value
		case "family_name":
			user.LastName = *attr.Value
		case "email":
			user.Email = *attr.Value
		}
	}
	return user, nil
}

func NewAuthService(cfg *config.Config) AuthService {

	return CognitoService{
		cfg:    cfg,
		client: cognitoidentityprovider.NewFromConfig(cfg.AwsConfig),
	}
}
