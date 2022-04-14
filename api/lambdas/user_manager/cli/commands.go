package main

import (
	"context"
	"fmt"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/urfave/cli/v2"
	"lambdas/user_manager/config"
	"lambdas/user_manager/service"
	"lambdas/user_manager/util"
)

func newGetUserInfoCommand() *cli.Command {
	return &cli.Command{
		Name:    "userinfo",
		Aliases: []string{},
		Usage:   "Get User Info",
		Action:  getUserInfoAction,
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:     "access_token",
				Required: true,
				Usage:    "User's access token",
			},
		},
	}
}

func getUserInfoAction(c *cli.Context) error {
	token := c.String("access_token")
	ctx := context.WithValue(c.Context, util.UserAccessTokenContextKey, token)
	cfg := &config.Config{}
	var err error
	cfg.AwsConfig, err = awsconfig.LoadDefaultConfig(ctx)
	if err != nil {
		return err
	}
	authService := service.NewAuthService(cfg)
	user, err := authService.GetUserInfo(ctx)
	if err != nil {
		return err
	}
	fmt.Println(user)
	return nil
}
