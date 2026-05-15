/**
 * One-time: mark the initial migration as applied when the DB schema
 * already exists from dev `push` (avoids re-running CREATE TABLE on deploy).
 *
 *   node scripts/baseline-migration.mjs
 */
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const MIGRATION_NAME = '20260515_151041_initial_schema'

const payload = await getPayload({ config })

const existing = await payload.find({
  collection: 'payload-migrations',
  where: { name: { equals: MIGRATION_NAME } },
  limit: 1,
})

if (existing.docs.length) {
  console.log(`Migration "${MIGRATION_NAME}" already recorded.`)
  process.exit(0)
}

await payload.create({
  collection: 'payload-migrations',
  data: { name: MIGRATION_NAME, batch: 1 },
})

console.log(`Recorded migration "${MIGRATION_NAME}" as applied (batch 1).`)
process.exit(0)
