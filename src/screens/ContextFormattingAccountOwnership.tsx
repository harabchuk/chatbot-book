import ChatWindow from '../components/ChatWindow'
import ContextCodeBlock from '../components/ContextCodeBlock'
import ScenarioScreen from '../components/ScenarioScreen'
import {
  clearlyStructuredContext,
  contextAnnotations,
  continuationMessages,
  conversationNote,
  expectedResponse,
  explanationCopy,
  implementationNote,
  poorlyFormattedContext,
  primaryTranscript,
  problemLabel,
  scopeMismatch,
  screenMeta,
  solutionIntro,
  takeaway,
  whatChanged,
} from './contextFormattingContent'

function ExplanationPanel() {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {problemLabel}
      </p>
      <p>{explanationCopy}</p>

      <div>
        <h3 className="text-sm font-medium text-slate-800">
          The context sent to the model
        </h3>
        <ContextCodeBlock
          className="mt-2"
          label="Poorly formatted context"
          code={poorlyFormattedContext}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-800">
          Why these fragments matter
        </h3>
        <table className="mt-2 w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            Context fragments and why they matter
          </caption>
          <thead>
            <tr>
              <th scope="col" className="border-b border-slate-200 py-1.5 pr-3">
                Context fragment
              </th>
              <th scope="col" className="border-b border-slate-200 py-1.5 pr-3">
                Why it matters
              </th>
            </tr>
          </thead>
          <tbody>
            {contextAnnotations.map((row) => (
              <tr key={row.fragment}>
                <td className="border-b border-slate-100 py-1.5 pr-3 align-top font-mono text-[0.8rem] text-slate-800">
                  {row.fragment}
                </td>
                <td className="border-b border-slate-100 py-1.5 pr-3 align-top">
                  {row.why}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-800">The scope mismatch</h3>
        <table className="mt-2 w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            What Alex asked for compared with what the assistant used
          </caption>
          <thead>
            <tr>
              <th scope="col" className="border-b border-slate-200 py-1.5 pr-3">
                What Alex asked for
              </th>
              <th scope="col" className="border-b border-slate-200 py-1.5 pr-3">
                What the assistant used
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-slate-100 py-1.5 pr-3 align-top">
                {scopeMismatch.asked.scope}
              </td>
              <td className="border-b border-slate-100 py-1.5 pr-3 align-top">
                {scopeMismatch.used.scope}
              </td>
            </tr>
            <tr>
              <td className="border-b border-slate-100 py-1.5 pr-3 align-top">
                {scopeMismatch.asked.amount}
              </td>
              <td className="border-b border-slate-100 py-1.5 pr-3 align-top">
                {scopeMismatch.used.amount}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3">
          <strong className="font-semibold text-slate-800">Takeaway:</strong>{' '}
          {takeaway}
        </p>
      </div>
    </div>
  )
}

function SolutionPanel() {
  return (
    <div className="space-y-4">
      <p>{solutionIntro}</p>

      <div>
        <h3 className="text-sm font-medium text-slate-800">Improved context</h3>
        <ContextCodeBlock
          className="mt-2"
          label="Clearly structured context"
          code={clearlyStructuredContext}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-800">Expected response</h3>
        <div className="mt-2 flex flex-col items-start gap-1">
          <p className="max-w-[80%] rounded-2xl rounded-bl-md bg-slate-100 px-3.5 py-2 text-sm leading-relaxed text-slate-800">
            {expectedResponse.content}
          </p>
          {expectedResponse.annotation ? (
            <p
              className="text-xs font-semibold text-emerald-800"
              data-annotation={expectedResponse.annotation.tone}
            >
              {expectedResponse.annotation.label}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-800">What changed</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {whatChanged.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
        <strong className="font-semibold text-slate-800">
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
