.PHONY: *

lint:
	@golangci-lint run

build-usermanager: clean
		@echo "Building User Manager lambda"
		env GOARCH=amd64 GOOS=linux $$(which go) build -ldflags="-s -w" -o bin/usermanager user_manager/main.go; \
		zip -mj bin/usermanager.zip bin/usermanager; \

build-postsignup: clean
		@echo "Building Post Sign Up lambda"
		env GOARCH=amd64 GOOS=linux CGO_ENABLED=0 $$(which go) build -ldflags="-s -w" -o bin/post-signup post_signup/main.go; \
		zip -mj bin/post-signup.zip bin/post-signup; \

build: build-usermanager build-postsignup

clean:
	@echo "Cleaning bin folder..."
	@rm -rf ./bin

openapi:
	go generate ./...
