package main

import (
	"context"
	"lambdas/user_manager/routes"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/core"
	"github.com/awslabs/aws-lambda-go-api-proxy/gorillamux"
)

var gorillaMux *gorillamux.GorillaMuxAdapter

// Handler is the main entry point for Lambda. Receives a proxy request and
// returns a proxy response
func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if gorillaMux == nil {
		gorillaMux = gorillamux.New(routes.GetRoutes())
	}
	resp, err := gorillaMux.ProxyWithContext(ctx, *core.NewSwitchableAPIGatewayRequestV1(&req))
	return *resp.Version1(), err
}

func main() {
	lambda.Start(Handler)
}
