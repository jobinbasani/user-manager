package routes

import (
	"context"
	"lambdas/user_manager/config"
	"lambdas/user_manager/middleware"
	"lambdas/user_manager/openapi"
	"lambdas/user_manager/service"

	"github.com/gorilla/mux"
)

// This directive instructs the "go generate ./..." command to call "../../scripts/generate_openapi_bindings.sh" in order to
// generate OpenAPI bindings
//go:generate ../../scripts/generate_openapi_bindings.sh

// GetRoutes registers all API gateway paths to a handler
func GetRoutes(ctx context.Context, cfg *config.Config) *mux.Router {
	authService := service.NewAuthService(cfg)
	UserManagementAPIService := service.NewUserManagerService(cfg, authService)
	UserManagementAPIController := openapi.NewUserManagementApiController(UserManagementAPIService)
	r := openapi.NewRouter(UserManagementAPIController)
	r.Use(middleware.DoAuth(ctx, cfg))
	return r

}
