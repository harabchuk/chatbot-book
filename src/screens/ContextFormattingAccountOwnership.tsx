import ChatContextTabs, { type ChatContextTab } from '../components/ChatContextTabs'
import ScenarioScreen from '../components/ScenarioScreen'
import {
  clearlyStructuredContext,
  conversationNote,
  correctConversationNote,
  correctTranscript,
  explanationCopy,
  formatOptionsIntro,
  improvementSteps,
  jsonFormatOption,
  jsonStructuredContext,
  otherDomainExamples,
  otherDomainsIntro,
  poorlyFormattedContext,
  primaryTranscript,
  problemLabel,
  screenMeta,
  solutionIntro,
  textFormatOption,
  wrongFormattingSummary,
  type FormatOption,
} from './contextFormattingContent'

function FormatOptionDescription({ option }: { option: FormatOption }) {
  return (
    <p>
      <span className="font-semibold text-stone-900">{option.label}.</span>{' '}
      {option.bestFor}
    </p>
  )
}

const contextTabs: readonly ChatContextTab[] = [
  {
    id: 'wrong',
    label: 'Wrong formatting',
    description: <p>{wrongFormattingSummary}</p>,
    messages: primaryTranscript,
    note: <p>{conversationNote}</p>,
    contextLabel: 'Poorly formatted context',
    context: poorlyFormattedContext,
  },
  {
    id: 'option-a',
    label: 'Option A',
    description: <FormatOptionDescription option={textFormatOption} />,
    messages: correctTranscript,
    note: <p>{correctConversationNote}</p>,
    contextLabel: 'Labeled text context',
    context: clearlyStructuredContext,
  },
  {
    id: 'option-b',
    label: 'Option B',
    description: <FormatOptionDescription option={jsonFormatOption} />,
    messages: correctTranscript,
    note: <p>{correctConversationNote}</p>,
    contextLabel: 'JSON context',
    context: jsonStructuredContext,
  },
]

function ExplanationPanel() {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-semibold text-stone-900">{problemLabel}</p>
        <p className="mt-1">{explanationCopy}</p>
      </div>
      <div>
        <h3 className="font-semibold text-stone-900">
          The same trap in other chatbots
        </h3>
        <p className="mt-1">{otherDomainsIntro}</p>
        <ul className="mt-3 space-y-2">
          {otherDomainExamples.map((example) => (
            <li key={example.domain}>
              <span className="font-semibold text-stone-900">
                {example.domain}:
              </span>{' '}
              {example.scenario}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function SolutionPanel() {
  return (
    <div className="max-w-3xl">
      <p>{solutionIntro}</p>
      <ol
        aria-label="Improvement steps"
        className="mt-4 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-amber-600">
        {improvementSteps.map((step) => (
          <li key={step.title}>
            <span className="font-semibold text-stone-900">
              {step.title}.
            </span>{' '}
            {step.detail}
          </li>
        ))}
      </ol>
      <p className="mt-6">{formatOptionsIntro}</p>
    </div>
  )
}

export default function ContextFormattingAccountOwnership() {
  return (
    <ScenarioScreen
      category={screenMeta.category}
      title={screenMeta.title}
      description={screenMeta.description}
      layout="stacked"
      chatTitle="Compare the chat with the context behind it"
      chat={
        <ChatContextTabs
          tabs={contextTabs}
          aria-label="Context versions"
          conversationLabel="Illustrative conversation"
          identityLabel="Signed in as Alex Morgan"
        />
      }
      behindTheScenesTitle="What went wrong"
      behindTheScenes={<ExplanationPanel />}
      stepsToImproveTitle="Make ownership and scope explicit"
      stepsToImprove={<SolutionPanel />}
    />
  )
}
