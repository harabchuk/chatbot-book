import ChatWindow, { type ChatMessage } from '../components/ChatWindow'
import ScenarioScreen from '../components/ScenarioScreen'

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

const behindTheScenes = `## What is happening

The assistant answers from **generic product knowledge** instead of the decisions already made in this thread.

### Why it fails

- Prior turns (and any “exception” agreed yesterday) are not in the active context window.
- The model falls back to a default refund policy answer.
- When the user corrects it, the bot has nothing left to retrieve — so it asks the user to restate the agreement.

### The problem

Without durable conversation memory (or an explicit handoff of prior decisions), the bot **loses the thread** and looks unreliable even when policy answers are correct in the abstract.
`

const stepsToImprove = `## How to improve

1. **Carry forward decisions** — Persist agreed exceptions (refund timeline, case id) and inject them into the system/context on every turn.
2. **Prefer thread facts over defaults** — When a user refers to “what we decided,” look up prior turns or a case record before answering with generic policy.
3. **Say what you know** — If context is missing, name what is missing (“I don’t see yesterday’s exception on this case”) instead of only asking for a full summary.
4. **Test the failure mode** — Script multi-turn conversations that re-ask about prior decisions and assert the bot uses stored context.
`

export default function BadContextDesign() {
  return (
    <ScenarioScreen
      title="Bad context design"
      description="The bot answers from generic knowledge and loses the thread of what was already decided in this conversation."
      chat={<ChatWindow messages={illustration} />}
      behindTheScenes={behindTheScenes}
      stepsToImprove={stepsToImprove}
    />
  )
}
