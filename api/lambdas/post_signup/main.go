package main

import (
	"context"
	"errors"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"lambdas/post_signup/signupconfig"
	"lambdas/post_signup/signupservice"
)

var cfg *signupconfig.Config

func handler(ctx context.Context, event events.CognitoEventUserPoolsPostConfirmation) (events.CognitoEventUserPoolsPostConfirmation, error) {
	if cfg == nil {
		cfg = signupconfig.Configure(ctx)
	}
	signupDataService := signupservice.NewDataService(cfg)
	signupAuthService := signupservice.NewAuthService(cfg)
	email, ok := event.Request.UserAttributes["email"]
	if !ok {
		return event, errors.New("email field could not be extracted")
	}
	fmt.Printf("PostConfirmation for user: %s\n", email)
	confirmUser := false
	if cfg.RequireAdminApprovalPostSignup {
		isPresent, err := signupDataService.IsEmailPresent(ctx, email)
		if err != nil {
			return event, err
		}
		if isPresent {
			confirmUser = true
		}
	} else {
		confirmUser = true
	}
	if confirmUser {
		err := signupAuthService.ConfirmUser(ctx, event.UserName, event.UserPoolID)
		if err != nil {
			return event, err
		}
	}
	return event, nil
}

func main() {
	lambda.Start(handler)
}
