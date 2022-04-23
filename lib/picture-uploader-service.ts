import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";

export class PictureUploaderService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const pictures = new s3.Bucket(this, "pictures", {
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
          ],
          allowedOrigins: ['*'],
          allowedHeaders: ['*']
        }
      ]
    });

    const handler = new lambda.Function(this, "PictureUploaderHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("src/picture-uploader"),
      handler: "upload.main",
      environment: {BUCKET_NAME: pictures.bucketName}
    });

    const api = new apigateway.RestApi(this, "PictureUploaderAPI", {
      restApiName: "Picture Uploader Service",
      description: "Upload pictures to an S3 bucket",
      defaultCorsPreflightOptions: {
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
        allowMethods: [
          'GET',
          'POST',
          'PUT',
          'DELETE'
        ],
        allowCredentials: false,
        allowOrigins: ["*"],
      },
    })

    const getPictureUploaderIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }'}
    })

    api.root.addMethod("GET", getPictureUploaderIntegration);
  }
}
