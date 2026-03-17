export function downloadBlob(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function exportToCsv(filename, rows) {
  if (!rows.length) {
    downloadBlob(filename, '', 'text/csv;charset=utf-8;')
    return
  }

  const headers = Object.keys(rows[0])
  const csvRows = [headers.join(',')]

  rows.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header] ?? ''
      const escaped = String(value).replace(/"/g, '""')
      return `"${escaped}"`
    })
    csvRows.push(values.join(','))
  })

  downloadBlob(filename, csvRows.join('\n'), 'text/csv;charset=utf-8;')
}

export function exportToJson(filename, data) {
  downloadBlob(filename, JSON.stringify(data, null, 2), 'application/json')
}
