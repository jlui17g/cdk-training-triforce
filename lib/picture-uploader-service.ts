import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class PictureUploaderService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const handler = new lambda.Function(this, "PictureUploaderHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("src/picture-uploader"),
      handler: "upload.main",
      environment: {}
    })

    const api = new apigateway.RestApi(this, "PictureUploaderAPI", {
      restApiName: "Picture Uploader Service",
      description: "Upload pictures to an S3 bucket"
    })

    const getPictureUploaderIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }'}
    })

    api.root.addMethod("GET", getPictureUploaderIntegration);
  }
}
