/**
 * Score an opportunity against a business profile
 * @param {Object} opportunity
 * @param {Object} profile
 * @returns {{ total: number, breakdown: Object, positives: string[], warnings: string[] }}
 */
export function scoreOpportunity(opportunity, profile) {
  const breakdown = {
    keyword: 0,
    agency: 0,
    naics: 0,
    setAside: 0,
    size: 0,
    techStack: 0,
    excluded: 0,
  }
  const positives = []
  const warnings = []

  const titleDesc = `${opportunity.title} ${opportunity.description}`.toLowerCase()

  // Keyword match (0-30)
  const profileKeywords = profile.keywords || []
  if (profileKeywords.length > 0) {
    const matchedKeywords = profileKeywords.filter((kw) =>
      titleDesc.includes(kw.toLowerCase())
    )
    const ratio = matchedKeywords.length / profileKeywords.length
    breakdown.keyword = Math.round(ratio * 30)
    if (matchedKeywords.length > 0) {
      positives.push(`Matched ${matchedKeywords.length} of ${profileKeywords.length} keywords: ${matchedKeywords.slice(0, 3).join(', ')}`)
    }
  } else {
    breakdown.keyword = 15 // neutral if no keywords set
  }

  // Agency match (0-20)
  const preferredAgencies = profile.preferredAgencies || []
  if (preferredAgencies.length > 0) {
    const isPreferred = preferredAgencies.some((a) =>
      opportunity.agency.toLowerCase().includes(a.toLowerCase())
    )
    if (isPreferred) {
      breakdown.agency = 20
      positives.push(`Agency "${opportunity.agency}" is in your preferred agency list`)
    } else {
      breakdown.agency = 5
    }
  } else {
    breakdown.agency = 10 // neutral
  }

  // NAICS match (0-15)
  const naicsCodes = profile.naicsCodes || []
  if (naicsCodes.length > 0) {
    const isNaicsMatch = naicsCodes.some((n) =>
      opportunity.naics.startsWith(n) || n.startsWith(opportunity.naics.slice(0, 4))
    )
    if (isNaicsMatch) {
      breakdown.naics = 15
      positives.push(`NAICS ${opportunity.naics} matches your registered NAICS codes`)
    } else {
      breakdown.naics = 0
      warnings.push(`NAICS ${opportunity.naics} does not match your registered codes`)
    }
  } else {
    breakdown.naics = 7 // neutral
  }

  // Set-aside match (0-15)
  const certifications = profile.certifications || []
  if (certifications.length > 0 && opportunity.setAside !== 'Unrestricted') {
    const isMatch = certifications.some((cert) =>
      opportunity.setAside.toLowerCase().includes(cert.toLowerCase()) ||
      cert.toLowerCase().includes(opportunity.setAside.toLowerCase())
    )
    if (isMatch) {
      breakdown.setAside = 15
      positives.push(`Set-aside "${opportunity.setAside}" matches your certifications`)
    } else if (opportunity.setAside === 'Small Business') {
      breakdown.setAside = 8
    } else {
      breakdown.setAside = 0
      warnings.push(`Set-aside "${opportunity.setAside}" does not match your certifications`)
    }
  } else if (opportunity.setAside === 'Unrestricted') {
    breakdown.setAside = 8
  } else {
    breakdown.setAside = 10 // neutral
  }

  // Size fit (0-10)
  const minSize = profile.contractSizeMin || 0
  const maxSize = profile.contractSizeMax || Infinity
  const value = opportunity.estimatedValue || 0
  if (value >= minSize && value <= maxSize) {
    breakdown.size = 10
    positives.push(`Contract value ${formatCurrencyShort(value)} fits your target range`)
  } else if (value < minSize) {
    breakdown.size = 3
    warnings.push(`Contract value ${formatCurrencyShort(value)} is below your minimum ($${(minSize / 1000).toFixed(0)}K)`)
  } else {
    breakdown.size = 3
    warnings.push(`Contract value ${formatCurrencyShort(value)} exceeds your maximum range`)
  }

  // Tech stack match (0-10)
  const techKeywords = profile.techKeywords || []
  if (techKeywords.length > 0) {
    const matchedTech = techKeywords.filter((t) =>
      titleDesc.includes(t.toLowerCase())
    )
    const ratio = matchedTech.length / techKeywords.length
    breakdown.techStack = Math.round(ratio * 10)
    if (matchedTech.length > 0) {
      positives.push(`Tech matches: ${matchedTech.slice(0, 3).join(', ')}`)
    }
  } else {
    breakdown.techStack = 5 // neutral
  }

  // Excluded keywords penalty (-25 to 0)
  const excludedKeywords = profile.excludedKeywords || []
  if (excludedKeywords.length > 0) {
    const matchedExclusions = excludedKeywords.filter((ex) =>
      titleDesc.includes(ex.toLowerCase())
    )
    if (matchedExclusions.length > 0) {
      breakdown.excluded = -25
      warnings.push(`Contains excluded keywords: ${matchedExclusions.join(', ')}`)
    }
  }

  const rawTotal =
    breakdown.keyword +
    breakdown.agency +
    breakdown.naics +
    breakdown.setAside +
    breakdown.size +
    breakdown.techStack +
    breakdown.excluded

  const total = Math.max(0, Math.min(100, rawTotal))

  return { total, breakdown, positives, warnings }
}

function formatCurrencyShort(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}
