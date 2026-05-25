import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { autoLinkBody, buildKeywords } from '@/lib/auto-link'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  if (!id) return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })

  try {
    const payload = await getPayload({ config })

    // Auth — must be a logged-in user
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    // Fetch the post
    const post: any = await payload.findByID({
      collection: 'posts',
      id,
      depth: 0,
      overrideAccess: true,
    })
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    if (!post.body) return NextResponse.json({ error: 'Post has no body content' }, { status: 400 })

    // Build keyword map and transform the body
    const keywords = await buildKeywords(payload)
    const { body: newBody, linksAdded } = autoLinkBody(post.body, keywords)

    if (linksAdded === 0) {
      return NextResponse.json({ linksAdded: 0, message: 'No new keywords found to link.' })
    }

    // Save the updated body — beforeChange hook will regenerate bodyHtml
    await payload.update({
      collection: 'posts',
      id,
      data: { body: newBody },
      overrideAccess: true,
    })

    return NextResponse.json({
      linksAdded,
      message: `Added ${linksAdded} link${linksAdded === 1 ? '' : 's'}. Refresh the page to see them in the editor.`,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[auto-link] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
