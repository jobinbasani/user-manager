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
	"os"
)

// AdminApiRouter defines the required methods for binding the api requests to a responses for the AdminApi
// The AdminApiRouter implementation should parse necessary information from the http request,
// pass the data to a AdminApiServicer to perform the required actions, then write the service results to the http response.
type AdminApiRouter interface {
	AddBackgroundImage(http.ResponseWriter, *http.Request)
	AddCarouselItem(http.ResponseWriter, *http.Request)
	AddPageContent(http.ResponseWriter, *http.Request)
	AddToAdminGroup(http.ResponseWriter, *http.Request)
	DeleteBackgroundImage(http.ResponseWriter, *http.Request)
	DeleteCarouselItem(http.ResponseWriter, *http.Request)
	DeletePageContent(http.ResponseWriter, *http.Request)
	GetAdmins(http.ResponseWriter, *http.Request)
	GetBackgroundImages(http.ResponseWriter, *http.Request)
	ListUsers(http.ResponseWriter, *http.Request)
	RemoveFromAdminGroup(http.ResponseWriter, *http.Request)
	SearchFamilyMembers(http.ResponseWriter, *http.Request)
	SearchSignedUpUsers(http.ResponseWriter, *http.Request)
	UpdatePageContent(http.ResponseWriter, *http.Request)
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
	GetCarouselItems(http.ResponseWriter, *http.Request)
	GetPageContents(http.ResponseWriter, *http.Request)
}

// UserManagementApiRouter defines the required methods for binding the api requests to a responses for the UserManagementApi
// The UserManagementApiRouter implementation should parse necessary information from the http request,
// pass the data to a UserManagementApiServicer to perform the required actions, then write the service results to the http response.
type UserManagementApiRouter interface {
	GetUser(http.ResponseWriter, *http.Request)
}

// AdminApiServicer defines the api actions for the AdminApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can be ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type AdminApiServicer interface {
	AddBackgroundImage(context.Context, *os.File) (ImplResponse, error)
	AddCarouselItem(context.Context, *os.File, string, string) (ImplResponse, error)
	AddPageContent(context.Context, string, PageContent) (ImplResponse, error)
	AddToAdminGroup(context.Context, []string) (ImplResponse, error)
	DeleteBackgroundImage(context.Context, string) (ImplResponse, error)
	DeleteCarouselItem(context.Context, string) (ImplResponse, error)
	DeletePageContent(context.Context, string, string) (ImplResponse, error)
	GetAdmins(context.Context) (ImplResponse, error)
	GetBackgroundImages(context.Context) (ImplResponse, error)
	ListUsers(context.Context, string, int32) (ImplResponse, error)
	RemoveFromAdminGroup(context.Context, []string) (ImplResponse, error)
	SearchFamilyMembers(context.Context, string) (ImplResponse, error)
	SearchSignedUpUsers(context.Context, string) (ImplResponse, error)
	UpdatePageContent(context.Context, string, string, PageContent) (ImplResponse, error)
}

// FamilyManagementApiServicer defines the api actions for the FamilyManagementApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can be ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type FamilyManagementApiServicer interface {
	AddFamilyMembers(context.Context, []UserData) (ImplResponse, error)
	DeleteFamilyMembers(context.Context, []string) (ImplResponse, error)
	GetUserFamily(context.Context) (ImplResponse, error)
	UpdateFamilyMember(context.Context, string, UserData) (ImplResponse, error)
}

// PublicApiServicer defines the api actions for the PublicApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can be ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type PublicApiServicer interface {
	GetCarouselItems(context.Context) (ImplResponse, error)
	GetPageContents(context.Context, string) (ImplResponse, error)
}

// UserManagementApiServicer defines the api actions for the UserManagementApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can be ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type UserManagementApiServicer interface {
	GetUser(context.Context) (ImplResponse, error)
}
