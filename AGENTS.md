# Agents

Guidance for humans and coding agents working in this repository.

## Purpose

Frontend-only simulator that demonstrates chatbot failure modes users may hit
in conversation — for example lack of context, wrong information retrieval,
and API failures. There is no application backend; anything that needs to
persist stays in the browser (`localStorage` or IndexedDB).

## Tech stack

| Layer | Choice |
| --- | --- |
| Build / dev server | [Vite](https://vite.dev/) |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| Routing | Add `react-router` only when multiple URLs are needed |
| Persistence | `localStorage` first; IndexedDB if data grows |
| Unit tests | Vitest + Testing Library + jsdom |
| Lint | Oxlint (template default) |

Static output from `npm run build` can be hosted on any static host. If you
later use browser-history routes, configure the host to serve `index.html`
for unknown paths.

## Project structure

Keep the layout small until features justify more folders:

```text
src/
  app/           App.tsx and app-wide setup
  components/    reusable UI
  features/      screens and feature-specific code
  lib/           browser storage and shared helpers
  test/          Vitest setup
  index.css      Tailwind entry (`@import "tailwindcss";`)
  main.tsx       React mount
```

Conventions:

- Put chatbot simulation UI and issue scenarios under `features/` (e.g.
  `features/chat`, `features/issues`).
- Shared presentational pieces go in `components/`.
- Pure helpers and storage adapters go in `lib/`.
- Keep unit tests in a `tests/` subfolder next to the file under test, named
  `*.spec.ts` / `*.spec.tsx` (not beside the source file):

```text
src/
  components/
    tests/
      Component1.spec.tsx
    Component1.tsx
  lib/
    tests/
      storage.spec.ts
    storage.ts
```

## Scripts

```bash
npm run dev      # local Vite server
npm run build    # typecheck + production bundle
npm run preview  # serve the production build
npm run lint     # Oxlint
npm run test     # Vitest (watch)
npm run test:run # Vitest once (CI)
```

## Unit testing

- Framework: **Vitest** with `environment: 'jsdom'` in `vite.config.ts`.
- Setup: `src/test/setup.ts` loads `@testing-library/jest-dom/vitest`.
- Prefer Testing Library queries that reflect user behavior
  (`getByRole`, `getByLabelText`) over implementation details.
- Cover pure logic in `lib/` and interactive feature pieces in `features/`.
- Mock network/API failure scenarios in tests the same way the simulator
  models them in the UI — keep tests frontend-only; do not stand up a backend.
- **Always add or update tests** for every new or changed source file under
  `src/` (place them in that folder's `tests/` subfolder).
- **Run `npm run test:run` after every task or bugfix** to confirm nothing
  regressed; also run it before opening a PR when behavior changes.

## Out of scope (for now)

- Application servers, databases, or auth backends
- React Router until multiple routes are required
- Heavy state libraries — start with React state and `lib/storage`
