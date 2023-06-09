package model

import "lambdas/user_manager/openapi"

type UserExtended struct {
	openapi.User
	FamilyID       string `json:"familyId"`
	BaptismalName  string `json:"baptismalName"`
	CanadianStatus string `json:"canadianStatus"`
	DateOfBirth    string `json:"dateOfBirth"`
	DateOfMarriage string `json:"dateOfMarriage"`
	DioceseInIndia string `json:"dioceseInIndia"`
	Gender         string `json:"gender"`
	HomeParish     string `json:"homeParish"`
	MaritalStatus  string `json:"maritalStatus"`
	Mobile         string `json:"mobile"`
	Street         string `json:"street"`
	PostalCode     string `json:"postalCode"`
	Province       string `json:"province"`
	City           string `json:"city"`
}
