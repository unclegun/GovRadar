import { mockOpportunities } from '../data/mockOpportunities'

function toNumber(value) {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return null
  const normalized = Number(value.replace(/[$,]/g, ''))
  return Number.isFinite(normalized) ? normalized : null
}

function formatSamDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

function resolveSamUrl(record) {
  if (record.uiLink?.startsWith('http')) return record.uiLink
  if (record.uiLink) return `https://sam.gov${record.uiLink}`
  const noticeId = record.noticeId || record.id
  if (noticeId) return `https://sam.gov/opp/${noticeId}/view`
  return 'https://sam.gov/opportunities'
}

function normalizeOpportunity(record) {
  return {
    id: record.noticeId || record.id,
    title: record.title || 'Untitled Opportunity',
    agency: record.fullParentPathName || record.agency || 'Unknown Agency',
    postedDate: record.postedDate || record.postedDateTime,
    dueDate: record.responseDeadLine || record.dueDate,
    naics: record.naicsCode || record.naics || 'N/A',
    setAside: record.typeOfSetAsideDescription || record.setAside || 'N/A',
    estimatedValue: toNumber(record.estimatedValue),
    description: record.description || record.additionalInfo || 'No summary available.',
    url: resolveSamUrl(record),
  }
}

function searchMockOpportunities(filters) {
  const keyword = filters.keyword.toLowerCase().trim()

  return mockOpportunities.filter((item) => {
    const matchesKeyword =
      !keyword ||
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)

    const matchesAgency = !filters.agency || item.agency === filters.agency
    const matchesNaics = !filters.naics || item.naics === filters.naics
    const matchesSetAside = !filters.setAside || item.setAside === filters.setAside

    const matchesPostedDate = !filters.postedAfter || new Date(item.postedDate) >= new Date(filters.postedAfter)

    return (
      matchesKeyword &&
      matchesAgency &&
      matchesNaics &&
      matchesSetAside &&
      matchesPostedDate
    )
  })
}

async function searchLiveOpportunities(filters) {
  const params = new URLSearchParams()
  const apiKey = import.meta.env.VITE_SAM_API_KEY
  if (apiKey) params.set('api_key', apiKey)
  params.set('q', filters.keyword || '')
  params.set('limit', '120')

  // SAM requires postedFrom and postedTo for this endpoint.
  const today = new Date()
  const ninetyDaysAgo = new Date(today)
  ninetyDaysAgo.setDate(today.getDate() - 90)

  const postedFrom = formatSamDate(filters.postedAfter || ninetyDaysAgo)
  const postedTo = formatSamDate(today)
  if (postedFrom && postedTo) {
    params.set('postedFrom', postedFrom)
    params.set('postedTo', postedTo)
  }

  const response = await fetch(`https://api.sam.gov/prod/opportunities/v2/search?${params.toString()}`)
  if (!response.ok) {
    const suffix = apiKey ? '' : ' Add VITE_SAM_API_KEY in .env for broader access.'
    throw new Error(`SAM.gov request failed (${response.status}).${suffix}`)
  }

  const payload = await response.json()
  const records = payload.opportunitiesData || payload.data || []

  const normalized = records.map(normalizeOpportunity)
  return normalized.filter((item) => {
    const matchesAgency = !filters.agency || item.agency === filters.agency
    const matchesNaics = !filters.naics || item.naics === filters.naics
    const matchesSetAside = !filters.setAside || item.setAside === filters.setAside
    const matchesPostedDate =
      !filters.postedAfter ||
      (item.postedDate && new Date(item.postedDate) >= new Date(filters.postedAfter))

    return matchesAgency && matchesNaics && matchesSetAside && matchesPostedDate
  })
}

export async function searchOpportunities(filters, useMock = true) {
  if (useMock) {
    await new Promise((resolve) => setTimeout(resolve, 550))
    return searchMockOpportunities(filters).map(normalizeOpportunity)
  }

  return searchLiveOpportunities(filters)
}
