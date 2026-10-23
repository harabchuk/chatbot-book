import { describe, expect, it } from 'vitest'
import {
  balancesUsdCents,
  clearlyStructuredContext,
  poorlyFormattedContext,
  primaryTranscript,
  userQuestion,
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
