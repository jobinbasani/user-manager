package internal

import (
	"context"
	"encoding/csv"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/labstack/gommon/log"
	"github.com/urfave/cli/v2"
	"github.com/ztrue/shutdown"
	"io"
	"lambdas/user_manager/cli/internal/dataloader"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/routes"
	"lambdas/user_manager/service"
	"lambdas/user_manager/util"
	"net"
	"net/http"
	"os"
	"strings"
)

func NewGetUserInfoCommand() *cli.Command {
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

func NewGetUserInfoBySubCommand() *cli.Command {
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
				EnvVars:  []string{"USERMANAGER_USER_POOL_ID"},
			},
		},
	}
}

func NewGetUserInfoByEmailCommand() *cli.Command {
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
				EnvVars:  []string{"USERMANAGER_USER_POOL_ID"},
			},
		},
	}
}

func NewStartServerCommand() *cli.Command {
	return &cli.Command{
		Name:    "server",
		Aliases: []string{},
		Usage:   "Get User Info by sub",
		Action:  getStartServerAction,
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:  "dynamo_endpoint",
				Usage: "DynamoDB endpoint URL",
			},
			&cli.IntFlag{
				Name:  "port",
				Usage: "Port to run the server on",
			},
		},
	}
}

func NewLoadDataCommand() *cli.Command {
	return &cli.Command{
		Name:    "load_data",
		Aliases: []string{},
		Usage:   "Load user data from csv files",
		Action:  getLoadFileAction,
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:     "file",
				Usage:    "Location of CSV input file",
				Required: true,
			},
			&cli.StringFlag{
				Name:  "dynamo_endpoint",
				Usage: "DynamoDB endpoint URL",
			},
			&cli.StringFlag{
				Name:  "table",
				Usage: "DynamoDB table name",
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

	endpointUrl := c.String("dynamo_endpoint")
	if len(endpointUrl) > 0 {
		cfg.DynamoDBEndpointURL = aws.String(endpointUrl)
	}

	srv := &http.Server{
		Handler: routes.GetRoutes(c.Context, cfg),
	}

	go func() {
		port := fmt.Sprintf(":%d", c.Int("port"))
		fmt.Println("Starting Server on port", port)
		listener, err := net.Listen("tcp", port)
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
		// Doesn't block if no connections, but will otherwise wait
		// until the timeout deadline.
		_ = srv.Shutdown(c.Context)
	})
	shutdown.Listen(os.Interrupt)
	return nil
}

func getLoadFileAction(c *cli.Context) error {
	inputFile := c.String("file")
	f, err := os.Open(inputFile)
	if err != nil {
		log.Fatal(err)
	}

	defer f.Close()

	cfg := config.Configure(c.Context)

	endpointUrl := c.String("dynamo_endpoint")
	if len(endpointUrl) > 0 {
		cfg.DynamoDBEndpointURL = aws.String(endpointUrl)
	}
	tableName := c.String("table")
	if len(tableName) > 0 {
		cfg.UserDataTableName = tableName
	}
	dataService := service.NewDataService(cfg, nil)
	csvReader := csv.NewReader(f)
	recCount := -1
	var headers []string
	for {
		rec, err := csvReader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}
		if len(rec) == 0 || len(strings.TrimSpace(rec[0])) == 0 {
			break
		}
		recCount = recCount + 1
		if recCount == 0 {
			headers = rec
			continue
		}
		userdataRecords := dataloader.ProcessRecord(headers, rec)
		if len(userdataRecords) > 0 {
			familyId, err := dataService.AdminLoadFamily(c.Context, userdataRecords)
			if err != nil {
				log.Fatal(err)
			}
			fmt.Println(familyId)
		}
	}
	return nil
}
