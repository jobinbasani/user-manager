package service

import (
	"context"
	"fmt"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/util"
	"log"
	"strings"
	"sync"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider/types"
	"github.com/samber/lo"
	lop "github.com/samber/lo/parallel"
	"golang.org/x/sync/errgroup"
)

type AuthService interface {
	GetUserInfoByAccessToken(ctx context.Context) (openapi.User, error)
	GetUserInfoBySub(ctx context.Context, sub string) (openapi.User, error)
	GetUserInfoByFirstName(ctx context.Context, sub string) ([]openapi.User, error)
	GetUserInfoByLastName(ctx context.Context, sub string) ([]openapi.User, error)
	GetUserInfoByEmail(ctx context.Context, email string) (openapi.User, error)
	GetAdmins(ctx context.Context) (openapi.BasicUserInfoList, error)
	SearchUsers(ctx context.Context, query string) (openapi.BasicUserInfoList, error)
}

type CognitoService struct {
	cfg    *config.Config
	client *cognitoidentityprovider.Client
}

type lookupFunc func(ctx context.Context, s string) ([]openapi.User, error)

func (c *CognitoService) GetUserInfoByEmail(ctx context.Context, email string) (openapi.User, error) {
	users, err := c.getUserInfoByAttribute(ctx, fmt.Sprintf("email = \"%s\"", email))
	if err != nil {
		return openapi.User{}, err
	}
	return users[0], err
}

func (c *CognitoService) GetUserInfoBySub(ctx context.Context, sub string) (openapi.User, error) {
	users, err := c.getUserInfoByAttribute(ctx, fmt.Sprintf("sub = \"%s\"", sub))
	if err != nil {
		return openapi.User{}, err
	}
	return users[0], err
}

func (c *CognitoService) getUserInfoByAttribute(ctx context.Context, attribute string) ([]openapi.User, error) {
	output, err := c.client.ListUsers(ctx, &cognitoidentityprovider.ListUsersInput{
		UserPoolId: aws.String(c.cfg.CognitoUserPoolID),
		Filter:     aws.String(attribute),
	})
	if err != nil {
		return nil, err
	}
	if len(output.Users) == 0 {
		return nil, fmt.Errorf("no user with '%s' found", attribute)
	}
	users := lop.Map(output.Users, func(o types.UserType, i int) openapi.User {
		return c.cognitoUserOutputToUserRecord(o.Attributes)
	})
	return users, nil
}

func (c *CognitoService) GetUserInfoByAccessToken(ctx context.Context) (openapi.User, error) {
	userOutput, err := c.client.GetUser(ctx, &cognitoidentityprovider.GetUserInput{
		AccessToken: aws.String(util.GetUserAccessTokenFromContext(ctx)),
	})
	if err != nil {
		log.Println(err)
		return openapi.User{}, err
	}
	return c.cognitoUserOutputToUserRecord(userOutput.UserAttributes), nil
}

func (c *CognitoService) GetAdmins(ctx context.Context) (openapi.BasicUserInfoList, error) {
	var users []openapi.User
	userOutput, err := c.client.ListUsersInGroup(ctx, &cognitoidentityprovider.ListUsersInGroupInput{
		GroupName:  c.cfg.CognitoAdminGroup,
		UserPoolId: aws.String(c.cfg.CognitoUserPoolID),
	})
	if err != nil {
		return openapi.BasicUserInfoList{}, err
	}
	for _, u := range userOutput.Users {
		users = append(users, c.cognitoUserOutputToUserRecord(u.Attributes))
	}
	return openapi.BasicUserInfoList{
		Total: int32(len(users)),
		Items: users,
	}, nil
}

func (c *CognitoService) GetUserInfoByFirstName(ctx context.Context, sub string) ([]openapi.User, error) {
	return c.getUserInfoByAttribute(ctx, fmt.Sprintf("given_name ^= \"%s\"", sub))
}

func (c *CognitoService) GetUserInfoByLastName(ctx context.Context, sub string) ([]openapi.User, error) {
	return c.getUserInfoByAttribute(ctx, fmt.Sprintf("family_name ^= \"%s\"", sub))
}

func (c *CognitoService) SearchUsers(ctx context.Context, query string) (openapi.BasicUserInfoList, error) {
	lookup := strings.TrimSpace(query)
	if strings.Contains(lookup, "@") {
		users, err := c.getUserInfoByAttribute(ctx, fmt.Sprintf("email = \"%s\"", lookup))
		if err != nil {
			return openapi.BasicUserInfoList{}, err
		}
		return openapi.BasicUserInfoList{
			Total: int32(len(users)),
			Items: users,
		}, err
	}
	g, ctx := errgroup.WithContext(ctx)
	results := make(map[string]openapi.User)
	var mu sync.Mutex
	lo.ForEach([]lookupFunc{c.GetUserInfoByFirstName, c.GetUserInfoByLastName}, func(l lookupFunc, _ int) {
		g.Go(func() error {
			users, _ := l(ctx, lookup)
			if users == nil {
				return nil
			}
			lo.ForEach(users, func(u openapi.User, _ int) {
				mu.Lock()
				results[u.Id] = u
				mu.Unlock()
			})
			return nil
		})
	})
	if err := g.Wait(); err != nil {
		return openapi.BasicUserInfoList{}, err
	}
	var users []openapi.User
	for k := range results {
		users = append(users, results[k])
	}
	return openapi.BasicUserInfoList{
		Total: int32(len(users)),
		Items: users,
	}, nil
}

func (c *CognitoService) cognitoUserOutputToUserRecord(attributes []types.AttributeType) openapi.User {
	var user openapi.User
	for _, attribute := range attributes {
		switch *attribute.Name {
		case "sub":
			user.Id = *attribute.Value
		case "given_name":
			user.FirstName = *attribute.Value
		case "family_name":
			user.LastName = *attribute.Value
		case "email":
			user.Email = *attribute.Value
		case "custom:approved_user":
			if attribute.Value != nil && *attribute.Value == "true" {
				user.IsApproved = true
			}
		}
	}
	user.DisplayName = util.ToTitleCase(user.FirstName, user.LastName)
	return user
}

func NewAuthService(cfg *config.Config) AuthService {

	return &CognitoService{
		cfg:    cfg,
		client: cognitoidentityprovider.NewFromConfig(cfg.AwsConfig),
	}
}
