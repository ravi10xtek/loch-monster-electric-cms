/**
 * seed-services.mjs
 *
 * Seeds the Payload CMS `services` collection from the LME website's
 * static serviceDetails.js data file.
 *
 * Usage:
 *   node scripts/seed-services.mjs
 *
 * Env overrides:
 *   CMS_URL      (default: http://localhost:3001)
 *   CMS_EMAIL    (default: admin@lochmonsterelectric.com)
 *   CMS_PASSWORD (default: LMEadmin2025!)
 */

import { serviceDetails } from '../../Loch Monster Electric/app/data/serviceDetails.js'

const BASE = process.env.CMS_URL || 'http://localhost:3001'
const EMAIL = process.env.CMS_EMAIL || 'admin@lochmonsterelectric.com'
const PASSWORD = process.env.CMS_PASSWORD || 'LMEadmin2025!'

// ── Helpers ────────────────────────────────────────────────────────────────

async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Login failed (${res.status}): ${text}`)
  }
  const { token } = await res.json()
  console.log('  Logged in.')
  return token
}

async function createService(token, data) {
  const res = await fetch(`${BASE}/api/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to create service "${data.slug}" (${res.status}): ${text}`)
  }
  const json = await res.json()
  return json.doc
}

/**
 * Map a serviceDetails entry (keyed by slug) to the flat Payload fields shape.
 *
 * Static shape:
 *   { parentHub, parentCategory, seo: { title, description },
 *     hero: { eyebrow, title: string[], tagline, body },
 *     whenDoYouNeed: { whenHeading, gradient, color, scenarios: [{heading,body}] } }
 *
 * Payload shape (flat):
 *   title, slug, parentCategory, parentHub,
 *   heroEyebrow, heroTitle: [{line}], heroTagline, heroBody,
 *   whenHeading, whenGradient, whenColor,
 *   scenarios: [{heading, body}],
 *   seoTitle, seoDescription
 */
function mapService(slug, data) {
  const hero = data.hero ?? {}
  const when = data.whenDoYouNeed ?? {}
  const seo = data.seo ?? {}

  // Build title from hero title lines joined with a space (for admin useAsTitle)
  const titleLines = Array.isArray(hero.title) ? hero.title : []
  const title = titleLines.join(' ')

  return {
    title,
    slug,
    parentCategory: data.parentCategory,
    parentHub: data.parentHub,

    // Hero
    heroEyebrow: hero.eyebrow ?? undefined,
    heroTitle: titleLines.map(line => ({ line })),
    heroTagline: hero.tagline ?? undefined,
    heroBody: hero.body ?? undefined,

    // When Do You Need
    whenHeading: when.whenHeading ?? undefined,
    whenGradient: when.gradient ?? undefined,
    whenColor: when.color ?? undefined,
    scenarios: Array.isArray(when.scenarios)
      ? when.scenarios.map(s => ({ heading: s.heading, body: s.body }))
      : [],

    // SEO
    seoTitle: seo.title ?? undefined,
    seoDescription: seo.description ?? undefined,
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nSeeding services → ${BASE}\n`)

  const token = await login()

  const entries = Object.entries(serviceDetails)
  console.log(`\nCreating ${entries.length} services...\n`)

  let successCount = 0
  for (const [slug, data] of entries) {
    const payload = mapService(slug, data)
    const doc = await createService(token, payload)
    console.log(`  [OK] ${slug} → id ${doc.id}`)
    successCount++
  }

  console.log(`\nDone. Seeded ${successCount} services.\n`)
}

main().catch(err => {
  console.error('\nSeed failed:', err.message)
  process.exit(1)
})
