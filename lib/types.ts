export type AnalysisMode = 'demo' | 'real'
export type SourceKind = 'url' | 'text'

export interface SourceInput {
  label: string
  kind: SourceKind
  value: string
}

export interface AnalyzeInput {
  sourceA: SourceInput
  sourceB: SourceInput
  projectName: string
  mode: AnalysisMode
  chainConfig?: string
  preferredMech?: string
  preferredTool?: string
  useOffchain?: boolean
}

export interface StructuredDiff {
  changedLines: number
  addedSections: string[]
  removedSections: string[]
  numericChanges: string[]
  raw: string
}

export interface DemoInsight {
  summary: string
  breakingChanges: string[]
  newCapabilities: string[]
  migrationActions: string[]
  riskScore: number
  evidence: string[]
}

export interface AnalyzeResult {
  id: string
  mode: AnalysisMode
  createdAt: string
  projectName: string
  sourceA: { label: string; summary: string }
  sourceB: { label: string; summary: string }
  diff: StructuredDiff
  insight: DemoInsight
  parsedOutput?: DemoInsight
  rawOutput: string
  meta: {
    command?: string
    mechAddress?: string
    tool?: string
    chainConfig?: string
    status: 'success' | 'partial' | 'failed'
    errors: string[]
  }
}

export interface AnalysisRecord {
  id: string
  title: string
  mode: AnalysisMode
  sourceTypeA: SourceKind
  sourceTypeB: SourceKind
  sourceLabelA: string
  sourceLabelB: string
  sourceSnapshotA: string
  sourceSnapshotB: string
  diffSummary: string
  result: {
    summary: string
    breakingChanges: string[]
    newCapabilities: string[]
    migrationActions: string[]
    riskScore: number
    evidence: string[]
  }
  createdAt: string
  receiptId?: string
}

export interface OlasConfig {
  chainConfig: string
  mechAddress: string
  toolName: string
  useOffchain: boolean
}

export interface MechSummary {
  address: string
  name: string
  tools: string[]
}

export interface Receipt {
  id: string
  mode: AnalysisMode
  action: 'analyze' | 'batch-evidence' | 'mech-list'
  command?: string[]
  sanitizedCommandPreview: string
  stdout?: string
  stderr?: string
  exitCode?: number
  parsed?: Record<string, unknown>
  success: boolean
  createdAt: string
  analysisId?: string
}

export interface AnalysisStatus {
  configured: boolean
  mechxInstalled: boolean
  privateKeyConfigured: boolean
  chainConfig?: string
  missing: string[]
}

export interface BatchEvidenceResult {
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
}
