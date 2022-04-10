.PHONY: *

lint:
	@golangci-lint run

build: clean
	@echo "Building User Manager lambda"
	env GOARCH=amd64 GOOS=linux $$(which go) build -ldflags="-s -w" -o bin/usermanager user_manager/main.go; \
    zip -mj bin/usermanager.zip bin/usermanager; \

clean:
	@echo "Cleaning bin folder..."
	@rm -rf ./bin

openapi:
	go generate ./...
