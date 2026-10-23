import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ContextCodeBlock from '../ContextCodeBlock'

describe('ContextCodeBlock', () => {
  it('renders a labeled selectable monospace block', () => {
    render(
      <ContextCodeBlock
        label="Poorly formatted context"
        code={'Available: USD 10,950.00'}
      />,
    )

    expect(screen.getByText(/poorly formatted context/i)).toBeInTheDocument()
    expect(screen.getByText(/Available: USD 10,950.00/)).toBeInTheDocument()
    expect(screen.getByText(/Available: USD 10,950.00/).closest('pre')    ).toHaveClass(
      'select-text',
    )
  })

  it('marks highlighted lines without changing the code text', () => {
    const code = 'Selected account: Rainy Day\nAvailable: USD 10,950.00\nAnswer directly.'
    const { container } = render(
      <ContextCodeBlock
        label="Poorly formatted context"
        code={code}
        highlights={[
          { marker: '2', lines: ['Available: USD 10,950.00'], tone: 'problem' },
        ]}
      />,
    )

    expect(container.querySelector('code')?.textContent).toBe(code)
    expect(screen.getByText('Available: USD 10,950.00')).toHaveAttribute(
      'data-marker',
      '2',
    )
    expect(screen.getByText('Answer directly.')).not.toHaveAttribute(
      'data-marker',
    )
  })
})
