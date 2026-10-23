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

export const explanationCopy = `The banking tool returns both Alex's and Jamie's accounts. Its text formatter flattens the table into slash-separated rows, then appends a summary with a generic “Available” label. Both accounts have the same nickname, and the summary covers all household members. The assistant may mistake that summary for Alex's own balance—even though “my” refers to the authenticated user, Alex.`

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

export type ContextAnnotation = {
  marker: string
  title: string
  /** Exact context lines this annotation explains. */
  lines: readonly string[]
  why: string
}

export const contextAnnotations: readonly ContextAnnotation[] = [
  {
    marker: '1',
    title: 'Ownership depends on a shared heading',
    lines: [
      'Account / Owner / Available',
      `Rainy Day / Alex Morgan / ${formatUsdLabel(balancesUsdCents.alex)}`,
      `Rainy Day / Jamie Morgan / ${formatUsdLabel(balancesUsdCents.jamie)}`,
    ],
    why: 'Each value depends on a shared positional heading. Ownership is present, but is not explicitly labeled beside each balance.',
  },
  {
    marker: '2',
    title: 'The nickname is not unique',
    lines: ['Selected account: Rainy Day'],
    why: 'Both accounts share this nickname. The selection does not identify one unique account.',
  },
  {
    marker: '3',
    title: 'The total is not labeled as combined',
    lines: [
      'Selected household member: All',
      `Available: ${formatUsdLabel(balancesUsdCents.household)}`,
    ],
    why: '“All” establishes household scope, but the amount is not explicitly labeled as a combined total across two accounts.',
  },
]

export const arithmetic = [
  { label: "Alex's account", amount: formatUsdChat(balancesUsdCents.alex) },
  { label: "Jamie's account", amount: formatUsdChat(balancesUsdCents.jamie) },
  {
    label: 'Household total',
    amount: formatUsdChat(balancesUsdCents.household),
  },
] as const

export const scopeMismatch = {
  asked: {
    scope: "Alex's own Rainy Day account",
    amount: formatUsdLabel(balancesUsdCents.alex),
  },
  used: {
    scope: "Both household members' Rainy Day accounts",
    amount: formatUsdLabel(balancesUsdCents.household),
  },
} as const

export const takeaway = `The arithmetic is correct: ${formatUsdChat(balancesUsdCents.alex)} + ${formatUsdChat(balancesUsdCents.jamie)} = ${formatUsdChat(balancesUsdCents.household)}. The mistake is assigning the combined amount to Alex.`

export const solutionIntro = `Give every account its own labeled record. Keep household totals separate, name what they include, and match the account owner to the authenticated user before answering a question about “my” balance.`

export const clearlyStructuredContext = `You are a banking assistant.

AUTHENTICATED USER
user_id: user_alex
display_name: Alex Morgan

USER:
${userQuestion}

RETRIEVED HOUSEHOLD ACCOUNT VIEW
view_scope: all_household_members
currency: USD

ACCOUNT RECORD
account_id: savings_alex_01
account_type: savings
nickname: Rainy Day
owner_user_id: user_alex
owner_name: Alex Morgan
available_balance_usd: ${formatUsdPlain(balancesUsdCents.alex)}
END ACCOUNT RECORD

ACCOUNT RECORD
account_id: savings_jamie_01
account_type: savings
nickname: Rainy Day
owner_user_id: user_jamie
owner_name: Jamie Morgan
available_balance_usd: ${formatUsdPlain(balancesUsdCents.jamie)}
END ACCOUNT RECORD

HOUSEHOLD SUMMARY — NOT AN INDIVIDUAL ACCOUNT
summary_scope: all_household_members
nickname_filter: Rainy Day
included_account_ids: [savings_alex_01, savings_jamie_01]
included_account_count: 2
combined_available_balance_usd: ${formatUsdPlain(balancesUsdCents.household)}
END HOUSEHOLD SUMMARY

ANSWER RULES
For “my” account, match owner_user_id to the authenticated user_id.
Use the matching account's available balance.
Do not use a household summary as an individual account balance.
If multiple accounts still match, ask which account the user means.
If no account matches, say that the requested balance could not be found.
Answer directly.`

export type ContextChange = {
  marker: string
  text: string
  /** Exact context lines that demonstrate this change. */
  lines: readonly string[]
}

export const whatChanged: readonly ContextChange[] = [
  {
    marker: 'A',
    text: 'Each balance has a local label and an explicit account owner.',
    lines: [
      'owner_name: Alex Morgan',
      'owner_name: Jamie Morgan',
      `available_balance_usd: ${formatUsdPlain(balancesUsdCents.alex)}`,
      `available_balance_usd: ${formatUsdPlain(balancesUsdCents.jamie)}`,
    ],
  },
  {
    marker: 'B',
    text: 'Stable user and account IDs distinguish records with identical nicknames.',
    lines: [
      'user_id: user_alex',
      'account_id: savings_alex_01',
      'account_id: savings_jamie_01',
      'owner_user_id: user_alex',
      'owner_user_id: user_jamie',
    ],
  },
  {
    marker: 'C',
    text: 'The household total names its scope and identifies the accounts it includes.',
    lines: [
      'HOUSEHOLD SUMMARY — NOT AN INDIVIDUAL ACCOUNT',
      'included_account_ids: [savings_alex_01, savings_jamie_01]',
      `combined_available_balance_usd: ${formatUsdPlain(balancesUsdCents.household)}`,
    ],
  },
  {
    marker: 'D',
    text: 'The answer rules connect “my” to the authenticated user’s identity.',
    lines: [
      'For “my” account, match owner_user_id to the authenticated user_id.',
      'Do not use a household summary as an individual account balance.',
    ],
  },
]

export const keyLessons = [
  'Accurate values can still produce a wrong answer when the context does not tie each value to its owner and scope.',
  'Account nicknames are not unique identifiers.',
  'A household total is not an individual account balance.',
] as const

export const implementationNote =
  'This example combines clearer formatting with explicit selection rules; do not treat it as a measured formatting-only experiment. Structured data and stronger instructions reduce ambiguity but do not guarantee correct model output. A stronger production design selects the authorized account in application code and passes only the relevant record to the model. Keep identity and authorization enforcement in the application.'
