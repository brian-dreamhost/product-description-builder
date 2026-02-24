const FRAMEWORK_EXPLAINERS = {
  aida: 'AIDA walks your reader through a journey: grab their attention, build interest in your product, create desire for the outcome, then tell them what to do next. It\'s the classic copywriting formula used in ads and landing pages.',
  pas: 'PAS connects with your reader emotionally: name the problem they\'re experiencing, make it feel urgent by showing what happens if they don\'t act, then present your product as the solution. Great for email and social media copy.',
  fab: 'FAB translates technical features into customer value: list what your product has (features), explain what each feature enables (advantages), and describe why the customer should care (benefits). Perfect for product pages and comparisons.',
}

const AIDA_FIELDS = [
  {
    key: 'attention',
    label: 'Attention',
    helperText: 'Write a bold opening statement or hook that grabs your reader\'s attention. Lead with a surprising fact, a provocative question, or a relatable pain point.',
    placeholder: 'Tired of spending hours on invoices?',
    rows: 3,
  },
  {
    key: 'interest',
    label: 'Interest',
    helperText: 'Explain what makes your product interesting. What does it do? What problem does it solve? Give enough detail that the reader wants to learn more.',
    placeholder: 'Our smart invoicing tool creates professional invoices in under 2 minutes. It pulls client details automatically, calculates taxes, and sends payment reminders for you.',
    rows: 4,
  },
  {
    key: 'desire',
    label: 'Desire',
    helperText: 'Make them want it. Describe the benefits, outcomes, and transformation. Focus on how their life or business improves — not just what the product does.',
    placeholder: 'Get paid faster with automatic reminders, beautiful templates, and one-click payment links. Our users get paid 3x faster on average.',
    rows: 4,
  },
  {
    key: 'action',
    label: 'Action',
    helperText: 'Tell them exactly what to do next. Be specific and remove friction — mention if it\'s free, no credit card, takes 30 seconds, etc.',
    placeholder: 'Start your free 14-day trial — no credit card required.',
    rows: 2,
  },
]

const PAS_FIELDS = [
  {
    key: 'problem',
    label: 'Problem',
    helperText: 'Describe the problem your customer faces. Be specific and relatable — use language they would actually use when describing this frustration.',
    placeholder: 'Managing inventory across multiple sales channels is a nightmare. You\'re updating spreadsheets, checking stock levels, and praying nothing gets oversold.',
    rows: 4,
  },
  {
    key: 'agitate',
    label: 'Agitate',
    helperText: 'Make the problem feel more urgent. What happens if they don\'t solve it? What\'s the cost of inaction — lost revenue, wasted time, frustrated customers?',
    placeholder: 'Every oversold item means a refund, an angry customer, and a hit to your reputation. One bad review can cost you dozens of future sales.',
    rows: 4,
  },
  {
    key: 'solution',
    label: 'Solution',
    helperText: 'Introduce your product as the answer. Show how it directly addresses the problem you just described. Be specific about the outcome.',
    placeholder: 'SyncStock automatically updates inventory across all your channels in real-time, so you never oversell again. Connect your stores in 5 minutes and never worry about stock levels.',
    rows: 4,
  },
]

function TextareaField({ label, helperText, placeholder, value, onChange, rows = 3, sectionColor }) {
  return (
    <div className="mb-5">
      <label className="block mb-1.5">
        <span className="text-sm font-semibold text-white flex items-center gap-2">
          {sectionColor && (
            <span className={`inline-block w-2 h-2 rounded-full ${sectionColor}`} />
          )}
          {label}
        </span>
      </label>
      <p className="text-xs text-galactic mb-2 leading-relaxed">{helperText}</p>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-sm text-white placeholder-galactic/60 focus:outline-none focus:ring-2 focus:ring-azure focus:border-azure transition-colors resize-y min-h-[60px]"
      />
    </div>
  )
}

function TextInputField({ label, helperText, placeholder, value, onChange, required = false }) {
  return (
    <div className="mb-5">
      <label className="block mb-1.5">
        <span className="text-sm font-semibold text-white">
          {label}
          {required && <span className="text-coral ml-1">*</span>}
        </span>
      </label>
      {helperText && <p className="text-xs text-galactic mb-2">{helperText}</p>}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-sm text-white placeholder-galactic/60 focus:outline-none focus:ring-2 focus:ring-azure focus:border-azure transition-colors"
      />
    </div>
  )
}

const SECTION_COLORS = {
  aida: {
    attention: 'bg-azure',
    interest: 'bg-prince',
    desire: 'bg-turtle',
    action: 'bg-tangerine',
  },
  pas: {
    problem: 'bg-coral',
    agitate: 'bg-tangerine',
    solution: 'bg-turtle',
  },
}

function FabItemCard({ item, index, total, onChange, onRemove }) {
  return (
    <div className="card-gradient border border-metal/20 rounded-xl p-5 mb-4 relative">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-azure/20 text-azure text-xs font-bold">
            {index + 1}
          </span>
          Feature {index + 1}
        </h4>
        {total > 1 && (
          <button
            onClick={() => onRemove(index)}
            className="text-galactic hover:text-coral transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-coral"
            aria-label={`Remove feature ${index + 1}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1.5">
          <span className="text-xs font-semibold text-cloudy">Feature</span>
        </label>
        <p className="text-xs text-galactic mb-2">List a specific feature of your product. Be concrete and factual.</p>
        <textarea
          value={item.feature}
          onChange={(e) => onChange(index, 'feature', e.target.value)}
          placeholder="256GB SSD storage"
          rows={2}
          className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-sm text-white placeholder-galactic/60 focus:outline-none focus:ring-2 focus:ring-azure focus:border-azure transition-colors resize-y min-h-[50px]"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1.5">
          <span className="text-xs font-semibold text-cloudy">Advantage</span>
        </label>
        <p className="text-xs text-galactic mb-2">What does this feature enable? How is it better than the alternative?</p>
        <textarea
          value={item.advantage}
          onChange={(e) => onChange(index, 'advantage', e.target.value)}
          placeholder="Boots up in seconds, no waiting for programs to load"
          rows={2}
          className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-sm text-white placeholder-galactic/60 focus:outline-none focus:ring-2 focus:ring-azure focus:border-azure transition-colors resize-y min-h-[50px]"
        />
      </div>

      <div>
        <label className="block mb-1.5">
          <span className="text-xs font-semibold text-cloudy">Benefit</span>
        </label>
        <p className="text-xs text-galactic mb-2">Why does the customer care? How does this improve their life or work?</p>
        <textarea
          value={item.benefit}
          onChange={(e) => onChange(index, 'benefit', e.target.value)}
          placeholder="Spend less time waiting and more time working on what matters"
          rows={2}
          className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-sm text-white placeholder-galactic/60 focus:outline-none focus:ring-2 focus:ring-azure focus:border-azure transition-colors resize-y min-h-[50px]"
        />
      </div>
    </div>
  )
}

export default function FrameworkForm({
  framework,
  aidaData,
  pasData,
  fabData,
  commonData,
  onAidaChange,
  onPasChange,
  onFabChange,
  onAddFabItem,
  onRemoveFabItem,
  onCommonChange,
}) {
  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-6 sm:p-8">
      {/* Common Fields */}
      <div className="mb-6 pb-6 border-b border-metal/20">
        <TextInputField
          label="Product Name"
          placeholder="e.g., InvoiceFlow Pro"
          value={commonData.productName}
          onChange={(e) => onCommonChange('productName', e.target.value)}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInputField
            label="Target Audience"
            helperText="Who is this product for?"
            placeholder="e.g., Freelancers and small agencies"
            value={commonData.targetAudience}
            onChange={(e) => onCommonChange('targetAudience', e.target.value)}
          />
          <TextInputField
            label="Price / CTA"
            helperText="Pricing or call-to-action text"
            placeholder="e.g., $29/month — Start Free Trial"
            value={commonData.priceCta}
            onChange={(e) => onCommonChange('priceCta', e.target.value)}
          />
        </div>
      </div>

      {/* Framework Explainer */}
      <div className="mb-6 p-4 rounded-xl bg-midnight/50 border border-metal/10">
        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-azure mt-0.5 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          <p className="text-sm text-cloudy leading-relaxed">
            {FRAMEWORK_EXPLAINERS[framework]}
          </p>
        </div>
      </div>

      {/* Framework-Specific Fields */}
      {framework === 'aida' && (
        <div className="animate-fadeIn">
          {AIDA_FIELDS.map((field) => (
            <TextareaField
              key={field.key}
              label={field.label}
              helperText={field.helperText}
              placeholder={field.placeholder}
              value={aidaData[field.key]}
              onChange={(e) => onAidaChange(field.key, e.target.value)}
              rows={field.rows}
              sectionColor={SECTION_COLORS.aida[field.key]}
            />
          ))}
        </div>
      )}

      {framework === 'pas' && (
        <div className="animate-fadeIn">
          {PAS_FIELDS.map((field) => (
            <TextareaField
              key={field.key}
              label={field.label}
              helperText={field.helperText}
              placeholder={field.placeholder}
              value={pasData[field.key]}
              onChange={(e) => onPasChange(field.key, e.target.value)}
              rows={field.rows}
              sectionColor={SECTION_COLORS.pas[field.key]}
            />
          ))}
        </div>
      )}

      {framework === 'fab' && (
        <div className="animate-fadeIn">
          {fabData.map((item, index) => (
            <FabItemCard
              key={item.id}
              item={item}
              index={index}
              total={fabData.length}
              onChange={onFabChange}
              onRemove={onRemoveFabItem}
            />
          ))}

          <button
            onClick={onAddFabItem}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-metal/40 rounded-xl text-sm text-cloudy hover:text-white hover:border-azure/50 transition-colors focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Another Feature
          </button>
        </div>
      )}
    </div>
  )
}
