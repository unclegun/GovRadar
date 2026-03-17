import { mockAwards } from '../data/mockAwards'

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

export async function getAwardsData({ keyword = '', agency = '' }, useMock = true) {
  const normalizedKeyword = keyword.toLowerCase().trim()

  let records = []

  if (useMock) {
    await new Promise((resolve) => setTimeout(resolve, 450))
    records = mockAwards.map((award) => ({
      ...award,
      sourceUrl: buildSearchUrl(`${award.vendor} ${award.agency}`),
      vendorUrl: buildSearchUrl(award.vendor),
    }))
  } else {
    const response = await fetch('https://api.usaspending.gov/api/v2/search/spending_by_award/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: [
          'Award ID',
          'Recipient Name',
          'Award Amount',
          'Awarding Agency',
          'Description',
          'NAICS Code',
          'Last Modified Date',
        ],
        filters: {
          time_period: [{ start_date: '2024-01-01', end_date: '2026-12-31' }],
          award_type_codes: ['02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        },
        sort: 'Award Amount',
        order: 'desc',
        limit: 120,
        page: 1,
        subawards: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`USAspending request failed (${response.status}).`)
    }

    const payload = await response.json()
    records = (payload.results || []).map(normalizeAward)
  }

  const filtered = records.filter((award) => {
    const matchesKeyword =
      !normalizedKeyword ||
      award.title.toLowerCase().includes(normalizedKeyword) ||
      award.vendor.toLowerCase().includes(normalizedKeyword)

    const matchesAgency = !agency || award.agency === agency
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
