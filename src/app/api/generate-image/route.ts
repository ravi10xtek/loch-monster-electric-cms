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
    // Call OpenAI Responses API with image_generation tool
    const openai = new OpenAI({ apiKey })
    const response = await openai.responses.create({
      model: 'gpt-5.4-mini',
      input: prompt,
      tools: [{ type: 'image_generation' }],
    })

    const b64 = response.output
      .filter((o: any) => o.type === 'image_generation_call')
      .map((o: any) => o.result)[0]

    if (!b64) {
      return NextResponse.json({ error: 'No image data returned from OpenAI' }, { status: 500 })
    }

    const imageBuffer = Buffer.from(b64, 'base64')

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
