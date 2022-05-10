#!/bin/bash

tblCount=$(awslocal dynamodb list-tables | jq -r '.TableNames | length')

if [ "$tblCount" -eq "0" ]; then
   echo "Creating table";
   awslocal dynamodb create-table \
    --table-name UserDetails \
    --attribute-definitions AttributeName=id,AttributeType=S \
                            AttributeName=emailId,AttributeType=S \
                            AttributeName=sub,AttributeType=S \
                            AttributeName=familyId,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --global-secondary-indexes \
            "[
                {
                    \"IndexName\": \"subIndex\",
                    \"KeySchema\": [{\"AttributeName\":\"sub\",\"KeyType\":\"HASH\"}],
                    \"Projection\":{
                        \"ProjectionType\":\"INCLUDE\",
                        \"NonKeyAttributes\":[\"familyId\"]
                    }
                },
                {
                    \"IndexName\": \"emailIndex\",
                    \"KeySchema\": [{\"AttributeName\":\"emailId\",\"KeyType\":\"HASH\"}],
                    \"Projection\":{
                        \"ProjectionType\":\"INCLUDE\",
                        \"NonKeyAttributes\":[\"familyId\"]
                    }
                },
                {
                    \"IndexName\": \"familyIndex\",
                    \"KeySchema\": [{\"AttributeName\":\"familyId\",\"KeyType\":\"HASH\"}],
                    \"Projection\":{
                        \"ProjectionType\":\"KEYS_ONLY\"
                    }
                }
            ]"
else
  echo "Available tables are:"
  awslocal dynamodb list-tables
fi

