import type { ReactNode } from 'react'
import MarkdownPanel from './MarkdownPanel'

type ScenarioScreenProps = {
  title: string
  description: string
  /** Chat illustration or interactive chat UI. */
  chat: ReactNode
  /** Markdown explaining what is happening behind the scenes. */
  behindTheScenes: string
  /** Markdown describing how to improve or fix the issue. */
  stepsToImprove: string
}

/**
 * Uniform layout for issue scenario screens:
 * chat + behind-the-scenes explanation, with improvement steps below.
 */
export default function ScenarioScreen({
  title,
  description,
  chat,
  behindTheScenes,
  stepsToImprove,
}: ScenarioScreenProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-600">{description}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="min-h-0">{chat}</div>
          <MarkdownPanel
            title="Behind the scenes"
            aria-label="Behind the scenes"
            markdown={behindTheScenes}
            className="min-h-[28rem]"
          />
        </div>

        <div className="mt-6">
          <MarkdownPanel
            title="Steps to improve"
            aria-label="Steps to improve"
            markdown={stepsToImprove}
          />
        </div>
      </div>
    </main>
  )
}
