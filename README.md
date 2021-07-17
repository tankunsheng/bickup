# Bickup

Bickup is a job posting and fulfilment platform where users posts job requests to be fulfilled by service providers.

We use Bickup as an example of one such service which provides bicycles transportation services. However, this can be easily generalised to serve other kinds of services.

1. User submit job requests with the invocation of Submit Job Lambda
   - Lambda writes a record into Dynamo Table and triggers a stream event
2. Job alerts new job into telegram chat where all drivers are in
   - Jobs stream lambda gets called by Dynamo Table's stream event source
   - Lambda gets bot token from Secrets Manager in order to send messages
3. Driver views details of job and accepts job (requires provider login)
   - Drivers required to register and login on Cognito Hosted UI
   - Cognito redirects and issues token
   - Accept job API is secured by APIG Cognito Authorizer (requires token)
4. Requester contact information revealed
5. Arrangement occur outside of platform
6. Driver marks job as completed

## Architecture

![Bickup AWS Architecture](bickup-archi.png)

## Tech Stack

### Frontend

Gatsby SSG

### Backend

NodeJs running on Lambdas

### Infra

AWS CDK
APIG, Lambdas, Cognito User Pool, DyanmoDB and streams. S3, Secrets Manager and KMS, APIG cognito authorizer

## Development
Gatsby frontend lives in the root dir of project.
CDK is found in serverless/cdk

#### Frontend Gatsby
npm run develop in root dir of project
#### Backend
cd into serverless/cdk and run cdk deploy

## Deployment

Generate build for frontend

- Run npm run build in root dir of project

Generate build CDK in Typescript (Deploys build from frontend + Backend lambdas + Changes in infra if any)

- cd into serverless/cdk
- npm run deploy:dev
  - Builds CDK in Typescript to Javascript and deploys 2 CDK stacks 
    1. Frontend Stack deploys generated build from frontend into S3
    2. Backend Stack deploys all other AWS resources (refer to archi above)

## CICD
Project automated deployment is ran through Gitlab CI in gitlab.com (refer to gitlab-ci.yml file) and not through Github Actions. The repo in Github is plainly for viewing.

---

## References

### Bickup Web App

https://d3bojbdeh120he.cloudfront.net/

### Telegram Job Chat

https://t.me/joinchat/-pTNF3FtpQQ0ZGM1

