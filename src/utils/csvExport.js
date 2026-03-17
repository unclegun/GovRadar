function toCSV(headers, rows) {
  const escape = (v) => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }
  const headerRow = headers.map(escape).join(',')
  const dataRows = rows.map((row) => headers.map((h) => escape(row[h])).join(','))
  return [headerRow, ...dataRows].join('\n')
}

function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportOpportunitiesToCSV(opportunities) {
  const headers = [
    'title',
    'agency',
    'naics',
    'postedDate',
    'dueDate',
    'setAside',
    'contractType',
    'estimatedValue',
    'solicitationNumber',
    'location',
    'status',
    'samUrl',
  ]
  const csv = toCSV(headers, opportunities)
  downloadCSV(csv, 'opportunities.csv')
}

export function exportPrimesToCSV(primes) {
  const headers = ['name', 'type', 'recentAwardCount', 'agencies', 'specialties', 'totalAwardValue', 'notes']
  const rows = primes.map((p) => ({
    ...p,
    agencies: Array.isArray(p.agencies) ? p.agencies.join('; ') : p.agencies,
    specialties: Array.isArray(p.specialties) ? p.specialties.join('; ') : p.specialties,
  }))
  const csv = toCSV(headers, rows)
  downloadCSV(csv, 'prime_vendors.csv')
}
