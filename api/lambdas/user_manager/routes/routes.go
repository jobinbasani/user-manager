package routes

import (
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/service"

	"github.com/gorilla/mux"
)

// This directive instructs the "go generate ./..." command to call "../../scripts/generate_openapi_bindings.sh" in order to
// generate OpenAPI bindings
//go:generate ../../scripts/generate_openapi_bindings.sh

// GetRoutes registers all API gateway paths to a handler
func GetRoutes(cfg *config.Config) *mux.Router {
	UserManagementAPIService := service.NewUserManagerService(cfg)
	UserManagementAPIController := openapi.NewUserManagementApiController(UserManagementAPIService)

	return openapi.NewRouter(UserManagementAPIController)

}
