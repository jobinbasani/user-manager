package routes

import "github.com/gorilla/mux"

// GetRoutes registers all API gateway paths to a handler
func GetRoutes() *mux.Router {
	r := mux.NewRouter()

	return r
}
