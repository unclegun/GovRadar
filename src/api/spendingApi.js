import { mockAwards } from '../data/mockAwards.js'
import { mockAgencies } from '../data/mockAgencies.js'
import { mockVendors } from '../data/mockVendors.js'

export const isMockMode = true

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomDelay() {
  return delay(350 + Math.random() * 450)
}

/**
 * Search awards from USASpending.gov (mock mode)
 * In live mode: https://api.usaspending.gov/api/v2/search/spending_by_award/
 * @param {Object} params - {keyword, agency, naics, page}
 */
export async function searchAwards(params = {}) {
  await randomDelay()

  const { keyword = '', agency = '', naics = '', page = 1 } = params
  const pageSize = 10

  let results = [...mockAwards]

  if (keyword) {
    const kw = keyword.toLowerCase()
    results = results.filter(
      (a) =>
        a.title.toLowerCase().includes(kw) ||
        a.description.toLowerCase().includes(kw) ||
        a.vendor.toLowerCase().includes(kw)
    )
  }

  if (agency) {
    results = results.filter((a) =>
      a.agency.toLowerCase().includes(agency.toLowerCase())
    )
  }

  if (naics) {
    results = results.filter((a) => a.naics.startsWith(naics))
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

/**
 * Get agency spending summary by keyword
 * In live mode: https://api.usaspending.gov/api/v2/agency/
 * @param {string} keyword
 */
export async function getAgencySummary(keyword = '') {
  await randomDelay()

  let agencies = [...mockAgencies]

  if (keyword) {
    const kw = keyword.toLowerCase()
    agencies = agencies.filter(
      (a) =>
        a.name.toLowerCase().includes(kw) ||
        a.shortName.toLowerCase().includes(kw) ||
        a.description.toLowerCase().includes(kw)
    )
  }

  return agencies.map((a) => ({
    ...a,
    // Simulate award data correlation
    recentSpend: a.budget * 0.15,
  }))
}

/**
 * Get vendors by agency
 * In live mode: uses USASpending recipient endpoints
 * @param {string} agencyShortName
 */
export async function getVendorsByAgency(agencyShortName = '') {
  await randomDelay()

  let vendors = [...mockVendors]

  if (agencyShortName) {
    vendors = vendors.filter((v) =>
      v.agencies.some((a) => a.toLowerCase().includes(agencyShortName.toLowerCase()))
    )
  }

  return vendors
}
