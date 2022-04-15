package config

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"

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
}

// Configure creates a config by processing the environment variables and default values
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
