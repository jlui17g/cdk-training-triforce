import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as pictureUploader from '../lib/picture-uploader-service';

export class CdkTrainingTriforceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new pictureUploader.PictureUploaderService(this, 'PictureUploader');
  }
}
