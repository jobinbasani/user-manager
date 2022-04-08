package main

import (
	"context"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/stretchr/testify/require"
)

func Test(t *testing.T) {
	tests := []struct {
		name               string
		req                events.APIGatewayProxyRequest
		expectedStatusCode int
	}{
		{
			name: "Verify path",
			req: events.APIGatewayProxyRequest{
				Path:       "/api/v1/user",
				HTTPMethod: "GET",
			},
			expectedStatusCode: 200,
		},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			resp, err := Handler(context.Background(), test.req)
			require.NoError(t, err)
			require.NotNil(t, resp)
			require.Equal(t, test.expectedStatusCode, resp.StatusCode)
		})
	}
}
