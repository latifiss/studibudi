import crypto from 'node:crypto'
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3'

const endpoint = process.env.R2_ENDPOINT?.trim()
const accessKey = process.env.R2_ACCESS_KEY?.trim()
const secretKey = process.env.R2_SECRET_KEY?.trim()
const bucket = process.env.R2_BUCKET?.trim()

if (!endpoint || !accessKey || !secretKey || !bucket) {
  throw new Error('R2 storage is not configured. Set R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY, and R2_BUCKET.')
}

const client = new S3Client({
  region: 'auto',
  endpoint,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
})

const awsEncode = (value: string) =>
  encodeURIComponent(value).replace(/[!'()*]/g, (character) =>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`
  )

const hmac = (key: Buffer | string, value: string) =>
  crypto.createHmac('sha256', key).update(value).digest()

const formatAmzDate = (date: Date) => {
  const iso = date.toISOString().replace(/[-:]/g, '')
  return iso.slice(0, 15) + 'Z'
}

const formatDate = (date: Date) => formatAmzDate(date).slice(0, 8)

export const createR2UploadUrl = (key: string, expiresIn = 900) => {
  const endpointUrl = new URL(endpoint)
  const host = `${bucket}.${endpointUrl.host}`
  const canonicalUri = `/${key.split('/').map(awsEncode).join('/')}`
  const now = new Date()
  const amzDate = formatAmzDate(now)
  const shortDate = formatDate(now)
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

  const canonicalHeaders = `host:${host}\n`
  const signedHeaders = 'host'
  const canonicalRequest = [
    'PUT',
    canonicalUri,
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
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
  const response = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
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

export const getR2ObjectMetadata = async (key: string) =>
  client.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  )

export const deleteR2Object = async (key: string) => {
  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    )
  } catch (error) {
    console.error('Failed to delete R2 object:', error)
  }
}
