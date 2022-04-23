const AWS = require('aws-sdk');
import { S3 } from 'aws-sdk';

const bucketName = process.env.BUCKET_NAME;

type GetPresignedPostUrlParams = {
  fileType: string;
  fileName: string;
};

const createPresignedPost = ({ fileType, fileName }: GetPresignedPostUrlParams): Promise<S3.PresignedPost> => {
  const params = {
    Bucket: bucketName,
    Fields: {key: fileName, acl: 'public-write'},
    Conditions: [
      // content length restrictions: 0-1MB]
      ['content-length-range', 0, 1000000],
      // specify content-type to be more generic- images only
      // ['starts-with', '$Content-Type', 'image/'],
      ['eq', '$Content-Type', fileType],
    ],
    // number of seconds for which the presigned policy should be valid
    Expires: 15,
  };

  const s3 = new S3();
  return s3.createPresignedPost(params) as unknown as Promise<S3.PresignedPost>;
}

exports.main = async (event, context) => {
  const method = event.httpMethod;

  if (method !== "GET") {
    return {
      statusCode: 400,
      headers: {},
      body: JSON.stringify({message: `please do a GET request, ${method}`})
    }
  }

  const fileType = event.queryStringParameters?.fileType;
  const fileName = event.queryStringParameters?.fileName;

  if (!fileType) return {
    statusCode: 400,
    headers: {},
    body: JSON.stringify({message: 'please include file type'})
  }

  const presignedPost = await createPresignedPost({ fileType: fileType, fileName: fileName });
  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify({ data: presignedPost })
  }
}
