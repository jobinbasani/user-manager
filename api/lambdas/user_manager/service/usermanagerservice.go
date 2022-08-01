package service

import (
	"context"
	"errors"
	"lambdas/user_manager/config"
	"lambdas/user_manager/openapi"
	"log"
	"net/http"
)

// UserManagerService represents the various operations related to User management
type UserManagerService struct {
	openapi.UserManagementApiService
	openapi.FamilyManagementApiService
	openapi.AdminApiService
	openapi.PublicApiService
	config      *config.Config
	authService AuthService
	dataService DataService
}

// GetUser returns the user profile
func (u *UserManagerService) GetUser(ctx context.Context) (openapi.ImplResponse, error) {
	user, err := u.authService.GetUserInfoByAccessToken(ctx)
	if err != nil {
		log.Println(err)
		return openapi.ImplResponse{
			Code: http.StatusNotFound,
			Body: nil,
		}, errors.New("unable to lookup user information")
	}
	return openapi.ImplResponse{
		Code: http.StatusOK,
		Body: user,
	}, nil
}

func (u *UserManagerService) AddFamilyMembers(ctx context.Context, userData []openapi.UserData) (openapi.ImplResponse, error) {
	familyId, err := u.dataService.AddFamilyMembers(ctx, userData)
	if err != nil {
		log.Println(err)
		return openapi.ImplResponse{
			Code: http.StatusForbidden,
		}, err
	}
	return openapi.ImplResponse{
		Code: http.StatusCreated,
		Body: familyId,
	}, nil
}

func (u *UserManagerService) DeleteFamilyMembers(ctx context.Context, memberIds []string) (openapi.ImplResponse, error) {
	deletedMemberIds, err := u.dataService.DeleteFamilyMembers(ctx, memberIds)
	if err != nil {
		return openapi.ImplResponse{
			Code: http.StatusInternalServerError,
		}, err
	}
	return openapi.ImplResponse{
		Code: http.StatusOK,
		Body: deletedMemberIds,
	}, nil
}

func (u *UserManagerService) GetUserFamily(ctx context.Context) (openapi.ImplResponse, error) {
	members, err := u.dataService.GetUserFamily(ctx)
	if err != nil {
		log.Println(err)
		return openapi.ImplResponse{
			Code: http.StatusInternalServerError,
		}, err
	}
	return openapi.ImplResponse{
		Code: http.StatusOK,
		Body: members,
	}, nil
}

func (u *UserManagerService) AddAnnouncement(ctx context.Context, announcement openapi.Announcement) (openapi.ImplResponse, error) {
	id, err := u.dataService.AddAnnouncement(ctx, announcement)

	if err != nil {
		log.Println(err)
		return openapi.ImplResponse{
			Code: http.StatusInternalServerError,
		}, err
	}

	return openapi.ImplResponse{
		Code: http.StatusCreated,
		Body: map[string]string{
			"id": id,
		},
	}, nil
}

func (u *UserManagerService) GetAnnouncements(ctx context.Context) (openapi.ImplResponse, error) {
	data, err := u.dataService.GetAnnouncements(ctx)
	if err != nil {
		log.Println(err)
		return openapi.Response(http.StatusInternalServerError, openapi.InternalServerError{
			Message: err.Error(),
		}), err
	}
	return openapi.Response(http.StatusOK, data), nil
}

func (u *UserManagerService) DeleteAnnouncements(ctx context.Context, announcementIds []string) (openapi.ImplResponse, error) {
	ids, err := u.dataService.DeleteAnnouncements(ctx, announcementIds)
	if err != nil {
		log.Println(err)
		return openapi.Response(http.StatusInternalServerError, openapi.InternalServerError{
			Message: err.Error(),
		}), err
	}
	return openapi.Response(http.StatusOK, ids), nil
}

func (u *UserManagerService) GetAdmins(ctx context.Context) (openapi.ImplResponse, error) {
	users, err := u.authService.GetAdmins(ctx)
	if err != nil {
		log.Println(err)
		return openapi.Response(http.StatusInternalServerError, openapi.InternalServerError{
			Message: err.Error(),
		}), err
	}
	return openapi.Response(http.StatusOK, users), nil
}

func (u *UserManagerService) UpdateFamilyMember(ctx context.Context, userId string, user openapi.UserData) (openapi.ImplResponse, error) {
	updatedUserId, err := u.dataService.UpdateFamilyMember(ctx, userId, user)
	return u.handleResponse(updatedUserId, err)
}

func (u *UserManagerService) SetServiceData(ctx context.Context, pageContent openapi.PageContent) (openapi.ImplResponse, error) {
	err := u.dataService.SetPageContent(ctx, servicesRecType, pageContent)
	return u.handleResponse(nil, err)
}

func (u *UserManagerService) GetServices(ctx context.Context) (openapi.ImplResponse, error) {
	content, err := u.dataService.GetPageContent(ctx, servicesRecType)
	return u.handleResponse(content, err)
}

func (u *UserManagerService) SetCommitteeData(ctx context.Context, pageContent openapi.PageContent) (openapi.ImplResponse, error) {
	err := u.dataService.SetPageContent(ctx, committeeRecType, pageContent)
	return u.handleResponse(nil, err)
}

func (u *UserManagerService) GetCommittee(ctx context.Context) (openapi.ImplResponse, error) {
	content, err := u.dataService.GetPageContent(ctx, committeeRecType)
	return u.handleResponse(content, err)
}

func (u *UserManagerService) SetCatechismData(ctx context.Context, pageContent openapi.PageContent) (openapi.ImplResponse, error) {
	err := u.dataService.SetPageContent(ctx, catechismRecType, pageContent)
	return u.handleResponse(nil, err)
}

func (u *UserManagerService) GetCatechism(ctx context.Context) (openapi.ImplResponse, error) {
	content, err := u.dataService.GetPageContent(ctx, catechismRecType)
	return u.handleResponse(content, err)
}

func (u *UserManagerService) SearchSignedUpUsers(ctx context.Context, query string) (openapi.ImplResponse, error) {
	results, err := u.authService.SearchUsers(ctx, query)
	return u.handleResponse(results, err)
}

func (u *UserManagerService) SearchFamilyMembers(ctx context.Context, query string) (openapi.ImplResponse, error) {
	results, err := u.dataService.SearchFamilyMembers(ctx, query)
	return u.handleResponse(results, err)
}

func (u *UserManagerService) AddToAdminGroup(ctx context.Context, userIds []string) (openapi.ImplResponse, error) {
	err := u.authService.AddToAdminGroup(ctx, userIds)
	return u.handleResponse(nil, err)
}

func (u *UserManagerService) RemoveFromAdminGroup(ctx context.Context, userIds []string) (openapi.ImplResponse, error) {
	err := u.authService.RemoveFromAdminGroup(ctx, userIds)
	return u.handleResponse(nil, err)
}

func (u *UserManagerService) handleResponse(body interface{}, err error) (openapi.ImplResponse, error) {
	if err != nil {
		log.Println(err)
		return openapi.Response(http.StatusInternalServerError, openapi.InternalServerError{
			Message: err.Error(),
		}), err
	}
	status := http.StatusOK
	if body == nil {
		status = http.StatusNoContent
	}
	return openapi.Response(status, body), nil
}

// NewUserManagerService creates a new UserManagerService
func NewUserManagerService(cfg *config.Config, authService AuthService, dataService DataService) *UserManagerService {
	return &UserManagerService{
		config:      cfg,
		authService: authService,
		dataService: dataService,
	}
}
