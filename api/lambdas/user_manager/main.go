package main

import (
	"lambdas/user_manager/routes"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/httpadapter"
)

func main() {
	lambda.Start(httpadapter.New(routes.GetRoutes()).ProxyWithContext)
}
