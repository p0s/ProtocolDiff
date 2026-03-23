import { AnalyzeInput, AnalyzeResult, AnalysisMode, AnalysisRecord, Receipt, BatchEvidenceResult } from '@/lib/types'
import { DemoAdapter } from '@/lib/analysis/demo-adapter'
import { OlasAdapter } from '@/lib/analysis/olas-adapter'
import { MAX_TEXT_PREVIEW } from '@/lib/config'
import { addAnalysis, addReceipt, saveBatchEvidenceSummary } from '@/lib/storage/local'
import { resolveSource } from '@/lib/extraction/source'
import { canPersistServerState } from '@/lib/security/runtime'

export function makeTitle(projectName: string, aLabel: string, bLabel: string) {
  return `${projectName}: ${aLabel} ↔ ${bLabel}`
}

export function buildStoredRecord(input: AnalyzeInput, analysis: AnalyzeResult, receiptId?: string): AnalysisRecord {
  return {
    id: analysis.id,
    title: makeTitle(input.projectName, input.sourceA.label, input.sourceB.label),
    mode: analysis.mode,
    sourceTypeA: input.sourceA.kind,
    sourceTypeB: input.sourceB.kind,
    sourceLabelA: input.sourceA.label,
    sourceLabelB: input.sourceB.label,
    sourceSnapshotA: analysis.sourceA.summary.slice(0, MAX_TEXT_PREVIEW),
    sourceSnapshotB: analysis.sourceB.summary.slice(0, MAX_TEXT_PREVIEW),
    diffSummary: analysis.diff.raw.slice(0, 2000),
    result: analysis.insight,
    createdAt: analysis.createdAt,
    receiptId
  }
}

export function buildReceiptFromAnalysis(input: AnalyzeInput, analysis: AnalyzeResult): Receipt {
  return {
    id: crypto.randomUUID(),
    mode: analysis.mode,
    action: 'analyze',
    command: analysis.meta.command ? analysis.meta.command.split(' ') : undefined,
    sanitizedCommandPreview: analysis.meta.command ?? 'local-diff-only',
    stdout: analysis.rawOutput.slice(0, 12000),
    stderr: analysis.meta.errors.join('\n') || undefined,
    exitCode: analysis.meta.status === 'success' ? 0 : analysis.meta.status === 'partial' ? 1 : 1,
    parsed: analysis.parsedOutput ? (analysis.parsedOutput as unknown as Record<string, unknown>) : undefined,
    success: analysis.meta.status === 'success',
    createdAt: new Date().toISOString(),
    analysisId: analysis.id
  }
}

export async function runAnalysis(input: AnalyzeInput): Promise<{ analysis: AnalysisRecord; receipt: Receipt }> {
  const sourceA = await resolveSource(input.sourceA)
  const sourceB = await resolveSource(input.sourceB)
  const preparedInput: AnalyzeInput = {
    ...input,
    sourceA: { ...input.sourceA, value: sourceA },
    sourceB: { ...input.sourceB, value: sourceB }
  }

  const adapter = input.mode === 'real' ? new OlasAdapter() : new DemoAdapter()
  const result = await adapter.analyze(preparedInput)

  const receipt = buildReceiptFromAnalysis(preparedInput, result)
  const record = buildStoredRecord(preparedInput, result, receipt.id)

  if (canPersistServerState()) {
    await addReceipt(receipt)
    await addAnalysis(record)
  }

  return { analysis: record, receipt }
}

export async function runBatchEvidence(inputs: AnalyzeInput[]): Promise<BatchEvidenceResult> {
  const adapter = new OlasAdapter()
  const records = [] as Array<{ run: number; analysisId?: string; label: string; success: boolean; error?: string }>

  for (const [run, input] of inputs.entries()) {
    try {
      const sourceA = await resolveSource(input.sourceA)
      const sourceB = await resolveSource(input.sourceB)
      const preparedInput: AnalyzeInput = {
        ...input,
        sourceA: { ...input.sourceA, value: sourceA },
        sourceB: { ...input.sourceB, value: sourceB }
      }
      const result = await adapter.analyze(preparedInput)
      const receipt = buildReceiptFromAnalysis(preparedInput, result)
      receipt.action = 'batch-evidence'
      await addReceipt(receipt)
      const record = buildStoredRecord(preparedInput, result, receipt.id)
      await addAnalysis(record)
      records.push({
        run: run + 1,
        analysisId: record.id,
        label: `${preparedInput.sourceA.label} vs ${preparedInput.sourceB.label}`,
        success: result.meta.status !== 'failed'
      })
    } catch (error: unknown) {
      records.push({
        run: run + 1,
        label: `${input.sourceA.label} vs ${input.sourceB.label}`,
        success: false,
        error: `${error}`
      })
    }
  }

  const summary = {
    total: inputs.length,
    successCount: records.filter((record) => record.success).length,
    failureCount: records.filter((record) => !record.success).length,
    records
  }
  await saveBatchEvidenceSummary(summary)
  return summary
}

export function isRealMode(mode?: string | null): mode is AnalysisMode {
  return mode === 'real'
}

export { MAX_TEXT_PREVIEW }
