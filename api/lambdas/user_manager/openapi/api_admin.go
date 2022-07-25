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

// Routes returns all of the api route for the AdminApiController
func (c *AdminApiController) Routes() Routes {
	return Routes{
		{
			"AddAnnouncement",
			strings.ToUpper("Post"),
			"/api/v1/admin/announcements",
			c.AddAnnouncement,
		},
		{
			"DeleteAnnouncements",
			strings.ToUpper("Delete"),
			"/api/v1/admin/announcements",
			c.DeleteAnnouncements,
		},
		{
			"GetAdmins",
			strings.ToUpper("Get"),
			"/api/v1/admin/admins",
			c.GetAdmins,
		},
		{
			"SetServiceData",
			strings.ToUpper("Put"),
			"/api/v1/admin/services",
			c.SetServiceData,
		},
	}
}

// AddAnnouncement - Add a new announcement
func (c *AdminApiController) AddAnnouncement(w http.ResponseWriter, r *http.Request) {
	announcementParam := Announcement{}
	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()
	if err := d.Decode(&announcementParam); err != nil {
		c.errorHandler(w, r, &ParsingError{Err: err}, nil)
		return
	}
	if err := AssertAnnouncementRequired(announcementParam); err != nil {
		c.errorHandler(w, r, err, nil)
		return
	}
	result, err := c.service.AddAnnouncement(r.Context(), announcementParam)
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}

// DeleteAnnouncements - Delete announcements
func (c *AdminApiController) DeleteAnnouncements(w http.ResponseWriter, r *http.Request) {
	requestBodyParam := []string{}
	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()
	if err := d.Decode(&requestBodyParam); err != nil {
		c.errorHandler(w, r, &ParsingError{Err: err}, nil)
		return
	}
	result, err := c.service.DeleteAnnouncements(r.Context(), requestBodyParam)
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

// SetServiceData - Set service details
func (c *AdminApiController) SetServiceData(w http.ResponseWriter, r *http.Request) {
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
	result, err := c.service.SetServiceData(r.Context(), pageContentParam)
	// If an error occurred, encode the error with the status code
	if err != nil {
		c.errorHandler(w, r, err, &result)
		return
	}
	// If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}
