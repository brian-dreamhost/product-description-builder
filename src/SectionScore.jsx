import { useState } from 'react'

function ScoreGauge({ score, size = 'sm', label }) {
  const getColor = (s) => {
    if (s >= 80) return { ring: 'text-turtle', bg: 'bg-turtle/10', text: 'text-turtle' }
    if (s >= 50) return { ring: 'text-tangerine', bg: 'bg-tangerine/10', text: 'text-tangerine' }
    if (s > 0) return { ring: 'text-coral', bg: 'bg-coral/10', text: 'text-coral' }
    return { ring: 'text-metal', bg: 'bg-metal/10', text: 'text-galactic' }
  }

  const colors = getColor(score)
  const radius = size === 'sm' ? 14 : 20
  const stroke = size === 'sm' ? 3 : 4
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const svgSize = (radius + stroke) * 2

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="transform -rotate-90">
          <circle cx={radius + stroke} cy={radius + stroke} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-metal/20" />
          <circle cx={radius + stroke} cy={radius + stroke} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={`${colors.ring} transition-all duration-500`} />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center ${size === 'sm' ? 'text-[9px]' : 'text-xs'} font-bold ${colors.text}`}>
          {score}
        </span>
      </div>
      {label && <span className="text-[10px] text-galactic">{label}</span>}
    </div>
  )
}

function WordCountBar({ words, target }) {
  const { min, max } = target
  const percentage = Math.min(100, (words / max) * 100)

  let barColor = 'bg-coral'
  let statusText = ''
  if (words === 0) {
    barColor = 'bg-metal/30'
    statusText = `${min}-${max} words recommended`
  } else if (words < min) {
    barColor = 'bg-coral'
    statusText = `${words}/${min}-${max} words (too short)`
  } else if (words <= max) {
    barColor = 'bg-turtle'
    statusText = `${words}/${min}-${max} words`
  } else {
    barColor = 'bg-tangerine'
    statusText = `${words}/${min}-${max} words (too long)`
  }

  return (
    <div className="mt-1.5">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-metal/20 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${Math.max(2, percentage)}%` }} />
        </div>
        <span className="text-[10px] text-galactic whitespace-nowrap">{statusText}</span>
      </div>
    </div>
  )
}

function PowerWordBadge({ category, count }) {
  const categoryColors = {
    urgency: 'text-coral border-coral/30',
    exclusivity: 'text-prince border-prince/30',
    trust: 'text-turtle border-turtle/30',
    emotion: 'text-tangerine border-tangerine/30',
    action: 'text-azure border-azure/30',
    value: 'text-sunflower border-sunflower/30',
    sensory: 'text-cloudy border-cloudy/30',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] border ${categoryColors[category] || 'text-galactic border-metal/30'}`}>
      {category} ({count})
    </span>
  )
}

export default function SectionScore({ score, compact = false }) {
  const [expanded, setExpanded] = useState(false)

  if (!score || score.length?.words === 0) {
    return (
      <div className="mt-2 px-3 py-2 rounded-lg bg-midnight/30 border border-metal/10">
        <WordCountBar words={0} target={score?.length?.target || { min: 10, max: 50 }} />
      </div>
    )
  }

  const { length, readability, emotional, specificity, cta, overall } = score

  return (
    <div className="mt-2 px-3 py-2.5 rounded-lg bg-midnight/30 border border-metal/10">
      {/* Summary Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <ScoreGauge score={overall} label="Overall" />
          {!compact && (
            <>
              <ScoreGauge score={readability.score} label="Read." />
              <ScoreGauge score={emotional.score} label="Emotion" />
              <ScoreGauge score={specificity.score} label="Specific" />
              {cta && <ScoreGauge score={cta.score} label="CTA" />}
            </>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-azure hover:text-white transition-colors shrink-0"
          aria-label={expanded ? 'Hide details' : 'Show details'}
        >
          {expanded ? 'Less' : 'Details'}
        </button>
      </div>

      {/* Word Count Bar */}
      <WordCountBar words={length.words} target={length.target} />

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-3 space-y-3 animate-fadeIn">
          {/* Readability */}
          <div className="text-[11px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-galactic font-medium">Readability</span>
              <span className={`font-semibold ${readability.grade <= 8 ? 'text-turtle' : readability.grade <= 10 ? 'text-tangerine' : 'text-coral'}`}>
                Grade {readability.grade} -- {readability.label}
              </span>
            </div>
            <p className="text-galactic text-[10px]">
              {readability.grade <= 5 && 'Great simplicity. Your copy is accessible to everyone.'}
              {readability.grade > 5 && readability.grade <= 8 && 'Perfect for web copy. Clear and easy to scan.'}
              {readability.grade > 8 && readability.grade <= 10 && 'Consider simplifying. Aim for grade 6-8 for web copy.'}
              {readability.grade > 10 && 'Too complex for web copy. Use shorter sentences and simpler words.'}
            </p>
          </div>

          {/* Power Words */}
          <div className="text-[11px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-galactic font-medium">Power Words</span>
              <span className={`font-semibold ${emotional.powerWords.count >= 3 ? 'text-turtle' : emotional.powerWords.count > 0 ? 'text-tangerine' : 'text-coral'}`}>
                {emotional.powerWords.count} found
              </span>
            </div>
            {emotional.powerWords.count > 0 && (
              <div className="flex flex-wrap gap-1 mb-1">
                {Object.entries(emotional.powerWords.byCategory).filter(([, words]) => words.length > 0).map(([cat, words]) => (
                  <PowerWordBadge key={cat} category={cat} count={words.length} />
                ))}
              </div>
            )}
            {emotional.powerWords.count < 3 && (
              <p className="text-galactic text-[10px]">
                Add power words like "proven", "instant", "transform", or "guaranteed" to increase emotional impact.
              </p>
            )}
          </div>

          {/* Weak Words */}
          {emotional.weakWords.length > 0 && (
            <div className="text-[11px]">
              <span className="text-coral font-medium block mb-1">Weak Words Found</span>
              <div className="space-y-1">
                {emotional.weakWords.slice(0, 4).map((w, i) => (
                  <div key={i} className="flex items-start gap-1 text-[10px]">
                    <span className="text-coral shrink-0">"{w.word}"</span>
                    <span className="text-galactic">{'->'} try: {w.suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specificity */}
          <div className="text-[11px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-galactic font-medium">Specificity</span>
              <span className={`font-semibold ${specificity.score >= 70 ? 'text-turtle' : specificity.score >= 40 ? 'text-tangerine' : 'text-coral'}`}>
                {specificity.details.totalSpecifics || 0} specific claims
              </span>
            </div>
            {specificity.score < 50 && (
              <p className="text-galactic text-[10px]">
                No specific numbers found. Try: "saves 3 hours/week" instead of "saves time", or "12,000+ customers" instead of "many customers."
              </p>
            )}
          </div>

          {/* CTA Strength */}
          {cta && (
            <div className="text-[11px]">
              <span className="text-galactic font-medium block mb-1">CTA Strength</span>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <div className={`flex items-center gap-1 ${cta.hasActionVerb ? 'text-turtle' : 'text-coral'}`}>
                  {cta.hasActionVerb ? '\u2713' : '\u2717'} Action verb
                </div>
                <div className={`flex items-center gap-1 ${cta.hasUrgency ? 'text-turtle' : 'text-coral'}`}>
                  {cta.hasUrgency ? '\u2713' : '\u2717'} Urgency
                </div>
                <div className={`flex items-center gap-1 ${cta.hasBenefit ? 'text-turtle' : 'text-coral'}`}>
                  {cta.hasBenefit ? '\u2713' : '\u2717'} Benefit
                </div>
                <div className={`flex items-center gap-1 ${cta.hasFrictionReducer ? 'text-turtle' : 'text-coral'}`}>
                  {cta.hasFrictionReducer ? '\u2713' : '\u2717'} Friction reducer
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
