# Lambda Functions

There are two AWS Lambda functions defined here.

1. User Manager - works as the backend API server
2. Post Signup - handles user signups and verifications

## User Manager
This Lambda function serves as the backend API server.
The API spec is defined in [api_spec.yml](api_spec.yml).
Whenever the spec is updated, run the below command to generate the OpenAPI bindings:

    make openapi

This will add/update the API interfaces. Make sure to implement the new interface methods.
## Test Environment
To create a docker based backend local test environment, run the compose file as below:

    cd user_manager/testenv
    docker compose -f docker-compose.yml up -d

The API server will be running on port `8989`
