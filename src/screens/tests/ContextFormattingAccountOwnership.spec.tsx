import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ContextFormattingAccountOwnership from '../ContextFormattingAccountOwnership'
import {
  balancesUsdCents,
  conversationNote,
  poorlyFormattedContext,
  clearlyStructuredContext,
  contextAnnotations,
  keyLessons,
  takeaway,
  userQuestion,
  whatChanged,
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

  it('links highlighted context lines to visible explanations', () => {
    render(<ContextFormattingAccountOwnership />)

    for (const annotation of contextAnnotations) {
      expect(screen.getByText(annotation.title)).toBeInTheDocument()
      expect(screen.getByText(annotation.why)).toBeInTheDocument()
    }
    for (const change of whatChanged) {
      expect(screen.getByText(change.text)).toBeInTheDocument()
    }
    expect(
      screen.getByRole('heading', { name: /what alex asked for/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /what the assistant used/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/^Takeaway:/).parentElement).toHaveTextContent(
      takeaway,
    )
    for (const lesson of keyLessons) {
      expect(screen.getByText(lesson)).toBeInTheDocument()
    }
  })


  it('keeps the correction continuation collapsed until expanded', async () => {
    const user = userEvent.setup()
    render(<ContextFormattingAccountOwnership />)

    const toggle = screen.getByRole('button', {
      name: /show expected response with correct account scope/i,
    })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('region', {
        name: /show expected response with correct account scope/i,
      }),
    ).not.toBeInTheDocument()

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByRole('region', {
        name: /show expected response with correct account scope/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('Correct account scope').length).toBeGreaterThan(
      1,
    )
  })
})
