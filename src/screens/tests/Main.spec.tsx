import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import Main from '../Main'
import { screenMeta as contextFormattingMeta } from '../contextFormattingContent'

describe('Main', () => {
  it('lists every scenario as a link', () => {
    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>,
    )

    const nav = screen.getByRole('navigation', { name: /issue scenarios/i })
    expect(within(nav).getAllByRole('link')).toHaveLength(4)
    expect(
      within(nav).getByRole('link', { name: contextFormattingMeta.title }),
    ).toHaveAttribute('href', contextFormattingMeta.path)
  })
})
