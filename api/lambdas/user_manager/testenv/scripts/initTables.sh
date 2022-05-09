#!/bin/bash

tblCount=$(awslocal dynamodb list-tables | jq -r '.TableNames | length')

if [ "$tblCount" -eq "0" ]; then
   echo "Creating table";
   awslocal dynamodb create-table \
    --table-name UserDetails \
    --attribute-definitions AttributeName=id,AttributeType=S \
                            AttributeName=email_id,AttributeType=S \
                            AttributeName=sub,AttributeType=S \
                            AttributeName=family_id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --global-secondary-indexes \
            "[
                {
                    \"IndexName\": \"subIndex\",
                    \"KeySchema\": [{\"AttributeName\":\"sub\",\"KeyType\":\"HASH\"}],
                    \"Projection\":{
                        \"ProjectionType\":\"INCLUDE\",
                        \"NonKeyAttributes\":[\"family_id\"]
                    }
                },
                {
                    \"IndexName\": \"emailIndex\",
                    \"KeySchema\": [{\"AttributeName\":\"email_id\",\"KeyType\":\"HASH\"}],
                    \"Projection\":{
                        \"ProjectionType\":\"INCLUDE\",
                        \"NonKeyAttributes\":[\"family_id\"]
                    }
                },
                {
                    \"IndexName\": \"familyIndex\",
                    \"KeySchema\": [{\"AttributeName\":\"family_id\",\"KeyType\":\"HASH\"}],
                    \"Projection\":{
                        \"ProjectionType\":\"KEYS_ONLY\"
                    }
                }
            ]"
else
  echo "Available tables are:"
  awslocal dynamodb list-tables
fi

