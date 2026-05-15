import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSerpResults } from '@/lib/dataforseo'

/**
 * POST /api/seo/discover-competitors
 * Searches DataForSEO for top organic results on each seed keyword,
 * deduplicates by domain, and returns candidate competitors to add.
 * Does NOT write to the DB — caller reviews and saves via the CMS.
 */
export async function POST() {
  try {
    const payload = await getPayload({ config })

    const settings = await payload.findGlobal({ slug: 'seo-settings' })
    const keywords: string[] = (settings.targetKeywords ?? []).map((k: any) => k.keyword).filter(Boolean)
    const locationCode: number = settings.targetLocationCode ?? 1023191
    const creds = { login: settings.dataForSeoLogin, password: settings.dataForSeoPassword }

    if (!keywords.length) {
      return NextResponse.json({ error: 'No seed keywords configured in SEO Settings.' }, { status: 400 })
    }

    const domainMap: Record<string, { domain: string; appearances: number; titles: string[]; urls: string[] }> = {}

    for (const keyword of keywords) {
      const results = await getSerpResults(keyword, locationCode, creds)
      for (const r of results) {
        if (!domainMap[r.domain]) {
          domainMap[r.domain] = { domain: r.domain, appearances: 0, titles: [], urls: [] }
        }
        domainMap[r.domain].appearances++
        if (!domainMap[r.domain].titles.includes(r.title)) domainMap[r.domain].titles.push(r.title)
        if (!domainMap[r.domain].urls.includes(r.url)) domainMap[r.domain].urls.push(r.url)
      }
    }

    // Exclude LME's own domain
    const siteUrl = settings.siteUrl ?? ''
    const ownDomain = siteUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '')

    const candidates = Object.values(domainMap)
      .filter(d => !d.domain.includes(ownDomain))
      .sort((a, b) => b.appearances - a.appearances)
      .slice(0, 20)

    return NextResponse.json({ candidates })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
