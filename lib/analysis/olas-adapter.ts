import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import { parseOlasOutput } from '@/lib/analysis/parser'
import { AnalysisAdapter } from '@/lib/analysis/adapter'
import { AnalyzeInput, AnalyzeResult, AnalysisStatus, MechSummary } from '@/lib/types'
import { buildStructuredDiff } from '@/lib/diff/structured'
import { normalizeText } from '@/lib/extraction/source'
import { buildOlasPrompt } from '@/lib/analysis/prompt'
import { DEFAULT_CHAIN_CONFIG, MAX_SOURCE_TEXT } from '@/lib/config'
import { getOlasConfig } from '@/lib/storage/local'

const execFileAsync = promisify(execFile)
const MECHX_BIN = process.env.MECHX_BIN || 'mechx'
const CLIENT_MODE_ARGS = ['--client-mode']

interface OlasCommandResult {
  stdout: string
  stderr: string
  status: number
}

function getRequestTimeoutMs() {
  const raw = Number(process.env.MECHX_REQUEST_TIMEOUT_MS || 45000)
  return Number.isFinite(raw) && raw > 0 ? raw : 45000
}

function sanitizeArg(arg: string) {
  if (arg.includes('/private/') || arg.includes('/Users/')) {
    return '[redacted-path]'
  }
  if (/^0x[a-fA-F0-9]{40}$/.test(arg)) {
    return `${arg.slice(0, 8)}...${arg.slice(-6)}`
  }
  if (arg.includes(' ')) {
    return `"${arg}"`
  }
  return arg
}

function sanitizeCommand(args: string[]) {
  return args.map((arg, index) => {
    if (index >= 2 && ['/private/', '/Users/'].some((prefix) => arg.includes(prefix))) {
      return '[redacted-path]'
    }
    return sanitizeArg(arg)
  })
}

async function runCommand(command: string, args: string[], timeoutMs?: number): Promise<OlasCommandResult> {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      env: {
        ...process.env,
        PYTHONPATH: process.env.PYTHONPATH
      },
      maxBuffer: 8 * 1024 * 1024,
      timeout: timeoutMs
    })
    return { status: 0, stdout: String(stdout || ''), stderr: String(stderr || '') }
  } catch (error: unknown) {
    const nodeError = error as {
      stdout?: unknown
      stderr?: unknown
      message?: string
      killed?: boolean
    }

    return {
      status: nodeError.killed ? 124 : 1,
      stdout: String(nodeError.stdout || ''),
      stderr: String(nodeError.stderr || nodeError.message || 'Command failed')
    }
  }
}

async function commandExists(): Promise<boolean> {
  if (process.env.MECHX_BIN) {
    try {
      await fs.access(process.env.MECHX_BIN)
      return true
    } catch {
      return false
    }
  }

  const probe = await runCommand(process.platform === 'win32' ? 'where' : 'which', ['mechx'])
  return probe.status === 0 && Boolean(probe.stdout.trim() || probe.stderr.trim())
}

export class OlasAdapter implements AnalysisAdapter {
  private async getConfiguredChain(): Promise<string> {
    const configured = await getOlasConfig()
    return configured.chainConfig || process.env.MECH_CHAIN_CONFIG || DEFAULT_CHAIN_CONFIG
  }

  async getStatus(): Promise<AnalysisStatus> {
    const chainConfig = await this.getConfiguredChain()
    const missing: string[] = []

    const mechxInstalled = await commandExists()
    if (!mechxInstalled) {
      missing.push('Install and expose mechx in PATH.')
    }

    const hasPrivateKey = Boolean(process.env.MECH_PRIVATE_KEY_PATH)
    if (!hasPrivateKey) {
      missing.push('MECH_PRIVATE_KEY_PATH is not set.')
    } else {
      try {
        await fs.access(process.env.MECH_PRIVATE_KEY_PATH as string)
      } catch {
        missing.push('MECH_PRIVATE_KEY_PATH does not point to an existing key file.')
      }
    }

    return {
      configured: mechxInstalled && hasPrivateKey && missing.length === 0,
      mechxInstalled,
      privateKeyConfigured: hasPrivateKey,
      chainConfig,
      missing
    }
  }

  async listMechs(): Promise<MechSummary[]> {
    const chainConfig = await this.getConfiguredChain()
    const result = await runCommand(MECHX_BIN, [...CLIENT_MODE_ARGS, 'mech', 'list', '--chain-config', chainConfig])

    if (result.status !== 0) {
      return []
    }

    try {
      const parsed = JSON.parse(result.stdout)
      if (Array.isArray(parsed)) {
        return parsed.map((entry, index) => ({
          address: entry?.address ?? entry?.id ?? `mech-${index}`,
          name: entry?.name ?? `mech-${index}`,
          tools: Array.isArray(entry?.tools) ? entry.tools.map((tool: unknown) => `${tool}`) : []
        }))
      }
    } catch {
      return result.stdout
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, index) => {
          const [address, name] = line.split('|')
          return {
            address: address?.trim() || `mech-${index}`,
            name: name?.trim() || `mech-${index}`,
            tools: []
          }
        })
    }

    return []
  }

  async analyze(input: AnalyzeInput): Promise<AnalyzeResult> {
    const configured = await getOlasConfig()
    const chainConfig = input.chainConfig || configured.chainConfig || process.env.MECH_CHAIN_CONFIG || DEFAULT_CHAIN_CONFIG
    const sourceA = normalizeText(input.sourceA.value).slice(0, MAX_SOURCE_TEXT)
    const sourceB = normalizeText(input.sourceB.value).slice(0, MAX_SOURCE_TEXT)
    const diff = buildStructuredDiff(sourceA, sourceB)
    const preferredMech = input.preferredMech || configured.mechAddress
    const preferredTool = input.preferredTool || configured.toolName
    const useOffchain = input.useOffchain ?? configured.useOffchain

    const prompt = buildOlasPrompt(input, diff.raw, sourceA.slice(0, 1200), sourceB.slice(0, 1200))
    const args = [...CLIENT_MODE_ARGS, 'request', '--prompts', prompt, '--chain-config', chainConfig]

    if (preferredMech) {
      args.push('--priority-mech', preferredMech)
    }
    if (preferredTool) {
      args.push('--tools', preferredTool)
    }
    if (useOffchain ?? true) {
      args.push('--use-offchain', 'true')
    }
    if (process.env.MECH_PRIVATE_KEY_PATH) {
      args.push('--key', path.resolve(process.env.MECH_PRIVATE_KEY_PATH))
    }

    const sanitizedCommandPreview = [MECHX_BIN, ...sanitizeCommand(args)].join(' ')
    const result = await runCommand(MECHX_BIN, args, getRequestTimeoutMs())
    const parsed = parseOlasOutput(result.stdout)
    const submittedOnChain = result.stdout.includes('Transaction submitted:')
    const status =
      result.status === 0 && parsed
        ? 'success'
        : result.status === 0 || submittedOnChain
          ? 'partial'
          : 'failed'
    const rawOutput = (result.stdout || result.stderr || 'No output from mechx').slice(0, 32000)

    return {
      id: crypto.randomUUID(),
      mode: 'real',
      createdAt: new Date().toISOString(),
      projectName: input.projectName,
      sourceA: {
        label: input.sourceA.label,
        summary: sourceA.slice(0, 1600)
      },
      sourceB: {
        label: input.sourceB.label,
        summary: sourceB.slice(0, 1600)
      },
      diff,
      insight: parsed ?? {
        summary: 'Could not parse JSON result from mechx.',
        breakingChanges: ['Parse fallback used.'],
        newCapabilities: ['Inspect raw result for signal.'],
        migrationActions: ['Retry with shorter context and no markdown in prompt.'],
        riskScore: 3,
        evidence: ['mechx returned non-JSON output or invalid structure']
      },
      parsedOutput: parsed ?? undefined,
      rawOutput,
      meta: {
        status,
        command: sanitizedCommandPreview,
        mechAddress: preferredMech,
        tool: preferredTool,
        chainConfig,
        errors:
          result.status === 0
            ? []
            : submittedOnChain
              ? ['mechx request submitted on-chain but did not finish delivery before timeout']
              : ['mechx execution failed']
      }
    }
  }

  async runBatchEvidence(inputs: AnalyzeInput[]) {
    const outputs: Array<{
      run: number
      analysisId?: string
      label: string
      success: boolean
      error?: string
    }> = []

    for (const [index, input] of inputs.entries()) {
      try {
        const output = await this.analyze(input)
        outputs.push({
          run: index + 1,
          analysisId: output.id,
          label: `${input.sourceA.label} vs ${input.sourceB.label}`,
          success: output.meta.status !== 'failed'
        })
      } catch (error: unknown) {
        outputs.push({
          run: index + 1,
          label: `${input.sourceA.label} vs ${input.sourceB.label}`,
          success: false,
          error: `${error}`
        })
      }
    }

    return {
      total: inputs.length,
      successCount: outputs.filter((entry) => entry.success).length,
      failureCount: outputs.filter((entry) => !entry.success).length,
      records: outputs
    }
  }
}
