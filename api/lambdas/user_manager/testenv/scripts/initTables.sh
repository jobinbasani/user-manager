#!/bin/bash

tblCount=$(awslocal dynamodb list-tables | jq -r '.TableNames | length')

if [ "$tblCount" -eq "0" ]; then
   echo "Creating table";
   awslocal dynamodb create-table \
    --table-name UserTable \
    --attribute-definitions AttributeName=Id,AttributeType=S \
                            AttributeName=email,AttributeType=S \
                            AttributeName=sub,AttributeType=S \
                            AttributeName=familyId,AttributeType=S \
    --key-schema AttributeName=Id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --global-secondary-indexes \
            "[
                {
                    \"IndexName\": \"SubIndex\",
                    \"KeySchema\": [{\"AttributeName\":\"sub\",\"KeyType\":\"HASH\"}],
                    \"Projection\":{
                        \"ProjectionType\":\"KEYS_ONLY\"
                    }
                },
                {
                    \"IndexName\": \"EmailIndex\",
                    \"KeySchema\": [{\"AttributeName\":\"email\",\"KeyType\":\"HASH\"}],
                    \"Projection\":{
                        \"ProjectionType\":\"KEYS_ONLY\"
                    }
                },
                {
                    \"IndexName\": \"FamilyIndex\",
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

