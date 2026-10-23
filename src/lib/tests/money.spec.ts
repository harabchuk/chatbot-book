import { describe, expect, it } from 'vitest'
import { formatUsdChat, formatUsdLabel, formatUsdPlain } from '../money'

describe('money', () => {
  it('formats chat, label, and plain USD amounts from cents', () => {
    expect(formatUsdChat(125_000)).toBe('$1,250.00')
    expect(formatUsdChat(1_095_000)).toBe('$10,950.00')
    expect(formatUsdLabel(125_000)).toBe('USD 1,250.00')
    expect(formatUsdLabel(970_000)).toBe('USD 9,700.00')
    expect(formatUsdPlain(125_000)).toBe('1250.00')
    expect(formatUsdPlain(1_095_000)).toBe('10950.00')
  })
})
