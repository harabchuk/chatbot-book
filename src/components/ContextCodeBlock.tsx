import { Fragment } from 'react'

export type CodeHighlight = {
  /** Short visible marker, e.g. `1` or `A`, repeated next to the explanation. */
  marker: string
  /** Exact line texts to highlight; every line equal to one of these is marked. */
  lines: readonly string[]
  tone?: 'problem' | 'fix'
}

type ContextCodeBlockProps = {
  label: string
  code: string
  highlights?: readonly CodeHighlight[]
  className?: string
}

const lineToneClass = {
  problem:
    'bg-amber-100/80 shadow-[inset_3px_0_0_var(--color-amber-500)] before:bg-amber-700',
  fix: 'bg-emerald-100/70 shadow-[inset_3px_0_0_var(--color-emerald-500)] before:bg-emerald-700',
} as const

const markerClass =
  'before:absolute before:left-2 before:top-[0.15rem] before:grid before:h-4 before:min-w-4 before:place-items-center before:rounded-full before:px-1 before:font-sans before:text-[0.65rem] before:font-bold before:leading-none before:text-white before:content-[attr(data-marker)]'

/**
 * Selectable monospace block for model context examples.
 * Highlight markers are drawn with CSS so copied text stays verbatim.
 */
export default function ContextCodeBlock({
  label,
  code,
  highlights = [],
  className = '',
}: ContextCodeBlockProps) {
  const lines = code.split('\n')
  const highlightFor = (line: string) =>
    highlights.find((highlight) => highlight.lines.includes(line))
  const hasHighlights = highlights.length > 0

  return (
    <figure className={`min-w-0 ${className}`}>
      <figcaption className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </figcaption>
      <pre
        className="mt-2 max-w-full overflow-x-auto rounded-xl bg-cream-100 font-mono text-[0.8rem] leading-relaxed text-stone-800 ring-1 ring-cream-200 select-text"
        tabIndex={0}
      >
        <code className="grid w-max min-w-full py-3">
          {lines.map((line, index) => {
            const highlight = highlightFor(line)
            const startsGroup =
              highlight !== undefined &&
              highlightFor(lines[index - 1] ?? '') !== highlight
            return (
              <Fragment key={index}>
                <span
                  data-marker={highlight?.marker}
                  className={`relative block min-h-[1lh] pr-4 ${
                    hasHighlights ? 'pl-10' : 'pl-4'
                  } ${
                    highlight ? lineToneClass[highlight.tone ?? 'problem'] : ''
                  } ${startsGroup ? markerClass : ''}`}
                >
                  {line}
                </span>
                {index < lines.length - 1 ? '\n' : null}
              </Fragment>
            )
          })}
        </code>
      </pre>
    </figure>
  )
}
