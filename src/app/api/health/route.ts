import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const hasUri = Boolean(
    process.env.DATABASE_PASSWORD ||
      process.env.DATABASE_URI ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL,
  )

  try {
    const payload = await getPayload({ config })
    const users = await payload.find({ collection: 'users', limit: 1 })
    return NextResponse.json({
      ok: true,
      hasDatabaseUri: hasUri,
      vercelEnv: process.env.VERCEL_ENV ?? null,
      usersTable: users.totalDocs >= 0,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      {
        ok: false,
        hasDatabaseUri: hasUri,
        vercelEnv: process.env.VERCEL_ENV ?? null,
        error: message,
      },
      { status: 500 },
    )
  }
}
