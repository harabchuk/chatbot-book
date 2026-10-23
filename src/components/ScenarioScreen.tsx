import type { ReactNode } from 'react'
import MarkdownPanel from './MarkdownPanel'

type ScenarioScreenProps = {
  title: string
  description: string
  /** Optional category eyebrow above the title. */
  category?: string
  /** Chat illustration or interactive chat UI. */
  chat: ReactNode
  /** Heading for the chat column. Defaults to omitting a chat panel chrome. */
  chatTitle?: string
  /** Markdown or rich content explaining what is happening behind the scenes. */
  behindTheScenes: string | ReactNode
  behindTheScenesTitle?: string
  /** Markdown or rich content describing how to improve or fix the issue. */
  stepsToImprove: string | ReactNode
  stepsToImproveTitle?: string
}

function PanelContent({
  title,
  content,
  className,
}: {
  title: string
  content: string | ReactNode
  className?: string
}) {
  if (typeof content === 'string') {
    return (
      <MarkdownPanel
        title={title}
        aria-label={title}
        markdown={content}
        className={className}
      />
    )
  }

  return (
    <MarkdownPanel title={title} aria-label={title} className={className}>
      {content}
    </MarkdownPanel>
  )
}

/**
 * Uniform layout for issue scenario screens:
 * chat + behind-the-scenes explanation, with improvement steps below.
 */
export default function ScenarioScreen({
  title,
  description,
  category,
  chat,
  chatTitle,
  behindTheScenes,
  behindTheScenesTitle = 'Behind the scenes',
  stepsToImprove,
  stepsToImproveTitle = 'Steps to improve',
}: ScenarioScreenProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {category ? (
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            {category}
          </p>
        ) : null}
        <h1
          className={`text-3xl font-semibold tracking-tight ${category ? 'mt-2' : ''}`}
        >
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-600">{description}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="flex min-h-0 flex-col gap-3">
            {chatTitle ? (
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                {chatTitle}
              </h2>
            ) : null}
            {chat}
          </div>
          <PanelContent
            title={behindTheScenesTitle}
            content={behindTheScenes}
            className="min-h-[28rem]"
          />
        </div>

        <div className="mt-6">
          <PanelContent
            title={stepsToImproveTitle}
            content={stepsToImprove}
          />
        </div>
      </div>
    </main>
  )
}
