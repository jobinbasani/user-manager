package service

import (
	"context"
	"errors"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/util"
)

type DataService interface {
	AddUpdateFamily(ctx context.Context, userData []openapi.UserData) error
}
type DynamoDBService struct {
	cfg         *config.Config
	client      *dynamodb.Client
	authService AuthService
}

func (d DynamoDBService) AddUpdateFamily(ctx context.Context, userData []openapi.UserData) error {
	user, err := d.authService.GetUserInfoBySub(ctx, util.GetUserIDFromContext(ctx))
	if err != nil {
		return err
	}
	if !user.IsApproved {
		return errors.New(fmt.Sprintf("%s is not an approved user", user.Email))
	}
	currentFamilyQuery := &dynamodb.QueryInput{
		TableName:              aws.String(d.cfg.UserDataTableName),
		IndexName:              aws.String(d.cfg.EmailIndexName),
		KeyConditionExpression: aws.String("#email_id = :email_id"),
		ExpressionAttributeNames: map[string]string{
			"#email_id": "email_id",
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":email_id": &types.AttributeValueMemberS{Value: user.Email},
		},
	}
	currentFamilyQueryOutput, err := d.client.Query(ctx, currentFamilyQuery)
	if err != nil {
		return err
	}
	if currentFamilyQueryOutput.Count > 0 {
		fmt.Println("deleting current records")
	}
	return nil
}

func NewDataService(cfg *config.Config, authService AuthService) DataService {

	return DynamoDBService{
		cfg:         cfg,
		client:      dynamodb.NewFromConfig(cfg.AwsConfig),
		authService: authService,
	}
}
