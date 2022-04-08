package controllers

import (
	"encoding/json"
	"lambdas/user_manager/config"
	"lambdas/user_manager/model"
	"net/http"

	"github.com/gorilla/mux"
)

// HandlerProvider defines functions to attach handler functions to the router
type HandlerProvider interface {
	AddRoutes(*mux.Router)
}

// UserManagerController provides controller methods associated with User
type UserManagerController struct {
	HandlerProvider
	config *config.Config
}

// AddRoutes attaches handlers to user related paths
func (umc *UserManagerController) AddRoutes(r *mux.Router) {
	r.HandleFunc("user", umc.getUser).Methods(http.MethodGet)
}

func (umc *UserManagerController) getUser(w http.ResponseWriter, r *http.Request) {
	user := model.User{
		DisplayName: "testUser",
	}
	writeJSONResponse(&w, user)
}

// NewUserManagerController creates a new UserManagerController
func NewUserManagerController(cfg *config.Config) *UserManagerController {
	return &UserManagerController{
		config: cfg,
	}
}

func writeJSONResponse(w *http.ResponseWriter, input interface{}) {
	response, err := json.Marshal(input)
	if err != nil {
		http.Error(*w, err.Error(), http.StatusInternalServerError)
		return
	}
	_, _ = (*w).Write(response)
}
