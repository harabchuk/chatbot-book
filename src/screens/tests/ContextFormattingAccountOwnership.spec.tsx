import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ContextFormattingAccountOwnership from '../ContextFormattingAccountOwnership'
import {
  balancesUsdCents,
  conversationNote,
  poorlyFormattedContext,
  clearlyStructuredContext,
  explanationCopy,
  solutionIntro,
  userQuestion,
} from '../contextFormattingContent'
import { formatUsdChat } from '../../lib/money'

describe('ContextFormattingAccountOwnership', () => {
  it('renders the three-part educational screen with the incorrect answer marked', () => {
    render(<ContextFormattingAccountOwnership />)

    expect(
      screen.getByRole('heading', { name: /right numbers, wrong account/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/context formatting/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /what the customer sees/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/illustrative conversation/i)).toBeInTheDocument()
    expect(screen.getByText(/signed in as alex morgan/i)).toBeInTheDocument()
    expect(within(screen.getByRole('log')).getByText(userQuestion)).toBeInTheDocument()
    expect(
      screen.getByText(
        `You have ${formatUsdChat(balancesUsdCents.household)} available in your Rainy Day savings account.`,
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('Incorrect account scope')).toBeInTheDocument()
    expect(screen.getByText(conversationNote)).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: /what went wrong/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/account ownership is buried in compact column headings/i),
    ).toBeInTheDocument()
    expect(screen.getByText('Poorly formatted context')).toBeInTheDocument()
    expect(
      screen.getByText((_, element) => element?.tagName === 'CODE' && element.textContent === poorlyFormattedContext),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /make ownership and scope explicit/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Clearly structured context')).toBeInTheDocument()
    expect(screen.getByText('Expected response')).toBeInTheDocument()
    expect(
      screen.getByText((_, element) => element?.tagName === 'CODE' && element.textContent === clearlyStructuredContext),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        `You have ${formatUsdChat(balancesUsdCents.alex)} available in your Rainy Day savings account.`,
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('Correct account scope')).toBeInTheDocument()
  })

  it('keeps the explanation brief', () => {
    render(<ContextFormattingAccountOwnership />)

    expect(screen.getByText(explanationCopy)).toBeInTheDocument()
    expect(screen.getByText(solutionIntro)).toBeInTheDocument()
    expect(screen.queryByText(/takeaway:/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/implementation note:/i)).not.toBeInTheDocument()
  })
})
