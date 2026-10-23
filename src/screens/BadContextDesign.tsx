import ChatWindow, { type ChatMessage } from '../components/ChatWindow'

const illustration: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Can you remind me what we decided about the refund timeline?',
  },
  {
    id: '2',
    role: 'bot',
    content:
      'Sure! Refunds typically process in 5–7 business days after approval.',
  },
  {
    id: '3',
    role: 'user',
    content: 'No — I meant the exception we agreed for my case yesterday.',
  },
  {
    id: '4',
    role: 'bot',
    content:
      'I don’t have prior conversation context. Could you summarize what was agreed?',
  },
]

export default function BadContextDesign() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">
          Bad context design
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          The bot answers from generic knowledge and loses the thread of what
          was already decided in this conversation.
        </p>

        <div className="mt-10">
          <ChatWindow messages={illustration} />
        </div>
      </div>
    </main>
  )
}
