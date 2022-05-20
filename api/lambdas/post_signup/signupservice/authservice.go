package signupservice

import (
	"context"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider/types"
	"lambdas/post_signup/signupconfig"
)

type SignupAuthService interface {
	ConfirmUser(ctx context.Context, userName string, userPoolId string) error
}

type SignupCognitoService struct {
	cfg    *signupconfig.Config
	client *cognitoidentityprovider.Client
}

func (s SignupCognitoService) ConfirmUser(ctx context.Context, userName string, userPoolId string) error {
	updateInput := &cognitoidentityprovider.AdminUpdateUserAttributesInput{
		UserAttributes: []types.AttributeType{
			{
				Name:  aws.String(s.cfg.ApprovedUserAttribute),
				Value: aws.String("true"),
			},
		},
		UserPoolId: &userPoolId,
		Username:   &userName,
	}
	_, err := s.client.AdminUpdateUserAttributes(ctx, updateInput)
	return err
}

func NewAuthService(cfg *signupconfig.Config) SignupAuthService {

	return &SignupCognitoService{
		cfg:    cfg,
		client: cognitoidentityprovider.NewFromConfig(cfg.AwsConfig),
	}
}
