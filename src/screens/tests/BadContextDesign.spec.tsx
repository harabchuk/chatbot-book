import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import BadContextDesign from '../BadContextDesign'

describe('BadContextDesign', () => {
  it('renders chat, behind the scenes, and steps to improve', () => {
    render(<BadContextDesign />)

    expect(
      screen.getByRole('heading', { name: /bad context design/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /chat/i })).toBeInTheDocument()
    expect(
      screen.getByText(/I don’t have prior conversation context/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /behind the scenes/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /steps to improve/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/generic product knowledge/i)).toBeInTheDocument()
    expect(screen.getByText(/carry forward decisions/i)).toBeInTheDocument()
  })
})
