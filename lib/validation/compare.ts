import { z } from 'zod'
import { AnalysisMode, SourceKind } from '@/lib/types'

export const sourceInputSchema = z.object({
  label: z.string().trim().min(1, 'Source label is required').max(140),
  kind: z.enum(['url', 'text'] as [SourceKind, ...SourceKind[]]),
  value: z.string().trim().min(3, 'Source text is too short')
})

export const compareRequestSchema = z.object({
  projectName: z.string().trim().min(1).max(120).default('ProtocolDiff Analysis'),
  sourceA: sourceInputSchema,
  sourceB: sourceInputSchema,
  mode: z.enum(['demo', 'real'] as [AnalysisMode, ...AnalysisMode[]]).default('demo'),
  chainConfig: z.string().trim().optional(),
  preferredMech: z.string().trim().optional(),
  preferredTool: z.string().trim().optional(),
  useOffchain: z.boolean().optional().default(true)
})

export const configSchema = z.object({
  chainConfig: z.string().trim().min(2),
  mechAddress: z.string().trim().default(''),
  toolName: z.string().trim().default(''),
  useOffchain: z.boolean().default(true)
})
