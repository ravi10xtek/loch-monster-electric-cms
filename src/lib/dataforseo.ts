const BASE_URL = 'https://api.dataforseo.com/v3'

function getCredentials(login?: string | null, password?: string | null) {
  const l = login || process.env.DATAFORSEO_LOGIN || ''
  const p = password || process.env.DATAFORSEO_PASSWORD || ''
  if (!l || !p) throw new Error('DataForSEO credentials not configured.')
  return Buffer.from(`${l}:${p}`).toString('base64')
}

async function post<T>(path: string, body: unknown, credentials: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`DataForSEO ${path} failed: ${res.status} ${res.statusText}`)
  const data = await res.json()
  if (data.status_code !== 20000) {
    throw new Error(`DataForSEO error ${data.status_code}: ${data.status_message}`)
  }
  return data
}

export type SerpResult = {
  domain: string
  url: string
  title: string
  description: string
  rank_group: number
}

export type RankedKeyword = {
  keyword: string
  ranked_serp_element: {
    serp_item: {
      rank_group: number
      url: string
    }
  }
  keyword_data: {
    keyword_info: {
      search_volume: number
    }
  }
}

export type DataForSeoCredentials = {
  login?: string | null
  password?: string | null
}

/** Get top organic results for a keyword — used to discover local competitors */
export async function getSerpResults(
  keyword: string,
  locationCode: number,
  creds: DataForSeoCredentials,
): Promise<SerpResult[]> {
  const credentials = getCredentials(creds.login, creds.password)
  const data = await post<any>('/serp/google/organic/live/regular', [
    { keyword, location_code: locationCode, language_code: 'en', device: 'desktop', depth: 10 },
  ], credentials)

  const items = data.tasks?.[0]?.result?.[0]?.items ?? []
  return items
    .filter((i: any) => i.type === 'organic')
    .map((i: any) => ({
      domain: i.domain,
      url: i.url,
      title: i.title,
      description: i.description,
      rank_group: i.rank_group,
    }))
}

/** Get all keywords a competitor domain ranks for */
export async function getCompetitorRankedKeywords(
  domain: string,
  locationCode: number,
  creds: DataForSeoCredentials,
  limit = 100,
): Promise<RankedKeyword[]> {
  const credentials = getCredentials(creds.login, creds.password)
  const data = await post<any>('/dataforseo_labs/google/ranked_keywords/live', [
    { target: domain, location_code: locationCode, language_code: 'en', limit },
  ], credentials)

  return data.tasks?.[0]?.result?.[0]?.items ?? []
}

/** Get search volumes for a list of keywords */
export async function getSearchVolumes(
  keywords: string[],
  locationCode: number,
  creds: DataForSeoCredentials,
): Promise<Record<string, number>> {
  const credentials = getCredentials(creds.login, creds.password)
  const data = await post<any>('/keywords_data/google_ads/search_volume/live', [
    { keywords, location_code: locationCode, language_code: 'en' },
  ], credentials)

  const results: Record<string, number> = {}
  const items = data.tasks?.[0]?.result ?? []
  for (const item of items) {
    results[item.keyword] = item.search_volume ?? 0
  }
  return results
}

/** Find keyword gaps: keywords competitor ranks for that are in our target list */
export function findKeywordGaps(
  rankedKeywords: RankedKeyword[],
  ourTargetKeywords: string[],
): { keyword: string; searchVolume: number; competitorPosition: number }[] {
  const ourSet = new Set(ourTargetKeywords.map(k => k.toLowerCase()))
  return rankedKeywords
    .filter(rk => ourSet.has(rk.keyword.toLowerCase()))
    .map(rk => ({
      keyword: rk.keyword,
      searchVolume: rk.keyword_data?.keyword_info?.search_volume ?? 0,
      competitorPosition: rk.ranked_serp_element?.serp_item?.rank_group ?? 0,
    }))
    .sort((a, b) => b.searchVolume - a.searchVolume)
}
