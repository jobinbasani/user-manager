package main

import (
	"context"
	"net/http"
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
			expectedStatusCode: http.StatusUnauthorized,
		},
	}

	t.Setenv("USERMANAGER_JWKS_URL", "https://cognito-idp.ca-central-1.amazonaws.com/poolid/.well-known/jwks.json")

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			resp, err := Handler(context.Background(), test.req)
			require.NoError(t, err)
			require.NotNil(t, resp)
			require.Equal(t, test.expectedStatusCode, resp.StatusCode)
		})
	}
}
