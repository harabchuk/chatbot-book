import { useId, useState, type FormEvent, type ReactNode } from 'react'

export type ChatMessageAnnotation = {
  label: string
  /** Visual cue only — meaning must also come from `label` text. */
  tone: 'incorrect' | 'correct'
}

export type ChatMessage = {
  id: string
  role: 'user' | 'bot'
  content: string
  annotation?: ChatMessageAnnotation
}

type ChatWindowProps = {
  messages: ChatMessage[]
  /** Small label above the transcript, e.g. “Illustrative conversation”. */
  conversationLabel?: string
  /** Account / identity line, e.g. “Signed in as Alex Morgan”. */
  identityLabel?: string
  /** Content below the transcript (notes, disclosures). */
  footer?: ReactNode
  /**
   * Optional correction messages shown behind a disclosure.
   * Collapsed by default; expanded state is exposed to assistive tech.
   */
  continuation?: {
    summary: string
    messages: ChatMessage[]
  }
  /** Placeholder for the message input. */
  placeholder?: string
  /** When true, the message input accepts typing. Defaults to read-only. */
  inputEnabled?: boolean
  /** Called when the user sends a message. If omitted, the message is appended locally. */
  onSendMessage?: (content: string) => void
  className?: string
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const annotationClass =
    message.annotation?.tone === 'correct'
      ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
      : 'bg-rose-50 text-rose-800 ring-rose-200'
  const bubbleToneClass =
    message.annotation?.tone === 'correct'
      ? 'ring-2 ring-emerald-300'
      : message.annotation?.tone === 'incorrect'
        ? 'ring-2 ring-rose-300'
        : ''

  return (
    <div
      className={`flex flex-col gap-1.5 ${
        message.role === 'user' ? 'items-end' : 'items-start'
      }`}
    >
      <p
        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
          message.role === 'user'
            ? 'rounded-br-md bg-amber-700 text-white'
            : `rounded-bl-md bg-cream-100 text-stone-800 ${bubbleToneClass}`
        }`}
        data-role={message.role}
      >
        {message.content}
      </p>
      {message.annotation ? (
        <p
          className={`max-w-[80%] rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${annotationClass}`}
          data-annotation={message.annotation.tone}
        >
          {message.annotation.label}
        </p>
      ) : null}
    </div>
  )
}

export default function ChatWindow({
  messages: initialMessages,
  conversationLabel,
  identityLabel,
  footer,
  continuation,
  placeholder = 'Type a message…',
  inputEnabled = false,
  onSendMessage,
  className = '',
}: ChatWindowProps) {
  const inputId = useId()
  const continuationId = useId()
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [continuationOpen, setContinuationOpen] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!inputEnabled) return
    const content = draft.trim()
    if (!content) return

    if (onSendMessage) {
      onSendMessage(content)
    } else {
      setMessages((prev) => [
        ...prev,
        { id: `local-${Date.now()}`, role: 'user', content },
      ])
    }
    setDraft('')
  }

  return (
    <section
      className={`flex h-[28rem] flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm shadow-amber-900/5 ${className}`}
      aria-label="Chat"
    >
      {(conversationLabel || identityLabel) && (
        <header className="border-b border-cream-200 bg-cream-100/70 px-4 py-3">
          {conversationLabel ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              {conversationLabel}
            </p>
          ) : null}
          {identityLabel ? (
            <p className="mt-1 text-sm font-medium text-stone-800">
              {identityLabel}
            </p>
          ) : null}
        </header>
      )}

      <div
        className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {continuation ? (
          <div className="mt-1">
            <button
              type="button"
              className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-left text-sm font-medium text-amber-900 outline-none hover:bg-amber-100 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              aria-expanded={continuationOpen}
              aria-controls={continuationId}
              onClick={() => setContinuationOpen((open) => !open)}
            >
              {continuation.summary}
            </button>
            {continuationOpen ? (
              <div
                id={continuationId}
                className="mt-3 flex flex-col gap-3"
                role="region"
                aria-label={continuation.summary}
              >
                {continuation.messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {footer ? (
          <div className="mt-2 text-sm italic text-stone-500">
            {footer}
          </div>
        ) : null}
      </div>

      <form
        className="flex gap-2 border-t border-cream-200 bg-cream-100/70 px-3 py-3"
        onSubmit={handleSubmit}
      >
        <label className="sr-only" htmlFor={inputId}>
          Message
        </label>
        <input
          id={inputId}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          readOnly={!inputEnabled}
          className="min-w-0 flex-1 rounded-xl border border-cream-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none placeholder:text-stone-400 read-only:bg-cream-50 read-only:text-stone-500 focus:border-amber-400"
          autoComplete="off"
        />
        <button
          type="submit"
          className="rounded-xl bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!inputEnabled || !draft.trim()}
        >
          Send
        </button>
      </form>
    </section>
  )
}
