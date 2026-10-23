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
    expect(screen.getByText(/Available: USD 10,950.00/).closest('pre')).toHaveClass(
      'select-text',
    )
  })
})
