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
    | 'global-home-page' | 'global-about-page' | 'global-contact-page'
    | 'global-pricing-page' | 'global-service-areas-page' | 'global-shared-sections'
  slug?: string
}

/**
 * Fire-and-forget revalidation call.
 * Logs on failure but never throws — a failed webhook shouldn't block a save.
 */
export async function revalidate({ collection, slug }: RevalidatePayload): Promise<void> {
  if (!SECRET) {
    console.warn('[revalidate] LME_REVALIDATE_SECRET is not set — skipping revalidation')
    return
  }

  try {
    const res = await fetch(`${SITE_URL}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: SECRET, collection, slug }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`[revalidate] Failed (${res.status}):`, text)
    } else {
      const json = await res.json()
      console.log('[revalidate] Success:', json.revalidated)
    }
  } catch (err) {
    console.error('[revalidate] Network error:', err)
  }
}
