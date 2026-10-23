import { describe, expect, it } from 'vitest'
import {
  balancesUsdCents,
  clearlyStructuredContext,
  contextAnnotations,
  poorlyFormattedContext,
  primaryTranscript,
  userQuestion,
  whatChanged,
} from '../contextFormattingContent'

describe('contextFormattingContent', () => {
  it('keeps the user question identical across transcript and both contexts', () => {
    expect(primaryTranscript[0]?.content).toBe(userQuestion)
    expect(poorlyFormattedContext).toContain(userQuestion)
    expect(clearlyStructuredContext).toContain(userQuestion)
  })

  it('derives household total from the two account balances', () => {
    expect(balancesUsdCents.alex + balancesUsdCents.jamie).toBe(
      balancesUsdCents.household,
    )
  })

  it('only highlights lines that exist verbatim in the matching context', () => {
    const poorLines = poorlyFormattedContext.split('\n')
    const clearLines = clearlyStructuredContext.split('\n')

    for (const annotation of contextAnnotations) {
      for (const line of annotation.lines) expect(poorLines).toContain(line)
    }
    for (const change of whatChanged) {
      for (const line of change.lines) expect(clearLines).toContain(line)
    }
  })

  it('uses unique markers for annotations and changes', () => {
    const markers = [...contextAnnotations, ...whatChanged].map(
      (item) => item.marker,
    )
    expect(new Set(markers).size).toBe(markers.length)
  })

  it('shows ownership in the poor context and separate account records in the clear context', () => {
    expect(poorlyFormattedContext).toContain('Rainy Day / Alex Morgan /')
    expect(poorlyFormattedContext).toContain('Rainy Day / Jamie Morgan /')
    expect(poorlyFormattedContext).toContain('Selected household member: All')
    expect(clearlyStructuredContext).toContain('account_id: savings_alex_01')
    expect(clearlyStructuredContext).toContain('account_id: savings_jamie_01')
    expect(clearlyStructuredContext).toContain(
      'HOUSEHOLD SUMMARY — NOT AN INDIVIDUAL ACCOUNT',
    )
  })
})
