import type { ReactNode } from 'react'
import Markdown from 'react-markdown'

type MarkdownPanelProps = {
  title: string
  markdown: string
  /** Accessible name for the region landmark. Defaults to `title`. */
  'aria-label'?: string
  className?: string
  children?: ReactNode
}

const proseClassName =
  'text-sm leading-relaxed text-slate-600 [&_h1]:mt-0 [&_h1]:text-base [&_h1]:font-semibold [&_h1]:text-slate-900 [&_h2]:mt-4 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-medium [&_h3]:text-slate-800 [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_li]:marker:text-slate-400 [&_strong]:font-semibold [&_strong]:text-slate-800 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8rem] [&_code]:text-slate-800 [&_pre]:mt-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-100 [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0'

export default function MarkdownPanel({
  title,
  markdown,
  'aria-label': ariaLabel = title,
  className = '',
  children,
}: MarkdownPanelProps) {
  return (
    <section
      className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
      aria-label={ariaLabel}
    >
      <header className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
      </header>
      <div className={`flex-1 overflow-y-auto px-4 py-4 ${proseClassName}`}>
        <Markdown>{markdown}</Markdown>
        {children}
      </div>
    </section>
  )
}
