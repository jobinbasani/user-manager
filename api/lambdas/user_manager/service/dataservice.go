package service

import (
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"lambdas/user_manager/config"
)

type DataService interface {
	AddUpdateFamily()
}
type DynamoDBService struct {
	cfg    *config.Config
	client *dynamodb.Client
}

func (d DynamoDBService) AddUpdateFamily() {
	//TODO implement me
	panic("implement me")
}

func NewDataService(cfg *config.Config) DataService {

	return DynamoDBService{
		cfg:    cfg,
		client: dynamodb.NewFromConfig(cfg.AwsConfig),
	}
}
