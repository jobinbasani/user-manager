package signupconfig

import (
	"context"
	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	AwsConfig             aws.Config
	UserDataTableName     string  `envconfig:"USERMANAGER_TABLE_NAME" required:"true"`
	EmailIndexName        string  `envconfig:"USERMANAGER_EMAIL_INDEX_NAME" required:"true"`
	DynamoDBEndpointURL   *string `envconfig:"USERMANAGER_DYNAMODB_ENDPOINT_URL"`
	ApprovedUserAttribute string  `envconfig:"USERMANAGER_APPROVED_USER_ATTRIBUTE" required:"true"`
}

func Configure(ctx context.Context) *Config {
	config := &Config{}
	err := envconfig.Process("", config)
	if err != nil {
		panic(err)
	}
	config.AwsConfig, err = awsconfig.LoadDefaultConfig(ctx)
	if err != nil {
		panic(err)
	}
	return config
}
