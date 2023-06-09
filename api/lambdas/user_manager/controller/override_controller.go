package controller

import (
	"context"
	"encoding/csv"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"lambdas/user_manager/model"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/service"
)

const errMsgRequiredMissing = "required parameter is missing"

type OverrideApiController struct {
	service      *service.UserManagerService
	errorHandler openapi.ErrorHandler
}

func (o *OverrideApiController) Routes() openapi.Routes {
	return openapi.Routes{
		{
			Name:        "ListUsers",
			Method:      strings.ToUpper("Get"),
			Pattern:     "/api/v1/admin/users",
			HandlerFunc: o.ListUsers,
		},
	}
}

func NewOverrideApiController(s *service.UserManagerService) openapi.Router {
	controller := &OverrideApiController{
		service:      s,
		errorHandler: openapi.DefaultErrorHandler,
	}

	return controller
}

func (o *OverrideApiController) ListUsers(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	acceptHeader := r.Header.Get("Accept")
	generateCSV := false
	if acceptHeader == "text/csv" {
		generateCSV = true
		ctx = context.WithValue(ctx, "csv", generateCSV)
	}
	query := r.URL.Query()
	startParam := query.Get("start")
	limitParam, err := parseInt32Parameter(query.Get("limit"), false)
	if err != nil {
		o.errorHandler(w, r, &openapi.ParsingError{Err: err}, nil)
		return
	}
	result, err := o.service.ListUsers(ctx, startParam, limitParam)
	// If an error occurred, encode the error with the status code
	if err != nil {
		o.errorHandler(w, r, err, &result)
		return
	}

	if generateCSV {
		if results, ok := result.Body.([]model.UserExtended); ok {
			w.Header().Set("Content-Type", acceptHeader)
			data := [][]string{{
				"First Name",
				"Last Name",
				"Email",
				"Baptismal Name",
				"Date Of Birth",
				"Gender",
				"Home Parish",
				"Marital Status",
				"Diocese In India",
				"Street",
				"City",
				"Postal Code",
				"Province",
			}}
			for _, k := range results {
				data = append(data, []string{
					k.FirstName,
					k.LastName,
					k.Email,
					k.BaptismalName,
					k.DateOfBirth,
					k.Gender,
					k.HomeParish,
					k.MaritalStatus,
					k.DioceseInIndia,
					k.Street,
					k.City,
					k.PostalCode,
					k.Province,
				})
			}
			cw := csv.NewWriter(w)
			cw.WriteAll(data)
		}
	} else {
		openapi.EncodeJSONResponse(result.Body, &result.Code, w)
	}
}

func parseInt32Parameter(param string, required bool) (int32, error) {
	val, err := parseIntParameter(param, 32, required)
	return int32(val), err
}

func parseIntParameter(param string, bitSize int, required bool) (int64, error) {
	if param == "" {
		if required {
			return 0, errors.New(errMsgRequiredMissing)
		}

		return 0, nil
	}

	return strconv.ParseInt(param, 10, bitSize)
}
