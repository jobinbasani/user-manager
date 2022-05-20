package signupservice

import (
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"lambdas/post_signup/signupconfig"
)

const (
	emailIdAttribute = "emailId"
)

type SignupDataService interface {
	IsEmailPresent(ctx context.Context, email string) (bool, error)
}
type SignupDynamoDBService struct {
	cfg    *signupconfig.Config
	client *dynamodb.Client
}

func (d SignupDynamoDBService) IsEmailPresent(ctx context.Context, email string) (bool, error) {
	checkEmailQueryInput := &dynamodb.ExecuteStatementInput{
		Statement: aws.String(fmt.Sprintf(
			`SELECT * FROM "%s"."%s" WHERE CONTAINS("%s", '%s')`,
			d.cfg.UserDataTableName,
			d.cfg.EmailIndexName,
			emailIdAttribute,
			email,
		)),
	}
	checkEmailQueryOutput, err := d.client.ExecuteStatement(ctx, checkEmailQueryInput)
	if err != nil {
		return false, err
	}
	if len(checkEmailQueryOutput.Items) == 0 {
		return false, nil
	}
	return true, nil
}

func NewDataService(cfg *signupconfig.Config) SignupDataService {

	return SignupDynamoDBService{
		cfg:    cfg,
		client: dynamodb.NewFromConfig(cfg.AwsConfig),
	}
}
