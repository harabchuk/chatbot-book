import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ContextFormattingAccountOwnership from '../ContextFormattingAccountOwnership'
import {
  balancesUsdCents,
  conversationNote,
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
  workedExampleLabel,
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
    expect(screen.getByText('Labeled text context')).toBeInTheDocument()
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

  it('lists domain-neutral improvement steps before the banking worked example', () => {
    render(<ContextFormattingAccountOwnership />)

    const steps = within(
      screen.getByRole('list', { name: /improvement steps/i }),
    ).getAllByRole('listitem')
    expect(steps).toHaveLength(improvementSteps.length)
    improvementSteps.forEach((step, index) => {
      expect(steps[index]).toHaveTextContent(step.title)
      expect(steps[index]).toHaveTextContent(step.detail)
    })

    const workedExample = screen.getByRole('heading', { name: workedExampleLabel })
    expect(
      steps[steps.length - 1].compareDocumentPosition(workedExample) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('offers JSON as an alternative to the labeled text format', () => {
    render(<ContextFormattingAccountOwnership />)

    expect(screen.getByText(formatOptionsIntro)).toBeInTheDocument()
    for (const option of [textFormatOption, jsonFormatOption]) {
      expect(screen.getByRole('heading', { name: option.label })).toBeInTheDocument()
      expect(screen.getByText(option.bestFor)).toBeInTheDocument()
    }
    expect(screen.getByText('JSON context')).toBeInTheDocument()
    expect(
      screen.getByText((_, element) => element?.tagName === 'CODE' && element.textContent === jsonStructuredContext),
    ).toBeInTheDocument()
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
