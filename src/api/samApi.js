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

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const agencyAliases = {
  gsa: ['general services administration', 'gsa'],
  epa: ['environmental protection agency', 'epa'],
  hud: ['department of housing and urban development', 'hud'],
  faa: ['federal aviation administration', 'faa'],
  noaa: ['national oceanic and atmospheric administration', 'noaa'],
  irs: ['internal revenue service', 'irs'],
  usda: ['department of agriculture', 'usda'],
}

function getSelectedAgencies(filters) {
  if (Array.isArray(filters.agencies)) return filters.agencies.filter(Boolean)
  if (filters.agency) return [filters.agency]
  return []
}

function singleAgencyMatch(itemAgency, selectedAgency) {
  const normalizedItem = normalizeText(itemAgency)
  const normalizedSelected = normalizeText(selectedAgency)
  const aliases = agencyAliases[normalizedSelected] || [normalizedSelected]

  return aliases.some((alias) => {
    const candidate = normalizeText(alias)
    if (!candidate) return false
    return normalizedItem === candidate || normalizedItem.includes(candidate)
  })
}

function matchesAgencies(itemAgency, filters) {
  const selectedAgencies = getSelectedAgencies(filters)
  if (!selectedAgencies.length) return true
  return selectedAgencies.some((selectedAgency) => singleAgencyMatch(itemAgency, selectedAgency))
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
    const matchesAgency = matchesAgencies(item.agency, filters)
    const matchesNaics = !filters.naics || item.naics === filters.naics
    const matchesSetAside = !filters.setAside || item.setAside === filters.setAside
    const matchesPostedDate =
      !filters.postedAfter ||
      (item.postedDate && new Date(item.postedDate) >= new Date(filters.postedAfter))

    return matchesAgency && matchesNaics && matchesSetAside && matchesPostedDate
  })
}

export async function searchOpportunities(filters) {
  return searchLiveOpportunities(filters)
}
