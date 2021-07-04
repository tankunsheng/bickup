import * as cdk from "@aws-cdk/core";
import { UserPool, UserPoolClient } from "@aws-cdk/aws-cognito";
import {
  LambdaRestApi,
  LambdaIntegration,
  CognitoUserPoolsAuthorizer,
  AuthorizationType,
  ResponseType,
} from "@aws-cdk/aws-apigateway";
import { Table, AttributeType, StreamViewType } from "@aws-cdk/aws-dynamodb";
import {
  Function,
  Runtime,
  AssetCode,
  StartingPosition,
} from "@aws-cdk/aws-lambda";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { DynamoEventSource } from "@aws-cdk/aws-lambda-event-sources";
import {
  ServicePrincipal,
  PolicyStatement,
  Role,
  ManagedPolicy,
} from "@aws-cdk/aws-iam";

import config from "./config";

export class BackendStack extends cdk.Stack {
  userPool: UserPool;
  userPoolClient: UserPoolClient;
  dynamoDbJobsTable: Table;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.createUserPool();
    const table = this.createDynamoDb();
    this.createDynamoDbStreams(table);
    this.createLambdaFunctions();
  }
  createUserPool() {
    // Cognito User Pool with Email Sign-in Type.
    this.userPool = new UserPool(this, "bickup-user-pool", {
      userPoolName: `${config.deploymentEnv}-bickup-user-pool`,
      // removalPolicy: cdk.RemovalPolicy.DESTROY // Defaults to retain. Similar to S3 buckets.
      signInAliases: {
        email: true,
      },
      standardAttributes: {
        phoneNumber: {
          required: true,
        },
      },

      selfSignUpEnabled: true,
      passwordPolicy: {
        requireLowercase: false,
        requireSymbols: false,
        requireUppercase: false,
        minLength: 8,
        requireDigits: true,
      },
    });
    this.userPool.addDomain("bickup-user-pool-domain", {
      cognitoDomain: {
        domainPrefix: `${config.deploymentEnv}-bickup`,
      },
    });
    this.userPoolClient = new UserPoolClient(this, "bickup-user-pool-client", {
      oAuth: {
        callbackUrls: ["http://localhost:8000/login/callback"],
      },
      userPool: this.userPool,
      userPoolClientName: `${config.deploymentEnv}-bickup-user-pool-client`,
    });
    // https://www.youtube.com/watch?v=oFSU6rhFETk&t=1s&ab_channel=BeABetterDev login with cognito
  }

  createDynamoDb() {
    // https://www.youtube.com/watch?v=XvD2FrS5yYM dynamodb keys
    // https://docs.aws.amazon.com/cdk/api/latest/docs/aws-dynamodb-readme.html dynamodb cdk

    this.dynamoDbJobsTable = new Table(this, "bickup-dynamodb", {
      tableName: `${config.deploymentEnv}-bickup-jobs-table`,
      partitionKey: {
        name: "contact_no",
        type: AttributeType.STRING,
      },
      encryptionKey: undefined,
      //sort key supports datetime in string ISO https://stackoverflow.com/questions/40561484/what-data-type-should-be-use-for-timestamp-in-dynamodb
      sortKey: {
        name: "created_at",
        type: AttributeType.STRING,
      },
      readCapacity: 3,
      writeCapacity: 3,
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    return this.dynamoDbJobsTable;
  }
  createDynamoDbStreams(table: Table) {
    // https://www.youtube.com/watch?v=OjppS4RWWt8&t=1s&ab_channel=BeABetterDevBeABetterDev dynamodb streams
    const jobsTableStreamLambda = new NodejsFunction(
      this,
      "bickup-jobs-stream-fn",
      {
        functionName: `${config.deploymentEnv}-bickup-jobs-stream-fn`,
        runtime: Runtime.NODEJS_14_X,
        entry: "./src/jobs.ts",
        handler: "handleJobStream",
        environment: {
          CHAT_ID: config.chatId,
          SERVER: config.server,
        },
      }
    );

    jobsTableStreamLambda.addToRolePolicy(
      new PolicyStatement({
        actions: [
          "secretsmanager:GetResourcePolicy",
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret",
          "secretsmanager:ListSecretVersionIds",
          "secretsmanager:ListSecrets",
        ],
        resources: [config.botTokenARN],
      })
    );

    jobsTableStreamLambda.addEventSource(
      new DynamoEventSource(table, {
        startingPosition: StartingPosition.TRIM_HORIZON,
        batchSize: 5,
        bisectBatchOnError: true,
        // onFailure: new SqsDlq(deadLetterQueue), // configure deadletter queue for failures beyond number of retries
        retryAttempts: 10,
      })
    );
  }

  createLambdaFunctions() {
    //Lambda for User Pool Registration
    const registerFn = new Function(this, "bickup-register-fn", {
      functionName: `${config.deploymentEnv}-bickup-register-fn`,
      runtime: Runtime.NODEJS_14_X,
      code: new AssetCode("./src"),
      handler: "user.register",
      environment: {
        USER_POOL_ARN: this.userPool.userPoolArn,
        USER_POOL_CLIENT_ID: this.userPoolClient.userPoolClientId,
      },
    });
    const registerLambdaApi = new LambdaRestApi(this, "bickup-register-api", {
      restApiName: `${config.deploymentEnv}-bickup-register-api`,
      handler: registerFn,
      proxy: false,
      deployOptions: { stageName: config.deploymentEnv },
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
      },
    });
    registerLambdaApi.root.addResource("users").addMethod("POST");

    //Lambda for posting jobs
    const rwJobsTablePolicy = new ManagedPolicy(
      this,
      "bickup-rw-jobs-table-policy",
      {
        managedPolicyName: `${config.deploymentEnv}-rw-bickup-jobs-table`,
        statements: [
          new PolicyStatement({
            //effect: Effect.Allow by default
            actions: ["dynamodb:*"],
            resources: [this.dynamoDbJobsTable.tableArn],
          }),
        ],
      }
    );
    const rwJobsTableLambdaRole = new Role(
      this,
      "bickup-rw-jobs-table-lambda-role",
      {
        assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
        managedPolicies: [
          rwJobsTablePolicy,
          ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AWSLambdaVPCAccessExecutionRole"
          ),
          ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AWSLambdaBasicExecutionRole"
          ),
        ],
      }
    );
    const postJobFn = new NodejsFunction(this, "bikcup-postjob-fn", {
      functionName: `${config.deploymentEnv}-bickup-postjob-fn`,
      runtime: Runtime.NODEJS_14_X,
      entry: "./src/jobs.ts",
      handler: "createJob",
      role: rwJobsTableLambdaRole,
      environment: {
        JOBS_TABLE: config.jobsTable,
      },
    });
    const postJobLambdaApi = new LambdaRestApi(this, "bickup-postjob-api", {
      restApiName: `${config.deploymentEnv}-bickup-postjob-api`,
      handler: postJobFn,
      proxy: false, //can this be set to true?
      deployOptions: { stageName: config.deploymentEnv },
      // https://docs.aws.amazon.com/cdk/api/latest/docs/aws-apigateway-readme.html#cross-origin-resource-sharing-cors
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowHeaders: ["Authorizer" , "Content-Type"]
      },
      
    });
    // we need to configure apigateway gateway response as cognito authorizer responses need to have the header 'Access-Control-Allow-Origin' properly configured
    // or else the client browser will refuse to read the response due to violation of CORS.
    // errorneuous documentation https://docs.aws.amazon.com/cdk/api/latest/docs/aws-apigateway-readme.html
    // solution at https://github.com/aws/serverless-application-model/issues/623 to enclose values in single quotes, e.g "'test-value'"
    postJobLambdaApi.addGatewayResponse('bickup-api-gateway-response', {
      type: ResponseType.UNAUTHORIZED,
      statusCode: '401',
      responseHeaders: {
        'Access-Control-Allow-Origin': "'*'",
        // 'test-key': "'test-value'"
      },
      templates: {
        'application/json': '{ "message": $context.error.messageString,  "type": "$context.error.responseType" }'
      }
    });
    const getJobFn = new NodejsFunction(this, "bickup-getjob-fn", {
      functionName: `${config.deploymentEnv}-bickup-getjob-fn`,
      runtime: Runtime.NODEJS_14_X,
      entry: "./src/jobs.ts",
      handler: "getJob",
      role: rwJobsTableLambdaRole,
      environment: {
        JOBS_TABLE: config.jobsTable,
      },
    });
    
    const patchJobFn = new NodejsFunction(this, "bickup-patchjob-fn", {
      functionName: `${config.deploymentEnv}-bickup-patchjob-fn`,
      runtime: Runtime.NODEJS_14_X,
      entry: "./build/src/jobs.js",
      handler: "patchJob",
      role: rwJobsTableLambdaRole,
      environment: {
        JOBS_TABLE: config.jobsTable,
      },
      
    });
    //implement cognito userpool authorizer to protect patchJobFn api
    //https://stackoverflow.com/questions/52726914/aws-cdk-user-pool-authorizer
    //https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-apigateway.CognitoUserPoolsAuthorizer.html
    const userPoolAuthorizer = new CognitoUserPoolsAuthorizer(this, "bickup-api-authorizer", {
      cognitoUserPools: [this.userPool],
      authorizerName: `${config.deploymentEnv}-bickup-patchjob-authorizer`,
      identitySource: "method.request.header.Authorizer"
    });
    const jobs = postJobLambdaApi.root.addResource("jobs");
    jobs.addMethod("POST");
   
    const singleJob = jobs.addResource("{contact_no}");
    singleJob.addMethod("GET", new LambdaIntegration(getJobFn));
    singleJob.addMethod("PATCH", new LambdaIntegration(patchJobFn), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: userPoolAuthorizer 
    });
  }
}
