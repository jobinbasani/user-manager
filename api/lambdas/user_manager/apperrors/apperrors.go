package apperrors

import "errors"

var (
	NotFoundError = errors.New("unable to find the requested resource")
)
