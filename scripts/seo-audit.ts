#!/usr/bin/env tsx
/**
 * Usage:
 *   npm run seo:audit                      — audits all known pages
 *   npm run seo:audit -- --url /about-us   — audits one page
 *
 * Calls POST /api/seo/run-audit once per URL so each request stays
 * well within Vercel's function timeout. Results are saved to the CMS.
 */

const CMS_URL = process.env.CMS_URL ?? 'http://localhost:3001'

async function auditUrl(url: string) {
  const res = await fetch(`${CMS_URL}/api/seo/run-audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Failed to audit ${url}: ${data.error}`)
  return data.urls?.[0]
}

async function getAllUrls(): Promise<string[]> {
  const settingsRes = await fetch(`${CMS_URL}/api/globals/seo-settings`)
  const settings = await settingsRes.json()
  const siteUrl = (settings.siteUrl ?? 'http://localhost:3000').replace(/\/$/, '')

  const locRes = await fetch(`${CMS_URL}/api/locations?limit=100`)
  const locations = await locRes.json()
  const locationPaths = (locations.docs ?? []).map((l: any) => `/service-areas/${l.slug}`)

  const staticPaths = [
    '/',
    '/about-us',
    '/contact-us',
    '/pricing-estimates',
    '/residential-electrical-services',
    '/commercial-electrical-services',
    '/hoa-electrical-services',
    '/service-areas',
  ]

  return [...staticPaths, ...locationPaths].map((p) => `${siteUrl}${p}`)
}

async function main() {
  const urlFlag = process.argv.indexOf('--url')
  const singlePath = urlFlag !== -1 ? process.argv[urlFlag + 1] : null

  let urls: string[]
  if (singlePath) {
    const settingsRes = await fetch(`${CMS_URL}/api/globals/seo-settings`)
    const settings = await settingsRes.json()
    const siteUrl = (settings.siteUrl ?? 'http://localhost:3000').replace(/\/$/, '')
    urls = [singlePath.startsWith('http') ? singlePath : `${siteUrl}${singlePath}`]
  } else {
    urls = await getAllUrls()
  }

  console.log(`\nAuditing ${urls.length} page${urls.length === 1 ? '' : 's'} via PageSpeed Insights...\n`)

  const results: any[] = []
  for (const url of urls) {
    process.stdout.write(`  ${url} ... `)
    try {
      const result = await auditUrl(url)
      results.push(result)
      console.log(`SEO: ${result.seoScore}/100  Perf: ${result.performanceScore}/100`)
    } catch (err: any) {
      console.log(`ERROR: ${err.message}`)
    }
  }

  console.log('\n--- Summary ---')
  console.table(
    results.map((r) => ({
      URL: r.url,
      SEO: `${r.seoScore}/100`,
      Perf: `${r.performanceScore}/100`,
    })),
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
