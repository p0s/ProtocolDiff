import type { SourceKind } from '@/lib/types'
import type { Receipt, AnalysisRecord } from '@/lib/types'

export const DEFAULT_CHAIN_CONFIG = process.env.MECH_CHAIN_CONFIG ?? 'gnosis'

export const MODELS = {
  projectName: 'ProtocolDiff',
  defaultMode: process.env.NEXT_PUBLIC_DEFAULT_MODE === 'real' ? 'real' : 'demo'
} as const

export const EXAMPLES = [
  {
    labelA: 'Protocol Docs v1',
    labelB: 'Protocol Docs v2',
    sourceTypeA: 'text',
    sourceTypeB: 'text',
    textA: '# Protocol API v1\n- `create-order` exists\n- Limit: 1000 req/day\n- Slippage limit defaults to 0.5%',
    textB: '# Protocol API v2\n- `create-order` removed\n- `submit-order` added\n- Limit: 1200 req/day\n- Slippage defaults to 1%'
  },
  {
    labelA: 'Governance draft',
    labelB: 'Governance final',
    sourceTypeA: 'text',
    sourceTypeB: 'text',
    textA: 'Quorum requires 33% of voting power and a 7 day delay.',
    textB: 'Quorum requires 35% of voting power and a 5 day delay.'
  },
  {
    labelA: 'Release notes old',
    labelB: 'Release notes new',
    sourceTypeA: 'text',
    sourceTypeB: 'text',
    textA: 'Agent rewards paid weekly. No on-chain attestations yet.',
    textB: 'Agent rewards paid daily. On-chain attestations enabled for payouts.'
  }
] satisfies Array<{
  labelA: string
  labelB: string
  sourceTypeA: SourceKind
  sourceTypeB: SourceKind
  textA: string
  textB: string
}>

export const BATCH_EXAMPLES = [
  {
    sourceA: {
      label: 'docs-intro-v1',
      kind: 'text',
      value: 'Protocol supports deposits, withdrawals, and a 14-day unbonding window. Governance controls fees.'
    },
    sourceB: {
      label: 'docs-intro-v2',
      kind: 'text',
      value: 'Protocol supports deposits, withdrawals, and a 10-day unbonding window. Governance controls fees and token economics.'
    }
  },
  {
    sourceA: {
      label: 'release-notes-v1',
      kind: 'text',
      value: 'Feature: API keys are optional. Quorum threshold is 2/3.'
    },
    sourceB: {
      label: 'release-notes-v2',
      kind: 'text',
      value: 'Feature: API keys required for admin actions. Quorum threshold is 60%.'
    }
  },
  {
    sourceA: {
      label: 'governance-old',
      kind: 'text',
      value: 'Proposal execution delay: 6 hours. Minimum stake: 1,000.'
    },
    sourceB: {
      label: 'governance-new',
      kind: 'text',
      value: 'Proposal execution delay: 8 hours. Minimum stake: 1,200.'
    }
  },
  {
    sourceA: {
      label: 'api-guide-v1',
      kind: 'text',
      value: 'GET /v1/status returns heartbeat only when authenticated.'
    },
    sourceB: {
      label: 'api-guide-v2',
      kind: 'text',
      value: 'GET /v1/status returns heartbeat and health score when authenticated.'
    }
  },
  {
    sourceA: {
      label: 'faq-v1',
      kind: 'text',
      value: 'Upgrades are handled weekly. Withdrawals may be delayed by network congestion.'
    },
    sourceB: {
      label: 'faq-v2',
      kind: 'text',
      value: 'Upgrades are handled monthly. Withdrawals may be delayed by network maintenance windows.'
    }
  },
  {
    sourceA: {
      label: 'roadmap-v1',
      kind: 'text',
      value: 'Phase 1: testnet launch. Phase 2: governance migration.'
    },
    sourceB: {
      label: 'roadmap-v2',
      kind: 'text',
      value: 'Phase 1: testnet launch. Phase 2: governance migration. Phase 3: audit-ready release.'
    }
  },
  {
    sourceA: {
      label: 'terms-v1',
      kind: 'text',
      value: 'Users must keep keys secure. SLA uptime 99%.'
    },
    sourceB: {
      label: 'terms-v2',
      kind: 'text',
      value: 'Users must keep keys secure. SLA uptime 99.5%.'
    }
  },
  {
    sourceA: {
      label: 'integration-v1',
      kind: 'text',
      value: 'Integration: endpoint /integrate/v1, retry window 1s.'
    },
    sourceB: {
      label: 'integration-v2',
      kind: 'text',
      value: 'Integration: endpoint /integrate/v2, retry window 2s. New retry header added.'
    }
  },
  {
    sourceA: {
      label: 'tokenomics-v1',
      kind: 'text',
      value: 'Mint inflation 2% annually. Validator collateral 2,500.'
    },
    sourceB: {
      label: 'tokenomics-v2',
      kind: 'text',
      value: 'Mint inflation 2.2% annually. Validator collateral 2,800.'
    }
  },
  {
    sourceA: {
      label: 'release-old',
      kind: 'text',
      value: 'No offchain fallback. Only API key auth supported.'
    },
    sourceB: {
      label: 'release-new',
      kind: 'text',
      value: 'Added offchain fallback for retries. API key auth and address allowlist supported.'
    }
  }
] satisfies Array<{
  sourceA: {
    label: string
    kind: SourceKind
    value: string
  }
  sourceB: {
    label: string
    kind: SourceKind
    value: string
  }
}>

export const MAX_TEXT_PREVIEW = 1200
export const MAX_SOURCE_TEXT = 3600

export const PUBLIC_PROOF_RECEIPTS: Receipt[] = [
  {
    id: 'public-proof-1',
    mode: 'real',
    action: 'batch-evidence',
    sanitizedCommandPreview: 'mechx --client-mode request ... --chain-config gnosis --tools openai-gpt-4',
    stdout: 'Transaction submitted: https://gnosisscan.io/tx/0x414f0d62de8d073e80026204803191c4967381b0586091e14ff0c87bdf4a5e56',
    success: true,
    createdAt: '2026-03-23T06:08:18.862Z',
    analysisId: 'dac06972-feef-4e38-a9aa-5fb1ef1e0ed5'
  },
  {
    id: 'public-proof-2',
    mode: 'real',
    action: 'batch-evidence',
    sanitizedCommandPreview: 'mechx --client-mode request ... --chain-config gnosis --tools openai-gpt-4',
    stdout: 'Transaction submitted: https://gnosisscan.io/tx/0x169f6b7da0be94e8e4fd775334a72b43d6e9e7a26ba1ad51e5d62d6f4df2c415',
    success: true,
    createdAt: '2026-03-23T06:08:18.862Z',
    analysisId: 'cca187b3-0a63-46ff-bee6-dfb59409564d'
  },
  {
    id: 'public-proof-3',
    mode: 'real',
    action: 'batch-evidence',
    sanitizedCommandPreview: 'mechx --client-mode request ... --chain-config gnosis --tools openai-gpt-4',
    stdout: 'Transaction submitted: https://gnosisscan.io/tx/0xb1cd9c681ca89e9ef33a32a487dcff868f4fc581ee1de277d9b6161bb1c581cd',
    success: true,
    createdAt: '2026-03-23T06:08:18.862Z',
    analysisId: '84193062-978a-4301-87da-09b98d38fa29'
  }
]

export const PUBLIC_ANALYSIS_EXAMPLES: AnalysisRecord[] = EXAMPLES.map((example, index) => ({
  id: `example-${index + 1}`,
  title: `Example ${index + 1}: ${example.labelA} ↔ ${example.labelB}`,
  mode: 'demo',
  sourceTypeA: example.sourceTypeA,
  sourceTypeB: example.sourceTypeB,
  sourceLabelA: example.labelA,
  sourceLabelB: example.labelB,
  sourceSnapshotA: example.textA,
  sourceSnapshotB: example.textB,
  diffSummary: `${example.textA}\n\n${example.textB}`,
  result: {
    summary: 'Public demo deployment hides server-local history, so seeded examples are shown here by default.',
    breakingChanges: ['Compare workspace can regenerate a fresh analysis instantly.'],
    newCapabilities: ['These examples make the history view navigable on the public demo.'],
    migrationActions: ['Open the compare workspace and run the example again for a live result.'],
    riskScore: 3,
    evidence: [`Example ${index + 1} is bundled for the public demo experience.`]
  },
  createdAt: new Date(Date.UTC(2026, 2, 20 + index, 12, 0, 0)).toISOString(),
  receiptId: undefined
}))
