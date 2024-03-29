/*
 * User Manager API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 1.0.1
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package openapi

type Location struct {
	Address string `json:"address"`

	Latitude float32 `json:"latitude"`

	Longitude float32 `json:"longitude"`

	ApiKey string `json:"apiKey"`

	Url string `json:"url"`
}

// AssertLocationRequired checks if the required fields are not zero-ed
func AssertLocationRequired(obj Location) error {
	elements := map[string]interface{}{
		"address":   obj.Address,
		"latitude":  obj.Latitude,
		"longitude": obj.Longitude,
		"apiKey":    obj.ApiKey,
		"url":       obj.Url,
	}
	for name, el := range elements {
		if isZero := IsZeroValue(el); isZero {
			return &RequiredError{Field: name}
		}
	}

	return nil
}

// AssertRecurseLocationRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of Location (e.g. [][]Location), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseLocationRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aLocation, ok := obj.(Location)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertLocationRequired(aLocation)
	})
}
