package service

import (
	"context"
	"fmt"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/util"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider/types"
)

type AuthService interface {
	GetUserInfoByAccessToken(ctx context.Context) (openapi.User, error)
	GetUserInfoBySub(ctx context.Context, sub string) (openapi.User, error)
	GetUserInfoByEmail(ctx context.Context, email string) (openapi.User, error)
}

type CognitoService struct {
	cfg    *config.Config
	client *cognitoidentityprovider.Client
}

func (c CognitoService) GetUserInfoByEmail(ctx context.Context, email string) (openapi.User, error) {
	return c.getUserInfoByAttribute(ctx, fmt.Sprintf("email = \"%s\"", email))
}

func (c CognitoService) GetUserInfoBySub(ctx context.Context, sub string) (openapi.User, error) {
	return c.getUserInfoByAttribute(ctx, fmt.Sprintf("sub = \"%s\"", sub))
}

func (c CognitoService) getUserInfoByAttribute(ctx context.Context, attribute string) (openapi.User, error) {
	output, err := c.client.ListUsers(ctx, &cognitoidentityprovider.ListUsersInput{
		UserPoolId: aws.String(c.cfg.CognitoUserPoolID),
		Filter:     aws.String(attribute),
	})
	if err != nil {
		return openapi.User{}, err
	}
	if len(output.Users) == 0 {
		return openapi.User{}, fmt.Errorf("no user with '%s' found", attribute)
	}
	return c.cognitoUserOutputToUserRecord(output.Users[0].Attributes), nil
}

func (c CognitoService) GetUserInfoByAccessToken(ctx context.Context) (openapi.User, error) {
	userOutput, err := c.client.GetUser(ctx, &cognitoidentityprovider.GetUserInput{
		AccessToken: aws.String(util.GetUserAccessTokenFromContext(ctx)),
	})
	if err != nil {
		log.Println(err)
		return openapi.User{}, err
	}
	return c.cognitoUserOutputToUserRecord(userOutput.UserAttributes), nil
}

func (c CognitoService) cognitoUserOutputToUserRecord(attributes []types.AttributeType) openapi.User {
	var user openapi.User
	for _, attribute := range attributes {
		switch *attribute.Name {
		case "sub":
			user.Id = *attribute.Value
		case "given_name":
			user.FirstName = *attribute.Value
		case "family_name":
			user.LastName = *attribute.Value
		case "email":
			user.Email = *attribute.Value
		}
	}
	return user
}

func NewAuthService(cfg *config.Config) AuthService {

	return CognitoService{
		cfg:    cfg,
		client: cognitoidentityprovider.NewFromConfig(cfg.AwsConfig),
	}
}
