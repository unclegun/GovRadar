function buildSearchUrl(query) {
  const q = encodeURIComponent(query || 'federal awards')
  return `https://www.usaspending.gov/search?query=${q}`
}

function normalizeAward(row) {
  const agency = row.awarding_agency_name || row['Awarding Agency'] || row.agency || 'Unknown Agency'
  const vendor = row.recipient_name || row['Recipient Name'] || row.vendor || 'Unknown Vendor'
  const awardId = row.generated_internal_id || row.internal_id || row.award_id || row['Award ID']
  const title = row.description || row['Description'] || row.title || 'Federal award record'

  return {
    id: awardId || row.id || crypto.randomUUID(),
    agency,
    vendor,
    naics: row.naics_code || row['NAICS Code'] || row.naics || 'N/A',
    amount: row.award_amount || row['Award Amount'] || row.amount || 0,
    awardDate: row.last_modified_date || row['Last Modified Date'] || row.awardDate || '',
    title,
    sourceUrl: awardId
      ? `https://www.usaspending.gov/award/${awardId}/latest`
      : buildSearchUrl(`${vendor} ${agency}`),
    vendorUrl: buildSearchUrl(vendor),
  }
}

function summarizeByCount(items, key) {
  const map = items.reduce((acc, item) => {
    const value = item[key]
    acc[value] = (acc[value] || 0) + 1
    return acc
  }, {})

  return Object.entries(map)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const agencyAliases = {
  gsa: ['general services administration', 'u s general services administration', 'gsa'],
  epa: ['environmental protection agency', 'u s environmental protection agency', 'epa'],
  hud: ['department of housing and urban development', 'u s department of housing and urban development', 'hud'],
  faa: ['federal aviation administration', 'u s federal aviation administration', 'faa'],
  noaa: ['national oceanic and atmospheric administration', 'noaa'],
  irs: ['internal revenue service', 'irs'],
  usda: ['department of agriculture', 'u s department of agriculture', 'usda'],
  'department of veterans affairs': ['department of veterans affairs', 'department of veteran affairs'],
}

const usaspendingAgencyFilters = {
  gsa: { tier: 'toptier', name: 'General Services Administration' },
  epa: { tier: 'toptier', name: 'Environmental Protection Agency' },
  hud: { tier: 'toptier', name: 'Department of Housing and Urban Development' },
  faa: { tier: 'subtier', name: 'Federal Aviation Administration' },
  noaa: { tier: 'subtier', name: 'National Oceanic and Atmospheric Administration' },
  irs: { tier: 'subtier', name: 'Internal Revenue Service' },
  usda: { tier: 'toptier', name: 'Department of Agriculture' },
}

function getAgencyFilter(selectedAgency) {
  if (!selectedAgency) return null

  const selected = normalizeText(selectedAgency)
  const mapped = usaspendingAgencyFilters[selected]
  if (mapped) {
    return {
      type: 'awarding',
      tier: mapped.tier,
      name: mapped.name,
    }
  }

  return {
    type: 'awarding',
    tier: 'toptier',
    name: selectedAgency,
  }
}

function agencyMatches(agencyValue, selectedAgency) {
  if (!selectedAgency) return true

  const selected = normalizeText(selectedAgency)
  const agency = normalizeText(agencyValue)
  const expanded = agencyAliases[selected] || [selected]

  return expanded.some((candidate) => {
    const normalizedCandidate = normalizeText(candidate)
    if (!normalizedCandidate) return false

    // Short aliases (e.g., EPA) should match a full token, not a substring.
    if (normalizedCandidate.length <= 4 && !normalizedCandidate.includes(' ')) {
      return agency.split(' ').includes(normalizedCandidate)
    }

    return agency === normalizedCandidate || agency.includes(normalizedCandidate)
  })
}

export async function getAwardsData({ keyword = '', agency = '' }) {
  const normalizedKeyword = keyword.toLowerCase().trim()
  const hasAgencyFilter = Boolean(agency)

  const fields = [
    'Award ID',
    'Recipient Name',
    'Award Amount',
    'Awarding Agency',
    'Description',
    'NAICS Code',
    'Last Modified Date',
  ]

  const maxPages = hasAgencyFilter ? 2 : 1
  const targetAgencyMatches = hasAgencyFilter ? 25 : 0
  const seenIds = new Set()
  const liveRows = []
  const agencyFilter = getAgencyFilter(agency)

  for (let page = 1; page <= maxPages; page += 1) {
    const response = await fetch('https://api.usaspending.gov/api/v2/search/spending_by_award/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields,
        filters: {
          time_period: [{ start_date: '2024-01-01', end_date: '2026-12-31' }],
          // USAspending requires all award type codes to come from a single group.
          // Use contracts only for this app's federal contracting use case.
          award_type_codes: ['A', 'B', 'C', 'D'],
          ...(agencyFilter ? { agencies: [agencyFilter] } : {}),
        },
        sort: 'Award Amount',
        order: 'desc',
        limit: 100,
        page,
        subawards: false,
      }),
    })

    if (!response.ok) {
      let detail = ''
      try {
        const errorPayload = await response.json()
        detail = errorPayload.message || JSON.stringify(errorPayload)
      } catch {
        // Fall back to status text when JSON is unavailable.
        detail = response.statusText || 'Unknown error'
      }
      throw new Error(`USAspending request failed (${response.status}): ${detail}`)
    }

    const payload = await response.json()
    const pageRows = (payload.results || []).map(normalizeAward)

    for (const row of pageRows) {
      if (seenIds.has(row.id)) continue
      seenIds.add(row.id)
      liveRows.push(row)
    }

    if (!pageRows.length) break

    if (hasAgencyFilter) {
      const agencyCount = liveRows.filter((row) => agencyMatches(row.agency, agency)).length
      if (agencyCount >= targetAgencyMatches) break
    }
  }

  const records = liveRows

  const filtered = records.filter((award) => {
    const matchesKeyword =
      !normalizedKeyword ||
      award.title.toLowerCase().includes(normalizedKeyword) ||
      award.vendor.toLowerCase().includes(normalizedKeyword)

    const matchesAgency = agencyMatches(award.agency, agency)
    return matchesKeyword && matchesAgency
  })

  const topAgencies = summarizeByCount(filtered, 'agency').slice(0, 6)
  const topVendors = summarizeByCount(filtered, 'vendor').slice(0, 6)
  const commonNaics = summarizeByCount(filtered, 'naics').slice(0, 6)

  const recentAwardCounts = filtered
    .sort((a, b) => new Date(b.awardDate) - new Date(a.awardDate))
    .slice(0, 8)
    .map((award) => ({
      period: award.awardDate,
      awards: 1,
    }))

  return {
    rows: filtered,
    topAgencies,
    topVendors,
    commonNaics,
    recentAwardCounts,
  }
}

export function summarizePrimes(awards) {
  const map = awards.reduce((acc, award) => {
    if (!acc[award.vendor]) {
      acc[award.vendor] = {
        companyName: award.vendor,
        recentAwardCount: 0,
        agencies: new Set(),
        naics: new Set(),
        sourceUrl: award.vendorUrl || award.sourceUrl,
      }
    }

    const item = acc[award.vendor]
    item.recentAwardCount += 1
    item.agencies.add(award.agency)
    item.naics.add(award.naics)

    return acc
  }, {})

  return Object.values(map)
    .map((prime) => ({
      companyName: prime.companyName,
      recentAwardCount: prime.recentAwardCount,
      agenciesWorkedWith: Array.from(prime.agencies).join(', '),
      commonNaics: Array.from(prime.naics).join(', '),
      sourceUrl: prime.sourceUrl,
    }))
    .sort((a, b) => b.recentAwardCount - a.recentAwardCount)
}
