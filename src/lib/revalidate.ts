/**
 * revalidate.ts — fires the LME website's /api/revalidate endpoint
 * after a Payload document is saved, so Next.js ISR caches are busted
 * without a full site rebuild.
 *
 * Environment variables (in lme-cms/.env):
 *   LME_SITE_URL          — e.g. http://localhost:3000 (dev) or https://lochmonsterelectric.com (prod)
 *   LME_REVALIDATE_SECRET — must match REVALIDATION_SECRET in the LME website .env.local
 */

const SITE_URL = process.env.LME_SITE_URL || 'http://localhost:3000'
const SECRET = process.env.LME_REVALIDATE_SECRET || ''

interface RevalidatePayload {
  collection:
    | 'posts' | 'locations' | 'services' | 'page-seo' | 'pages' | 'faqs'
    | 'service-hubs' | 'category-hubs'
    | 'projects' | 'social-posts'
    | 'global-media-page'
    | 'global-home-page' | 'global-about-page' | 'global-contact-page'
    | 'global-pricing-page' | 'global-service-areas-page' | 'global-shared-sections'
    | 'global-site-settings'
    | 'global-navigation'
  slug?: string
}

/**
 * TRULY fire-and-forget revalidation call.
 *
 * Critically: we do NOT await the fetch. The promise is dispatched and the
 * function returns immediately. This is essential on Vercel serverless — if
 * we await, the calling Payload hook holds its DB connection for the whole
 * duration of the website round-trip, which can be 1-10 seconds with cold
 * starts. That hold + Vercel's per-instance connection pooling adds up fast
 * and exhausts Supabase's 200-connection cap.
 *
 * Trade-off: revalidation may silently fail. We log failures (logs may not
 * complete on serverless), and add a 3s timeout so dangling fetches don't
 * leak resources.
 */
export function revalidate({ collection, slug }: RevalidatePayload): void {
  if (!SECRET) {
    console.warn('[revalidate] LME_REVALIDATE_SECRET is not set — skipping revalidation')
    return
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 3000)

  fetch(`${SITE_URL}/api/revalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: SECRET, collection, slug }),
    signal: controller.signal,
  })
    .then(async (res) => {
      clearTimeout(timeoutId)
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        console.error(`[revalidate] Failed (${res.status}):`, text)
      } else {
        const json = await res.json().catch(() => ({ revalidated: '?' }))
        console.log('[revalidate] Success:', json.revalidated)
      }
    })
    .catch((err) => {
      clearTimeout(timeoutId)
      console.error('[revalidate] Network error:', err?.message || err)
    })
}
