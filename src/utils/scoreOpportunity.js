function includesAny(text = '', keywords = []) {
  const normalized = text.toLowerCase()
  return keywords.filter((keyword) => normalized.includes(keyword.toLowerCase()))
}

export function scoreOpportunity(opportunity, profile) {
  const breakdown = {
    keyword: 0,
    agency: 0,
    naics: 0,
    setAside: 0,
    size: 0,
    tech: 0,
    excludedPenalty: 0,
  }

  const reasons = []
  const warnings = []

  const textBlock = `${opportunity.title} ${opportunity.description}`

  const keywordMatches = includesAny(textBlock, profile.coreKeywords)
  breakdown.keyword = Math.min(25, keywordMatches.length * 5)
  if (keywordMatches.length) {
    reasons.push(`Matched service keywords: ${keywordMatches.join(', ')}`)
  }

  if (profile.preferredAgencies.includes(opportunity.agency)) {
    breakdown.agency = 15
    reasons.push(`Target agency match: ${opportunity.agency}`)
  }

  if (profile.naicsCodes.includes(opportunity.naics)) {
    breakdown.naics = 20
    reasons.push(`NAICS alignment: ${opportunity.naics}`)
  }

  if (profile.certifications.includes(opportunity.setAside)) {
    breakdown.setAside = 12
    reasons.push(`Set-aside alignment: ${opportunity.setAside}`)
  }

  if (
    typeof opportunity.estimatedValue === 'number' &&
    opportunity.estimatedValue >= profile.contractSize.min &&
    opportunity.estimatedValue <= profile.contractSize.max
  ) {
    breakdown.size = 12
    reasons.push('Estimated value is in preferred size range')
  }

  const techMatches = includesAny(textBlock, profile.techStackKeywords)
  breakdown.tech = Math.min(10, techMatches.length * 5)
  if (techMatches.length) {
    reasons.push(`Tech stack keywords present: ${techMatches.join(', ')}`)
  }

  const excluded = includesAny(textBlock, profile.excludedKeywords)
  breakdown.excludedPenalty = excluded.length * 8
  if (excluded.length) {
    warnings.push(`Contains excluded terms: ${excluded.join(', ')}`)
  }

  const scoreRaw =
    breakdown.keyword +
    breakdown.agency +
    breakdown.naics +
    breakdown.setAside +
    breakdown.size +
    breakdown.tech -
    breakdown.excludedPenalty

  const total = Math.max(0, Math.min(100, Math.round(scoreRaw)))

  if (!reasons.length) reasons.push('Limited profile overlap found; review manually.')
  if (total < 45) warnings.push('Low fit score based on current profile preferences.')

  return {
    total,
    breakdown,
    reasons,
    warnings,
  }
}
