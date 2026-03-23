import { DemoInsight } from '@/lib/types'

function stripCodeFences(input: string): string {
  const trimmed = input.trim()
  const match = trimmed.match(/^```[\s\S]*?\n([\s\S]*?)```$/)
  if (!match) return trimmed
  return match[1].trim()
}

function normalizeArray(values: unknown): string[] {
  if (!Array.isArray(values)) return []
  return values
    .filter((value) => typeof value === 'string')
    .map((value) => `${value}`)
    .filter(Boolean)
}

function clampRisk(value: unknown): number {
  const parsed = Number(value)
  if (Number.isNaN(parsed)) return 5
  return Math.min(5, Math.max(1, Math.round(parsed)))
}

export function parseOlasOutput(raw: string): DemoInsight | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(stripCodeFences(raw)) as DemoInsight
    const summary = parsed?.summary
    const riskScore = clampRisk(parsed?.riskScore)
    if (!summary || typeof summary !== 'string') return null

    return {
      summary: summary.trim(),
      breakingChanges: normalizeArray(parsed.breakingChanges),
      newCapabilities: normalizeArray(parsed.newCapabilities),
      migrationActions: normalizeArray(parsed.migrationActions),
      riskScore,
      evidence: normalizeArray(parsed.evidence)
    }
  } catch {
    const sections = raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const extractGroup = (keyword: string) =>
      sections
        .filter((line) => line.toLowerCase().includes(keyword.toLowerCase()))
        .map((line) => line.replace(/^[-*\d.\s]*/, '').trim())

    const summaryLine =
      sections.find((line) => /^summary/i.test(line))?.replace(/^summary\s*[:=-]\s*/i, '') ||
      (sections[0] ?? 'Parsed from non-JSON output.')

    const riskMatch = sections.find((line) => /risk/i.test(line))?.replace(/\D+/g, '')

    return {
      summary: summaryLine,
      breakingChanges: extractGroup('breaking'),
      newCapabilities: extractGroup('capability'),
      migrationActions: extractGroup('action'),
      riskScore: riskMatch ? clampRisk(Number(riskMatch)) : 5,
      evidence: sections.filter((line) => /evidence|snippet|line/i.test(line))
    }
  }
}
