import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import { RemovalPolicy } from "@aws-cdk/core";
import config from "./config"

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const bucket = new s3.Bucket(this, "bickup-static-site", {
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
      bucketName: `${config.deploymentEnv}-bickup-static-site`
    });
    new s3Deployment.BucketDeployment(this, "bickup-static-site-deployment", {
      sources: [s3Deployment.Source.asset("../../public")],
      destinationBucket: bucket
    });
    // The code that defines your stack goes here
  }
}
