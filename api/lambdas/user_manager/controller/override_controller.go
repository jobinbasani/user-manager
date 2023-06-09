package controller

import (
	"encoding/csv"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"lambdas/user_manager/model"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/service"
	"lambdas/user_manager/util"
)

const errMsgRequiredMissing = "required parameter is missing"

type OverrideApiController struct {
	service      *service.UserManagerService
	errorHandler openapi.ErrorHandler
}

func (o *OverrideApiController) Routes() openapi.Routes {
	return openapi.Routes{
		{
			Name:        "DownloadUsers",
			Method:      strings.ToUpper("Get"),
			Pattern:     "/api/v1/admin/download/users",
			HandlerFunc: o.DownloadUsers,
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

func (o *OverrideApiController) DownloadUsers(w http.ResponseWriter, r *http.Request) {
	result, err := o.service.DownloadUsers(r.Context())
	// If an error occurred, encode the error with the status code
	if err != nil {
		o.errorHandler(w, r, err, &result)
		return
	}

	if results, ok := result.Body.([]model.UserExtended); ok {
		w.Header().Set("Content-Disposition", "attachment; filename=\"holyfamily_members.csv\"")
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
			"Status In Canada",
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
				util.ToTitleCase(k.Gender),
				k.HomeParish,
				util.ToTitleCase(k.MaritalStatus),
				k.DioceseInIndia,
				util.ToTitleCase(k.CanadianStatus),
				k.Street,
				k.City,
				k.PostalCode,
				k.Province,
			})
		}
		cw := csv.NewWriter(w)
		cw.WriteAll(data)
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
