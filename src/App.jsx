import { useState, useCallback } from 'react'
import FrameworkSelector from './FrameworkSelector.jsx'
import FrameworkForm from './FrameworkForm.jsx'
import OutputPreview from './OutputPreview.jsx'

const INITIAL_AIDA = {
  attention: '',
  interest: '',
  desire: '',
  action: '',
}

const INITIAL_PAS = {
  problem: '',
  agitate: '',
  solution: '',
}

const INITIAL_FAB = [
  { id: 1, feature: '', advantage: '', benefit: '' },
]

const INITIAL_COMMON = {
  productName: '',
  targetAudience: '',
  priceCta: '',
}

// Example data for each framework
const EXAMPLE_AIDA = {
  attention: 'Small business owners spend 8+ hours a month chasing unpaid invoices. What if you could get that time back?',
  interest: 'InvoiceFlow Pro automates your entire invoicing workflow — from creating branded invoices to sending payment reminders and reconciling payments. It integrates with your existing accounting tools in under 5 minutes.',
  desire: 'Join 12,000+ freelancers and small businesses who\'ve cut their accounts receivable time by 73%. Get paid 2x faster with automatic payment links, late-fee scheduling, and real-time cash flow dashboards.',
  action: 'Start your free 14-day trial — no credit card required. See why Capterra rated us #1 in invoicing software for small business.',
}

const EXAMPLE_PAS = {
  problem: 'You started a business to do work you love — not to spend your evenings chasing invoices, copy-pasting spreadsheet data, and wondering when clients will actually pay.',
  agitate: 'Every unpaid invoice is money stuck in limbo. Late payments snowball into cash flow gaps, which means stress about making payroll, delaying your own growth, and losing sleep over money that\'s technically yours. Manual invoicing tools make it worse — they\'re slow, error-prone, and give you zero visibility into what\'s actually outstanding.',
  solution: 'InvoiceFlow Pro puts your invoicing on autopilot. Create professional invoices in 60 seconds, send automatic payment reminders, and accept payments online. Real-time dashboards show exactly what\'s paid, pending, and overdue — so you always know where your cash stands.',
}

const EXAMPLE_FAB = [
  {
    id: 1,
    feature: 'One-click invoice generation with smart templates',
    advantage: 'Creates branded, itemized invoices in under 60 seconds — no design skills needed',
    benefit: 'You spend less time on paperwork and more time on billable work that grows your business',
  },
  {
    id: 2,
    feature: 'Automated payment reminders with escalation scheduling',
    advantage: 'Sends polite reminders at intervals you set, with optional late-fee calculations',
    benefit: 'Get paid 2x faster without the awkwardness of personally chasing clients for money',
  },
  {
    id: 3,
    feature: 'Real-time cash flow dashboard',
    advantage: 'Shows paid, pending, and overdue invoices at a glance with weekly trend charts',
    benefit: 'Make confident business decisions because you always know exactly where your money stands',
  },
]

const EXAMPLE_COMMON = {
  productName: 'InvoiceFlow Pro',
  targetAudience: 'Freelancers and small business owners who invoice clients regularly',
  priceCta: 'Start your free 14-day trial — no credit card required. Plans from $12/month.',
}

export default function App() {
  const [framework, setFramework] = useState('aida')
  const [aidaData, setAidaData] = useState(INITIAL_AIDA)
  const [pasData, setPasData] = useState(INITIAL_PAS)
  const [fabData, setFabData] = useState(INITIAL_FAB)
  const [commonData, setCommonData] = useState(INITIAL_COMMON)
  const [outputFormat, setOutputFormat] = useState('structured')
  const [copied, setCopied] = useState(false)
  const [showMobilePreview, setShowMobilePreview] = useState(false)
  const [fabNextId, setFabNextId] = useState(2)

  const fillTestData = () => {
    setFramework('aida')
    setCommonData(EXAMPLE_COMMON)
    setAidaData(EXAMPLE_AIDA)
  }

  const handleFrameworkChange = useCallback((newFramework) => {
    setFramework(newFramework)
  }, [])

  const handleLoadExample = useCallback((targetFramework) => {
    setFramework(targetFramework)
    setCommonData(EXAMPLE_COMMON)
    if (targetFramework === 'aida') {
      setAidaData(EXAMPLE_AIDA)
    } else if (targetFramework === 'pas') {
      setPasData(EXAMPLE_PAS)
    } else if (targetFramework === 'fab') {
      setFabData(EXAMPLE_FAB)
      setFabNextId(4)
    }
  }, [])

  const handleAidaChange = useCallback((field, value) => {
    setAidaData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handlePasChange = useCallback((field, value) => {
    setPasData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleFabChange = useCallback((index, field, value) => {
    setFabData(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }, [])

  const handleAddFabItem = useCallback(() => {
    setFabData(prev => [...prev, { id: fabNextId, feature: '', advantage: '', benefit: '' }])
    setFabNextId(prev => prev + 1)
  }, [fabNextId])

  const handleRemoveFabItem = useCallback((index) => {
    setFabData(prev => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  const handleCommonChange = useCallback((field, value) => {
    setCommonData(prev => ({ ...prev, [field]: value }))
  }, [])

  const generateOutput = useCallback(() => {
    const { productName, targetAudience, priceCta } = commonData
    const name = productName.trim()
    const audience = targetAudience.trim()
    const cta = priceCta.trim()

    if (framework === 'aida') {
      return generateAidaOutput(aidaData, name, audience, cta, outputFormat)
    } else if (framework === 'pas') {
      return generatePasOutput(pasData, name, audience, cta, outputFormat)
    } else {
      return generateFabOutput(fabData, name, audience, cta, outputFormat)
    }
  }, [framework, aidaData, pasData, fabData, commonData, outputFormat])

  const output = generateOutput()

  const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0
  const charCount = output.trim().length

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = output
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [output])

  const hasContent = output.trim().length > 0

  return (
    <div className="min-h-screen bg-abyss bg-glow bg-grid">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 animate-fadeIn">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-galactic">
          <a href="https://seo-tools-tau.vercel.app/" className="text-azure hover:text-white transition-colors">Free Tools</a>
          <span className="mx-2 text-metal">/</span>
          <a href="https://seo-tools-tau.vercel.app/copywriting/" className="text-azure hover:text-white transition-colors">Copywriting Tools</a>
          <span className="mx-2 text-metal">/</span>
          <span className="text-cloudy">Product Description Builder</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <span className="inline-block border border-turtle text-turtle rounded-full px-4 py-2 text-sm font-medium mb-4">
            Free Tool
          </span>
          <h1 className="text-4xl sm:text-[2.7rem] font-bold text-white mb-3">
            Product Description Builder
          </h1>
          <p className="text-cloudy text-lg max-w-2xl">
            Create compelling product descriptions using proven copywriting frameworks — AIDA, PAS, and FAB. Select a framework, fill in the guided fields, and get a polished description ready to copy.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-sm text-galactic">Load example:</span>
            <button
              onClick={() => handleLoadExample('aida')}
              className="text-sm text-azure hover:text-white border border-metal/30 rounded-lg px-3 py-1.5 hover:border-azure/50 transition-colors focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
            >
              AIDA
            </button>
            <button
              onClick={() => handleLoadExample('pas')}
              className="text-sm text-azure hover:text-white border border-metal/30 rounded-lg px-3 py-1.5 hover:border-azure/50 transition-colors focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
            >
              PAS
            </button>
            <button
              onClick={() => handleLoadExample('fab')}
              className="text-sm text-azure hover:text-white border border-metal/30 rounded-lg px-3 py-1.5 hover:border-azure/50 transition-colors focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
            >
              FAB
            </button>
          </div>
        </header>

        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={fillTestData}
            className="px-3 py-1.5 text-xs font-mono bg-prince/20 text-prince border border-prince/30 rounded hover:bg-prince/30 transition-colors focus:outline-none focus:ring-2 focus:ring-prince focus:ring-offset-2 focus:ring-offset-abyss"
          >
            Fill Test Data
          </button>
        </div>

        {/* Framework Selector */}
        <FrameworkSelector
          selected={framework}
          onChange={handleFrameworkChange}
        />

        {/* Main Content: Form + Preview */}
        <div className="mt-8 flex flex-col lg:flex-row gap-6">
          {/* Form Side */}
          <div className="w-full lg:w-[60%]">
            <FrameworkForm
              framework={framework}
              aidaData={aidaData}
              pasData={pasData}
              fabData={fabData}
              commonData={commonData}
              onAidaChange={handleAidaChange}
              onPasChange={handlePasChange}
              onFabChange={handleFabChange}
              onAddFabItem={handleAddFabItem}
              onRemoveFabItem={handleRemoveFabItem}
              onCommonChange={handleCommonChange}
            />
          </div>

          {/* Preview Side */}
          <div className="w-full lg:w-[40%]">
            {/* Mobile Preview Toggle */}
            <button
              onClick={() => setShowMobilePreview(!showMobilePreview)}
              className="lg:hidden w-full mb-4 flex items-center justify-center gap-2 bg-azure text-white rounded-lg px-4 py-3 font-medium hover:bg-azure-hover transition-colors focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              {showMobilePreview ? 'Hide Preview' : 'Show Preview'}
            </button>

            <div className={`${showMobilePreview ? 'block' : 'hidden'} lg:block lg:sticky lg:top-6`}>
              <OutputPreview
                output={output}
                outputFormat={outputFormat}
                onFormatChange={setOutputFormat}
                onCopy={handleCopy}
                copied={copied}
                hasContent={hasContent}
                wordCount={wordCount}
                charCount={charCount}
              />
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section className="mt-16">
          <details className="card-gradient border border-metal/20 rounded-2xl overflow-hidden group">
            <summary className="px-6 py-5 cursor-pointer flex items-center justify-between text-left select-none hover:bg-white/[0.02] transition-colors">
              <h2 className="text-lg font-bold text-white">Why use this instead of AI?</h2>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-galactic transition-transform duration-200 group-open:rotate-180">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </summary>
            <div className="px-6 pb-6 space-y-4 text-sm text-cloudy leading-relaxed">
              <p>
                AI chatbots can write product descriptions, but they produce generic, interchangeable copy. Every output sounds the same because there's no structured thinking behind it.
              </p>
              <p>
                <strong className="text-white">Frameworks force better thinking.</strong> AIDA, PAS, and FAB have been used by professional copywriters for decades because they work. Each field prompts you to think about a specific aspect of your product — the problem, the benefit, the proof — instead of hoping AI fills in the gaps.
              </p>
              <p>
                <strong className="text-white">You know your product best.</strong> AI doesn't know your customers, your competitive advantage, or why someone should choose you over five alternatives. This tool gives you the structure; you bring the substance.
              </p>
              <p>
                <strong className="text-white">Consistency across your catalog.</strong> When you have 10, 50, or 200 products, frameworks keep every description at the same quality bar. No more descriptions that trail off or miss the call to action.
              </p>
              <p>
                <strong className="text-white">It's faster than prompt engineering.</strong> Instead of writing and re-writing AI prompts to get the right tone and structure, just fill in the fields. The framework does the organizing for you.
              </p>
            </div>
          </details>
        </section>

        {/* Footer */}
        <footer className="border-t border-metal/30 mt-16 py-8 text-center text-sm text-galactic">
          Free marketing tools by{' '}
          <a href="https://www.dreamhost.com" target="_blank" rel="noopener" className="text-azure hover:text-white transition-colors">
            DreamHost
          </a>
        </footer>
      </div>
    </div>
  )
}

/* ---------- Output Generation Functions ---------- */

function generateAidaOutput(data, productName, audience, cta, format) {
  const { attention, interest, desire, action } = data
  const sections = []
  const hasAttention = attention.trim()
  const hasInterest = interest.trim()
  const hasDesire = desire.trim()
  const hasAction = action.trim()

  if (!hasAttention && !hasInterest && !hasDesire && !hasAction && !productName && !cta) {
    return ''
  }

  if (format === 'paragraph') {
    const parts = []
    if (productName) parts.push(`**${productName}**`)
    if (audience) parts.push(`*For ${audience}*`)
    if (parts.length) sections.push(parts.join(' — '))
    if (hasAttention) sections.push(attention.trim())
    if (hasInterest) sections.push(interest.trim())
    if (hasDesire) sections.push(desire.trim())
    if (hasAction) sections.push(action.trim())
    if (cta) sections.push(cta)
    return sections.join('\n\n')
  }

  if (format === 'structured') {
    if (productName) sections.push(`# ${productName}`)
    if (audience) sections.push(`*For ${audience}*`)
    if (hasAttention) sections.push(`## Attention\n${attention.trim()}`)
    if (hasInterest) sections.push(`## Interest\n${interest.trim()}`)
    if (hasDesire) sections.push(`## Desire\n${desire.trim()}`)
    if (hasAction) sections.push(`## Action\n${action.trim()}`)
    if (cta) sections.push(`---\n${cta}`)
    return sections.join('\n\n')
  }

  // bullet
  if (productName) sections.push(`# ${productName}`)
  if (audience) sections.push(`*For ${audience}*`)
  const bullets = []
  if (hasAttention) bullets.push(`- ${attention.trim()}`)
  if (hasInterest) bullets.push(`- ${interest.trim()}`)
  if (hasDesire) bullets.push(`- ${desire.trim()}`)
  if (hasAction) bullets.push(`- ${action.trim()}`)
  if (bullets.length) sections.push(bullets.join('\n'))
  if (cta) sections.push(cta)
  return sections.join('\n\n')
}

function generatePasOutput(data, productName, audience, cta, format) {
  const { problem, agitate, solution } = data
  const hasProblem = problem.trim()
  const hasAgitate = agitate.trim()
  const hasSolution = solution.trim()

  if (!hasProblem && !hasAgitate && !hasSolution && !productName && !cta) {
    return ''
  }

  const sections = []

  if (format === 'paragraph') {
    const parts = []
    if (productName) parts.push(`**${productName}**`)
    if (audience) parts.push(`*For ${audience}*`)
    if (parts.length) sections.push(parts.join(' — '))
    if (hasProblem) sections.push(problem.trim())
    if (hasAgitate) sections.push(agitate.trim())
    if (hasSolution) sections.push(solution.trim())
    if (cta) sections.push(cta)
    return sections.join('\n\n')
  }

  if (format === 'structured') {
    if (productName) sections.push(`# ${productName}`)
    if (audience) sections.push(`*For ${audience}*`)
    if (hasProblem) sections.push(`## The Problem\n${problem.trim()}`)
    if (hasAgitate) sections.push(`## Why It Matters\n${agitate.trim()}`)
    if (hasSolution) sections.push(`## The Solution\n${solution.trim()}`)
    if (cta) sections.push(`---\n${cta}`)
    return sections.join('\n\n')
  }

  // bullet
  if (productName) sections.push(`# ${productName}`)
  if (audience) sections.push(`*For ${audience}*`)
  const bullets = []
  if (hasProblem) bullets.push(`- Problem: ${problem.trim()}`)
  if (hasAgitate) bullets.push(`- Why it matters: ${agitate.trim()}`)
  if (hasSolution) bullets.push(`- Solution: ${solution.trim()}`)
  if (bullets.length) sections.push(bullets.join('\n'))
  if (cta) sections.push(cta)
  return sections.join('\n\n')
}

function generateFabOutput(data, productName, audience, cta, format) {
  const filledItems = data.filter(item =>
    item.feature.trim() || item.advantage.trim() || item.benefit.trim()
  )

  if (filledItems.length === 0 && !productName && !cta) {
    return ''
  }

  const sections = []

  if (format === 'paragraph') {
    const parts = []
    if (productName) parts.push(`**${productName}**`)
    if (audience) parts.push(`*For ${audience}*`)
    if (parts.length) sections.push(parts.join(' — '))
    filledItems.forEach(item => {
      const itemParts = []
      if (item.feature.trim()) itemParts.push(item.feature.trim())
      if (item.advantage.trim()) itemParts.push(item.advantage.trim())
      if (item.benefit.trim()) itemParts.push(item.benefit.trim())
      if (itemParts.length) sections.push(itemParts.join('. ') + '.')
    })
    if (cta) sections.push(cta)
    return sections.join('\n\n')
  }

  if (format === 'structured') {
    if (productName) sections.push(`# ${productName}`)
    if (audience) sections.push(`*For ${audience}*`)
    filledItems.forEach((item, i) => {
      const itemSections = []
      const heading = item.feature.trim() || `Feature ${i + 1}`
      itemSections.push(`## ${heading}`)
      if (item.advantage.trim()) itemSections.push(`**Advantage:** ${item.advantage.trim()}`)
      if (item.benefit.trim()) itemSections.push(`**Benefit:** ${item.benefit.trim()}`)
      sections.push(itemSections.join('\n'))
    })
    if (cta) sections.push(`---\n${cta}`)
    return sections.join('\n\n')
  }

  // bullet
  if (productName) sections.push(`# ${productName}`)
  if (audience) sections.push(`*For ${audience}*`)
  const bullets = []
  filledItems.forEach(item => {
    if (item.feature.trim()) {
      let line = `- **${item.feature.trim()}**`
      if (item.advantage.trim()) line += ` — ${item.advantage.trim()}`
      if (item.benefit.trim()) line += `. ${item.benefit.trim()}`
      bullets.push(line)
    }
  })
  if (bullets.length) sections.push(bullets.join('\n'))
  if (cta) sections.push(cta)
  return sections.join('\n\n')
}
