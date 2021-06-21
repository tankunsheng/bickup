import * as cdk from "@aws-cdk/core";
import { UserPool, UserPoolClient } from "@aws-cdk/aws-cognito";
import { LambdaRestApi, RestApi, Integration } from "@aws-cdk/aws-apigateway";
import { Function, Runtime, AssetCode } from "@aws-cdk/aws-lambda";
import config from "./config";

export class BackendStack extends cdk.Stack {
  userPool: UserPool;
  userPoolClient: UserPoolClient;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.createUserPool()
    // // Cognito User Pool with Email Sign-in Type.
    // const userPool = new UserPool(this, "bickup-user-pool", {
    //   userPoolName: `${config.deploymentEnv}-bickup-user-pool`,
    //   // removalPolicy: cdk.RemovalPolicy.DESTROY // Defaults to retain. Similar to S3 buckets.
    //   signInAliases: {
    //     email: true,
    //   },
    //   standardAttributes: {
    //     phoneNumber: {
    //       required: true,
    //     },
    //   },
    //   selfSignUpEnabled: true,
    //   passwordPolicy: {
    //     requireLowercase: false,
    //     requireSymbols: false,
    //     requireUppercase: false,
    //     minLength: 8,
    //     requireDigits: true,
    //   },
    // });
    // const userPoolClient = new UserPoolClient(this, "bickup-user-pool-client", {
    //   userPool:  this.userPool,
    //   userPoolClientName: `${config.deploymentEnv}-bickup-user-pool-client`,
    // });
    const registerFn = new Function(this, "bickup-register-fn", {
      functionName: `${config.deploymentEnv}-bickup-register-fn`,
      runtime: Runtime.NODEJS_14_X,
      code: new AssetCode("./src"),
      handler: "user.register",
      environment: {
        USER_POOL_ARN:  this.userPool.userPoolArn,
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
    //Lambda for User Pool Registration
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
    this.userPoolClient = new UserPoolClient(this, "bickup-user-pool-client", {
      userPool:  this.userPool,
      userPoolClientName: `${config.deploymentEnv}-bickup-user-pool-client`,
    });
  }
}
