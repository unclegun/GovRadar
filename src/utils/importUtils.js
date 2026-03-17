export async function parseJsonFile(file) {
  const text = await file.text()
  return JSON.parse(text)
}
