package service

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"image"
	"image/jpeg"
	_ "image/jpeg"
	"image/png"
	_ "image/png"
	"io"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	orderedmap "github.com/wk8/go-ordered-map/v2"

	"lambdas/user_manager/config"
	"lambdas/user_manager/model"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/util"

	"github.com/disintegration/imaging"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/google/uuid"
)

const (
	idAttribute            = "id"
	recTypeAttribute       = "recType"
	createdAtAttribute     = "createdAt"
	searchAttribute        = "search"
	familyIdAttribute      = "familyId"
	emailIdAttribute       = "emailId"
	infoAttribute          = "info"
	userRecType            = "USER"
	pageContentId          = "pagecontent"
	appdataContentId       = "appdata"
	carouselImageDir       = "/images/carousel/"
	carouselRecType        = "carousel"
	backgroundImageDir     = "/images/backgrounds/"
	backgroundImageRecType = "backgroundImage"
	pageContentsId         = "pagecontents"
)

var titleCaser = cases.Title(language.English)

type dataUnmarshaller func(data []byte) error

type DataService interface {
	GetUserFamily(ctx context.Context) ([]openapi.UserData, error)
	AddFamilyMembers(ctx context.Context, userData []openapi.UserData) (openapi.FamilyId, error)
	AdminLoadFamily(ctx context.Context, userData []openapi.UserData) (openapi.FamilyId, error)
	UpdateFamilyMember(ctx context.Context, userId string, userData openapi.UserData) (openapi.UserId, error)
	DeleteFamilyMembers(ctx context.Context, memberIds []string) ([]string, error)
	SetAppData(ctx context.Context, id string, key string, content interface{}) error
	GetAppData(ctx context.Context, id string, key string, target interface{}) error
	AddCarouselItem(ctx context.Context, img *bytes.Reader, title string, subtitle string) error
	GetCarouselItems(ctx context.Context) ([]openapi.CarouselItem, error)
	GetCarouselItem(ctx context.Context, itemId string) (openapi.CarouselItem, error)
	DeleteCarouselItem(ctx context.Context, itemId string) error
	AddBackgroundImage(ctx context.Context, img *bytes.Reader) error
	GetBackgroundImages(ctx context.Context) ([]openapi.BackgroundImageItem, error)
	GetBackgroundImage(ctx context.Context, itemId string) (openapi.BackgroundImageItem, error)
	DeleteBackgroundImage(ctx context.Context, itemId string) error
	AddPageContent(ctx context.Context, pageId string, content openapi.PageContent) error
	UpdatePageContent(ctx context.Context, pageId string, contentId string, content openapi.PageContent) error
	DeletePageContent(ctx context.Context, pageId string, contentId string) error
	GetPageContents(ctx context.Context, pageId string) ([]openapi.PageContent, error)
	ListUsers(ctx context.Context, start string, limit int32) (openapi.BasicUserInfoList, error)
	SearchFamilyMembers(ctx context.Context, query string) (openapi.BasicUserInfoList, error)
	GetAllUsers(ctx context.Context) ([]model.UserExtended, error)
}
type UserManagerAppData struct {
	cfg            *config.Config
	dynamodbClient *dynamodb.Client
	s3Client       *s3.Client
	authService    AuthService
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

func (d UserManagerAppData) GetUserFamily(ctx context.Context) ([]openapi.UserData, error) {
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

func (d UserManagerAppData) AddFamilyMembers(ctx context.Context, userData []openapi.UserData) (openapi.FamilyId, error) {
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

func (d UserManagerAppData) AdminLoadFamily(ctx context.Context, userData []openapi.UserData) (openapi.FamilyId, error) {
	return d.insertFamilyMembers(ctx, nil, openapi.User{}, userData)
}

func (d UserManagerAppData) UpdateFamilyMember(ctx context.Context, userId string, userData openapi.UserData) (openapi.UserId, error) {
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
	_, err = d.dynamodbClient.ExecuteStatement(ctx, &dynamodb.ExecuteStatementInput{
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

func (d UserManagerAppData) ListUsers(ctx context.Context, start string, limit int32) (openapi.BasicUserInfoList, error) {
	resultLimit := limit
	if resultLimit < 1 || resultLimit > 50 {
		resultLimit = 50
	}
	scanInput := dynamodb.ScanInput{
		TableName:            aws.String(d.cfg.UserDataTableName),
		Limit:                aws.Int32(resultLimit),
		ProjectionExpression: aws.String(fmt.Sprintf("%s,%s", idAttribute, infoAttribute)),
		FilterExpression:     aws.String(fmt.Sprintf("%s = :user_rec", recTypeAttribute)),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":user_rec": &types.AttributeValueMemberS{
				Value: userRecType,
			},
		},
	}

	if len(start) > 0 {
		scanInput.ExclusiveStartKey = map[string]types.AttributeValue{
			idAttribute: &types.AttributeValueMemberS{
				Value: start,
			},
			recTypeAttribute: &types.AttributeValueMemberS{
				Value: userRecType,
			},
		}
	}

	data, err := d.dynamodbClient.Scan(ctx, &scanInput)
	if err != nil {
		return openapi.BasicUserInfoList{}, err
	}
	users := []openapi.User{}
	for _, item := range data.Items {
		id := d.getStringValue(item, idAttribute)
		infoJSON := d.getStringValue(item, infoAttribute)
		var userData openapi.User
		err := json.Unmarshal([]byte(*infoJSON), &userData)
		if err != nil {
			return openapi.BasicUserInfoList{}, err
		}
		userData.Id = *id
		users = append(users, userData)
	}

	var next *string
	if data.LastEvaluatedKey != nil {
		next = d.getStringValue(data.LastEvaluatedKey, idAttribute)
	}

	return openapi.BasicUserInfoList{
		Total: int32(len(users)),
		Items: users,
		Next:  next,
	}, nil
}

func (d UserManagerAppData) GetAllUsers(ctx context.Context) ([]model.UserExtended, error) {
	scanInput := dynamodb.ScanInput{
		TableName:            aws.String(d.cfg.UserDataTableName),
		ProjectionExpression: aws.String(fmt.Sprintf("%s,%s", familyIdAttribute, infoAttribute)),
		FilterExpression:     aws.String(fmt.Sprintf("%s = :user_rec", recTypeAttribute)),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":user_rec": &types.AttributeValueMemberS{
				Value: userRecType,
			},
		},
	}

	users := []model.UserExtended{}
	var startKey *string

	for {
		if startKey != nil {
			scanInput.ExclusiveStartKey = map[string]types.AttributeValue{
				idAttribute: &types.AttributeValueMemberS{
					Value: *startKey,
				},
				recTypeAttribute: &types.AttributeValueMemberS{
					Value: userRecType,
				},
			}
		}

		data, err := d.dynamodbClient.Scan(ctx, &scanInput)
		if err != nil {
			return nil, err
		}

		for _, item := range data.Items {
			infoJSON := d.getStringValue(item, infoAttribute)
			var userData model.UserExtended
			err := json.Unmarshal([]byte(*infoJSON), &userData)
			if err != nil {
				return nil, err
			}
			familyID := d.getStringValue(item, familyIdAttribute)
			if familyID != nil {
				userData.FamilyID = *familyID
			}
			users = append(users, userData)
		}

		startKey = d.getStringValue(data.LastEvaluatedKey, idAttribute)
		if startKey == nil {
			break
		}
	}

	sort.Slice(users, func(i, j int) bool {
		return users[i].DisplayName < users[j].DisplayName
	})

	om := orderedmap.New[string, []*model.UserExtended]()

	for i, k := range users {
		familyId := k.FamilyID
		members, exists := om.Get(familyId)
		if exists {
			om.Set(familyId, append(members, &users[i]))
		} else {
			om.Set(familyId, []*model.UserExtended{&users[i]})
		}
	}

	orderedUsers := []model.UserExtended{}

	for pair := om.Oldest(); pair != nil; pair = pair.Next() {
		for i := range pair.Value {
			orderedUsers = append(orderedUsers, *pair.Value[i])
		}
	}

	return orderedUsers, nil
}

func (d UserManagerAppData) DeleteFamilyMembers(ctx context.Context, memberIds []string) ([]string, error) {
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
	_, err = d.dynamodbClient.ExecuteTransaction(ctx, &dynamodb.ExecuteTransactionInput{
		TransactStatements: statements,
	})
	if err != nil {
		return nil, err
	}

	return memberIds, nil
}

func (d UserManagerAppData) SetAppData(ctx context.Context, id string, key string, content interface{}) error {
	contentData, err := json.Marshal(content)
	if err != nil {
		return err
	}
	_, err = d.dynamodbClient.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: &d.cfg.UserDataTableName,
		Item: map[string]types.AttributeValue{
			idAttribute: &types.AttributeValueMemberS{
				Value: id,
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

func (d UserManagerAppData) GetAppData(ctx context.Context, id string, key string, target interface{}) error {

	data, err := d.dynamodbClient.ExecuteStatement(ctx, &dynamodb.ExecuteStatementInput{
		Statement: aws.String(fmt.Sprintf(
			`SELECT * FROM "%s" WHERE "%s" = '%s' AND "%s" = '%s'`,
			d.cfg.UserDataTableName,
			idAttribute,
			id,
			recTypeAttribute,
			key,
		)),
	})
	if err != nil {
		return err
	}
	if len(data.Items) == 0 {
		return nil
	}
	contentString := d.getStringValue(data.Items[0], infoAttribute)
	if contentString == nil {
		return errors.New("no valid data found")
	}
	err = json.Unmarshal([]byte(*contentString), target)
	if err != nil {
		return err
	}
	return nil
}

func (d UserManagerAppData) SearchFamilyMembers(ctx context.Context, query string) (openapi.BasicUserInfoList, error) {
	if len(query) < 3 {
		return openapi.BasicUserInfoList{}, fmt.Errorf("invalid query - %s - must have atleast 3 characters", query)
	}
	var users []openapi.User
	searchQueryOutput, err := d.dynamodbClient.ExecuteStatement(ctx, &dynamodb.ExecuteStatementInput{
		Statement: aws.String(fmt.Sprintf(
			`SELECT * FROM "%s"."%s" WHERE CONTAINS("%s", '%s')`,
			d.cfg.UserDataTableName,
			d.cfg.SearchIndexName,
			searchAttribute,
			strings.TrimSpace(strings.ToLower(query)),
		)),
	})
	if err != nil {
		return openapi.BasicUserInfoList{}, err
	}

	if len(searchQueryOutput.Items) == 0 {
		return openapi.BasicUserInfoList{}, nil
	}
	var allIds []string
	for i := range searchQueryOutput.Items {
		userId := d.getStringValue(searchQueryOutput.Items[i], idAttribute)
		if userId == nil {
			continue
		}
		allIds = append(allIds, fmt.Sprintf("'%s'", *userId))
	}

	userQueryOutput, err := d.dynamodbClient.ExecuteStatement(ctx, &dynamodb.ExecuteStatementInput{
		Statement: aws.String(fmt.Sprintf(
			`SELECT * FROM "%s" WHERE "%s" IN [%s] AND "%s" = '%s'`,
			d.cfg.UserDataTableName,
			idAttribute,
			strings.Join(allIds, ","),
			recTypeAttribute,
			userRecType,
		)),
	})

	if err != nil {
		return openapi.BasicUserInfoList{}, err
	}

	if len(userQueryOutput.Items) == 0 {
		return openapi.BasicUserInfoList{}, nil
	}

	for i := range userQueryOutput.Items {
		infoJson := d.getStringValue(userQueryOutput.Items[i], infoAttribute)
		if infoJson == nil {
			continue
		}
		var userData openapi.User
		err := json.Unmarshal([]byte(*infoJson), &userData)
		if err != nil {
			return openapi.BasicUserInfoList{}, err
		}

		userId := d.getStringValue(userQueryOutput.Items[i], idAttribute)
		if userId != nil {
			userData.Id = *userId
		}
		users = append(users, userData)
	}
	sort.Slice(users, func(i, j int) bool {
		return users[i].DisplayName < users[j].DisplayName
	})
	return openapi.BasicUserInfoList{
		Total: int32(len(users)),
		Items: users,
	}, nil
}

func (d UserManagerAppData) AddCarouselItem(ctx context.Context, img *bytes.Reader, title string, subtitle string) error {
	imgToSave, imgType, contentType, _, _, err := d.processImage(img)
	if err != nil {
		return err
	}

	itemId := uuid.New().String()
	imgKey := itemId + "." + imgType
	imgPath := carouselImageDir + imgKey

	err = d.saveToBucket(ctx, imgPath, imgToSave, contentType)
	if err != nil {
		return err
	}

	carouselItem := openapi.CarouselItem{
		Id:       itemId,
		Title:    title,
		Subtitle: subtitle,
		Url:      imgPath,
	}

	return d.addOrUpdateInfo(ctx, appdataContentId, carouselRecType, itemId, carouselItem)
}

func (d UserManagerAppData) GetCarouselItems(ctx context.Context) ([]openapi.CarouselItem, error) {

	carouselItems := []openapi.CarouselItem{}
	unmarshaller := func(input []byte) error {
		var itemInfo openapi.CarouselItem
		err := json.Unmarshal(input, &itemInfo)
		if err != nil {
			return err
		}
		carouselItems = append(carouselItems, itemInfo)
		return nil
	}

	err := d.getInfoDataMap(ctx, appdataContentId, carouselRecType, unmarshaller)
	if err != nil {
		return nil, err
	}
	return carouselItems, nil
}

func (d UserManagerAppData) GetCarouselItem(ctx context.Context, itemId string) (openapi.CarouselItem, error) {
	var itemInfo openapi.CarouselItem
	unmarshaller := func(input []byte) error {
		return json.Unmarshal(input, &itemInfo)
	}

	exists, err := d.getInfoDataMapItem(ctx, appdataContentId, carouselRecType, itemId, unmarshaller)

	if err != nil {
		return openapi.CarouselItem{}, err
	}

	if !exists {
		return openapi.CarouselItem{}, errors.New("unable to find requested carousel item")
	}

	return itemInfo, nil

}

func (d UserManagerAppData) DeleteCarouselItem(ctx context.Context, itemId string) error {

	item, err := d.GetCarouselItem(ctx, itemId)
	if err != nil {
		return err
	}

	err = d.deleteInfoDataMapItem(ctx, appdataContentId, carouselRecType, itemId)

	if err != nil {
		return err
	}

	key := item.Url
	if strings.HasPrefix(key, "/") {
		key = key[1:]
	}

	_, err = d.s3Client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: &d.cfg.S3Bucket,
		Key:    &key,
	})

	if err != nil {
		return err
	}

	return err
}

func (d UserManagerAppData) AddBackgroundImage(ctx context.Context, img *bytes.Reader) error {
	imgToSave, imgType, contentType, width, height, err := d.processImage(img)
	if err != nil {
		return err
	}

	itemId := uuid.New().String()
	imgKey := itemId + "." + imgType
	imgPath := backgroundImageDir + imgKey

	bgImage := openapi.BackgroundImageItem{
		Id:     itemId,
		Src:    imgPath,
		Width:  int32(width),
		Height: int32(height),
	}

	err = d.saveToBucket(ctx, imgPath, imgToSave, contentType)
	if err != nil {
		return err
	}

	return d.addOrUpdateInfo(ctx, appdataContentId, backgroundImageRecType, itemId, bgImage)
}

func (d UserManagerAppData) GetBackgroundImages(ctx context.Context) ([]openapi.BackgroundImageItem, error) {
	allImages := []openapi.BackgroundImageItem{}
	unmarshaller := func(input []byte) error {
		var item openapi.BackgroundImageItem
		err := json.Unmarshal(input, &item)
		if err != nil {
			return err
		}
		allImages = append(allImages, item)
		return nil
	}

	err := d.getInfoDataMap(ctx, appdataContentId, backgroundImageRecType, unmarshaller)
	if err != nil {
		return nil, err
	}
	return allImages, nil
}

func (d UserManagerAppData) GetBackgroundImage(ctx context.Context, itemId string) (openapi.BackgroundImageItem, error) {
	var itemInfo openapi.BackgroundImageItem
	unmarshaller := func(input []byte) error {
		return json.Unmarshal(input, &itemInfo)
	}

	exists, err := d.getInfoDataMapItem(ctx, appdataContentId, backgroundImageRecType, itemId, unmarshaller)

	if err != nil {
		return openapi.BackgroundImageItem{}, err
	}

	if !exists {
		return openapi.BackgroundImageItem{}, errors.New("unable to find requested background image")
	}

	return itemInfo, nil
}

func (d UserManagerAppData) DeleteBackgroundImage(ctx context.Context, itemId string) error {
	item, err := d.GetBackgroundImage(ctx, itemId)
	if err != nil {
		return err
	}

	err = d.deleteInfoDataMapItem(ctx, appdataContentId, backgroundImageRecType, itemId)

	if err != nil {
		return err
	}

	key := item.Src
	if strings.HasPrefix(key, "/") {
		key = key[1:]
	}

	_, err = d.s3Client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: &d.cfg.S3Bucket,
		Key:    &key,
	})

	if err != nil {
		return err
	}

	return err
}

func (d UserManagerAppData) AddPageContent(ctx context.Context, pageId string, content openapi.PageContent) error {
	itemId := strconv.FormatInt(time.Now().Unix(), 10)
	content.Id = itemId
	return d.addOrUpdateInfo(ctx, pageContentsId, pageId, itemId, content)
}

func (d UserManagerAppData) UpdatePageContent(ctx context.Context, pageId string, contentId string, content openapi.PageContent) error {
	currentContents, err := d.GetPageContents(ctx, pageId)
	if err != nil {
		return err
	}
	var hasContent bool
	for _, c := range currentContents {
		if c.Id == contentId {
			hasContent = true
			break
		}
	}
	if !hasContent {
		return errors.New("unable to find content with id " + contentId)
	}
	content.Id = contentId
	return d.updateInfo(ctx, pageContentsId, pageId, contentId, content)
}

func (d UserManagerAppData) DeletePageContent(ctx context.Context, pageId string, contentId string) error {
	return d.deleteInfoDataMapItem(ctx, pageContentsId, pageId, contentId)
}

func (d UserManagerAppData) GetPageContents(ctx context.Context, pageId string) ([]openapi.PageContent, error) {
	allPageContents := []openapi.PageContent{}
	unmarshaller := func(input []byte) error {
		var item openapi.PageContent
		err := json.Unmarshal(input, &item)
		if err != nil {
			return err
		}
		allPageContents = append(allPageContents, item)
		return nil
	}

	err := d.getInfoDataMap(ctx, pageContentsId, pageId, unmarshaller)
	if err != nil {
		return nil, err
	}
	sort.Slice(allPageContents, func(i, j int) bool {
		contentIdStr1, contentIdStr2 := allPageContents[i].Id, allPageContents[j].Id
		contentId1, parseErr := strconv.Atoi(contentIdStr1)
		if parseErr != nil {
			return true
		}
		contentId2, parseErr := strconv.Atoi(contentIdStr2)
		if parseErr != nil {
			return false
		}
		return contentId1 < contentId2
	})
	return allPageContents, nil
}

func (d UserManagerAppData) insertFamilyMembers(ctx context.Context, familyID *string, currentUser openapi.User, userData []openapi.UserData) (openapi.FamilyId, error) {

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
	_, err := d.dynamodbClient.ExecuteTransaction(ctx, &dynamodb.ExecuteTransactionInput{
		TransactStatements: statements,
	})
	if err != nil {
		return openapi.FamilyId{}, err
	}

	return openapi.FamilyId{
		FamilyId: *familyID,
	}, nil
}

func (d UserManagerAppData) formatUser(user openapi.User, u openapi.UserData) (openapi.UserData, stringSet, string) {
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
func (d UserManagerAppData) getUserDetailsForIDs(ctx context.Context, ids []string) ([]openapi.UserData, error) {
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

	batchExecutionOutput, err := d.dynamodbClient.BatchExecuteStatement(ctx, &dynamodb.BatchExecuteStatementInput{
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

func (d UserManagerAppData) getFamilyIDForEmail(ctx context.Context, email string) (*string, error) {
	currentFamilyQueryInput := &dynamodb.ExecuteStatementInput{
		Statement: aws.String(fmt.Sprintf(
			`SELECT * FROM "%s"."%s" WHERE CONTAINS("%s", '%s')`,
			d.cfg.UserDataTableName,
			d.cfg.EmailIndexName,
			emailIdAttribute,
			email,
		)),
	}
	currentFamilyQueryOutput, err := d.dynamodbClient.ExecuteStatement(ctx, currentFamilyQueryInput)
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

func (d UserManagerAppData) getFamilyMemberIDs(ctx context.Context, familyID string) ([]string, error) {
	familyMembersQueryInput := &dynamodb.ExecuteStatementInput{
		Statement: aws.String(fmt.Sprintf(
			`SELECT * FROM "%s"."%s" WHERE "%s" = '%s'`,
			d.cfg.UserDataTableName,
			d.cfg.FamilyIndexName,
			familyIdAttribute,
			familyID,
		)),
	}
	familyMembersQueryOutput, err := d.dynamodbClient.ExecuteStatement(ctx, familyMembersQueryInput)
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

func (d UserManagerAppData) getStringValue(attrMap map[string]types.AttributeValue, attrName string) *string {
	attr, exists := attrMap[attrName]
	if exists {
		member, ok := attr.(*types.AttributeValueMemberS)
		if ok {
			return aws.String(member.Value)
		}
	}
	return nil
}

func (d UserManagerAppData) getIntValue(attrMap map[string]types.AttributeValue, attrName string) *int {
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

func (d UserManagerAppData) titleCase(s string) string {
	return strings.TrimSpace(titleCaser.String(s))
}

func (d UserManagerAppData) buildSearchIndex(s ...string) string {
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
func (d UserManagerAppData) processImage(img *bytes.Reader) (*io.Reader, string, string, int, int, error) {
	var imgToSave io.Reader
	uploadedImage, imgType, err := image.Decode(img)
	if err != nil {
		return nil, "", "", 0, 0, err
	}
	imgToSave = img
	bounds := uploadedImage.Bounds()
	contentType := "image/" + imgType
	if bounds.Dx() > 800 {
		buf := new(bytes.Buffer)
		resizedImage := imaging.Resize(uploadedImage, 800, 0, imaging.Lanczos)
		bounds = resizedImage.Bounds()
		switch imgType {
		case "jpeg":
			err = jpeg.Encode(buf, resizedImage, nil)
			imgToSave = bytes.NewReader(buf.Bytes())
		case "png":
			err = png.Encode(buf, resizedImage)
			imgToSave = bytes.NewReader(buf.Bytes())
		}
	}
	return &imgToSave, imgType, contentType, bounds.Dx(), bounds.Dy(), nil
}

func (d UserManagerAppData) saveToBucket(ctx context.Context, key string, body *io.Reader, contentType string) error {
	if strings.HasPrefix(key, "/") {
		key = key[1:]
	}
	_, err := d.s3Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      &d.cfg.S3Bucket,
		Key:         &key,
		Body:        *body,
		ContentType: &contentType,
	})
	return err
}
func (d UserManagerAppData) updateInfo(ctx context.Context, keyId string, keyType string, itemId string, item interface{}) error {
	c, _ := json.Marshal(item)

	_, err := d.dynamodbClient.UpdateItem(ctx, &dynamodb.UpdateItemInput{
		TableName: &d.cfg.UserDataTableName,
		Key: map[string]types.AttributeValue{
			idAttribute: &types.AttributeValueMemberS{
				Value: keyId,
			},
			recTypeAttribute: &types.AttributeValueMemberS{
				Value: keyType,
			},
		},
		UpdateExpression: aws.String(fmt.Sprintf("SET %s.#itemId = :itemData", infoAttribute)),
		ExpressionAttributeNames: map[string]string{
			"#itemId": itemId,
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":itemData": &types.AttributeValueMemberS{
				Value: string(c),
			},
		},
		ConditionExpression: aws.String(fmt.Sprintf("attribute_exists(%s)", infoAttribute)),
	})
	return err
}
func (d UserManagerAppData) addOrUpdateInfo(ctx context.Context, keyId string, keyType string, itemId string, item interface{}) error {
	err := d.updateInfo(ctx, keyId, keyType, itemId, item)

	if err != nil {
		var cfe *types.ConditionalCheckFailedException
		if errors.As(err, &cfe) {
			c, _ := json.Marshal(item)
			_, err = d.dynamodbClient.PutItem(ctx, &dynamodb.PutItemInput{
				TableName: &d.cfg.UserDataTableName,
				Item: map[string]types.AttributeValue{
					idAttribute: &types.AttributeValueMemberS{
						Value: keyId,
					},
					recTypeAttribute: &types.AttributeValueMemberS{
						Value: keyType,
					},
					infoAttribute: &types.AttributeValueMemberM{
						Value: map[string]types.AttributeValue{
							itemId: &types.AttributeValueMemberS{
								Value: string(c),
							},
						},
					},
				},
			})
			if err != nil {
				return err
			}
		} else {
			return err
		}
	}
	return err
}

func (d UserManagerAppData) getInfoDataMap(ctx context.Context, id string, recType string, unmarshaller dataUnmarshaller) error {
	data, err := d.dynamodbClient.ExecuteStatement(ctx, &dynamodb.ExecuteStatementInput{
		Statement: aws.String(fmt.Sprintf(
			`SELECT * FROM "%s" WHERE "%s" = '%s' AND "%s" = '%s'`,
			d.cfg.UserDataTableName,
			idAttribute,
			id,
			recTypeAttribute,
			recType,
		)),
	})
	if err != nil {
		return err
	}
	if len(data.Items) == 0 {
		return nil
	}
	attr, exists := data.Items[0][infoAttribute]
	if exists {
		mapEntries, ok := attr.(*types.AttributeValueMemberM)
		if ok {
			for _, v := range mapEntries.Value {
				itemEntry, ok := v.(*types.AttributeValueMemberS)
				if ok {
					err = unmarshaller([]byte(itemEntry.Value))
					if err != nil {
						return err
					}
				}
			}
		}
	}
	return nil
}

func (d UserManagerAppData) getInfoDataMapItem(ctx context.Context, id string, recType string, itemId string, unmarshaller dataUnmarshaller) (bool, error) {
	data, err := d.dynamodbClient.ExecuteStatement(ctx, &dynamodb.ExecuteStatementInput{
		Statement: aws.String(fmt.Sprintf(
			`SELECT "%s"."%s" FROM "%s" WHERE "%s" = '%s' AND "%s" = '%s'`,
			infoAttribute,
			itemId,
			d.cfg.UserDataTableName,
			idAttribute,
			id,
			recTypeAttribute,
			recType,
		)),
	})
	if err != nil {
		return false, err
	}
	if len(data.Items) == 0 {
		return false, nil
	}

	attr, exists := data.Items[0][itemId]
	if exists {
		dataStr, ok := attr.(*types.AttributeValueMemberS)
		if ok {
			err = unmarshaller([]byte(dataStr.Value))
			if err != nil {
				return false, err
			}
			return true, nil
		}
	}
	return false, nil
}

func (d UserManagerAppData) deleteInfoDataMapItem(ctx context.Context, recId, recType, itemId string) error {
	_, err := d.dynamodbClient.UpdateItem(ctx, &dynamodb.UpdateItemInput{
		TableName: &d.cfg.UserDataTableName,
		Key: map[string]types.AttributeValue{
			idAttribute: &types.AttributeValueMemberS{
				Value: recId,
			},
			recTypeAttribute: &types.AttributeValueMemberS{
				Value: recType,
			},
		},
		UpdateExpression: aws.String(fmt.Sprintf("REMOVE %s.#itemId", infoAttribute)),
		ExpressionAttributeNames: map[string]string{
			"#itemId": itemId,
		},
		ConditionExpression: aws.String(fmt.Sprintf("attribute_exists(%s)", infoAttribute)),
	})

	return err
}

func NewDataService(cfg *config.Config, authService AuthService) DataService {

	return UserManagerAppData{
		cfg:            cfg,
		dynamodbClient: dynamodb.NewFromConfig(cfg.AwsConfig),
		s3Client: s3.NewFromConfig(cfg.AwsConfig, func(options *s3.Options) {
			options.UsePathStyle = true
		}),
		authService: authService,
	}
}
