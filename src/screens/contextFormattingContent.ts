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
    'Poorly formatted context can make a chatbot answer with someone else’s data. In this example, it reports a household total as your personal balance.',
} as const

export const userQuestion =
  'Hi, how much do I have available in my Rainy Day savings account?'

const userMessage: ChatMessage = {
  id: 'cf-user-1',
  role: 'user',
  content: userQuestion,
}

export const primaryTranscript: ChatMessage[] = [
  userMessage,
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

export const expectedResponse: ChatMessage = {
  id: 'cf-bot-expected',
  role: 'bot',
  content: `You have ${formatUsdChat(balancesUsdCents.alex)} available in your Rainy Day savings account.`,
  annotation: {
    label: 'Correct account scope',
    tone: 'correct',
  },
}

export const correctTranscript: ChatMessage[] = [
  userMessage,
  expectedResponse,
]

export const conversationNote = `The amount is real, but it belongs to the household summary. Alex's account has ${formatUsdChat(balancesUsdCents.alex)} available.`

export const correctConversationNote =
  'Every account carries its own owner, and the household total is labeled as a summary, so the bot picks Alex’s account.'

export const problemLabel =
  'Account ownership is buried in compact column headings'

export const explanationCopy =
  'Two accounts share the same name, and the household total is labeled just “Available”. The model picks the total as Alex’s balance.'

export const otherDomainsIntro =
  'Banking is just one example. Any chatbot that answers questions about “my” data can fall into the same trap when the context mixes your records with other people’s records or with totals.'

export type DomainExample = {
  domain: string
  scenario: string
}

export const otherDomainExamples: readonly DomainExample[] = [
  {
    domain: 'Medical app',
    scenario:
      'A parent manages family profiles and asks “When is my next appointment?” The context lists everyone’s visits under one “Patient / Date” heading, so the bot replies with their child’s check-up.',
  },
  {
    domain: 'Parcel delivery',
    scenario:
      'Two parcels are going to the same “Home” address, one for the customer and one for a flatmate. Asked “Where is my parcel?”, the bot reports the flatmate’s parcel as delivered.',
  },
]

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
  'These steps work for any chatbot that looks up personal records, whether those are bank accounts, appointments, prescriptions, or parcels. The goal is the same everywhere: every record has a clear owner, and every summary has a clear scope.'

export type ImprovementStep = {
  title: string
  detail: string
}

export const improvementSteps: readonly ImprovementStep[] = [
  {
    title: 'Put the owner next to every value',
    detail:
      'Don’t rely on a shared column heading. Each balance, appointment, or delivery status should carry its own owner field.',
  },
  {
    title: 'Use unique IDs, not display names',
    detail:
      'Nicknames like “Rainy Day”, address labels like “Home”, or a doctor’s name can repeat. Stable IDs keep records apart.',
  },
  {
    title: 'Label summaries as summaries',
    detail:
      'A household balance, a family appointment list, or “3 parcels on the way” is not one person’s record. Say what it includes and that it is a combined view.',
  },
  {
    title: 'Define who “my” means',
    detail:
      'Tie “my” to the signed-in user’s ID, and tell the bot to ask a clarifying question when more than one record still matches.',
  },
  {
    title: 'Filter before the model sees it',
    detail:
      'Where possible, select the user’s own records in application code and send only those. Clear formatting reduces mistakes but doesn’t eliminate them, and access control belongs in the app, not the prompt.',
  },
]

export const formatOptionsIntro =
  'The Option A and Option B tabs above apply these steps with two different formats. Both put the owner, a unique ID, and the scope on every record, so the model gets the same answer from each.'

export const wrongFormattingSummary =
  'The context lists both “Rainy Day” accounts under one shared heading, then adds a household total labeled just “Available”.'

export type FormatOption = {
  label: string
  bestFor: string
}

export const textFormatOption: FormatOption = {
  label: 'Option A: Labeled text',
  bestFor:
    'Best when context is built as plain text. Each record is a block of “field: value” lines.',
}

export const jsonFormatOption: FormatOption = {
  label: 'Option B: JSON',
  bestFor:
    'Best when your app builds the context from an API or database. Each record is a JSON object, so field names stay attached to every value.',
}

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

export const jsonStructuredContext = `You are a banking assistant.
The authenticated user is Alex Morgan (user_alex).

USER:
${userQuestion}

RETRIEVED DATA (JSON):
{
  "accounts": [
    {
      "account_id": "savings_alex_01",
      "nickname": "Rainy Day",
      "owner_user_id": "user_alex",
      "owner_name": "Alex Morgan",
      "available_balance_usd": ${formatUsdPlain(balancesUsdCents.alex)}
    },
    {
      "account_id": "savings_jamie_01",
      "nickname": "Rainy Day",
      "owner_user_id": "user_jamie",
      "owner_name": "Jamie Morgan",
      "available_balance_usd": ${formatUsdPlain(balancesUsdCents.jamie)}
    }
  ],
  "household_summary": {
    "is_individual_account": false,
    "included_account_ids": ["savings_alex_01", "savings_jamie_01"],
    "combined_available_balance_usd": ${formatUsdPlain(balancesUsdCents.household)}
  }
}

For “my” account, use the account whose owner_user_id is user_alex.
Answer directly.`
