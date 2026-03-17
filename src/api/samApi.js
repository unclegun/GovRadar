import { mockOpportunities } from '../data/mockOpportunities.js'

export const isMockMode = true

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomDelay() {
  return delay(400 + Math.random() * 400)
}

function normalizeOpportunity(opp) {
  return {
    id: opp.id,
    title: opp.title,
    agency: opp.agency,
    naics: opp.naics,
    postedDate: opp.postedDate,
    dueDate: opp.dueDate,
    setAside: opp.setAside,
    contractType: opp.contractType,
    estimatedValue: opp.estimatedValue,
    description: opp.description,
    solicitationNumber: opp.solicitationNumber,
    location: opp.location,
    placeOfPerformance: opp.placeOfPerformance,
    samUrl: opp.samUrl,
    status: opp.status,
    keywords: opp.keywords || [],
  }
}

/**
 * Search opportunities from SAM.gov (mock mode)
 * In live mode, this would call: https://api.sam.gov/opportunities/v2/search
 * @param {Object} params - {keyword, agency, naics, setAside, postedAfter, page}
 * @returns {Promise<{results: Array, total: number, page: number, hasMore: boolean}>}
 */
export async function searchOpportunities(params = {}) {
  await randomDelay()

  const { keyword = '', agency = '', naics = '', setAside = '', postedAfter = '', page = 1 } = params
  const pageSize = 10

  let results = mockOpportunities.map(normalizeOpportunity)

  if (keyword) {
    const kw = keyword.toLowerCase()
    results = results.filter(
      (opp) =>
        opp.title.toLowerCase().includes(kw) ||
        opp.description.toLowerCase().includes(kw) ||
        opp.keywords.some((k) => k.toLowerCase().includes(kw))
    )
  }

  if (agency) {
    results = results.filter((opp) =>
      opp.agency.toLowerCase().includes(agency.toLowerCase())
    )
  }

  if (naics) {
    results = results.filter((opp) => opp.naics.startsWith(naics))
  }

  if (setAside) {
    results = results.filter((opp) => opp.setAside === setAside)
  }

  if (postedAfter) {
    const after = new Date(postedAfter)
    results = results.filter((opp) => new Date(opp.postedDate) >= after)
  }

  const total = results.length
  const start = (page - 1) * pageSize
  const paged = results.slice(start, start + pageSize)

  return {
    results: paged,
    total,
    page,
    hasMore: start + pageSize < total,
  }
}
