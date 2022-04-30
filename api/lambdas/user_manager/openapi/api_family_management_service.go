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
	"context"
	"errors"
	"net/http"
)

// FamilyManagementApiService is a service that implements the logic for the FamilyManagementApiServicer
// This service should implement the business logic for every endpoint for the FamilyManagementApi API.
// Include any external packages or services that will be required by this service.
type FamilyManagementApiService struct {
}

// NewFamilyManagementApiService creates a default api service
func NewFamilyManagementApiService() FamilyManagementApiServicer {
	return &FamilyManagementApiService{}
}

// AddUpdateUserFamily - Add/update user family details
func (s *FamilyManagementApiService) AddUpdateUserFamily(ctx context.Context, userData []UserData) (ImplResponse, error) {
	// TODO - update AddUpdateUserFamily with the required logic for this service method.
	// Add api_family_management_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(201, {}) or use other options such as http.Ok ...
	//return Response(201, nil),nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("AddUpdateUserFamily method not implemented")
}
