import { useState } from 'react'

const FORMAT_TABS = [
  { id: 'structured', label: 'Structured' },
  { id: 'paragraph', label: 'Paragraph' },
  { id: 'bullet', label: 'Bullet Points' },
]

const PLATFORM_TABS = [
  { id: 'amazon', label: 'Amazon', icon: null },
  { id: 'shopify', label: 'Shopify', icon: null },
  { id: 'google_shopping', label: 'Google', icon: null },
  { id: 'etsy', label: 'Etsy', icon: null },
  { id: 'web_html', label: 'Web HTML', icon: null },
]

function CharLimitIndicator({ current, max, label }) {
  const pct = Math.min(100, (current / max) * 100)
  const over = current > max
  return (
    <div className="flex items-center gap-2 text-[10px] mt-1">
      <div className="flex-1 h-1 bg-metal/20 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${over ? 'bg-coral' : pct > 80 ? 'bg-tangerine' : 'bg-turtle'}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
      <span className={over ? 'text-coral' : 'text-galactic'}>{current}/{max} {label}</span>
    </div>
  )
}

function renderFormattedOutput(text) {
  if (!text) return null

  const lines = text.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('# ')) {
      elements.push(
        <h2 key={i} className="text-xl font-bold text-white mb-3">{line.slice(2)}</h2>
      )
      i++
      continue
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={i} className="text-base font-semibold text-white mt-4 mb-2">{line.slice(3)}</h3>
      )
      i++
      continue
    }

    if (line.trim() === '---') {
      elements.push(<hr key={i} className="border-metal/30 my-4" />)
      i++
      continue
    }

    if (line.startsWith('- ')) {
      const bulletLines = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        bulletLines.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1.5 text-cloudy text-sm mb-3">
          {bulletLines.map((bl, j) => (
            <li key={j}>{renderInlineFormatting(bl)}</li>
          ))}
        </ul>
      )
      continue
    }

    if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
      elements.push(
        <p key={i} className="text-sm text-galactic italic mb-3">{line.slice(1, -1)}</p>
      )
      i++
      continue
    }

    if (line.trim() === '') { i++; continue }

    elements.push(
      <p key={i} className="text-sm text-cloudy mb-3 leading-relaxed">{renderInlineFormatting(line)}</p>
    )
    i++
  }

  return elements
}

function renderInlineFormatting(text) {
  const parts = []
  let remaining = text
  let keyIndex = 0

  while (remaining.length > 0) {
    const boldStart = remaining.indexOf('**')
    if (boldStart === -1) {
      parts.push(<span key={keyIndex++}>{remaining}</span>)
      break
    }

    if (boldStart > 0) {
      parts.push(<span key={keyIndex++}>{remaining.slice(0, boldStart)}</span>)
    }

    const boldEnd = remaining.indexOf('**', boldStart + 2)
    if (boldEnd === -1) {
      parts.push(<span key={keyIndex++}>{remaining.slice(boldStart)}</span>)
      break
    }

    parts.push(
      <strong key={keyIndex++} className="text-white font-semibold">
        {remaining.slice(boldStart + 2, boldEnd)}
      </strong>
    )
    remaining = remaining.slice(boldEnd + 2)
  }

  return parts
}

function renderPlatformOutput(platformOutput) {
  if (!platformOutput) return null

  return (
    <div className="space-y-3">
      {platformOutput.sections.map((section, i) => (
        <div key={i}>
          {section.label && (
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-galactic uppercase tracking-wider font-medium">{section.label}</span>
              {section.maxChars && (
                <span className="text-[10px] text-galactic">Max {section.maxChars} chars</span>
              )}
            </div>
          )}
          <div className={`p-3 rounded-lg border border-metal/20 ${section.type === 'html' ? 'bg-midnight font-mono text-xs' : 'bg-midnight/30'}`}>
            {section.type === 'html' ? (
              <pre className="text-cloudy text-xs whitespace-pre-wrap break-words overflow-x-auto">{section.content}</pre>
            ) : section.type === 'bullets' ? (
              <ul className="list-disc list-inside space-y-1 text-sm text-cloudy">
                {section.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            ) : section.type === 'tags' ? (
              <div className="flex flex-wrap gap-1">
                {section.items.map((tag, j) => (
                  <span key={j} className="inline-block px-2 py-0.5 rounded-full bg-prince/10 text-prince text-xs border border-prince/20">
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-cloudy leading-relaxed">{section.content}</p>
            )}
          </div>
          {section.maxChars && section.content && (
            <CharLimitIndicator current={section.content.length} max={section.maxChars} label="chars" />
          )}
        </div>
      ))}
    </div>
  )
}

export default function OutputPreview({
  output,
  outputFormat,
  onFormatChange,
  onCopy,
  copied,
  hasContent,
  wordCount,
  charCount,
  platformOutput,
  onPlatformChange,
  activePlatform,
}) {
  const [activeTab, setActiveTab] = useState('format') // 'format' or 'platform'

  const handleFormatTabClick = (id) => {
    setActiveTab('format')
    onFormatChange(id)
    onPlatformChange(null)
  }

  const handlePlatformTabClick = (id) => {
    setActiveTab('platform')
    onPlatformChange(id)
  }

  const showingPlatform = activeTab === 'platform' && activePlatform && platformOutput

  // For platform outputs, compute a plain text version for copy
  const copyText = showingPlatform
    ? platformOutput.sections.map(s => {
        if (s.label) {
          if (s.type === 'bullets') return `${s.label}:\n${s.items.map(item => `- ${item}`).join('\n')}`
          if (s.type === 'tags') return `${s.label}: ${s.items.join(', ')}`
          return `${s.label}:\n${s.content}`
        }
        return s.content || ''
      }).join('\n\n')
    : output

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      onCopy()
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = copyText
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      onCopy()
    }
  }

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl overflow-hidden">
      {/* Tab Group Selector */}
      <div className="flex border-b border-metal/20">
        <button
          onClick={() => setActiveTab('format')}
          className={`px-3 py-2 text-[10px] uppercase tracking-wider font-medium transition-colors ${
            activeTab === 'format' ? 'text-azure border-b-2 border-azure' : 'text-galactic hover:text-cloudy'
          }`}
        >
          Formats
        </button>
        <button
          onClick={() => setActiveTab('platform')}
          className={`px-3 py-2 text-[10px] uppercase tracking-wider font-medium transition-colors ${
            activeTab === 'platform' ? 'text-azure border-b-2 border-azure' : 'text-galactic hover:text-cloudy'
          }`}
        >
          Platforms
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b border-metal/20 overflow-x-auto">
        {activeTab === 'format' ? (
          FORMAT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFormatTabClick(tab.id)}
              className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-inset focus:ring-azure ${
                outputFormat === tab.id && !showingPlatform
                  ? 'text-azure border-b-2 border-azure bg-azure/5'
                  : 'text-galactic hover:text-cloudy'
              }`}
            >
              {tab.label}
            </button>
          ))
        ) : (
          PLATFORM_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handlePlatformTabClick(tab.id)}
              className={`flex-1 px-2 py-2.5 text-xs font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-inset focus:ring-azure ${
                activePlatform === tab.id
                  ? 'text-azure border-b-2 border-azure bg-azure/5'
                  : 'text-galactic hover:text-cloudy'
              }`}
            >
              {tab.label}
            </button>
          ))
        )}
      </div>

      {/* Preview Content */}
      <div className="p-5 min-h-[300px]">
        <div className="flex items-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-galactic">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <span className="text-xs font-medium text-galactic uppercase tracking-wider">
            {showingPlatform ? `${PLATFORM_TABS.find(t => t.id === activePlatform)?.label} Preview` : 'Live Preview'}
          </span>
        </div>

        {hasContent ? (
          <div className="animate-fadeIn">
            {showingPlatform ? renderPlatformOutput(platformOutput) : renderFormattedOutput(output)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-metal/40 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <p className="text-sm text-galactic mb-1">Your description preview will appear here</p>
            <p className="text-xs text-metal">Start filling in the fields on the left</p>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="border-t border-metal/20 px-5 py-3 flex items-center justify-between">
        <div className="text-xs text-galactic">
          {hasContent ? (
            <span>{wordCount} words / {charCount} characters</span>
          ) : (
            <span>No content yet</span>
          )}
        </div>

        <button
          onClick={handleCopyClick}
          disabled={!hasContent}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss ${
            hasContent
              ? copied
                ? 'bg-turtle text-white'
                : 'bg-azure text-white hover:bg-azure-hover'
              : 'bg-metal/20 text-galactic cursor-not-allowed'
          }`}
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  )
}
