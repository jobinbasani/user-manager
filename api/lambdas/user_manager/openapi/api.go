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
	"net/http"
)

// AdminApiRouter defines the required methods for binding the api requests to a responses for the AdminApi
// The AdminApiRouter implementation should parse necessary information from the http request,
// pass the data to a AdminApiServicer to perform the required actions, then write the service results to the http response.
type AdminApiRouter interface {
	AddAnnouncement(http.ResponseWriter, *http.Request)
	AddToAdminGroup(http.ResponseWriter, *http.Request)
	DeleteAnnouncements(http.ResponseWriter, *http.Request)
	GetAdmins(http.ResponseWriter, *http.Request)
	RemoveFromAdminGroup(http.ResponseWriter, *http.Request)
	SearchSignedUpUsers(http.ResponseWriter, *http.Request)
	SetCatechismData(http.ResponseWriter, *http.Request)
	SetCommitteeData(http.ResponseWriter, *http.Request)
	SetServiceData(http.ResponseWriter, *http.Request)
}

// FamilyManagementApiRouter defines the required methods for binding the api requests to a responses for the FamilyManagementApi
// The FamilyManagementApiRouter implementation should parse necessary information from the http request,
// pass the data to a FamilyManagementApiServicer to perform the required actions, then write the service results to the http response.
type FamilyManagementApiRouter interface {
	AddFamilyMembers(http.ResponseWriter, *http.Request)
	DeleteFamilyMembers(http.ResponseWriter, *http.Request)
	GetUserFamily(http.ResponseWriter, *http.Request)
	UpdateFamilyMember(http.ResponseWriter, *http.Request)
}

// PublicApiRouter defines the required methods for binding the api requests to a responses for the PublicApi
// The PublicApiRouter implementation should parse necessary information from the http request,
// pass the data to a PublicApiServicer to perform the required actions, then write the service results to the http response.
type PublicApiRouter interface {
	GetAnnouncements(http.ResponseWriter, *http.Request)
	GetCatechism(http.ResponseWriter, *http.Request)
	GetCommittee(http.ResponseWriter, *http.Request)
	GetServices(http.ResponseWriter, *http.Request)
}

// UserManagementApiRouter defines the required methods for binding the api requests to a responses for the UserManagementApi
// The UserManagementApiRouter implementation should parse necessary information from the http request,
// pass the data to a UserManagementApiServicer to perform the required actions, then write the service results to the http response.
type UserManagementApiRouter interface {
	GetUser(http.ResponseWriter, *http.Request)
}

// AdminApiServicer defines the api actions for the AdminApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type AdminApiServicer interface {
	AddAnnouncement(context.Context, Announcement) (ImplResponse, error)
	AddToAdminGroup(context.Context, []string) (ImplResponse, error)
	DeleteAnnouncements(context.Context, []string) (ImplResponse, error)
	GetAdmins(context.Context) (ImplResponse, error)
	RemoveFromAdminGroup(context.Context, []string) (ImplResponse, error)
	SearchSignedUpUsers(context.Context, string) (ImplResponse, error)
	SetCatechismData(context.Context, PageContent) (ImplResponse, error)
	SetCommitteeData(context.Context, PageContent) (ImplResponse, error)
	SetServiceData(context.Context, PageContent) (ImplResponse, error)
}

// FamilyManagementApiServicer defines the api actions for the FamilyManagementApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type FamilyManagementApiServicer interface {
	AddFamilyMembers(context.Context, []UserData) (ImplResponse, error)
	DeleteFamilyMembers(context.Context, []string) (ImplResponse, error)
	GetUserFamily(context.Context) (ImplResponse, error)
	UpdateFamilyMember(context.Context, string, UserData) (ImplResponse, error)
}

// PublicApiServicer defines the api actions for the PublicApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type PublicApiServicer interface {
	GetAnnouncements(context.Context) (ImplResponse, error)
	GetCatechism(context.Context) (ImplResponse, error)
	GetCommittee(context.Context) (ImplResponse, error)
	GetServices(context.Context) (ImplResponse, error)
}

// UserManagementApiServicer defines the api actions for the UserManagementApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type UserManagementApiServicer interface {
	GetUser(context.Context) (ImplResponse, error)
}
