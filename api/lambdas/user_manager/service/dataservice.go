package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/util"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/google/uuid"
)

const (
	idAttribute         = "id"
	recTypeAttribute    = "recType"
	familyIdAttribute   = "familyId"
	emailIdAttribute    = "emailId"
	infoAttribute       = "info"
	userRecType         = "USER"
	announcementRecType = "ANNOUNCE"
)

var titleCaser = cases.Title(language.English)

type DataService interface {
	GetUserFamily(ctx context.Context) ([]openapi.UserData, error)
	AddFamilyMembers(ctx context.Context, userData []openapi.UserData) (openapi.FamilyId, error)
	DeleteFamilyMembers(ctx context.Context, memberIds []string) ([]string, error)
	AddAnnouncement(ctx context.Context, announcement openapi.Announcement) (string, error)
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

func (d DynamoDBService) GetUserFamily(ctx context.Context) ([]openapi.UserData, error) {
	user, err := d.authService.GetUserInfoBySub(ctx, util.GetUserIDFromContext(ctx))
	if err != nil {
		return nil, err
	}
	familyID, err := d.getFamilyIDForEmail(ctx, user.Email)
	if err != nil {
		return nil, err
	}
	if familyID == nil {
		return []openapi.UserData{}, nil
	}
	memberIDs, err := d.getFamilyMemberIDs(ctx, *familyID)
	if err != nil {
		return nil, err
	}
	users, err := d.getUserDetailsForIDs(ctx, memberIDs)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (d DynamoDBService) AddFamilyMembers(ctx context.Context, userData []openapi.UserData) (openapi.FamilyId, error) {
	user, err := d.authService.GetUserInfoBySub(ctx, util.GetUserIDFromContext(ctx))
	if err != nil {
		return openapi.FamilyId{}, err
	}
	if !user.IsApproved {
		return openapi.FamilyId{}, errors.New(fmt.Sprintf("%s is not an approved user", user.Email))
	}
	if len(userData) == 0 {
		return openapi.FamilyId{}, errors.New("at least one user is needed in a family")
	}
	var statements []types.ParameterizedStatement
	familyID, err := d.getFamilyIDForEmail(ctx, user.Email)
	if err != nil {
		return openapi.FamilyId{}, err
	}
	if familyID == nil {
		familyID = aws.String(uuid.New().String())
	}
	for _, u := range userData {
		if len(u.Email) == 0 {
			return openapi.FamilyId{}, errors.New("a valid email id is needed or all users")
		}
		emails := make(stringSet)
		emails.add(user.Email)
		emails.add(u.Email)
		u.FirstName = d.titleCase(u.FirstName)
		u.LastName = d.titleCase(u.LastName)
		u.DisplayName = u.FirstName + " " + u.LastName
		userDataJson, err := json.Marshal(u)
		if err != nil {
			return openapi.FamilyId{}, err
		}
		statements = append(statements, types.ParameterizedStatement{
			Statement: aws.String(fmt.Sprintf(
				`INSERT INTO "%s" VALUE {'%s' : '%s', '%s' : '%s', '%s' : '%s', '%s' : '%s', '%s' : '%s'}`,
				d.cfg.UserDataTableName,
				idAttribute,
				uuid.New().String(),
				recTypeAttribute,
				userRecType,
				familyIdAttribute,
				*familyID,
				emailIdAttribute,
				emails.getAll(),
				infoAttribute,
				string(userDataJson),
			)),
		})
	}
	_, err = d.client.ExecuteTransaction(ctx, &dynamodb.ExecuteTransactionInput{
		TransactStatements: statements,
	})
	if err != nil {
		return openapi.FamilyId{}, err
	}

	return openapi.FamilyId{
		FamilyId: *familyID,
	}, nil
}

func (d DynamoDBService) DeleteFamilyMembers(ctx context.Context, memberIds []string) ([]string, error) {
	user, err := d.authService.GetUserInfoBySub(ctx, util.GetUserIDFromContext(ctx))
	if err != nil {
		return nil, err
	}
	if !user.IsApproved {
		return nil, errors.New(fmt.Sprintf("%s is not an approved user", user.Email))
	}
	familyID, err := d.getFamilyIDForEmail(ctx, user.Email)
	if err != nil {
		return nil, err
	}
	if familyID == nil {
		return nil, errors.New(fmt.Sprintf("unable to locate family for %s", user.Email))
	}
	statements := make([]types.ParameterizedStatement, len(memberIds))
	for i, id := range memberIds {
		statements[i] = types.ParameterizedStatement{
			Statement: aws.String(fmt.Sprintf(`DELETE FROM "%s" WHERE "%s" = '%s' AND "%s" = '%s' AND "%s" = '%s'`,
				d.cfg.UserDataTableName,
				idAttribute,
				id,
				recTypeAttribute,
				userRecType,
				familyIdAttribute,
				*familyID,
			)),
		}
	}
	_, err = d.client.ExecuteTransaction(ctx, &dynamodb.ExecuteTransactionInput{
		TransactStatements: statements,
	})
	if err != nil {
		return nil, err
	}

	return memberIds, nil
}

func (d DynamoDBService) AddAnnouncement(ctx context.Context, announcement openapi.Announcement) (string, error) {
	announcementId := uuid.New().String()
	announcement.Id = announcementId
	announcementJson, err := json.Marshal(announcement)
	if err != nil {
		return "", err
	}
	_, err = d.client.ExecuteStatement(ctx, &dynamodb.ExecuteStatementInput{
		Statement: aws.String(fmt.Sprintf(
			`INSERT INTO "%s" VALUE {'%s' : '%s', '%s' : '%s', '%s' : '%s'}`,
			d.cfg.UserDataTableName,
			idAttribute,
			announcementId,
			recTypeAttribute,
			announcementRecType,
			infoAttribute,
			string(announcementJson),
		)),
	})

	if err != nil {
		return "", err
	}

	return announcementId, nil
}

func (d DynamoDBService) getUserDetailsForIDs(ctx context.Context, ids []string) ([]openapi.UserData, error) {
	if len(ids) == 0 {
		return nil, errors.New("no user id's were provided")
	}
	statements := make([]types.BatchStatementRequest, len(ids))
	for i, id := range ids {
		statements[i] = types.BatchStatementRequest{
			Statement: aws.String(fmt.Sprintf(
				`SELECT * FROM "%s" WHERE "%s" = '%s' AND "%s" = '%s'`,
				d.cfg.UserDataTableName,
				idAttribute,
				id,
				recTypeAttribute,
				userRecType,
			)),
		}
	}

	batchExecutionOutput, err := d.client.BatchExecuteStatement(ctx, &dynamodb.BatchExecuteStatementInput{
		Statements: statements,
	})
	if err != nil {
		return nil, err
	}
	var users []openapi.UserData
	for _, resp := range batchExecutionOutput.Responses {
		infoJson := d.getStringValue(resp.Item, infoAttribute)
		if infoJson == nil {
			continue
		}
		var userData openapi.UserData
		err := json.Unmarshal([]byte(*infoJson), &userData)
		if err != nil {
			return nil, err
		}
		familyId := d.getStringValue(resp.Item, familyIdAttribute)
		if familyId != nil {
			userData.FamilyId = *familyId
		}
		userId := d.getStringValue(resp.Item, idAttribute)
		if userId != nil {
			userData.Id = *userId
		}
		users = append(users, userData)
	}
	return users, nil
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
	familyMembersQueryInput := &dynamodb.ExecuteStatementInput{
		Statement: aws.String(fmt.Sprintf(
			`SELECT * FROM "%s"."%s" WHERE "%s" = '%s'`,
			d.cfg.UserDataTableName,
			d.cfg.FamilyIndexName,
			familyIdAttribute,
			familyID,
		)),
	}
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

func (d DynamoDBService) titleCase(s string) string {
	return strings.TrimSpace(titleCaser.String(s))
}

func NewDataService(cfg *config.Config, authService AuthService) DataService {

	return DynamoDBService{
		cfg:         cfg,
		client:      dynamodb.NewFromConfig(cfg.AwsConfig),
		authService: authService,
	}
}
