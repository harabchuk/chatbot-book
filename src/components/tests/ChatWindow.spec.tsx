import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ChatWindow, { type ChatMessage } from '../ChatWindow'

const sampleMessages: ChatMessage[] = [
  { id: '1', role: 'user', content: 'What is my order status?' },
  { id: '2', role: 'bot', content: 'Which order are you asking about?' },
]

describe('ChatWindow', () => {
  it('renders provided user and bot messages', () => {
    render(<ChatWindow messages={sampleMessages} />)

    expect(screen.getByText('What is my order status?')).toBeInTheDocument()
    expect(screen.getByText('Which order are you asking about?')).toBeInTheDocument()
    expect(screen.getByText('What is my order status?')).toHaveAttribute(
      'data-role',
      'user',
    )
    expect(
      screen.getByText('Which order are you asking about?'),
    ).toHaveAttribute('data-role', 'bot')
  })

  it('exposes a chat landmark and a read-only message input by default', () => {
    render(<ChatWindow messages={sampleMessages} />)

    expect(screen.getByRole('region', { name: /chat/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toHaveAttribute('readonly')
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })

  it('appends a user message locally when input is enabled and no onSendMessage is provided', async () => {
    const user = userEvent.setup()
    render(<ChatWindow messages={sampleMessages} inputEnabled />)

    await user.type(screen.getByLabelText(/message/i), 'Order #42')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(screen.getByText('Order #42')).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toHaveValue('')
  })

  it('calls onSendMessage instead of appending locally when provided', async () => {
    const user = userEvent.setup()
    const onSendMessage = vi.fn()
    render(
      <ChatWindow
        messages={sampleMessages}
        inputEnabled
        onSendMessage={onSendMessage}
      />,
    )

    await user.type(screen.getByLabelText(/message/i), 'Order #42')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(onSendMessage).toHaveBeenCalledWith('Order #42')
    expect(screen.queryByText('Order #42')).not.toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toHaveValue('')
  })

  it('renders identity labels, annotations outside bubbles, and a collapsed continuation', async () => {
    const user = userEvent.setup()
    const annotated: ChatMessage[] = [
      {
        id: '1',
        role: 'bot',
        content: 'You have $10,950.00 available.',
        annotation: { label: 'Incorrect account scope', tone: 'incorrect' },
      },
    ]

    render(
      <ChatWindow
        messages={annotated}
        conversationLabel="Illustrative conversation"
        identityLabel="Signed in as Alex Morgan"
        footer={<p>Household total note</p>}
        continuation={{
          summary: 'Show expected response',
          messages: [
            {
              id: '2',
              role: 'bot',
              content: 'You have $1,250.00 available.',
              annotation: { label: 'Correct account scope', tone: 'correct' },
            },
          ],
        }}
      />,
    )

    expect(screen.getByText(/illustrative conversation/i)).toBeInTheDocument()
    expect(screen.getByText(/signed in as alex morgan/i)).toBeInTheDocument()
    expect(screen.getByText(/incorrect account scope/i)).toHaveAttribute(
      'data-annotation',
      'incorrect',
    )
    expect(screen.getByText(/household total note/i)).toBeInTheDocument()

    const toggle = screen.getByRole('button', {
      name: /show expected response/i,
    })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByText(/you have \$1,250\.00 available/i),
    ).not.toBeInTheDocument()

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/you have \$1,250\.00 available/i)).toBeInTheDocument()
    expect(screen.getByText('Correct account scope')).toHaveAttribute(
      'data-annotation',
      'correct',
    )
  })
})


