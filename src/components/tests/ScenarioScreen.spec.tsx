import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ScenarioScreen from '../ScenarioScreen'

describe('ScenarioScreen', () => {
  it('renders title, chat slot, behind the scenes, and steps to improve', () => {
    render(
      <ScenarioScreen
        title="Example issue"
        description="A short description of the failure."
        chat={<div>Chat illustration</div>}
        behindTheScenes="## Context\n\nSomething goes wrong inside."
        stepsToImprove="## Fix\n\n1. Carry forward decisions."
      />,
    )

    expect(
      screen.getByRole('heading', { name: /example issue/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/a short description of the failure/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/chat illustration/i)).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /behind the scenes/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /steps to improve/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/something goes wrong inside/i)).toBeInTheDocument()
    expect(
      screen.getByText(/carry forward decisions/i),
    ).toBeInTheDocument()
  })

  it('supports category, custom section titles, and rich panel content', () => {
    render(
      <ScenarioScreen
        category="Context formatting"
        title="Right numbers, wrong account"
        description="Household total confusion."
        chatTitle="What the customer sees"
        chat={<div>Chat illustration</div>}
        behindTheScenesTitle="What went wrong"
        behindTheScenes={<p>Ownership is buried.</p>}
        stepsToImproveTitle="Make ownership and scope explicit"
        stepsToImprove={<p>Label each account.</p>}
      />,
    )

    expect(screen.getByText(/context formatting/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /what the customer sees/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /what went wrong/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/ownership is buried/i)).toBeInTheDocument()
    expect(
      screen.getByRole('region', {
        name: /make ownership and scope explicit/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(/label each account/i)).toBeInTheDocument()
  })
})

