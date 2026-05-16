import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

export const dynamic = 'force-dynamic'

export async function GET() {
  const endpoint = process.env.SUPABASE_S3_ENDPOINT
  const region = process.env.SUPABASE_S3_REGION || 'us-east-1'
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'media'
  const accessKeyId = process.env.SUPABASE_S3_ACCESS_KEY_ID
  const secretAccessKey = process.env.SUPABASE_S3_SECRET_ACCESS_KEY

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    return NextResponse.json(
      {
        ok: false,
        envCheck: {
          endpoint: !!endpoint,
          region,
          bucket,
          accessKeyId: !!accessKeyId,
          secretAccessKey: !!secretAccessKey,
        },
        message: 'Missing S3 env vars',
      },
      { status: 500 },
    )
  }

  const client = new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  })

  const key = `diagnostic/test-${Date.now()}.txt`
  const body = Buffer.from('Hello from /api/s3-direct-test', 'utf-8')

  try {
    const put = await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: 'text/plain',
      }),
    )
    const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    return NextResponse.json({
      ok: true,
      bucket,
      key,
      etag: put.ETag,
      headSize: head.ContentLength,
      publicUrl: `${endpoint.replace('/storage/v1/s3', '/storage/v1/object/public')}/${bucket}/${key}`,
    })
  } catch (err) {
    const e = err as Error & { name?: string; $metadata?: { httpStatusCode?: number } }
    return NextResponse.json(
      {
        ok: false,
        name: e.name ?? null,
        httpStatusCode: e.$metadata?.httpStatusCode ?? null,
        message: e.message,
        bucket,
        endpoint,
      },
      { status: 500 },
    )
  }
}
