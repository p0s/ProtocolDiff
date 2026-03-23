import { AnalyzeInput } from '@/lib/types'

export function buildOlasPrompt(input: AnalyzeInput, structuredDiffText: string, sourceA: string, sourceB: string) {
  return [
    'You are an agent analyzing differences between two protocol or product snapshots.',
    'Return strict JSON only (no markdown, no explanation).',
    'Fields: summary, breakingChanges, newCapabilities, migrationActions, riskScore, evidence.',
    'Keep each field concise and practical.',
    '',
    `Project: ${input.projectName}`,
    `Source A label: ${input.sourceA.label}`,
    `Source B label: ${input.sourceB.label}`,
    `Source A extracted text (truncated): ${sourceA}`,
    `Source B extracted text (truncated): ${sourceB}`,
    '',
    'Instructions:',
    '- Summarize what changed.',
    '- Identify likely breaking changes.',
    '- Identify likely new capabilities.',
    '- Provide migration or rollout actions.',
    '- Risk score must be 1..5.',
    'Structured diff:',
    structuredDiffText,
    '',
    'Risk score: 1=low, 5=high.',
    'JSON format:',
    '{',
    '  "summary": "short summary",',
    '  "breakingChanges": ["..."],',
    '  "newCapabilities": ["..."],',
    '  "migrationActions": ["..."],',
    '  "riskScore": 3,',
    '  "evidence": ["..."],',
    '}'
  ].join('\n')
}
