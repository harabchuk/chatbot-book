import ChatWindow, { MessageBubble } from '../components/ChatWindow'
import ContextCodeBlock from '../components/ContextCodeBlock'
import ScenarioScreen from '../components/ScenarioScreen'
import {
  clearlyStructuredContext,
  continuationMessages,
  conversationNote,
  expectedResponse,
  explanationCopy,
  poorlyFormattedContext,
  primaryTranscript,
  problemLabel,
  screenMeta,
  solutionIntro,
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
    </div>
  )
}

function SolutionPanel() {
  return (
    <div className="space-y-6">
      <p className="max-w-3xl">{solutionIntro}</p>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
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
