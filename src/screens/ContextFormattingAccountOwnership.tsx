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
    <div className="space-y-5">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-base font-semibold text-stone-900">
          {problemLabel}
        </p>
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
    <div className="space-y-5">
      <p className="max-w-3xl text-base text-stone-700">{solutionIntro}</p>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <ContextCodeBlock
          label="Clearly structured context"
          code={clearlyStructuredContext}
        />
        <div className="self-start rounded-xl border border-cream-200 bg-white p-4">
          <MessageBubble message={expectedResponse} />
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
