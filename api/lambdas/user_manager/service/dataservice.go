package service

import (
	"context"
	"errors"
	"fmt"
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
	currentFamilyQuery := fmt.Sprintf(`select * from "%s"."%s" where "emailId" = '%s'`, d.cfg.UserDataTableName, d.cfg.EmailIndexName, user.Email)
	currentFamilyQueryInput := &dynamodb.ExecuteStatementInput{Statement: &currentFamilyQuery}
	currentFamilyQueryOutput, err := d.client.ExecuteStatement(ctx, currentFamilyQueryInput)
	if err != nil {
		return err
	}
	if len(currentFamilyQueryOutput.Items) > 0 {
		var familyId string
		familyIdAttr, exists := currentFamilyQueryOutput.Items[0]["familyId"]
		if exists {
			switch v := familyIdAttr.(type) {
			case *types.AttributeValueMemberS:
				familyId = v.Value
			}
		}
		fmt.Println("deleting current records", familyId)
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
