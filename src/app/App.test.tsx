import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the main screen with scenario links', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /chatbot issues simulator/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /bad context design/i }),
    ).toHaveAttribute('href', '/bad-context-design')
    expect(
      screen.getByRole('link', { name: /right numbers, wrong account/i }),
    ).toHaveAttribute('href', '/context-formatting-account-ownership')
    expect(
      screen.getByRole('link', { name: /wrong information retrieved/i }),
    ).toHaveAttribute('href', '/wrong-information-retrieved')
    expect(
      screen.getByRole('link', { name: /internal information leackage/i }),
    ).toHaveAttribute('href', '/internal-information-leackage')
  })
})

