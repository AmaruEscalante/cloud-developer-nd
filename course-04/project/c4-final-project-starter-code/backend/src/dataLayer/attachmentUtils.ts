import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })
// TODO: Implement the fileStogare logic
export default async function createPresignedUrl(
    imageId: string
): Promise<string> {
    return s3.getSignedUrl('putObject', {
        Bucket: process.env.ATTACHMENT_S3_BUCKET,
        Key: imageId,
        Expires: process.env.SIGNED_URL_EXPIRATION,
    })
}