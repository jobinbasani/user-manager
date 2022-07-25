package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/util"
	"log"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/aws/smithy-go"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/google/uuid"
)

const (
	idAttribute        = "id"
	recTypeAttribute   = "recType"
	createdAtAttribute = "createdAt"
	searchAttribute    = "search"
	familyIdAttribute  = "familyId"
	emailIdAttribute   = "emailId"
	infoAttribute      = "info"
	ttlAttribute       = "expDate"
	userRecType        = "USER"
	servicesRecType    = "SERVICES"
	announcementId     = "announcements"
	pageContentId      = "pagecontent"
)

var titleCaser = cases.Title(language.English)

type DataService interface {
	GetUserFamily(ctx context.Context) ([]openapi.UserData, error)
	AddFamilyMembers(ctx context.Context, userData []openapi.UserData) (openapi.FamilyId, error)
	AdminLoadFamily(ctx context.Context, userData []openapi.UserData) (openapi.FamilyId, error)
	UpdateFamilyMember(ctx context.Context, userId string, userData openapi.UserData) (openapi.UserId, error)
	DeleteFamilyMembers(ctx context.Context, memberIds []string) ([]string, error)
	AddAnnouncement(ctx context.Context, announcement openapi.Announcement) (string, error)
	GetAnnouncements(ctx context.Context) ([]openapi.Announcement, error)
	DeleteAnnouncements(ctx context.Context, announcementIds []string) ([]string, error)
	GetPageContent(ctx context.Context, key string) (openapi.PageContent, error)
	SetPageContent(ctx context.Context, key string, content openapi.PageContent) error
}
type DynamoDBService struct {
	cfg         *config.Config
	client      *dynamodb.Client
	authService AuthService
}

type userDataWithTime struct {
	createdTime *int
	*openapi.UserData
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
	familyID, err := d.getFamilyIDForEmail(ctx, user.Email)
	if err != nil {
		return openapi.FamilyId{}, err
	}
	return d.insertFamilyMembers(ctx, familyID, user, userData)
}

func (d DynamoDBService) AdminLoadFamily(ctx context.Context, userData []openapi.UserData) (openapi.FamilyId, error) {
	return d.insertFamilyMembers(ctx, nil, openapi.User{}, userData)
}

func (d DynamoDBService) UpdateFamilyMember(ctx context.Context, userId string, userData openapi.UserData) (openapi.UserId, error) {
	user, err := d.authService.GetUserInfoBySub(ctx, util.GetUserIDFromContext(ctx))
	if err != nil {
		return openapi.UserId{}, err
	}
	familyId, err := d.getFamilyIDForEmail(ctx, user.Email)
	if err != nil {
		return openapi.UserId{}, err
	}
	userIds, err := d.getFamilyMemberIDs(ctx, *familyId)
	if err != nil {
		return openapi.UserId{}, err
	}
	hasUser := false
	for i := range userIds {
		if userIds[i] == userId {
			hasUser = true
			break
		}
	}
	if !hasUser {
		return openapi.UserId{}, fmt.Errorf("unable to find user %s in family", userId)
	}
	userData.Id = userId
	formattedUser, emails, searchData := d.formatUser(user, userData)
	userDataJson, err := json.Marshal(formattedUser)
	if err != nil {
		return openapi.UserId{}, err
	}
	_, err = d.client.ExecuteStatement(ctx, &dynamodb.ExecuteStatementInput{
		Statement: aws.String(fmt.Sprintf(`UPDATE "%s" SET %s = ? SET %s = ? SET %s = ? WHERE "%s" = '%s' AND "%s" = '%s' AND "%s" = '%s'`,
			d.cfg.UserDataTableName,
			infoAttribute,
			emailIdAttribute,
			searchAttribute,
			idAttribute,
			userId,
			recTypeAttribute,
			userRecType,
			familyIdAttribute,
			*familyId,
		)),
		Parameters: []types.AttributeValue{
			&types.AttributeValueMemberS{
				Value: string(userDataJson),
			},
			&types.AttributeValueMemberS{
				Value: emails.getAll(),
			},
			&types.AttributeValueMemberS{
				Value: searchData,
			},
		},
	})
	if err != nil {
		return openapi.UserId{}, err
	}
	return openapi.UserId{
		UserId: userId,
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
	now := time.Now()
	ts := now.Unix()
	today := now.Format("January 2, 2006")
	announcement.Id = fmt.Sprintf("announce-%d", ts)
	announcement.CreatedOn = today
	announcementJson, err := json.Marshal(announcement)
	var expiry int
	if len(announcement.ExpiresOn) > 0 {
		if s, err := strconv.Atoi(announcement.ExpiresOn); err == nil {
			expiry = s
		}
	}
	if err != nil {
		return "", err
	}
	_, err = d.client.ExecuteStatement(ctx, &dynamodb.ExecuteStatementInput{
		Statement: aws.String(fmt.Sprintf(
			`INSERT INTO "%s" VALUE {'%s' : '%s', '%s' : '%s', '%s' : ?, '%s' : %d, '%s' : %d}`,
			d.cfg.UserDataTableName,
			idAttribute,
			announcementId,
			recTypeAttribute,
			announcement.Id,
			infoAttribute,
			createdAtAttribute,
			ts,
			ttlAttribute,
			expiry,
		)),
		Parameters: []types.AttributeValue{
			&types.AttributeValueMemberS{
				Value: string(announcementJson),
			},
		},
	})

	if err != nil {
		return "", err
	}

	return announcement.Id, nil
}

func (d DynamoDBService) GetAnnouncements(ctx context.Context) ([]openapi.Announcement, error) {
	data, err := d.client.ExecuteStatement(ctx, &dynamodb.ExecuteStatementInput{
		Statement: aws.String(
			fmt.Sprintf(
				`SELECT * FROM "%s" WHERE "%s" = '%s' ORDER BY "%s" DESC`,
				d.cfg.UserDataTableName,
				idAttribute,
				announcementId,
				recTypeAttribute,
			),
		),
	},
	)
	if err != nil {
		var oe *smithy.OperationError
		if errors.As(err, &oe) {
			log.Printf("failed to call service: %s, operation: %s, error: %v", oe.Service(), oe.Operation(), oe.Unwrap())
		}
		return nil, err
	}
	if len(data.Items) == 0 {
		return []openapi.Announcement{
			{
				Id:          "default-announcement",
				Title:       "Welcome!",
				Subtitle:    "Join our growing community",
				Description: "Please sign up if you haven't done so!",
			},
		}, nil
	}
	announcements := make([]openapi.Announcement, len(data.Items))
	for i := range data.Items {
		a := d.getStringValue(data.Items[i], infoAttribute)
		if a != nil {
			var announcement openapi.Announcement
			_ = json.Unmarshal([]byte(*a), &announcement)
			announcements[i] = announcement
		}
	}
	return announcements, nil
}

func (d DynamoDBService) DeleteAnnouncements(ctx context.Context, announcementIds []string) ([]string, error) {
	statements := make([]types.ParameterizedStatement, len(announcementIds))
	for i, id := range announcementIds {
		statements[i] = types.ParameterizedStatement{
			Statement: aws.String(fmt.Sprintf(`DELETE FROM "%s" WHERE "%s" = '%s' AND "%s" = '%s'`,
				d.cfg.UserDataTableName,
				idAttribute,
				announcementId,
				recTypeAttribute,
				id,
			)),
		}
	}
	_, err := d.client.ExecuteTransaction(ctx, &dynamodb.ExecuteTransactionInput{
		TransactStatements: statements,
	})
	if err != nil {
		return nil, err
	}
	return announcementIds, nil
}

func (d DynamoDBService) GetPageContent(ctx context.Context, key string) (openapi.PageContent, error) {

	data, err := d.client.ExecuteStatement(ctx, &dynamodb.ExecuteStatementInput{
		Statement: aws.String(fmt.Sprintf(
			`SELECT * FROM "%s" WHERE "%s" = '%s' AND "%s" = '%s'`,
			d.cfg.UserDataTableName,
			idAttribute,
			pageContentId,
			recTypeAttribute,
			servicesRecType,
		)),
	})
	if err != nil {
		return openapi.PageContent{}, err
	}
	if len(data.Items) == 0 {
		return openapi.PageContent{}, errors.New("no data found")
	}
	contentString := d.getStringValue(data.Items[0], infoAttribute)
	if contentString == nil {
		return openapi.PageContent{}, errors.New("no valid data found")
	}
	var content openapi.PageContent
	err = json.Unmarshal([]byte(*contentString), &content)
	if err != nil {
		return openapi.PageContent{}, err
	}
	return content, nil
}

func (d DynamoDBService) SetPageContent(ctx context.Context, key string, content openapi.PageContent) error {
	contentData, err := json.Marshal(content)
	if err != nil {
		return err
	}
	_, err = d.client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: &d.cfg.UserDataTableName,
		Item: map[string]types.AttributeValue{
			idAttribute: &types.AttributeValueMemberS{
				Value: pageContentId,
			},
			recTypeAttribute: &types.AttributeValueMemberS{
				Value: key,
			},
			infoAttribute: &types.AttributeValueMemberS{
				Value: string(contentData),
			},
		},
	})

	return err
}

func (d DynamoDBService) insertFamilyMembers(ctx context.Context, familyID *string, currentUser openapi.User, userData []openapi.UserData) (openapi.FamilyId, error) {

	var statements []types.ParameterizedStatement

	if familyID == nil {
		familyID = aws.String(uuid.New().String())
	}
	ts := time.Now().Unix()
	for i, u := range userData {
		if len(u.Email) == 0 {
			return openapi.FamilyId{}, errors.New("a valid email id is needed or all users")
		}
		formattedUser, emails, searchData := d.formatUser(currentUser, u)
		userDataJson, err := json.Marshal(formattedUser)
		if err != nil {
			return openapi.FamilyId{}, err
		}
		statements = append(statements, types.ParameterizedStatement{
			Statement: aws.String(fmt.Sprintf(
				`INSERT INTO "%s" VALUE {'%s' : '%s', '%s' : '%s', '%s' : '%s', '%s' : '%s', '%s' : %d, '%s' : ?, '%s' : ?}`,
				d.cfg.UserDataTableName,
				idAttribute,
				uuid.New().String(),
				recTypeAttribute,
				userRecType,
				familyIdAttribute,
				*familyID,
				emailIdAttribute,
				emails.getAll(),
				createdAtAttribute,
				ts+int64(i),
				infoAttribute,
				searchAttribute,
			)),
			Parameters: []types.AttributeValue{
				&types.AttributeValueMemberS{
					Value: string(userDataJson),
				},
				&types.AttributeValueMemberS{
					Value: searchData,
				},
			},
		})
	}
	_, err := d.client.ExecuteTransaction(ctx, &dynamodb.ExecuteTransactionInput{
		TransactStatements: statements,
	})
	if err != nil {
		return openapi.FamilyId{}, err
	}

	return openapi.FamilyId{
		FamilyId: *familyID,
	}, nil
}

func (d DynamoDBService) formatUser(user openapi.User, u openapi.UserData) (openapi.UserData, stringSet, string) {
	emails := make(stringSet)
	if len(user.Email) > 0 {
		emails.add(user.Email)
	}
	emails.add(u.Email)
	u.FirstName = d.titleCase(u.FirstName)
	u.LastName = d.titleCase(u.LastName)
	u.DisplayName = u.FirstName + " " + u.LastName
	if u.MaritalStatus != "married" {
		u.DateOfMarriage = ""
	}
	searchData := d.buildSearchIndex(u.FirstName, u.LastName, u.Email)
	return u, emails, searchData
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
	var udwt []userDataWithTime
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
		udwt = append(udwt, userDataWithTime{
			createdTime: d.getIntValue(resp.Item, createdAtAttribute),
			UserData:    &userData,
		})
	}
	if udwt != nil {
		sort.Slice(udwt, func(i, j int) bool {
			return *udwt[i].createdTime < *udwt[j].createdTime
		})
		users = make([]openapi.UserData, len(udwt))
		for i := range udwt {
			users[i] = *udwt[i].UserData
		}
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

func (d DynamoDBService) getIntValue(attrMap map[string]types.AttributeValue, attrName string) *int {
	attr, exists := attrMap[attrName]
	if exists {
		member, ok := attr.(*types.AttributeValueMemberN)
		if ok {
			num, _ := strconv.Atoi(member.Value)
			return aws.Int(num)
		}
	}
	return nil
}

func (d DynamoDBService) titleCase(s string) string {
	return strings.TrimSpace(titleCaser.String(s))
}

func (d DynamoDBService) buildSearchIndex(s ...string) string {
	var all []string
	for i := range s {
		entry := strings.TrimSpace(s[i])
		entry = strings.ToLower(entry)
		if len(entry) > 0 {
			all = append(all, entry)
		}
	}
	return strings.Join(all, ",")
}

func NewDataService(cfg *config.Config, authService AuthService) DataService {

	return DynamoDBService{
		cfg:         cfg,
		client:      dynamodb.NewFromConfig(cfg.AwsConfig),
		authService: authService,
	}
}
