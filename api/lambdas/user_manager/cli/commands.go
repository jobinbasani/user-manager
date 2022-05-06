package main

import (
	"context"
	"fmt"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/labstack/gommon/log"
	"github.com/urfave/cli/v2"
	"github.com/ztrue/shutdown"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/routes"
	"lambdas/user_manager/service"
	"lambdas/user_manager/util"
	"net"
	"net/http"
	"os"
	"time"
)

func newGetUserInfoCommand() *cli.Command {
	return &cli.Command{
		Name:    "tokeninfo",
		Aliases: []string{},
		Usage:   "Get User Info by Access Token",
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

func newGetUserInfoBySubCommand() *cli.Command {
	return &cli.Command{
		Name:    "subinfo",
		Aliases: []string{},
		Usage:   "Get User Info by sub",
		Action:  getUserInfoBySubAction,
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:     "sub",
				Required: true,
				Usage:    "Value of sub",
			},
			&cli.StringFlag{
				Name:     "pool_id",
				Required: true,
				Usage:    "Cognito User Pool ID",
			},
		},
	}
}

func newGetUserInfoByEmailCommand() *cli.Command {
	return &cli.Command{
		Name:    "emailinfo",
		Aliases: []string{},
		Usage:   "Get User Info by email",
		Action:  getUserInfoByEmailAction,
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:     "email",
				Required: true,
				Usage:    "Email ID of user",
			},
			&cli.StringFlag{
				Name:     "pool_id",
				Required: true,
				Usage:    "Cognito User Pool ID",
			},
		},
	}
}

func newStartServerCommand() *cli.Command {
	return &cli.Command{
		Name:    "server",
		Aliases: []string{},
		Usage:   "Get User Info by sub",
		Action:  getStartServerAction,
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
	user, err := authService.GetUserInfoByAccessToken(ctx)
	if err != nil {
		return err
	}
	fmt.Println(user)
	return nil
}

func getUserInfoBySubAction(c *cli.Context) error {
	sub := c.String("sub")
	poolID := c.String("pool_id")
	user, err := getUserInfoByAttribute(c, poolID, "sub", sub)
	if err != nil {
		return err
	}
	fmt.Println(user)
	return nil
}

func getUserInfoByEmailAction(c *cli.Context) error {
	email := c.String("email")
	poolID := c.String("pool_id")
	user, err := getUserInfoByAttribute(c, poolID, "email", email)
	if err != nil {
		return err
	}
	fmt.Println(user)
	return nil
}

func getUserInfoByAttribute(c *cli.Context, poolID string, attributeType string, attributeValue string) (openapi.User, error) {
	cfg := &config.Config{
		CognitoUserPoolID: poolID,
	}
	var err error
	cfg.AwsConfig, err = awsconfig.LoadDefaultConfig(c.Context)
	if err != nil {
		return openapi.User{}, err
	}
	authService := service.NewAuthService(cfg)
	switch attributeType {
	case "sub":
		return authService.GetUserInfoBySub(c.Context, attributeValue)
	case "email":
		return authService.GetUserInfoByEmail(c.Context, attributeValue)
	}
	return openapi.User{}, fmt.Errorf("unknown attribute type '%s'", attributeType)
}

func getStartServerAction(c *cli.Context) error {
	cfg := config.Configure(c.Context)
	srv := &http.Server{
		Handler: routes.GetRoutes(c.Context, cfg),
	}

	go func() {
		fmt.Println("Starting Server")
		listener, err := net.Listen("tcp", ":0")
		if err != nil {
			panic(err)
		}
		address := fmt.Sprintf("http://localhost:%d", listener.Addr().(*net.TCPAddr).Port)
		log.Info(address)
		if err := srv.Serve(listener); err != nil {
			log.Fatal(err)
		}
	}()

	shutdown.Add(func() {
		fmt.Println("shutting down")
		ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
		defer cancel()
		// Doesn't block if no connections, but will otherwise wait
		// until the timeout deadline.
		_ = srv.Shutdown(ctx)
	})
	shutdown.Listen(os.Interrupt)
	return nil
}
