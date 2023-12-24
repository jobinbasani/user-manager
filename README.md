A user manager system that run on AWS that aims to be a cost-effective system.

 - The backend runs on AWS Lambda and is written in Go to take advantage
   of fast startup times. 
  - The database is DynamoDB 
  - Identity management is handled by Cognito 
   - UI is a React app, hosted in a S3 bucket 
   - Both UI and API is behind a Cloudfront distribution 
   - Domain is managed by Route53 
   - Inrastructure is defined using CDK 
   - Github actions will deploy code after PR merge

To start with backend, refer [here](api/lambdas)
To start with frontend, refer [here](ui/user-manager)
