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
	"os"
)

// AdminApiService is a service that implements the logic for the AdminApiServicer
// This service should implement the business logic for every endpoint for the AdminApi API.
// Include any external packages or services that will be required by this service.
type AdminApiService struct {
}

// NewAdminApiService creates a default api service
func NewAdminApiService() AdminApiServicer {
	return &AdminApiService{}
}

// AddBackgroundImage - Add a background image
func (s *AdminApiService) AddBackgroundImage(ctx context.Context, image *os.File) (ImplResponse, error) {
	// TODO - update AddBackgroundImage with the required logic for this service method.
	// Add api_admin_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(204, {}) or use other options such as http.Ok ...
	//return Response(204, nil),nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("AddBackgroundImage method not implemented")
}

// AddCarouselItem - Add an item to the carousel
func (s *AdminApiService) AddCarouselItem(ctx context.Context, image *os.File, title string, subtitle string) (ImplResponse, error) {
	// TODO - update AddCarouselItem with the required logic for this service method.
	// Add api_admin_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(204, {}) or use other options such as http.Ok ...
	//return Response(204, nil),nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("AddCarouselItem method not implemented")
}

// AddPageContent - Add content to a page
func (s *AdminApiService) AddPageContent(ctx context.Context, pageId string, pageContent PageContent) (ImplResponse, error) {
	// TODO - update AddPageContent with the required logic for this service method.
	// Add api_admin_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(204, {}) or use other options such as http.Ok ...
	//return Response(204, nil),nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("AddPageContent method not implemented")
}

// AddToAdminGroup - Add members to admin group
func (s *AdminApiService) AddToAdminGroup(ctx context.Context, requestBody []string) (ImplResponse, error) {
	// TODO - update AddToAdminGroup with the required logic for this service method.
	// Add api_admin_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(204, {}) or use other options such as http.Ok ...
	//return Response(204, nil),nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("AddToAdminGroup method not implemented")
}

// DeleteBackgroundImage - Delete an item from the backgrounds
func (s *AdminApiService) DeleteBackgroundImage(ctx context.Context, backgroundImageItemId string) (ImplResponse, error) {
	// TODO - update DeleteBackgroundImage with the required logic for this service method.
	// Add api_admin_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(204, {}) or use other options such as http.Ok ...
	//return Response(204, nil),nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("DeleteBackgroundImage method not implemented")
}

// DeleteCarouselItem - Delete an item from the carousel
func (s *AdminApiService) DeleteCarouselItem(ctx context.Context, carouselItemId string) (ImplResponse, error) {
	// TODO - update DeleteCarouselItem with the required logic for this service method.
	// Add api_admin_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(204, {}) or use other options such as http.Ok ...
	//return Response(204, nil),nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("DeleteCarouselItem method not implemented")
}

// DeletePageContent - Delete content of a page
func (s *AdminApiService) DeletePageContent(ctx context.Context, pageId string, contentId string) (ImplResponse, error) {
	// TODO - update DeletePageContent with the required logic for this service method.
	// Add api_admin_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(204, {}) or use other options such as http.Ok ...
	//return Response(204, nil),nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("DeletePageContent method not implemented")
}

// GetAdmins - List of users with Admin access
func (s *AdminApiService) GetAdmins(ctx context.Context) (ImplResponse, error) {
	// TODO - update GetAdmins with the required logic for this service method.
	// Add api_admin_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(200, BasicUserInfoList{}) or use other options such as http.Ok ...
	//return Response(200, BasicUserInfoList{}), nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("GetAdmins method not implemented")
}

// GetBackgroundImages - Get list of background images
func (s *AdminApiService) GetBackgroundImages(ctx context.Context) (ImplResponse, error) {
	// TODO - update GetBackgroundImages with the required logic for this service method.
	// Add api_admin_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(200, []BackgroundImageItem{}) or use other options such as http.Ok ...
	//return Response(200, []BackgroundImageItem{}), nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("GetBackgroundImages method not implemented")
}

// ListUsers - List users in the system
func (s *AdminApiService) ListUsers(ctx context.Context, start string, limit int32) (ImplResponse, error) {
	// TODO - update ListUsers with the required logic for this service method.
	// Add api_admin_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(200, BasicUserInfoList{}) or use other options such as http.Ok ...
	//return Response(200, BasicUserInfoList{}), nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("ListUsers method not implemented")
}

// RemoveFromAdminGroup - Remove members from admin group
func (s *AdminApiService) RemoveFromAdminGroup(ctx context.Context, requestBody []string) (ImplResponse, error) {
	// TODO - update RemoveFromAdminGroup with the required logic for this service method.
	// Add api_admin_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(204, {}) or use other options such as http.Ok ...
	//return Response(204, nil),nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("RemoveFromAdminGroup method not implemented")
}

// SearchFamilyMembers - Search family members by name or email
func (s *AdminApiService) SearchFamilyMembers(ctx context.Context, q string) (ImplResponse, error) {
	// TODO - update SearchFamilyMembers with the required logic for this service method.
	// Add api_admin_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(200, BasicUserInfoList{}) or use other options such as http.Ok ...
	//return Response(200, BasicUserInfoList{}), nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("SearchFamilyMembers method not implemented")
}

// SearchSignedUpUsers - Search signed up users by name or email
func (s *AdminApiService) SearchSignedUpUsers(ctx context.Context, q string) (ImplResponse, error) {
	// TODO - update SearchSignedUpUsers with the required logic for this service method.
	// Add api_admin_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(200, BasicUserInfoList{}) or use other options such as http.Ok ...
	//return Response(200, BasicUserInfoList{}), nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("SearchSignedUpUsers method not implemented")
}

// UpdatePageContent - Update page content
func (s *AdminApiService) UpdatePageContent(ctx context.Context, pageId string, contentId string, pageContent PageContent) (ImplResponse, error) {
	// TODO - update UpdatePageContent with the required logic for this service method.
	// Add api_admin_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(204, {}) or use other options such as http.Ok ...
	//return Response(204, nil),nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("UpdatePageContent method not implemented")
}
