import crypto from 'node:crypto'
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3'

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
    throw new Error('R2 storage is not configured. Set R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY, and R2_BUCKET.')
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

const awsEncode = (value: string) =>
  encodeURIComponent(value).replace(/[!'()*]/g, (character) =>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`
  )

const hmac = (key: Buffer | string, value: string) =>
  crypto.createHmac('sha256', key).update(value).digest()

const formatAmzDate = (date: Date) => {
  const iso = date.toISOString().replace(/[-:]/g, '')
  return `${iso.slice(0, 15)}Z`
}

export const createR2UploadUrl = (key: string, expiresIn = 900) => {
  const { endpoint, accessKey, secretKey, bucket } = getConfig()
  const endpointUrl = new URL(endpoint)
  const host = `${bucket}.${endpointUrl.host}`
  const canonicalUri = `/${key.split('/').map(awsEncode).join('/')}`
  const now = new Date()
  const amzDate = formatAmzDate(now)
  const shortDate = amzDate.slice(0, 8)
  const credentialScope = `${shortDate}/auto/s3/aws4_request`

  const query: Record<string, string> = {
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${accessKey}/${credentialScope}`,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': String(expiresIn),
    'X-Amz-SignedHeaders': 'host',
  }

  const canonicalQuery = Object.entries(query)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => `${awsEncode(name)}=${awsEncode(value)}`)
    .join('&')

  const canonicalRequest = [
    'PUT',
    canonicalUri,
    canonicalQuery,
    `host:${host}\n`,
    'host',
    'UNSIGNED-PAYLOAD',
  ].join('\n')

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
  ].join('\n')

  const dateKey = hmac(`AWS4${secretKey}`, shortDate)
  const regionKey = hmac(dateKey, 'auto')
  const serviceKey = hmac(regionKey, 's3')
  const signingKey = hmac(serviceKey, 'aws4_request')
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex')

  return `${endpointUrl.protocol}//${host}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${signature}`
}

export const getR2Object = async (key: string) => {
  const { client, config } = getClient()
  const response = await client.send(new GetObjectCommand({ Bucket: config.bucket, Key: key }))

  if (!response.Body) throw new Error('Uploaded file could not be read from storage.')

  const bytes = await response.Body.transformToByteArray()

  return {
    bytes,
    contentType: response.ContentType || 'application/octet-stream',
    contentLength: response.ContentLength ?? bytes.byteLength,
  }
}

export const getR2ObjectMetadata = async (key: string) => {
  const { client, config } = getClient()
  return client.send(new HeadObjectCommand({ Bucket: config.bucket, Key: key }))
}

export const deleteR2Object = async (key: string) => {
  try {
    const { client, config } = getClient()
    await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }))
  } catch (error) {
    console.error('Failed to delete R2 object:', error)
  }
}
