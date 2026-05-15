import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

/**
 * Opt-in DB health check for debugging deploys.
 * Set ENABLE_DB_HEALTH_CHECK=true in Vercel, hit /api/health, then remove the env var.
 */
export async function GET() {
  if (process.env.ENABLE_DB_HEALTH_CHECK !== 'true') {
    return NextResponse.json({ ok: false, message: 'Disabled' }, { status: 404 })
  }

  const hasUri = Boolean(
    process.env.DATABASE_URI || process.env.DATABASE_URL || process.env.POSTGRES_URL,
  )

  try {
    const payload = await getPayload({ config })
    const users = await payload.find({ collection: 'users', limit: 1 })
    return NextResponse.json({
      ok: true,
      hasDatabaseUri: hasUri,
      usersTable: users.totalDocs >= 0,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { ok: false, hasDatabaseUri: hasUri, error: message },
      { status: 500 },
    )
  }
}
