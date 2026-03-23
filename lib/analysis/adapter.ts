import { AnalyzeInput, AnalyzeResult, AnalysisStatus, MechSummary } from '@/lib/types'

export interface AnalysisAdapter {
  getStatus(): Promise<AnalysisStatus>
  listMechs?(): Promise<MechSummary[]>
  analyze(input: AnalyzeInput): Promise<AnalyzeResult>
  runBatchEvidence?(inputs: AnalyzeInput[]): Promise<{
    total: number
    successCount: number
    failureCount: number
    records: {
      run: number
      analysisId?: string
      label: string
      success: boolean
      error?: string
    }[]
  }>
}
