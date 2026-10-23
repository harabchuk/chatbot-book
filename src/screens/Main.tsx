import { Link } from 'react-router'
import { screenMeta as contextFormattingMeta } from './contextFormattingContent'

const scenarios = [
  {
    to: '/bad-context-design',
    label: 'Bad context design',
  },
  {
    to: contextFormattingMeta.path,
    label: contextFormattingMeta.title,
  },
  {
    to: '/wrong-information-retrieved',
    label: 'Wrong information retrieved',
  },
  {
    to: '/internal-information-leackage',
    label: 'Internal information leackage',
  },
] as const

export default function Main() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">
          Chatbot Issues Simulator
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Explore how chatbot failures like missing context, bad retrieval, and
          API errors show up in a conversation.
        </p>

        <nav className="mt-10" aria-label="Issue scenarios">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Scenarios
          </h2>
          <ul className="mt-3 space-y-2">
            {scenarios.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-lg text-slate-800 underline-offset-4 hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  )
}
