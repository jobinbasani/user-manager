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

// AdminApiService is a service that implements the logic for the AdminApiServicer
// This service should implement the business logic for every endpoint for the AdminApi API.
// Include any external packages or services that will be required by this service.
type AdminApiService struct {
}

// NewAdminApiService creates a default api service
func NewAdminApiService() AdminApiServicer {
	return &AdminApiService{}
}

// AddAnnouncement - Add a new announcement
func (s *AdminApiService) AddAnnouncement(ctx context.Context, announcement Announcement) (ImplResponse, error) {
	// TODO - update AddAnnouncement with the required logic for this service method.
	// Add api_admin_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(201, AnnouncementId{}) or use other options such as http.Ok ...
	//return Response(201, AnnouncementId{}), nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("AddAnnouncement method not implemented")
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

// DeleteAnnouncements - Delete announcements
func (s *AdminApiService) DeleteAnnouncements(ctx context.Context, requestBody []string) (ImplResponse, error) {
	// TODO - update DeleteAnnouncements with the required logic for this service method.
	// Add api_admin_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(200, []string{}) or use other options such as http.Ok ...
	//return Response(200, []string{}), nil

	//TODO: Uncomment the next line to return response Response(401, UnauthorizedError{}) or use other options such as http.Ok ...
	//return Response(401, UnauthorizedError{}), nil

	//TODO: Uncomment the next line to return response Response(403, ForbiddenError{}) or use other options such as http.Ok ...
	//return Response(403, ForbiddenError{}), nil

	//TODO: Uncomment the next line to return response Response(404, NotFoundError{}) or use other options such as http.Ok ...
	//return Response(404, NotFoundError{}), nil

	//TODO: Uncomment the next line to return response Response(0, InternalServerError{}) or use other options such as http.Ok ...
	//return Response(0, InternalServerError{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("DeleteAnnouncements method not implemented")
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

// SetCatechismData - Set catechism details
func (s *AdminApiService) SetCatechismData(ctx context.Context, pageContent PageContent) (ImplResponse, error) {
	// TODO - update SetCatechismData with the required logic for this service method.
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

	return Response(http.StatusNotImplemented, nil), errors.New("SetCatechismData method not implemented")
}

// SetCommitteeData - Set committee details
func (s *AdminApiService) SetCommitteeData(ctx context.Context, pageContent PageContent) (ImplResponse, error) {
	// TODO - update SetCommitteeData with the required logic for this service method.
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

	return Response(http.StatusNotImplemented, nil), errors.New("SetCommitteeData method not implemented")
}

// SetServiceData - Set service details
func (s *AdminApiService) SetServiceData(ctx context.Context, pageContent PageContent) (ImplResponse, error) {
	// TODO - update SetServiceData with the required logic for this service method.
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

	return Response(http.StatusNotImplemented, nil), errors.New("SetServiceData method not implemented")
}
