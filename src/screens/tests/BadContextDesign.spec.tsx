import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import BadContextDesign from '../BadContextDesign'

describe('BadContextDesign', () => {
  it('renders the scenario heading and chat illustration', () => {
    render(<BadContextDesign />)

    expect(
      screen.getByRole('heading', { name: /bad context design/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /chat/i })).toBeInTheDocument()
    expect(
      screen.getByText(/I don’t have prior conversation context/i),
    ).toBeInTheDocument()
  })
})
