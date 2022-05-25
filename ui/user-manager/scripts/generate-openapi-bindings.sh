rm -rf src/generated-sources/openapi
openapi-generator-cli generate \
  -i ../../api/lambdas/api_spec.yml \
  -o src/generated-sources/openapi \
  -g typescript-axios \
  --additional-properties=supportsES6=true,npmVersion=6.9.0,typescriptThreePlus=true

