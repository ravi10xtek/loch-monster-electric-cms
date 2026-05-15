import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCompetitorRankedKeywords, findKeywordGaps } from '@/lib/dataforseo'

/**
 * POST /api/seo/sync-competitor
 * Body: { competitorId: string }
 * Fetches ranked keywords from DataForSEO for a saved Competitor record,
 * computes keyword gaps vs. LME's target list, and updates the record.
 */
export async function POST(req: NextRequest) {
  try {
    const { competitorId } = await req.json()
    if (!competitorId) {
      return NextResponse.json({ error: 'competitorId is required.' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const [competitor, settings] = await Promise.all([
      payload.findByID({ collection: 'competitors', id: competitorId }),
      payload.findGlobal({ slug: 'seo-settings' }),
    ])

    const locationCode: number = settings.targetLocationCode ?? 1023191
    const creds = { login: settings.dataForSeoLogin, password: settings.dataForSeoPassword }
    const ourKeywords: string[] = (settings.lmeKeywords ?? []).map((k: any) => k.keyword).filter(Boolean)

    const rankedKeywords = await getCompetitorRankedKeywords(competitor.domain, locationCode, creds)

    const topKeywords = rankedKeywords
      .slice(0, 50)
      .map((rk: any) => ({
        keyword: rk.keyword,
        position: rk.ranked_serp_element?.serp_item?.rank_group ?? 0,
        searchVolume: rk.keyword_data?.keyword_info?.search_volume ?? 0,
        url: rk.ranked_serp_element?.serp_item?.url ?? '',
      }))
      .sort((a, b) => b.searchVolume - a.searchVolume)

    const keywordGaps = findKeywordGaps(rankedKeywords, ourKeywords)

    await payload.update({
      collection: 'competitors',
      id: competitorId,
      data: {
        topKeywords,
        keywordGaps,
        lastSynced: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      topKeywordsCount: topKeywords.length,
      keywordGapsCount: keywordGaps.length,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
