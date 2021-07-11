import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import { RemovalPolicy } from "@aws-cdk/core";
import config from "./config";

export class FrontendStack extends cdk.Stack {
  private _cloudFrontDist: cloudfront.Distribution;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const bucket = new s3.Bucket(this, "bickup-static-site", {
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.RETAIN,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html", // client side routing if document is not found in bucket
      bucketName: `${config.deploymentEnv}-bickup-static-site`,
    });
    new s3Deployment.BucketDeployment(this, "bickup-static-site-deployment", {
      sources: [s3Deployment.Source.asset("../../public")],
      destinationBucket: bucket,
    });

    this._cloudFrontDist = new cloudfront.Distribution(
      this,
      "bickup-static-site-cloudfront",
      {
        defaultBehavior: { origin: new origins.S3Origin(bucket) },
      }
    );
  }
  get cloudFrontDist(){
    return this._cloudFrontDist
  }
}
