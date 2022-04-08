package config

import "github.com/kelseyhightower/envconfig"

// Config contains the application level configuration, which can be overridden by environment variables
type Config struct {
	BasePath string `envconfig:"USERMANAGER_API_BASEPATH" default:"/api/v1"`
}

// Configure creates a config by processing the environment variables and default values
func Configure() *Config {
	config := &Config{}
	err := envconfig.Process("", config)
	if err != nil {
		panic(err)
	}
	return config
}
