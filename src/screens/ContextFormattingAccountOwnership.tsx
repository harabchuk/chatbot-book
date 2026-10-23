import ChatWindow, { MessageBubble } from '../components/ChatWindow'
import ContextCodeBlock from '../components/ContextCodeBlock'
import ScenarioScreen from '../components/ScenarioScreen'
import {
  clearlyStructuredContext,
  conversationNote,
  expectedResponse,
  explanationCopy,
  improvementSteps,
  otherDomainExamples,
  otherDomainsIntro,
  poorlyFormattedContext,
  primaryTranscript,
  problemLabel,
  screenMeta,
  solutionIntro,
  workedExampleLabel,
} from './contextFormattingContent'

function ExplanationPanel() {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-semibold text-stone-900">{problemLabel}</p>
        <p className="mt-1">{explanationCopy}</p>
      </div>
      <ContextCodeBlock
        label="Poorly formatted context"
        code={poorlyFormattedContext}
      />
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
    <div className="space-y-10">
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
      </div>
      <div>
        <h3 className="font-semibold text-stone-900">{workedExampleLabel}</h3>
        <div className="mt-4 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <ContextCodeBlock
            label="Clearly structured context"
            code={clearlyStructuredContext}
          />
          <figure className="min-w-0 self-start">
            <figcaption className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Expected response
            </figcaption>
            <div className="mt-3">
              <MessageBubble message={expectedResponse} />
            </div>
          </figure>
        </div>
      </div>
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
