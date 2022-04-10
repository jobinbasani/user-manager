/*
 * User Manager API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package openapi

// NotFoundError - The specified content was not found.
type NotFoundError struct {
	Message string `json:"message"`

	Code int32 `json:"code"`

	Errors []InternalServerErrorErrors `json:"errors,omitempty"`
}

// AssertNotFoundErrorRequired checks if the required fields are not zero-ed
func AssertNotFoundErrorRequired(obj NotFoundError) error {
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

// AssertRecurseNotFoundErrorRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of NotFoundError (e.g. [][]NotFoundError), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseNotFoundErrorRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aNotFoundError, ok := obj.(NotFoundError)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertNotFoundErrorRequired(aNotFoundError)
	})
}