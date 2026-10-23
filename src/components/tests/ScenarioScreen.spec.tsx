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
})
