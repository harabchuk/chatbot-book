import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import ChatWindow, { type ChatMessage } from './ChatWindow'
import ContextCodeBlock from './ContextCodeBlock'

export type ChatContextTab = {
  id: string
  label: string
  /** Short intro shown above the chat and context for this tab. */
  description?: ReactNode
  messages: ChatMessage[]
  /** Note rendered under the transcript. */
  note?: ReactNode
  contextLabel: string
  context: string
}

type ChatContextTabsProps = {
  tabs: readonly ChatContextTab[]
  /** Accessible name for the tab list. */
  'aria-label': string
  conversationLabel?: string
  identityLabel?: string
  defaultTabId?: string
  className?: string
}

/**
 * Chat transcript paired with the model context that produced it.
 * Each tab swaps both the conversation and the context version.
 */
export default function ChatContextTabs({
  tabs,
  'aria-label': ariaLabel,
  conversationLabel,
  identityLabel,
  defaultTabId,
  className = '',
}: ChatContextTabsProps) {
  const baseId = useId()
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeId),
  )
  const activeTab = tabs[activeIndex]

  const tabId = (id: string) => `${baseId}-tab-${id}`
  const panelId = (id: string) => `${baseId}-panel-${id}`

  function selectIndex(index: number) {
    const tab = tabs[index]
    if (!tab) return
    setActiveId(tab.id)
    tabRefs.current[index]?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = tabs.length - 1
    const next = {
      ArrowRight: activeIndex === last ? 0 : activeIndex + 1,
      ArrowLeft: activeIndex === 0 ? last : activeIndex - 1,
      Home: 0,
      End: last,
    }[event.key]
    if (next === undefined) return
    event.preventDefault()
    selectIndex(next)
  }

  if (!activeTab) return null

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm shadow-amber-900/5 ${className}`}
    >
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex gap-1 overflow-x-auto border-b border-cream-200 bg-cream-100/70 px-3 pt-3"
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === activeTab.id
          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              type="button"
              role="tab"
              id={tabId(tab.id)}
              aria-selected={selected}
              aria-controls={panelId(tab.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              className={`-mb-px shrink-0 rounded-t-xl border px-4 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                selected
                  ? 'border-cream-200 border-b-white bg-white text-amber-900'
                  : 'border-transparent text-stone-600 hover:bg-cream-50 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={panelId(activeTab.id)}
        aria-labelledby={tabId(activeTab.id)}
        className="p-4 sm:p-6"
      >
        {activeTab.description ? (
          <div className="mb-5 max-w-3xl text-sm leading-relaxed text-stone-700">
            {activeTab.description}
          </div>
        ) : null}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start">
          <ChatWindow
            key={activeTab.id}
            messages={activeTab.messages}
            conversationLabel={conversationLabel}
            identityLabel={identityLabel}
            footer={activeTab.note}
          />
          <ContextCodeBlock
            label={activeTab.contextLabel}
            code={activeTab.context}
            preClassName="lg:max-h-[26rem]"
          />
        </div>
      </div>
    </div>
  )
}
