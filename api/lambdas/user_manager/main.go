package main

import (
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/httpadapter"
	"lambdas/user_manager/routes"
)

func main() {
	lambda.Start(httpadapter.New(routes.GetRoutes()).ProxyWithContext)
}
