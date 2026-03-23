import { describe, it, expect } from 'vitest'
import { normalizeText } from '@/lib/extraction/source'

describe('normalizeText', () => {
  it('normalizes whitespace', () => {
    expect(normalizeText('a\r\n\tb')).toBe('a\nb')
  })
})
