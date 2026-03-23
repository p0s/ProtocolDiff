import { describe, it, expect } from 'vitest'
import { buildStructuredDiff } from '@/lib/diff/structured'

describe('buildStructuredDiff', () => {
  it('finds added and removed lines', () => {
    const result = buildStructuredDiff('a\nb\nc', 'a\nb\nd')
    expect(result.changedLines).toBeGreaterThan(0)
    expect(result.raw).toBeTruthy()
    expect(result.addedSections.length + result.removedSections.length).toBeGreaterThan(0)
  })
})
