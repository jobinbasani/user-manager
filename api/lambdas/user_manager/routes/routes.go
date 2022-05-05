package routes

import (
	"context"
	"github.com/gorilla/handlers"
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
	dataService := service.NewDataService(cfg, authService)

	UserManagementAPIService := service.NewUserManagerService(cfg, authService, dataService)

	familyManagementAPIController := openapi.NewFamilyManagementApiController(UserManagementAPIService)
	userManagementAPIController := openapi.NewUserManagementApiController(UserManagementAPIService)

	r := openapi.NewRouter(userManagementAPIController, familyManagementAPIController)

	r.Use(mux.CORSMethodMiddleware(r))
	r.Use(middleware.DoAuth(ctx, cfg))
	r.Use(handlers.CORS(handlers.AllowedOrigins([]string{"*"})))

	return r
}
