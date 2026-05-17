import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Validate API key
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY is not configured' }, { status: 500 })
  }

  let body: { prompt?: string; altText?: string; filename?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { prompt, altText, filename } = body

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
  }
  if (!altText || typeof altText !== 'string') {
    return NextResponse.json({ error: 'altText is required' }, { status: 400 })
  }
  if (!filename || typeof filename !== 'string') {
    return NextResponse.json({ error: 'filename is required' }, { status: 400 })
  }

  try {
    // Call DALL-E 3
    const openai = new OpenAI({ apiKey })
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1792x1024',
      quality: 'standard',
      n: 1,
    })

    const imageUrl = imageResponse.data?.[0]?.url
    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL returned from DALL-E' }, { status: 500 })
    }

    // Fetch the image buffer
    const imageRes = await fetch(imageUrl)
    if (!imageRes.ok) {
      return NextResponse.json({ error: 'Failed to download generated image' }, { status: 500 })
    }
    const imageBuffer = await imageRes.arrayBuffer()

    // Upload to Payload media collection
    const payload = await getPayload({ config })
    const mediaDoc = await payload.create({
      collection: 'media',
      data: { alt: altText },
      file: {
        data: Buffer.from(imageBuffer),
        mimetype: 'image/png',
        name: `${filename}.png`,
        size: imageBuffer.byteLength,
      },
    })

    return NextResponse.json({
      id: mediaDoc.id,
      url: mediaDoc.url,
      alt: (mediaDoc as any).alt,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[generate-image] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
