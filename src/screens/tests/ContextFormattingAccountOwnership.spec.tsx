import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ContextFormattingAccountOwnership from '../ContextFormattingAccountOwnership'
import {
  balancesUsdCents,
  conversationNote,
  correctConversationNote,
  poorlyFormattedContext,
  clearlyStructuredContext,
  explanationCopy,
  formatOptionsIntro,
  improvementSteps,
  jsonFormatOption,
  jsonStructuredContext,
  textFormatOption,
  otherDomainExamples,
  otherDomainsIntro,
  solutionIntro,
  userQuestion,
  wrongFormattingSummary,
} from '../contextFormattingContent'
import { formatUsdChat } from '../../lib/money'

const incorrectAnswer = `You have ${formatUsdChat(balancesUsdCents.household)} available in your Rainy Day savings account.`
const correctAnswer = `You have ${formatUsdChat(balancesUsdCents.alex)} available in your Rainy Day savings account.`

const codeWithText = (text: string) =>
  screen.getByText(
    (_, element) => element?.tagName === 'CODE' && element.textContent === text,
  )

describe('ContextFormattingAccountOwnership', () => {
  it('opens on the wrong-formatting tab with the incorrect answer and its context', () => {
    render(<ContextFormattingAccountOwnership />)

    expect(
      screen.getByRole('heading', { name: /right numbers, wrong account/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/^context formatting$/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /compare the chat with the context behind it/i,
      }),
    ).toBeInTheDocument()

    const tabNames = within(
      screen.getByRole('tablist', { name: /context versions/i }),
    )
      .getAllByRole('tab')
      .map((tab) => tab.textContent)
    expect(tabNames).toEqual(['Wrong formatting', 'Option A', 'Option B'])
    expect(
      screen.getByRole('tab', { name: 'Wrong formatting' }),
    ).toHaveAttribute('aria-selected', 'true')

    expect(screen.getByText(/illustrative conversation/i)).toBeInTheDocument()
    expect(screen.getByText(/signed in as alex morgan/i)).toBeInTheDocument()
    expect(
      within(screen.getByRole('log')).getByText(userQuestion),
    ).toBeInTheDocument()
    expect(screen.getByText(wrongFormattingSummary)).toBeInTheDocument()
    expect(screen.getByText(incorrectAnswer)).toBeInTheDocument()
    expect(screen.getByText('Incorrect account scope')).toBeInTheDocument()
    expect(screen.getByText(conversationNote)).toBeInTheDocument()
    expect(screen.getByText('Poorly formatted context')).toBeInTheDocument()
    expect(codeWithText(poorlyFormattedContext)).toBeInTheDocument()
  })

  it('shows the correct answer and labeled text context on Option A', async () => {
    const user = userEvent.setup()
    render(<ContextFormattingAccountOwnership />)

    await user.click(screen.getByRole('tab', { name: 'Option A' }))

    expect(screen.getByText(textFormatOption.bestFor)).toBeInTheDocument()
    expect(screen.getByText(correctAnswer)).toBeInTheDocument()
    expect(screen.getByText('Correct account scope')).toBeInTheDocument()
    expect(screen.getByText(correctConversationNote)).toBeInTheDocument()
    expect(screen.getByText('Labeled text context')).toBeInTheDocument()
    expect(codeWithText(clearlyStructuredContext)).toBeInTheDocument()
    expect(screen.queryByText(incorrectAnswer)).not.toBeInTheDocument()
  })

  it('shows the correct answer and JSON context on Option B', async () => {
    const user = userEvent.setup()
    render(<ContextFormattingAccountOwnership />)

    await user.click(screen.getByRole('tab', { name: 'Option B' }))

    expect(screen.getByText(jsonFormatOption.bestFor)).toBeInTheDocument()
    expect(screen.getByText(correctAnswer)).toBeInTheDocument()
    expect(screen.getByText('JSON context')).toBeInTheDocument()
    expect(codeWithText(jsonStructuredContext)).toBeInTheDocument()
    expect(screen.queryByText('Poorly formatted context')).not.toBeInTheDocument()
  })

  it('places the explanation below the tabbed chat', () => {
    render(<ContextFormattingAccountOwnership />)

    const tablist = screen.getByRole('tablist')
    const explanation = screen.getByRole('region', { name: /what went wrong/i })
    expect(
      tablist.compareDocumentPosition(explanation) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      within(explanation).getByText(
        /account ownership is buried in compact column headings/i,
      ),
    ).toBeInTheDocument()
    expect(within(explanation).getByText(explanationCopy)).toBeInTheDocument()
  })

  it('keeps the explanation brief', () => {
    render(<ContextFormattingAccountOwnership />)

    expect(screen.getByText(solutionIntro)).toBeInTheDocument()
    expect(screen.queryByText(/takeaway:/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/implementation note:/i)).not.toBeInTheDocument()
  })

  it('relates the failure to chatbots outside banking', () => {
    render(<ContextFormattingAccountOwnership />)

    expect(
      screen.getByRole('heading', { name: /the same trap in other chatbots/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(otherDomainsIntro)).toBeInTheDocument()
    for (const example of otherDomainExamples) {
      expect(screen.getByText(`${example.domain}:`)).toBeInTheDocument()
      expect(screen.getByText(example.scenario, { exact: false })).toBeInTheDocument()
    }
  })

  it('lists domain-neutral improvement steps and points to the option tabs', () => {
    render(<ContextFormattingAccountOwnership />)

    expect(
      screen.getByRole('heading', { name: /make ownership and scope explicit/i }),
    ).toBeInTheDocument()
    const steps = within(
      screen.getByRole('list', { name: /improvement steps/i }),
    ).getAllByRole('listitem')
    expect(steps).toHaveLength(improvementSteps.length)
    improvementSteps.forEach((step, index) => {
      expect(steps[index]).toHaveTextContent(step.title)
      expect(steps[index]).toHaveTextContent(step.detail)
    })
    expect(screen.getByText(formatOptionsIntro)).toBeInTheDocument()
  })

  it('embeds valid JSON with the same balances as the text option', () => {
    const json = jsonStructuredContext.slice(
      jsonStructuredContext.indexOf('{'),
      jsonStructuredContext.lastIndexOf('}') + 1,
    )
    const data = JSON.parse(json)

    expect(data.accounts.map((account: { owner_user_id: string }) => account.owner_user_id)).toEqual([
      'user_alex',
      'user_jamie',
    ])
    expect(data.accounts[0].available_balance_usd).toBe(balancesUsdCents.alex / 100)
    expect(data.accounts[1].available_balance_usd).toBe(balancesUsdCents.jamie / 100)
    expect(data.household_summary.is_individual_account).toBe(false)
    expect(data.household_summary.combined_available_balance_usd).toBe(
      balancesUsdCents.household / 100,
    )
  })
})
