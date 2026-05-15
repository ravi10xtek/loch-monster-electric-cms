import { NextResponse } from 'next/server'
import pg from 'pg'

export const dynamic = 'force-dynamic'

export async function GET() {
  const ref = process.env.SUPABASE_PROJECT_REF || 'qvmccwbxnwacedtckfkp'
  const host = process.env.SUPABASE_POOLER_HOST || 'aws-1-us-east-1.pooler.supabase.com'

  const pool = new pg.Pool({
    host,
    port: 6543,
    user: `postgres.${ref}`,
    password: process.env.DATABASE_PASSWORD,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    max: 1,
  })

  const started = Date.now()
  try {
    const res = await pool.query('select 1 as ok, current_user, now() as ts')
    return NextResponse.json({
      ok: true,
      ms: Date.now() - started,
      row: res.rows[0],
    })
  } catch (err) {
    const e = err as Error & { code?: string }
    return NextResponse.json(
      {
        ok: false,
        ms: Date.now() - started,
        message: e.message,
        code: e.code ?? null,
      },
      { status: 500 },
    )
  } finally {
    await pool.end().catch(() => {})
  }
}
