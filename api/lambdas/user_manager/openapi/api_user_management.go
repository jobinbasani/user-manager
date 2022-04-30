/*
 * User Manager API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package openapi

import (
	"net/http"
	"strings"
)

// UserManagementApiController binds http requests to an api service and writes the service results to the http response
type UserManagementApiController struct {
	service      UserManagementApiServicer
	errorHandler ErrorHandler
}

// UserManagementApiOption for how the controller is set up.
type UserManagementApiOption func(*UserManagementApiController)

// WithUserManagementApiErrorHandler inject ErrorHandler into controller
func WithUserManagementApiErrorHandler(h ErrorHandler) UserManagementApiOption {
	return func(c *UserManagementApiController) {
		c.errorHandler = h
	}
}

// NewUserManagementApiController creates a default api controller
func NewUserManagementApiController(s UserManagementApiServicer, opts ...UserManagementApiOption) Router {
	controller := &UserManagementApiController{
		service:      s,
		errorHandler: DefaultErrorHandler,
	}

	for _, opt := range opts {
		opt(controller)
	}

	return controller
}

// Routes returns all of the api route for the UserManagementApiController
func (c *UserManagementApiController) Routes() Routes {
	return Routes{
		{
			"GetUser",
			strings.ToUpper("Get"),
			"/api/v1/user/profile",
			c.GetUser,
		},
	}
}

// GetUser - Provides user profile information
func (c *UserManagementApiController) GetUser(w http.ResponseWriter, r *http.Request) {
	result, err := c.service.GetUser(r.Context())
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}
