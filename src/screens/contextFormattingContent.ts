import type { ChatMessage } from '../components/ChatWindow'
import {
  formatUsdChat,
  formatUsdLabel,
  formatUsdPlain,
} from '../lib/money'

export const balancesUsdCents = {
  alex: 125_000,
  jamie: 970_000,
  household: 1_095_000,
} as const

export const screenMeta = {
  key: 'context-formatting-account-ownership',
  path: '/context-formatting-account-ownership',
  category: 'Context formatting',
  title: 'Right numbers, wrong account',
  description:
    'Poorly formatted context can make a chatbot confuse a household total with your personal balance.',
} as const

export const userQuestion =
  'Hi, how much do I have available in my Rainy Day savings account?'

export const primaryTranscript: ChatMessage[] = [
  {
    id: 'cf-user-1',
    role: 'user',
    content: userQuestion,
  },
  {
    id: 'cf-bot-incorrect',
    role: 'bot',
    content: `You have ${formatUsdChat(balancesUsdCents.household)} available in your Rainy Day savings account.`,
    annotation: {
      label: 'Incorrect account scope',
      tone: 'incorrect',
    },
  },
]

export const continuationMessages: ChatMessage[] = [
  {
    id: 'cf-bot-correct-continuation',
    role: 'bot',
    content: `You have ${formatUsdChat(balancesUsdCents.alex)} available in your Rainy Day savings account.`,
    annotation: {
      label: 'Correct account scope',
      tone: 'correct',
    },
  },
]

export const expectedResponse: ChatMessage = {
  id: 'cf-bot-expected',
  role: 'bot',
  content: `You have ${formatUsdChat(balancesUsdCents.alex)} available in your Rainy Day savings account.`,
  annotation: {
    label: 'Correct account scope',
    tone: 'correct',
  },
}

export const conversationNote = `The amount is real, but it belongs to the household summary. Alex's account has ${formatUsdChat(balancesUsdCents.alex)} available.`

export const problemLabel =
  'Account ownership is buried in compact column headings'

export const explanationCopy =
  'Two accounts share the same name, and the household total is labeled just “Available”. The model picks the total as Alex’s balance.'

export const poorlyFormattedContext = `You are a banking assistant.
The authenticated user is Alex Morgan.

USER:
${userQuestion}

RETRIEVED HOUSEHOLD ACCOUNT VIEW:
Savings accounts
Account / Owner / Available

Rainy Day / Alex Morgan / ${formatUsdLabel(balancesUsdCents.alex)}
Rainy Day / Jamie Morgan / ${formatUsdLabel(balancesUsdCents.jamie)}

Selected household member: All
Selected account: Rainy Day
Available: ${formatUsdLabel(balancesUsdCents.household)}

Answer directly.`

export const solutionIntro =
  'Label every balance with its owner, and mark the household total as a combined amount.'

export const clearlyStructuredContext = `You are a banking assistant.
The authenticated user is Alex Morgan (user_alex).

USER:
${userQuestion}

ACCOUNT
account_id: savings_alex_01
nickname: Rainy Day
owner: Alex Morgan (user_alex)
available_balance_usd: ${formatUsdPlain(balancesUsdCents.alex)}

ACCOUNT
account_id: savings_jamie_01
nickname: Rainy Day
owner: Jamie Morgan (user_jamie)
available_balance_usd: ${formatUsdPlain(balancesUsdCents.jamie)}

HOUSEHOLD SUMMARY — NOT AN INDIVIDUAL ACCOUNT
combined_available_balance_usd: ${formatUsdPlain(balancesUsdCents.household)}

For “my” account, use the account owned by the authenticated user.
Answer directly.`
