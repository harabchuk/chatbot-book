import { useId, useState, type FormEvent } from 'react'

export type ChatMessage = {
  id: string
  role: 'user' | 'bot'
  content: string
}

type ChatWindowProps = {
  messages: ChatMessage[]
  /** Placeholder for the message input. */
  placeholder?: string
  /** When true, the message input accepts typing. Defaults to read-only. */
  inputEnabled?: boolean
  /** Called when the user sends a message. If omitted, the message is appended locally. */
  onSendMessage?: (content: string) => void
  className?: string
}

export default function ChatWindow({
  messages: initialMessages,
  placeholder = 'Type a message…',
  inputEnabled = false,
  onSendMessage,
  className = '',
}: ChatWindowProps) {
  const inputId = useId()
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')

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
      className={`flex h-[28rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
      aria-label="Chat"
    >
      <div
        className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <p
              className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'rounded-br-md bg-slate-800 text-white'
                  : 'rounded-bl-md bg-slate-100 text-slate-800'
              }`}
              data-role={message.role}
            >
              {message.content}
            </p>
          </div>
        ))}
      </div>

      <form
        className="flex gap-2 border-t border-slate-200 bg-slate-50 px-3 py-3"
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
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 read-only:bg-slate-50 read-only:text-slate-500 focus:border-slate-400"
          autoComplete="off"
        />
        <button
          type="submit"
          className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!inputEnabled || !draft.trim()}
        >
          Send
        </button>
      </form>
    </section>
  )
}
