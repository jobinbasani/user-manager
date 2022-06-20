package routes

import (
	"context"
	"fmt"
	"github.com/gorilla/mux"
	"lambdas/user_manager/config"
	"lambdas/user_manager/middleware"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/service"
	"net/http"
)

// This directive instructs the "go generate ./..." command to call "../../scripts/generate_openapi_bindings.sh" in order to
// generate OpenAPI bindings
//go:generate ../../scripts/generate_openapi_bindings.sh

// GetRoutes registers all API gateway paths to a handler
func GetRoutes(ctx context.Context, cfg *config.Config) *mux.Router {
	authService := service.NewAuthService(cfg)
	dataService := service.NewDataService(cfg, authService)

	UserManagementAPIService := service.NewUserManagerService(cfg, authService, dataService)

	familyManagementAPIController := openapi.NewFamilyManagementApiController(UserManagementAPIService)
	userManagementAPIController := openapi.NewUserManagementApiController(UserManagementAPIService)
	adminAPIController := openapi.NewAdminApiController(UserManagementAPIService)
	publicAPIController := openapi.NewPublicApiController(UserManagementAPIService)

	r := openapi.NewRouter(userManagementAPIController, familyManagementAPIController, adminAPIController, publicAPIController)

	r.Use(middleware.DoAuth(ctx, cfg))
	r.MethodNotAllowedHandler = methodNotAllowedHandler()

	return r
}

func methodNotAllowedHandler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Method not allowed")
	})
}
