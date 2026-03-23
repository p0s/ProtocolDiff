import { describe, it, expect } from 'vitest'
import { buildOlasPrompt } from '@/lib/analysis/prompt'

describe('buildOlasPrompt', () => {
  it('includes structured blocks', () => {
    const text = buildOlasPrompt(
      {
        projectName: 'Demo',
        sourceA: { label: 'a', kind: 'text', value: 'x' },
        sourceB: { label: 'b', kind: 'text', value: 'y' },
        mode: 'real',
        chainConfig: 'gnosis'
      } as any,
      'diff',
      'x',
      'y'
    )
    expect(text).toContain('Return strict JSON only')
    expect(text).toContain('Structured diff:')
  })
})
