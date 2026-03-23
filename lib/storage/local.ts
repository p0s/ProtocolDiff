import fs from 'node:fs/promises'
import path from 'node:path'
import { AnalysisMode, AnalysisRecord, OlasConfig, Receipt } from '@/lib/types'
import { DEFAULT_CHAIN_CONFIG, MODELS } from '@/lib/config'

const DATA_DIR = path.join(process.cwd(), '.local')
const STATE_PATH = path.join(DATA_DIR, 'state.json')
const EVIDENCE_DIR = path.join(process.cwd(), '.secrets', 'submission', 'evidence')

interface AppState {
  runtimeMode: AnalysisMode
  analyses: AnalysisRecord[]
  receipts: Receipt[]
  olasConfig: OlasConfig
}

const DEFAULT_STATE: AppState = {
  runtimeMode: MODELS.defaultMode,
  analyses: [],
  receipts: [],
  olasConfig: {
    chainConfig: DEFAULT_CHAIN_CONFIG,
    mechAddress: process.env.MECH_PRIORITY_ADDRESS || '',
    toolName: process.env.MECH_TOOL_NAME || '',
    useOffchain: process.env.MECH_USE_OFFCHAIN !== 'false'
  }
}

async function readState(): Promise<AppState> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const raw = await fs.readFile(STATE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as AppState
    return {
      runtimeMode: parsed.runtimeMode ?? DEFAULT_STATE.runtimeMode,
      analyses: Array.isArray(parsed.analyses) ? parsed.analyses : [],
      receipts: Array.isArray(parsed.receipts) ? parsed.receipts : [],
      olasConfig: { ...DEFAULT_STATE.olasConfig, ...(parsed.olasConfig || {}) }
    }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

async function writeState(state: AppState) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2), 'utf8')
}

export async function getRuntimeMode(): Promise<AnalysisMode> {
  const state = await readState()
  return state.runtimeMode
}

export async function setRuntimeMode(mode: AnalysisMode): Promise<void> {
  const state = await readState()
  state.runtimeMode = mode
  await writeState(state)
}

export async function getOlasConfig() {
  const state = await readState()
  return state.olasConfig
}

export async function setOlasConfig(config: OlasConfig): Promise<void> {
  const state = await readState()
  state.olasConfig = config
  await writeState(state)
}

export async function addAnalysis(record: AnalysisRecord): Promise<AnalysisRecord> {
  const state = await readState()
  state.analyses.unshift(record)
  state.analyses = state.analyses.slice(0, 200)
  await writeState(state)
  return record
}

export async function getAnalysis(id: string): Promise<AnalysisRecord | undefined> {
  const state = await readState()
  return state.analyses.find((entry) => entry.id === id)
}

export async function listAnalyses(limit = 50): Promise<AnalysisRecord[]> {
  const state = await readState()
  return state.analyses.slice(0, limit)
}

export async function addReceipt(receipt: Receipt): Promise<Receipt> {
  const state = await readState()
  state.receipts.unshift(receipt)
  state.receipts = state.receipts.slice(0, 300)
  await writeState(state)
  return receipt
}

export async function listReceipts(limit = 80): Promise<Receipt[]> {
  const state = await readState()
  return state.receipts.slice(0, limit)
}

export async function getReceipt(id: string): Promise<Receipt | undefined> {
  const state = await readState()
  return state.receipts.find((entry) => entry.id === id)
}

export async function saveBatchEvidenceSummary(summary: unknown) {
  await fs.mkdir(EVIDENCE_DIR, { recursive: true })
  await fs.writeFile(path.join(EVIDENCE_DIR, 'olas-batch-summary.json'), JSON.stringify(summary, null, 2), 'utf8')
}
