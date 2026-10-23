# Page specification: When context formatting hides ownership

## Purpose

Add one educational screen to the existing TypeScript application explaining how weakly structured context can cause a chatbot to attribute a household total to one person.

Reuse the application's existing screen layout src/screens/BadContextDesign.tsx, navigation, typography, chat components, explanation panels, and solution components. This specification defines content and behavior; it does not require a new application, framework, backend, or design system.

The screen has the same three parts as the other screens:

1. A realistic example conversation showing a possible incorrect answer.
2. An explanation with the context supplied to the model.
3. A solution showing clearer context and the expected answer.

## Learning outcome

Readers should understand that accurate values can still produce an incorrect answer when the context does not clearly connect each value to its owner and scope. Account nicknames are not unique identifiers. A household total is not an individual account balance.

This is an illustrative failure scenario, not a claim that every model will make this mistake. The supplied context contains enough information to answer correctly, but its presentation makes the relationship between individual records and the summary easy to overlook.

## Page heading

**Title:** Right numbers, wrong account

**Subtitle:** Poorly formatted context can make a chatbot confuse a household total with your personal balance.

**Category label:** Context formatting

## Scenario and fixed facts

Use fictional banking data throughout. Alex is authenticated. Alex and their partner Jamie each own a separate savings account nicknamed “Rainy Day.” Assume the household view is authorized to display both accounts; the issue demonstrated here is incorrect attribution.

| Record | Owner | Nickname | Available balance |
| --- | --- | --- | --- |
| Account A | Alex Morgan | Rainy Day | USD 1,250.00 |
| Account B | Jamie Morgan | Rainy Day | USD 9,700.00 |
| Household summary | Alex and Jamie combined | Rainy Day | USD 10,950.00 |

Alex's correct available balance is **$1,250.00**, not **$10,950.00**. The household summary adds two distinct accounts. These are not two owners of one joint account.

## Part 1: Example conversation

**Section heading:** What the customer sees

Display a compact banking chat using the existing message components. Show the label **Illustrative conversation** and a small account identity label, **Signed in as Alex Morgan**.

### Primary transcript

**Alex:** Hi, how much do I have available in my Rainy Day savings account?

**Banking assistant:** You have $10,950.00 available in your Rainy Day savings account.

Mark the assistant's message with **Incorrect account scope**. Keep this annotation outside the message bubble so it is clearly part of the educational interface, not something the banking assistant said.

Below the transcript, show:

> The amount is real, but it belongs to the household summary. Alex's account has $1,250.00 available.


## Part 2: Explanation and behind-the-scenes context

**Section heading:** What went wrong

**Problem label:** Account ownership is buried in compact column headings

**Explanation copy:**

> The banking tool returns both Alex's and Jamie's accounts. Its text formatter flattens the table into slash-separated rows, then appends a summary with a generic “Available” label. Both accounts have the same nickname, and the summary covers all household members. The assistant may mistake that summary for Alex's own balance—even though “my” refers to the authenticated user, Alex.

### The context sent to the model

Show the following text verbatim in a selectable, monospace block. Label it **Poorly formatted context**. The user question must match the primary transcript.

```text
You are a banking assistant.
The authenticated user is Alex Morgan.

USER:
Hi, how much do I have available in my Rainy Day savings account?

RETRIEVED HOUSEHOLD ACCOUNT VIEW:
Savings accounts
Account / Owner / Available

Rainy Day / Alex Morgan / USD 1,250.00
Rainy Day / Jamie Morgan / USD 9,700.00

Selected household member: All
Selected account: Rainy Day
Available: USD 10,950.00

Answer directly.
```

Explain the evidence using three annotations next to or below the block:

| Context fragment | Why it matters |
| --- | --- |
| `Account / Owner / Available` and the two rows | Each value depends on a shared positional heading. Ownership is present, but is not explicitly labeled beside each balance. |
| `Selected account: Rainy Day` | Both accounts share this nickname. The selection does not identify one unique account. |
| `Selected household member: All` followed by `Available: USD 10,950.00` | “All” establishes household scope, but the amount is not explicitly labeled as a combined total across two accounts. |

If the application supports code annotations, highlight the corresponding lines. Always provide the same explanation as visible text; do not rely on hover or color alone.

### The scope mismatch

Show a compact comparison:

| What Alex asked for | What the assistant used |
| --- | --- |
| Alex's own Rainy Day account | Both household members' Rainy Day accounts |
| USD 1,250.00 | USD 10,950.00 |

**Takeaway:** The arithmetic is correct: $1,250.00 + $9,700.00 = $10,950.00. The mistake is assigning the combined amount to Alex.

Avoid describing this as missing data, a calculation error, prompt injection, or a confirmed internal reasoning trace. The annotations explain a plausible failure mechanism using visible input and output.

## Part 3: Possible solution

**Section heading:** Make ownership and scope explicit

**Introductory copy:**

> Give every account its own labeled record. Keep household totals separate, name what they include, and match the account owner to the authenticated user before answering a question about “my” balance.

### Improved context

Show the following in a selectable, monospace block labeled **Clearly structured context**. Preserve the same underlying balances and the same user question so readers can compare the two versions fairly. The IDs below are fictional stable identifiers added to distinguish the records.

```text
You are a banking assistant.

AUTHENTICATED USER
user_id: user_alex
display_name: Alex Morgan

USER:
Hi, how much do I have available in my Rainy Day savings account?

RETRIEVED HOUSEHOLD ACCOUNT VIEW
view_scope: all_household_members
currency: USD

ACCOUNT RECORD
account_id: savings_alex_01
account_type: savings
nickname: Rainy Day
owner_user_id: user_alex
owner_name: Alex Morgan
available_balance_usd: 1250.00
END ACCOUNT RECORD

ACCOUNT RECORD
account_id: savings_jamie_01
account_type: savings
nickname: Rainy Day
owner_user_id: user_jamie
owner_name: Jamie Morgan
available_balance_usd: 9700.00
END ACCOUNT RECORD

HOUSEHOLD SUMMARY — NOT AN INDIVIDUAL ACCOUNT
summary_scope: all_household_members
nickname_filter: Rainy Day
included_account_ids: [savings_alex_01, savings_jamie_01]
included_account_count: 2
combined_available_balance_usd: 10950.00
END HOUSEHOLD SUMMARY

ANSWER RULES
For “my” account, match owner_user_id to the authenticated user_id.
Use the matching account's available balance.
Do not use a household summary as an individual account balance.
If multiple accounts still match, ask which account the user means.
If no account matches, say that the requested balance could not be found.
Answer directly.
```

### Expected response

Use the existing assistant message component with a **Correct account scope** annotation:

**Banking assistant:** You have $1,250.00 available in your Rainy Day savings account.

### What changed

- Each balance has a local label and an explicit account owner.
- Stable user and account IDs distinguish records with identical nicknames.
- The household total names its scope and identifies the accounts it includes.
- The answer rules connect “my” to the authenticated user's identity.

**Implementation note:** This example combines clearer formatting with explicit selection rules; do not present it as a measured formatting-only experiment. Structured data and stronger instructions reduce ambiguity but do not guarantee correct model output. A stronger production design selects the authorized account in application code and passes only the relevant record to the model. Keep identity and authorization enforcement in the application.

## Interaction and presentation requirements

- Keep all three sections in the existing screen's normal reading order: conversation, explanation, solution.
- Show the incorrect response and its annotation immediately. Keep the correction continuation collapsed initially.
- Keep the poor context available in the explanation section and the improved context in the solution section. If the existing UI uses tabs for context comparisons, use **Poor formatting** and **Clear formatting**, defaulting to poor formatting.
- Keep the core explanation visible without requiring an interaction.
- Use the application's existing visual language for incorrect and correct examples, supplemented with explicit text labels.
- On narrow screens, stack content vertically. Constrain horizontal scrolling to code blocks; allow chat text and explanation copy to wrap.
- Preserve keyboard access and visible focus for expanders and tabs. Expose expanded or selected state to assistive technology.
- Present context as text, not images. Use semantic headings, table headers, and descriptive labels.
- Reuse any existing copy-context action; copy the exact displayed text without annotation markers. Adding this action is optional if it is not already supported.
- Do not simulate a live bank connection, run a model, or introduce artificial loading delays. This is a deterministic educational example.

## TypeScript integration guidance

Use the existing screen registration and content model. Suggested screen key: `context-formatting-account-ownership`. Treat this as a proposed identifier, not an assumption about the current router.

Keep the primary transcript, optional continuation, poor context, improved context, annotations, and expected response in a typed content fixture using the application's existing conventions. Avoid duplicating the same monetary facts across independently maintained objects where practical.

If balances are represented numerically, store them as integer minor units:

```ts
const balancesUsdCents = {
  alex: 125_000,
  jamie: 970_000,
  household: 1_095_000,
} as const;
```

Format visible chat amounts consistently as USD with two decimal places. No new package is required for this screen. Follow the repository's actual component APIs and testing conventions rather than introducing parallel abstractions.

## Acceptance criteria

1. The screen is reachable through the existing application navigation and uses the existing three-part screen structure.
2. The primary transcript uses the exact user question included in both context examples.
3. The initial assistant reply incorrectly states $10,950.00 and is clearly marked as an illustrative failure.
4. The explanation identifies Alex's $1,250.00, Jamie's $9,700.00, and their $10,950.00 household total consistently.
5. Readers can see that ownership information exists in the poor context; the problem is weak structure and ambiguous summary labeling.
6. Both Rainy Day records are shown as separate accounts, not one joint account.
7. The improved context preserves the scenario's facts while explicitly labeling ownership, account identity, and aggregate scope.
8. The expected response gives Alex's available balance as $1,250.00.
9. Any optional continuation is revealed by a keyboard-accessible control with an accurate expanded state.
10. The screen remains readable on mobile, and meaning does not depend on color or hover.
11. The page does not imply that formatting guarantees correctness or that a live model generated the displayed transcript.
12. Existing TypeScript checks and relevant screen/component checks pass after implementation; manually verify layout and any disclosure interaction.
