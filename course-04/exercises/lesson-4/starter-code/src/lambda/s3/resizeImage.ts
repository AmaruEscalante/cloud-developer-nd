import { SNSEvent, SNSHandler, S3EventRecord } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import Jimp from 'jimp/es'

const s3 = new AWS.S3()

const imagesBucketName = process.env.IMAGES_S3_BUCKET
const thumbnailBucketName = process.env.THUMBNAILS_S3_BUCKET

export const handler: SNSHandler = async (event: SNSEvent) => {
    console.log('Processing SNS event', JSON.stringify(event))
    for (const snsRecord of event.Records) {
        const s3EventStr = snsRecord.Sns.Message
        console.log('Processing S3 event', s3EventStr)
        const s3Event = JSON.parse(s3EventStr)
    
        for (const record of s3Event.Records) {
            // "record" is an instance of S3EventRecord
            await processImage(record)
        }
    }
}

async function processImage(record: S3EventRecord) {
    const key = record.s3.object.key
    console.log('Processing S3 item with key: ', key)

    if (key.includes('thumb')) {
        console.log(`Thumbnail file ${key} uploaded. Skipping...`)
        return
    }

    return resizeImage(key)
}

async function resizeImage(key: string) {
    const image = await s3.getObject({
        Bucket: imagesBucketName,
        Key: key
    }).promise()

    const imageBody = image.Body;
    const imageType = image.ContentType

    const imageBuffer = await Jimp.read(imageBody)
    const resizeImageBuffer = await imageBuffer.resize(150, Jimp.AUTO)
    const resizeImageBody = await resizeImageBuffer.getBufferAsync(imageType)

    await s3.putObject({
        Bucket: thumbnailBucketName,
        Key: `${key}-thumb.jpeg`,
        Body: resizeImageBody,
    }).promise()

}

