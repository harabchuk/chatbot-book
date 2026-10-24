import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ChatContextTabs, { type ChatContextTab } from '../ChatContextTabs'

const tabs: ChatContextTab[] = [
  {
    id: 'wrong',
    label: 'Wrong formatting',
    description: <p>Ownership is buried.</p>,
    messages: [
      { id: 'u', role: 'user', content: 'What is my balance?' },
      { id: 'b1', role: 'bot', content: 'You have $10.' },
    ],
    note: <p>That is the household total.</p>,
    contextLabel: 'Poor context',
    context: 'Available: 10',
  },
  {
    id: 'json',
    label: 'Option B',
    messages: [
      { id: 'u', role: 'user', content: 'What is my balance?' },
      { id: 'b2', role: 'bot', content: 'You have $1.' },
    ],
    contextLabel: 'JSON context',
    context: '{ "owner": "alex", "balance": 1 }',
  },
]

describe('ChatContextTabs', () => {
  it('shows the first tab with its chat, note, and context', () => {
    render(<ChatContextTabs tabs={tabs} aria-label="Context versions" />)

    expect(
      screen.getByRole('tablist', { name: /context versions/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: 'Wrong formatting' }),
    ).toHaveAttribute('aria-selected', 'true')
    const panel = screen.getByRole('tabpanel', { name: 'Wrong formatting' })
    expect(within(panel).getByText('Ownership is buried.')).toBeInTheDocument()
    expect(within(panel).getByText('You have $10.')).toBeInTheDocument()
    expect(
      within(panel).getByText('That is the household total.'),
    ).toBeInTheDocument()
    expect(within(panel).getByText('Poor context')).toBeInTheDocument()
    expect(within(panel).getByText('Available: 10')).toBeInTheDocument()
  })

  it('swaps chat and context when another tab is clicked', async () => {
    const user = userEvent.setup()
    render(<ChatContextTabs tabs={tabs} aria-label="Context versions" />)

    await user.click(screen.getByRole('tab', { name: 'Option B' }))

    expect(screen.getByRole('tab', { name: 'Option B' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByText('You have $1.')).toBeInTheDocument()
    expect(screen.getByText('JSON context')).toBeInTheDocument()
    expect(screen.queryByText('You have $10.')).not.toBeInTheDocument()
    expect(screen.queryByText('Available: 10')).not.toBeInTheDocument()
  })

  it('supports arrow-key navigation with a roving tab stop', async () => {
    const user = userEvent.setup()
    render(<ChatContextTabs tabs={tabs} aria-label="Context versions" />)

    const first = screen.getByRole('tab', { name: 'Wrong formatting' })
    const second = screen.getByRole('tab', { name: 'Option B' })
    expect(second).toHaveAttribute('tabindex', '-1')

    first.focus()
    await user.keyboard('{ArrowRight}')
    expect(second).toHaveFocus()
    expect(second).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowRight}')
    expect(first).toHaveFocus()

    await user.keyboard('{End}')
    expect(second).toHaveFocus()
  })

  it('honors defaultTabId', () => {
    render(
      <ChatContextTabs
        tabs={tabs}
        aria-label="Context versions"
        defaultTabId="json"
      />,
    )

    expect(screen.getByText('You have $1.')).toBeInTheDocument()
  })
})
