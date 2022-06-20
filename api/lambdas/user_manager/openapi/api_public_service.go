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
	"context"
	"errors"
	"net/http"
)

// PublicApiService is a service that implements the logic for the PublicApiServicer
// This service should implement the business logic for every endpoint for the PublicApi API.
// Include any external packages or services that will be required by this service.
type PublicApiService struct {
}

// NewPublicApiService creates a default api service
func NewPublicApiService() PublicApiServicer {
	return &PublicApiService{}
}

// GetAnnouncements - Get all announcements
func (s *PublicApiService) GetAnnouncements(ctx context.Context) (ImplResponse, error) {
	// TODO - update GetAnnouncements with the required logic for this service method.
	// Add api_public_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(200, []Announcement{}) or use other options such as http.Ok ...
	//return Response(200, []Announcement{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("GetAnnouncements method not implemented")
}
