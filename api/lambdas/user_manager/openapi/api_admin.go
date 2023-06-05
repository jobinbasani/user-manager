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
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

// AdminApiController binds http requests to an api service and writes the service results to the http response
type AdminApiController struct {
	service      AdminApiServicer
	errorHandler ErrorHandler
}

// AdminApiOption for how the controller is set up.
type AdminApiOption func(*AdminApiController)

// WithAdminApiErrorHandler inject ErrorHandler into controller
func WithAdminApiErrorHandler(h ErrorHandler) AdminApiOption {
	return func(c *AdminApiController) {
		c.errorHandler = h
	}
}

// NewAdminApiController creates a default api controller
func NewAdminApiController(s AdminApiServicer, opts ...AdminApiOption) Router {
	controller := &AdminApiController{
		service:      s,
		errorHandler: DefaultErrorHandler,
	}

	for _, opt := range opts {
		opt(controller)
	}

	return controller
}

// Routes returns all the api routes for the AdminApiController
func (c *AdminApiController) Routes() Routes {
	return Routes{
		{
			"AddBackgroundImage",
			strings.ToUpper("Post"),
			"/api/v1/admin/images/backgrounds",
			c.AddBackgroundImage,
		},
		{
			"AddCarouselItem",
			strings.ToUpper("Post"),
			"/api/v1/admin/carousel",
			c.AddCarouselItem,
		},
		{
			"AddPageContent",
			strings.ToUpper("Post"),
			"/api/v1/admin/pages/{pageId}",
			c.AddPageContent,
		},
		{
			"AddToAdminGroup",
			strings.ToUpper("Put"),
			"/api/v1/admin/admins",
			c.AddToAdminGroup,
		},
		{
			"DeleteBackgroundImage",
			strings.ToUpper("Delete"),
			"/api/v1/admin/images/backgrounds/{backgroundImageItemId}",
			c.DeleteBackgroundImage,
		},
		{
			"DeleteCarouselItem",
			strings.ToUpper("Delete"),
			"/api/v1/admin/carousel/{carouselItemId}",
			c.DeleteCarouselItem,
		},
		{
			"DeletePageContent",
			strings.ToUpper("Delete"),
			"/api/v1/admin/pages/{pageId}/{contentId}",
			c.DeletePageContent,
		},
		{
			"GetAdmins",
			strings.ToUpper("Get"),
			"/api/v1/admin/admins",
			c.GetAdmins,
		},
		{
			"GetBackgroundImages",
			strings.ToUpper("Get"),
			"/api/v1/admin/images/backgrounds",
			c.GetBackgroundImages,
		},
		{
			"ListUsers",
			strings.ToUpper("Get"),
			"/api/v1/admin/users",
			c.ListUsers,
		},
		{
			"RemoveFromAdminGroup",
			strings.ToUpper("Delete"),
			"/api/v1/admin/admins",
			c.RemoveFromAdminGroup,
		},
		{
			"SearchFamilyMembers",
			strings.ToUpper("Get"),
			"/api/v1/admin/search/familymembers",
			c.SearchFamilyMembers,
		},
		{
			"SearchSignedUpUsers",
			strings.ToUpper("Get"),
			"/api/v1/admin/search/signedupusers",
			c.SearchSignedUpUsers,
		},
		{
			"UpdatePageContent",
			strings.ToUpper("Put"),
			"/api/v1/admin/pages/{pageId}/{contentId}",
			c.UpdatePageContent,
		},
	}
}

// AddBackgroundImage - Add a background image
func (c *AdminApiController) AddBackgroundImage(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		c.errorHandler(w, r, &ParsingError{Err: err}, nil)
		return
	}

	imageParam, err := ReadFormFileToTempFile(r, "image")
	if err != nil {
		c.errorHandler(w, r, &ParsingError{Err: err}, nil)
		return
	}
	result, err := c.service.AddBackgroundImage(r.Context(), imageParam)
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}

// AddCarouselItem - Add an item to the carousel
func (c *AdminApiController) AddCarouselItem(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		c.errorHandler(w, r, &ParsingError{Err: err}, nil)
		return
	}

	imageParam, err := ReadFormFileToTempFile(r, "image")
	if err != nil {
		c.errorHandler(w, r, &ParsingError{Err: err}, nil)
		return
	}
	titleParam := r.FormValue("title")
	subtitleParam := r.FormValue("subtitle")
	result, err := c.service.AddCarouselItem(r.Context(), imageParam, titleParam, subtitleParam)
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}

// AddPageContent - Add content to a page
func (c *AdminApiController) AddPageContent(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	pageIdParam := params["pageId"]
	pageContentParam := PageContent{}
	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()
	if err := d.Decode(&pageContentParam); err != nil {
		c.errorHandler(w, r, &ParsingError{Err: err}, nil)
		return
	}
	if err := AssertPageContentRequired(pageContentParam); err != nil {
		c.errorHandler(w, r, err, nil)
		return
	}
	result, err := c.service.AddPageContent(r.Context(), pageIdParam, pageContentParam)
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}

// AddToAdminGroup - Add members to admin group
func (c *AdminApiController) AddToAdminGroup(w http.ResponseWriter, r *http.Request) {
	requestBodyParam := []string{}
	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()
	if err := d.Decode(&requestBodyParam); err != nil {
		c.errorHandler(w, r, &ParsingError{Err: err}, nil)
		return
	}
	result, err := c.service.AddToAdminGroup(r.Context(), requestBodyParam)
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}

// DeleteBackgroundImage - Delete an item from the backgrounds
func (c *AdminApiController) DeleteBackgroundImage(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	backgroundImageItemIdParam := params["backgroundImageItemId"]
	result, err := c.service.DeleteBackgroundImage(r.Context(), backgroundImageItemIdParam)
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}

// DeleteCarouselItem - Delete an item from the carousel
func (c *AdminApiController) DeleteCarouselItem(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	carouselItemIdParam := params["carouselItemId"]
	result, err := c.service.DeleteCarouselItem(r.Context(), carouselItemIdParam)
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}

// DeletePageContent - Delete content of a page
func (c *AdminApiController) DeletePageContent(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	pageIdParam := params["pageId"]
	contentIdParam := params["contentId"]
	result, err := c.service.DeletePageContent(r.Context(), pageIdParam, contentIdParam)
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}

// GetAdmins - List of users with Admin access
func (c *AdminApiController) GetAdmins(w http.ResponseWriter, r *http.Request) {
	result, err := c.service.GetAdmins(r.Context())
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}

// GetBackgroundImages - Get list of background images
func (c *AdminApiController) GetBackgroundImages(w http.ResponseWriter, r *http.Request) {
	result, err := c.service.GetBackgroundImages(r.Context())
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}

// ListUsers - List users in the system
func (c *AdminApiController) ListUsers(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	startParam := query.Get("start")
	limitParam, err := parseInt32Parameter(query.Get("limit"), false)
	if err != nil {
		c.errorHandler(w, r, &ParsingError{Err: err}, nil)
		return
	}
	result, err := c.service.ListUsers(r.Context(), startParam, limitParam)
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}

// RemoveFromAdminGroup - Remove members from admin group
func (c *AdminApiController) RemoveFromAdminGroup(w http.ResponseWriter, r *http.Request) {
	requestBodyParam := []string{}
	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()
	if err := d.Decode(&requestBodyParam); err != nil {
		c.errorHandler(w, r, &ParsingError{Err: err}, nil)
		return
	}
	result, err := c.service.RemoveFromAdminGroup(r.Context(), requestBodyParam)
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}

// SearchFamilyMembers - Search family members by name or email
func (c *AdminApiController) SearchFamilyMembers(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	qParam := query.Get("q")
	result, err := c.service.SearchFamilyMembers(r.Context(), qParam)
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}

// SearchSignedUpUsers - Search signed up users by name or email
func (c *AdminApiController) SearchSignedUpUsers(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	qParam := query.Get("q")
	result, err := c.service.SearchSignedUpUsers(r.Context(), qParam)
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}

// UpdatePageContent - Update page content
func (c *AdminApiController) UpdatePageContent(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	pageIdParam := params["pageId"]
	contentIdParam := params["contentId"]
	pageContentParam := PageContent{}
	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()
	if err := d.Decode(&pageContentParam); err != nil {
		c.errorHandler(w, r, &ParsingError{Err: err}, nil)
		return
	}
	if err := AssertPageContentRequired(pageContentParam); err != nil {
		c.errorHandler(w, r, err, nil)
		return
	}
	result, err := c.service.UpdatePageContent(r.Context(), pageIdParam, contentIdParam, pageContentParam)
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}
