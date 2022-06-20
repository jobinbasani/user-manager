/*
 * User Manager API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 1.0.1
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package openapi

import (
	"net/http"
	"strings"
)

// PublicApiController binds http requests to an api service and writes the service results to the http response
type PublicApiController struct {
	service      PublicApiServicer
	errorHandler ErrorHandler
}

// PublicApiOption for how the controller is set up.
type PublicApiOption func(*PublicApiController)

// WithPublicApiErrorHandler inject ErrorHandler into controller
func WithPublicApiErrorHandler(h ErrorHandler) PublicApiOption {
	return func(c *PublicApiController) {
		c.errorHandler = h
	}
}

// NewPublicApiController creates a default api controller
func NewPublicApiController(s PublicApiServicer, opts ...PublicApiOption) Router {
	controller := &PublicApiController{
		service:      s,
		errorHandler: DefaultErrorHandler,
	}

	for _, opt := range opts {
		opt(controller)
	}

	return controller
}

// Routes returns all of the api route for the PublicApiController
func (c *PublicApiController) Routes() Routes {
	return Routes{
		{
			"GetAnnouncements",
			strings.ToUpper("Get"),
			"/api/v1/public/announcements",
			c.GetAnnouncements,
		},
	}
}

// GetAnnouncements - Get all announcements
func (c *PublicApiController) GetAnnouncements(w http.ResponseWriter, r *http.Request) {
	result, err := c.service.GetAnnouncements(r.Context())
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}
