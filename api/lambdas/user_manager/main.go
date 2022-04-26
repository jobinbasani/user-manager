package main

import (
	"context"
	"lambdas/user_manager/config"
	"lambdas/user_manager/routes"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/core"
	"github.com/awslabs/aws-lambda-go-api-proxy/gorillamux"
	_ "github.com/joho/godotenv/autoload"
)

var gorillaMux *gorillamux.GorillaMuxAdapter
var cfg *config.Config

// Handler is the main entry point for Lambda. Receives a proxy request and
// returns a proxy response
func Handler(ctx context.Context, req events.LambdaFunctionURLRequest) (events.APIGatewayProxyResponse, error) {
	if cfg == nil {
		cfg = config.Configure(ctx)
	}
	if gorillaMux == nil {
		gorillaMux = gorillamux.New(routes.GetRoutes(ctx, cfg))
	}
	resp, err := gorillaMux.ProxyWithContext(ctx, *core.NewSwitchableAPIGatewayRequestV1(&events.APIGatewayProxyRequest{
		Path:                  req.RequestContext.HTTP.Path,
		HTTPMethod:            req.RequestContext.HTTP.Method,
		Headers:               req.Headers,
		QueryStringParameters: req.QueryStringParameters,
		Body:                  req.Body,
	}))
	return *resp.Version1(), err
}

func main() {
	lambda.Start(Handler)
}
