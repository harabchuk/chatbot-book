import type { ReactNode } from 'react'
import Markdown from 'react-markdown'

type MarkdownPanelProps = {
  title: string
  /** Markdown body. Optional when `children` supplies the panel content. */
  markdown?: string
  /** Accessible name for the region landmark. Defaults to `title`. */
  'aria-label'?: string
  className?: string
  children?: ReactNode
}

const proseClassName =
  'text-sm leading-relaxed text-stone-700 [&_h1]:mt-0 [&_h1]:text-base [&_h1]:font-semibold [&_h1]:text-stone-900 [&_h2]:mt-4 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-stone-900 [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-medium [&_h3]:text-stone-800 [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_li]:marker:text-amber-600 [&_strong]:font-semibold [&_strong]:text-stone-900 [&_code]:rounded [&_code]:bg-cream-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8rem] [&_code]:text-amber-950 [&_pre]:mt-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-cream-100 [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:mt-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_th]:border-b [&_th]:border-cream-200 [&_th]:py-1.5 [&_th]:pr-3 [&_th]:font-semibold [&_th]:text-stone-800 [&_td]:border-b [&_td]:border-cream-100 [&_td]:py-1.5 [&_td]:pr-3 [&_td]:align-top [&_figure]:mt-3'

export default function MarkdownPanel({
  title,
  markdown,
  'aria-label': ariaLabel = title,
  className = '',
  children,
}: MarkdownPanelProps) {
  return (
    <section
      className={`flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm shadow-amber-900/5 ${className}`}
      aria-label={ariaLabel}
    >
      <header className="flex items-center gap-2 border-b border-cream-200 bg-cream-100/70 px-4 py-3">
        <span aria-hidden="true" className="size-2 rounded-full bg-amber-500" />
        <h2 className="text-sm font-semibold tracking-tight text-stone-900">
          {title}
        </h2>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-4 text-sm leading-relaxed text-stone-700">
        {markdown ? (
          <div className={proseClassName}>
            <Markdown>{markdown}</Markdown>
          </div>
        ) : null}
        {children}
      </div>
    </section>
  )
}
