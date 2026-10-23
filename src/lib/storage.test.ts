import { beforeEach, describe, expect, it } from 'vitest'
import { readJson, writeJson } from './storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns fallback when key is missing', () => {
    expect(readJson('missing', { ok: true })).toEqual({ ok: true })
  })

  it('round-trips JSON values', () => {
    writeJson('session', { issue: 'lack-of-context' })
    expect(readJson('session', null)).toEqual({ issue: 'lack-of-context' })
  })
})
