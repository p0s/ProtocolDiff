import { AnalyzeInput, AnalyzeResult, DemoInsight } from '@/lib/types'
import { AnalysisAdapter } from '@/lib/analysis/adapter'
import { buildStructuredDiff } from '@/lib/diff/structured'
import { normalizeText } from '@/lib/extraction/source'

function chunkText(input: string, max = 2800) {
  return normalizeText(input).slice(0, max)
}

function summarizeSections(lines: string[]) {
  const headings = lines.filter((line) => /^#+\s+/.test(line)).slice(0, 6)
  if (headings.length) return headings

  return lines
    .filter((line) => line.length > 6)
    .slice(0, 6)
}

function deterministicRiskScore(changedLines: number, numericCount: number) {
  const base = 1 + Math.min(9, Math.round((changedLines + numericCount * 0.8) / 2))
  return Math.min(10, Math.max(1, base))
}

function scoreToBand(riskScore: number) {
  if (riskScore <= 3) return 'Low'
  if (riskScore <= 6) return 'Moderate'
  return 'High'
}

function buildDemoInsight(
  left: string,
  right: string,
  diff: ReturnType<typeof buildStructuredDiff>
): DemoInsight {
  const leftLines = normalizeText(left).split('\n')
  const rightLines = normalizeText(right).split('\n')

  const addedHeadings = summarizeSections(diff.addedSections)
  const removedHeadings = summarizeSections(diff.removedSections)

  const riskScore = deterministicRiskScore(diff.changedLines, diff.numericChanges.length)

  const summary =
    `Compared ${leftLines.length} and ${rightLines.length} lines. Risk band: ${scoreToBand(riskScore)}.`

  return {
    summary,
    breakingChanges: removedHeadings.length
      ? removedHeadings.map((line) => `Removed or changed section: ${line}`)
      : ['No explicit removals detected in major sections.'],
    newCapabilities: addedHeadings.length
      ? addedHeadings.map((line) => `Potential new capability: ${line}`)
      : ['No clear additions detected.'],
    migrationActions: [
      'Validate each changed parameter against staging.',
      'Run a second pass for changed numeric values.',
      'Gate rollout until critical diffs are reviewed manually.'
    ],
    riskScore: Math.min(5, Math.max(1, Math.round((riskScore + 1) / 2))),
    evidence: [
      `Changed lines: ${diff.changedLines}`,
      `Numeric candidates: ${diff.numericChanges.length}`,
      `Added chunks: ${diff.addedSections.length}`,
      `Removed chunks: ${diff.removedSections.length}`
    ]
  }
}

export class DemoAdapter implements AnalysisAdapter {
  async getStatus() {
    return {
      configured: true,
      mechxInstalled: false,
      privateKeyConfigured: false,
      missing: []
    }
  }

  async analyze(input: AnalyzeInput): Promise<AnalyzeResult> {
    const sourceA = chunkText(input.sourceA.value)
    const sourceB = chunkText(input.sourceB.value)
    const structured = buildStructuredDiff(sourceA, sourceB)
    const insight = buildDemoInsight(sourceA, sourceB, structured)

    return {
      id: crypto.randomUUID(),
      mode: 'demo',
      createdAt: new Date().toISOString(),
      projectName: input.projectName,
      sourceA: { label: input.sourceA.label, summary: sourceA.slice(0, 1600) },
      sourceB: { label: input.sourceB.label, summary: sourceB.slice(0, 1600) },
      diff: structured,
      insight,
      rawOutput: JSON.stringify(insight),
      meta: {
        status: 'success',
        errors: []
      }
    }
  }
}
