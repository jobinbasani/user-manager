        s3bucket=$(aws cloudformation describe-stacks --profile personal --region ca-central-1 --stack-name UserManagerStack --query "Stacks[0].Outputs[?OutputKey=='WebAppBucketName'].OutputValue" | jq -r '.[0]')
        echo $s3bucket
        docs_exists=$(aws s3api list-objects-v2 --profile personal --region ca-central-1 --bucket ${s3bucket} --query "contains(Contents[].Key, 'docs/index.html')" | jq .)

        if [[ "$docs_exists" == "false" ]] ; then
          wget -q -O swagger.tar.gz https://github.com/swagger-api/swagger-ui/archive/refs/tags/v4.10.3.tar.gz
          tar -zxf swagger.tar.gz
          pwd
          ls -la
          sed -i 's/url:.*,/url: "api_spec.yml",/g' swagger-ui-4.10.3/dist/swagger-initializer.js
        fi


