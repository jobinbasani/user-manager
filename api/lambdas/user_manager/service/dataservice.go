package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/google/uuid"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/util"
	"strings"
)

const (
	idAttribute       = "id"
	familyIdAttribute = "familyId"
	emailIdAttribute  = "emailId"
	infoAttribute     = "info"
)

type DataService interface {
	AddUpdateFamily(ctx context.Context, userData []openapi.UserData) error
}
type DynamoDBService struct {
	cfg         *config.Config
	client      *dynamodb.Client
	authService AuthService
}

type stringSet map[string]struct{}

func (s stringSet) add(k string) {
	map[string]struct{}(s)[k] = struct{}{}
}

func (s stringSet) getAll() string {
	var keys []string
	for k := range s {
		keys = append(keys, k)
	}
	return strings.Join(keys, ",")
}

func (d DynamoDBService) AddUpdateFamily(ctx context.Context, userData []openapi.UserData) error {
	user, err := d.authService.GetUserInfoBySub(ctx, util.GetUserIDFromContext(ctx))
	if err != nil {
		return err
	}
	if !user.IsApproved {
		return errors.New(fmt.Sprintf("%s is not an approved user", user.Email))
	}
	if len(userData) == 0 {
		return errors.New("at least one user is needed in a family")
	}
	var statements []types.BatchStatementRequest
	familyID, err := d.getFamilyIDForEmail(ctx, user.Email)
	if err != nil {
		return err
	}
	if familyID != nil {
		fmt.Println("Deleting ", *familyID)
		memberIDs, err := d.getFamilyMemberIDs(ctx, *familyID)
		if err != nil {
			return err
		}
		for _, memberID := range memberIDs {
			statements = append(statements, types.BatchStatementRequest{
				Statement: aws.String(fmt.Sprintf(`DELETE FROM "%s" WHERE "%s" = '%s'`, d.cfg.UserDataTableName, idAttribute, memberID)),
			})
		}
	}
	if familyID == nil {
		familyID = aws.String(uuid.New().String())
	}
	for _, u := range userData {
		if len(u.Email) == 0 {
			return errors.New("a valid email id is needed or all users")
		}
		emails := make(stringSet)
		emails.add(user.Email)
		emails.add(u.Email)
		userDataJson, err := json.Marshal(u)
		if err != nil {
			return err
		}
		statements = append(statements, types.BatchStatementRequest{
			Statement: aws.String(fmt.Sprintf(
				`INSERT INTO "%s" VALUE {'%s' : '%s','%s' : '%s', '%s' : '%s', '%s' : '%s'}`,
				d.cfg.UserDataTableName,
				idAttribute,
				uuid.New().String(),
				familyIdAttribute,
				*familyID,
				emailIdAttribute,
				emails.getAll(),
				infoAttribute,
				string(userDataJson),
			)),
		})
	}
	batchExecutionOutput, err := d.client.BatchExecuteStatement(ctx, &dynamodb.BatchExecuteStatementInput{
		Statements: statements,
	})
	if err != nil {
		return err
	}
	var errorMessages []string
	for _, o := range batchExecutionOutput.Responses {
		if o.Error != nil {
			errorMessages = append(errorMessages, *o.Error.Message)
		}
	}
	if len(errorMessages) > 0 {
		return errors.New(strings.Join(errorMessages, ", "))
	}
	return nil
}

func (d DynamoDBService) getFamilyIDForEmail(ctx context.Context, email string) (*string, error) {
	currentFamilyQueryInput := &dynamodb.ExecuteStatementInput{
		Statement: aws.String(fmt.Sprintf(
			`SELECT * FROM "%s"."%s" WHERE CONTAINS("%s", '%s')`,
			d.cfg.UserDataTableName,
			d.cfg.EmailIndexName,
			emailIdAttribute,
			email,
		)),
	}
	currentFamilyQueryOutput, err := d.client.ExecuteStatement(ctx, currentFamilyQueryInput)
	if err != nil {
		return nil, err
	}
	if len(currentFamilyQueryOutput.Items) > 0 {
		familyId := d.getStringValue(currentFamilyQueryOutput.Items[0], familyIdAttribute)
		if familyId != nil {
			return familyId, nil
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
		userId := d.getStringValue(familyMembersQueryOutput.Items[i], idAttribute)
		if userId != nil {
			userIds[i] = *userId
		}
	}
	return userIds, nil
}

func (d DynamoDBService) getStringValue(attrMap map[string]types.AttributeValue, attrName string) *string {
	attr, exists := attrMap[attrName]
	if exists {
		member, ok := attr.(*types.AttributeValueMemberS)
		if ok {
			return aws.String(member.Value)
		}
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
