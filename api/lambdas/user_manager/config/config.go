package config

import (
	"context"
	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/kelseyhightower/envconfig"
	"github.com/lestrrat-go/jwx/v2/jwk"
)

// UserManagerJwkCache keeps the public keys used to sign the Bearer tokens
type UserManagerJwkCache struct {
	*jwk.Cache
	jwksURL string
}

// Config contains the application level configuration, which can be overridden by environment variables
type Config struct {
	AwsConfig         aws.Config
	JwkCache          *UserManagerJwkCache `envconfig:"USERMANAGER_JWKS_URL" required:"true"`
	CognitoUserPoolID string               `envconfig:"USERMANAGER_USER_POOL_ID" required:"true"`
	CognitoAdminGroup *string              `envconfig:"USERMANAGER_ADMIN_GROUP" default:"admin"`
	S3Bucket          string               `envconfig:"USERMANAGER_S3_BUCKET" required:"true"`
	UserDataTableName string               `envconfig:"USERMANAGER_TABLE_NAME" required:"true"`
	EmailIndexName    string               `envconfig:"USERMANAGER_EMAIL_INDEX_NAME" required:"true"`
	SearchIndexName   string               `envconfig:"USERMANAGER_SEARCH_INDEX_NAME" required:"true"`
	FamilyIndexName   string               `envconfig:"USERMANAGER_FAMILY_INDEX_NAME" required:"true"`
	AWSEndpointURL    *string              `envconfig:"USERMANAGER_AWS_ENDPOINT_URL"`
	AWSProfile        *string              `envconfig:"USERMANAGER_AWS_PROFILE"`
}

// Configure creates a config by processing the environment variables and default values
func Configure(ctx context.Context) *Config {
	config := &Config{}
	err := envconfig.Process("", config)
	if err != nil {
		panic(err)
	}
	_, err = config.JwkCache.Get(ctx)
	if err != nil {
		panic(err)
	}
	var loadOption awsconfig.LoadOptionsFunc

	if config.AWSProfile != nil {
		loadOption = awsconfig.WithSharedConfigProfile(*config.AWSProfile)
	} else {
		loadOption = awsconfig.WithEndpointResolverWithOptions(aws.EndpointResolverWithOptionsFunc(
			func(service, region string, options ...interface{}) (aws.Endpoint, error) {
				if config.AWSEndpointURL != nil && (service == dynamodb.ServiceID || service == s3.ServiceID) {
					return aws.Endpoint{URL: *config.AWSEndpointURL}, nil
				}
				// returning EndpointNotFoundError will allow the service to fallback to it's default resolution
				return aws.Endpoint{}, &aws.EndpointNotFoundError{}
			}))
	}

	config.AwsConfig, err = awsconfig.LoadDefaultConfig(ctx, loadOption)
	if err != nil {
		panic(err)
	}
	return config
}

// Set provides custom deserialization used by the envconfig library when setting the JWKS URL value
func (jc *UserManagerJwkCache) Set(jwksURL string) error {
	jwkCache := jwk.NewCache(context.Background())
	err := jwkCache.Register(jwksURL)
	if err != nil {
		return err
	}
	jc.Cache = jwkCache
	jc.jwksURL = jwksURL
	return nil
}

// Get returns the JWK keyset from cache
func (jc *UserManagerJwkCache) Get(ctx context.Context) (jwk.Set, error) {
	return jc.Cache.Get(ctx, jc.jwksURL)
}
