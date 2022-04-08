package routes

import (
	"lambdas/user_manager/config"
	"lambdas/user_manager/controllers"

	"github.com/gorilla/mux"
)

// GetRoutes registers all API gateway paths to a handler
func GetRoutes() *mux.Router {
	cfg := config.Configure()
	r := mux.NewRouter().PathPrefix(cfg.BasePath).Subrouter()

	handlerProviders := []controllers.HandlerProvider{
		controllers.NewUserManagerController(cfg),
	}

	for _, p := range handlerProviders {
		p.AddRoutes(r)
	}

	return r
}
