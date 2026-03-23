import * as cheerio from 'cheerio'

export function normalizeText(input: string): string {
  return (input ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]*\n[ \t]*/g, '\n')
    .replace(/[\t ]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function stripNoise(raw: string) {
  return raw
    .replace(/\s+from\s+\w+/gi, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export async function extractTextFromUrl(url: string): Promise<string> {
  const parsed = new URL(url)
  const response = await fetch(parsed.toString())
  if (!response.ok) {
    throw new Error(`Unable to fetch URL: ${response.status} ${response.statusText}`)
  }

  const html = await response.text()
  const $ = cheerio.load(html)

  $('script, style, noscript, header, footer, nav, aside').remove()
  const text = $('body').text()
  return normalizeText(stripNoise(text))
}

export async function resolveSource(input: { kind: 'url' | 'text'; value: string }): Promise<string> {
  if (input.kind === 'url') return extractTextFromUrl(input.value)
  return normalizeText(input.value)
}
