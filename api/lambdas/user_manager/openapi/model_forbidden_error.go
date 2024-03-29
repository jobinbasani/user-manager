/*
 * User Manager API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 1.0.1
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package openapi

// ForbiddenError - User does not have the appropriate permissions to access this endpoint.
type ForbiddenError struct {
	Message string `json:"message"`

	Code int32 `json:"code"`

	Errors []InternalServerErrorErrorsInner `json:"errors,omitempty"`
}

// AssertForbiddenErrorRequired checks if the required fields are not zero-ed
func AssertForbiddenErrorRequired(obj ForbiddenError) error {
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
		if err := AssertInternalServerErrorErrorsInnerRequired(el); err != nil {
			return err
		}
	}
	return nil
}

// AssertRecurseForbiddenErrorRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of ForbiddenError (e.g. [][]ForbiddenError), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseForbiddenErrorRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aForbiddenError, ok := obj.(ForbiddenError)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertForbiddenErrorRequired(aForbiddenError)
	})
}
