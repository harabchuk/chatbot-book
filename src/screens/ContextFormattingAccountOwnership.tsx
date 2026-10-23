import { Fragment, type ReactNode } from 'react'
import ChatWindow, { MessageBubble } from '../components/ChatWindow'
import ContextCodeBlock, {
  type CodeHighlight,
} from '../components/ContextCodeBlock'
import ScenarioScreen from '../components/ScenarioScreen'
import {
  arithmetic,
  clearlyStructuredContext,
  contextAnnotations,
  continuationMessages,
  conversationNote,
  expectedResponse,
  explanationCopy,
  implementationNote,
  keyLessons,
  poorlyFormattedContext,
  primaryTranscript,
  problemLabel,
  scopeMismatch,
  screenMeta,
  solutionIntro,
  takeaway,
  whatChanged,
} from './contextFormattingContent'

const problemHighlights: CodeHighlight[] = contextAnnotations.map(
  ({ marker, lines }) => ({ marker, lines, tone: 'problem' }),
)

const fixHighlights: CodeHighlight[] = whatChanged.map(({ marker, lines }) => ({
  marker,
  lines,
  tone: 'fix',
}))

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
      <span aria-hidden="true" className="h-4 w-1 rounded-full bg-amber-500" />
      {children}
    </h3>
  )
}

function Marker({
  tone,
  children,
}: {
  tone: 'problem' | 'fix'
  children: ReactNode
}) {
  return (
    <span
      className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${
        tone === 'fix' ? 'bg-emerald-700' : 'bg-amber-700'
      }`}
    >
      <span className="sr-only">Marker </span>
      {children}
    </span>
  )
}

function ScopeCard({
  tone,
  heading,
  scope,
  amount,
}: {
  tone: 'correct' | 'incorrect'
  heading: string
  scope: string
  amount: string
}) {
  const toneClass =
    tone === 'correct'
      ? 'border-emerald-200 bg-emerald-50/70 [&_h4]:text-emerald-800'
      : 'border-rose-200 bg-rose-50/70 [&_h4]:text-rose-800'

  return (
    <div className={`rounded-xl border p-3 ${toneClass}`}>
      <h4 className="text-xs font-semibold uppercase tracking-wide">
        {heading}
      </h4>
      <p className="mt-1 text-stone-800">{scope}</p>
      <p className="mt-2 font-mono text-lg font-semibold text-stone-900">
        {amount}
      </p>
    </div>
  )
}

function ExplanationPanel() {
  return (
    <div className="space-y-7">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
          The problem
        </p>
        <p className="mt-1 text-base font-semibold text-stone-900">
          {problemLabel}
        </p>
        <p className="mt-2">{explanationCopy}</p>
      </div>

      <div>
        <SectionHeading>The context sent to the model</SectionHeading>
        <p className="mt-1 text-stone-500">
          Numbered highlights are explained right below.
        </p>
        <ContextCodeBlock
          className="mt-3"
          label="Poorly formatted context"
          code={poorlyFormattedContext}
          highlights={problemHighlights}
        />
      </div>

      <div>
        <SectionHeading>Why these fragments matter</SectionHeading>
        <ol className="mt-3 space-y-3">
          {contextAnnotations.map((annotation) => (
            <li
              key={annotation.marker}
              className="flex gap-3 rounded-xl border border-cream-200 bg-cream-50 p-3"
            >
              <Marker tone="problem">{annotation.marker}</Marker>
              <div className="min-w-0 space-y-1.5">
                <p className="font-semibold text-stone-900">
                  {annotation.title}
                </p>
                <ul
                  aria-label="Highlighted lines"
                  className="flex flex-wrap gap-1.5"
                >
                  {annotation.lines.map((line) => (
                    <li key={line}>
                      <code className="rounded bg-amber-100/80 px-1.5 py-0.5 font-mono text-[0.75rem] break-all text-amber-950">
                        {line}
                      </code>
                    </li>
                  ))}
                </ul>
                <p>{annotation.why}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <SectionHeading>The scope mismatch</SectionHeading>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <ScopeCard
            tone="correct"
            heading="What Alex asked for"
            scope={scopeMismatch.asked.scope}
            amount={scopeMismatch.asked.amount}
          />
          <ScopeCard
            tone="incorrect"
            heading="What the assistant used"
            scope={scopeMismatch.used.scope}
            amount={scopeMismatch.used.amount}
          />
        </div>

        <div className="mt-4 rounded-xl bg-cream-100 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Where the number came from
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {arithmetic.map((term, index) => (
              <Fragment key={term.label}>
                {index > 0 ? (
                  <span className="text-lg font-semibold text-stone-500">
                    {index === arithmetic.length - 1 ? '=' : '+'}
                  </span>
                ) : null}
                <span
                  className={`flex flex-col rounded-lg px-3 py-1.5 ring-1 ${
                    index === arithmetic.length - 1
                      ? 'bg-rose-50 ring-rose-200'
                      : 'bg-white ring-cream-200'
                  }`}
                >
                  <span className="text-xs text-stone-500">{term.label}</span>
                  <span className="font-mono font-semibold text-stone-900">
                    {term.amount}
                  </span>
                </span>
              </Fragment>
            ))}
          </div>
        </div>

        <p className="mt-4 rounded-xl border-l-4 border-amber-500 bg-amber-50 px-4 py-3">
          <strong className="font-semibold text-stone-900">Takeaway:</strong>{' '}
          {takeaway}
        </p>
      </div>
    </div>
  )
}

function SolutionPanel() {
  return (
    <div className="space-y-7">
      <p className="max-w-3xl text-base text-stone-700">{solutionIntro}</p>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <SectionHeading>Improved context</SectionHeading>
          <p className="mt-1 text-stone-500">
            Lettered highlights match the list of changes.
          </p>
          <ContextCodeBlock
            className="mt-3"
            label="Clearly structured context"
            code={clearlyStructuredContext}
            highlights={fixHighlights}
          />
        </div>

        <div className="space-y-7">
          <div>
            <SectionHeading>What changed</SectionHeading>
            <ol className="mt-3 space-y-3">
              {whatChanged.map((change) => (
                <li
                  key={change.marker}
                  className="flex gap-3 rounded-xl border border-cream-200 bg-cream-50 p-3"
                >
                  <Marker tone="fix">{change.marker}</Marker>
                  <p className="min-w-0 text-stone-800">{change.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <SectionHeading>Expected response</SectionHeading>
            <div className="mt-3 rounded-xl border border-cream-200 bg-white p-4">
              <MessageBubble message={expectedResponse} />
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              Remember
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-amber-600">
              {keyLessons.map((lesson) => (
                <li key={lesson}>{lesson}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-600">
        <strong className="font-semibold text-stone-800">
          Implementation note:
        </strong>{' '}
        {implementationNote}
      </p>
    </div>
  )
}

export default function ContextFormattingAccountOwnership() {
  return (
    <ScenarioScreen
      category={screenMeta.category}
      title={screenMeta.title}
      description={screenMeta.description}
      chatTitle="What the customer sees"
      chat={
        <ChatWindow
          messages={primaryTranscript}
          conversationLabel="Illustrative conversation"
          identityLabel="Signed in as Alex Morgan"
          continuation={{
            summary: 'Show expected response with correct account scope',
            messages: continuationMessages,
          }}
          footer={<p>{conversationNote}</p>}
        />
      }
      behindTheScenesTitle="What went wrong"
      behindTheScenes={<ExplanationPanel />}
      stepsToImproveTitle="Make ownership and scope explicit"
      stepsToImprove={<SolutionPanel />}
    />
  )
}
