package service

import (
	"context"
	"errors"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/google/uuid"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/util"
)

const (
	idAttribute       = "id"
	familyIdAttribute = "familyId"
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
	familyID, err := d.getFamilyIDForEmail(ctx, user.Email)
	if err != nil {
		return err
	}
	if familyID != nil {
		fmt.Println("Deleting ", *familyID)
		members, err := d.getFamilyMemberIDs(ctx, *familyID)
		if err != nil {
			return err
		}
		fmt.Println(members)
	}
	if familyID == nil {
		familyID = aws.String(uuid.New().String())
	}
	fmt.Println(*familyID)
	return nil
}

func (d DynamoDBService) getFamilyIDForEmail(ctx context.Context, email string) (*string, error) {
	currentFamilyQuery := fmt.Sprintf(`select * from "%s"."%s" where "emailId" = '%s'`, d.cfg.UserDataTableName, d.cfg.EmailIndexName, email)
	currentFamilyQueryInput := &dynamodb.ExecuteStatementInput{Statement: &currentFamilyQuery}
	currentFamilyQueryOutput, err := d.client.ExecuteStatement(ctx, currentFamilyQueryInput)
	if err != nil {
		return nil, err
	}
	if len(currentFamilyQueryOutput.Items) > 0 {
		familyIdAttr, exists := currentFamilyQueryOutput.Items[0][familyIdAttribute]
		if exists {
			familyIdMember, ok := familyIdAttr.(*types.AttributeValueMemberS)
			if ok {
				return aws.String(familyIdMember.Value), nil
			}
		}
	}
	return nil, nil
}

func (d DynamoDBService) getFamilyMemberIDs(ctx context.Context, familyID string) ([]string, error) {
	familyMembersQuery := fmt.Sprintf(`select * from "%s"."%s" where "familyId" = '%s'`, d.cfg.UserDataTableName, d.cfg.FamilyIndexName, familyID)
	familyMembersQueryInput := &dynamodb.ExecuteStatementInput{Statement: &familyMembersQuery}
	familyMembersQueryOutput, err := d.client.ExecuteStatement(ctx, familyMembersQueryInput)
	if err != nil {
		return nil, err
	}
	userIds := make([]string, len(familyMembersQueryOutput.Items))
	for i := range familyMembersQueryOutput.Items {
		idAttr, exists := familyMembersQueryOutput.Items[i][idAttribute]
		if exists {
			idMember, ok := idAttr.(*types.AttributeValueMemberS)
			if ok {
				userIds[i] = idMember.Value
			}
		}
	}
	return userIds, nil
}

func NewDataService(cfg *config.Config, authService AuthService) DataService {

	return DynamoDBService{
		cfg:         cfg,
		client:      dynamodb.NewFromConfig(cfg.AwsConfig),
		authService: authService,
	}
}
