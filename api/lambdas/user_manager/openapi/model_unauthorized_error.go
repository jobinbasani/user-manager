/*
 * User Manager API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 1.0.1
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package openapi

// UnauthorizedError - User must be authenticated in order to access this endpoint.
type UnauthorizedError struct {
	Message string `json:"message"`

	Code int32 `json:"code"`

	Errors []InternalServerErrorErrors `json:"errors,omitempty"`
}

// AssertUnauthorizedErrorRequired checks if the required fields are not zero-ed
func AssertUnauthorizedErrorRequired(obj UnauthorizedError) error {
	elements := map[string]interface{}{
		"message": obj.Message,
		"code":    obj.Code,
	}
	for name, el := range elements {
		if isZero := IsZeroValue(el); isZero {
			return &RequiredError{Field: name}
		}
	}

	for _, el := range obj.Errors {
		if err := AssertInternalServerErrorErrorsRequired(el); err != nil {
			return err
		}
	}
	return nil
}

// AssertRecurseUnauthorizedErrorRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of UnauthorizedError (e.g. [][]UnauthorizedError), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseUnauthorizedErrorRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aUnauthorizedError, ok := obj.(UnauthorizedError)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertUnauthorizedErrorRequired(aUnauthorizedError)
	})
}
