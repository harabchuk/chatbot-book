import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MarkdownPanel from '../MarkdownPanel'

describe('MarkdownPanel', () => {
  it('renders the panel title and markdown content', () => {
    render(
      <MarkdownPanel
        title="Behind the scenes"
        markdown={'## What is happening\n\nThe bot **loses** context.'}
      />,
    )

    expect(
      screen.getByRole('heading', { name: /behind the scenes/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /what is happening/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('loses')).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /behind the scenes/i }),
    ).toBeInTheDocument()
  })

  it('renders children without markdown when only rich content is provided', () => {
    render(
      <MarkdownPanel title="What went wrong">
        <p>Ownership is buried in compact headings.</p>
      </MarkdownPanel>,
    )

    expect(
      screen.getByRole('region', { name: /what went wrong/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/ownership is buried in compact headings/i),
    ).toBeInTheDocument()
  })
})

