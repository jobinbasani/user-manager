#!/usr/bin/env bash

rootdir=$(cd $(dirname ${BASH_SOURCE[0]}); cd ../; pwd)

PACKAGE_NAME=openapi
WORKDIR=${rootdir}/user_manager/${PACKAGE_NAME}
GENERATOR_IMAGE=openapitools/openapi-generator-cli:v6.6.0
rm -Rf $WORKDIR/*

docker run --rm -v "$rootdir":/src_files "$GENERATOR_IMAGE" generate \
  -i /src_files/api_spec.yml \
  -g go-server \
  -o /src_files/user_manager/${PACKAGE_NAME} \
  --package-name=${PACKAGE_NAME}

mv $WORKDIR/go/* $WORKDIR
rm -Rf $WORKDIR/go
rm -Rf $WORKDIR/api
rm -Rf $WORKDIR/go.*
rm -f $WORKDIR/Dockerfile
rm -f $WORKDIR/main.go

goimports -w $WORKDIR

git add $WORKDIR
