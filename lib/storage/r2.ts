import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

type R2Config = {
  endpoint: string
  accessKey: string
  secretKey: string
  bucket: string
}

const getConfig = (): R2Config => {
  const endpoint = process.env.R2_ENDPOINT?.trim()
  const accessKey = process.env.R2_ACCESS_KEY?.trim()
  const secretKey = process.env.R2_SECRET_KEY?.trim()
  const bucket = process.env.R2_BUCKET?.trim()

  if (!endpoint || !accessKey || !secretKey || !bucket) {
    throw new Error('R2 storage is not configured.')
  }

  return { endpoint, accessKey, secretKey, bucket }
}

const getClient = () => {
  const config = getConfig()

  return {
    config,
    client: new S3Client({
      region: 'auto',
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
      },
    }),
  }
}

export const createR2UploadUrl = async (
  key: string,
  contentType = 'application/octet-stream',
  expiresIn = 900,
) => {
  const { client, config } = getClient()

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: contentType,
  })

  return getSignedUrl(client, command, {
    expiresIn,
  })
}

export const getR2Object = async (key: string) => {
  const { client, config } = getClient()
  const response = await client.send(
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: key,
    }),
  )

  if (!response.Body) {
    throw new Error('Uploaded file could not be read from storage.')
  }

  const bytes = await response.Body.transformToByteArray()

  return {
    bytes,
    contentType: response.ContentType || 'application/octet-stream',
    contentLength: response.ContentLength ?? bytes.byteLength,
  }
}

export const getR2ObjectMetadata = async (key: string) => {
  const { client, config } = getClient()

  return client.send(
    new HeadObjectCommand({
      Bucket: config.bucket,
      Key: key,
    }),
  )
}

export const deleteR2Object = async (key: string) => {
  try {
    const { client, config } = getClient()

    await client.send(
      new DeleteObjectCommand({
        Bucket: config.bucket,
        Key: key,
      }),
    )
  } catch (error) {
    console.error('Failed to delete R2 object:', error)
  }
}
