/**
 * seed-locations.mjs
 *
 * Seeds the Payload CMS `locations` collection from the LME website's
 * static serviceAreas.js data file.
 *
 * Usage:
 *   node scripts/seed-locations.mjs
 *
 * Env overrides:
 *   CMS_URL      (default: http://localhost:3001)
 *   CMS_EMAIL    (default: admin@lochmonsterelectric.com)
 *   CMS_PASSWORD (default: LMEadmin2025!)
 */

import { allCities } from '../../Loch Monster Electric/app/data/serviceAreas.js'

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

async function createLocation(token, data) {
  const res = await fetch(`${BASE}/api/locations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to create location "${data.slug}" (${res.status}): ${text}`)
  }
  const json = await res.json()
  return json.doc
}

async function patchLocation(token, id, data) {
  const res = await fetch(`${BASE}/api/locations/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to patch location ${id} (${res.status}): ${text}`)
  }
  return res.json()
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nSeeding locations → ${BASE}\n`)

  const token = await login()

  // Pass 1: create all cities without nearby relationships
  const slugToId = {}

  console.log(`\nPass 1: Creating ${allCities.length} locations (no nearby)...\n`)
  for (const city of allCities) {
    const payload = {
      name: city.name,
      state: city.state,
      slug: city.slug,
      county: city.county ?? undefined,
      lat: city.lat ?? undefined,
      lng: city.lng ?? undefined,
      blurb: city.blurb,
      metaTitle: city.metaTitle ?? undefined,
      metaDescription: city.metaDescription ?? undefined,
    }

    const doc = await createLocation(token, payload)
    slugToId[city.slug] = doc.id
    console.log(`  [OK] ${city.name} (${city.slug}) → id ${doc.id}`)
  }

  // Pass 2: set nearby relationships by mapping slugs → IDs
  console.log(`\nPass 2: Setting nearby relationships...\n`)
  for (const city of allCities) {
    const nearbySlugs = city.nearby ?? []
    if (!nearbySlugs.length) continue

    const nearbyIds = nearbySlugs
      .map(s => slugToId[s])
      .filter(Boolean)

    if (!nearbyIds.length) continue

    await patchLocation(token, slugToId[city.slug], { nearby: nearbyIds })
    console.log(`  [OK] ${city.slug} → nearby: [${nearbySlugs.join(', ')}]`)
  }

  console.log(`\nDone. Seeded ${allCities.length} locations.\n`)
}

main().catch(err => {
  console.error('\nSeed failed:', err.message)
  process.exit(1)
})
