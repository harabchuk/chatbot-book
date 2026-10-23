type ContextCodeBlockProps = {
  label: string
  code: string
  className?: string
}

/** Selectable monospace block for model context examples. */
export default function ContextCodeBlock({
  label,
  code,
  className = '',
}: ContextCodeBlockProps) {
  return (
    <figure className={`min-w-0 ${className}`}>
      <figcaption className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </figcaption>
      <pre
        className="mt-2 max-w-full overflow-x-auto rounded-lg bg-slate-100 p-3 font-mono text-[0.8rem] leading-relaxed text-slate-800 select-text"
        tabIndex={0}
      >
        <code>{code}</code>
      </pre>
    </figure>
  )
}
