function ScoreRing({ score, size = 48, strokeWidth = 4, label }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const getColor = (s) => {
    if (s >= 80) return { stroke: 'text-turtle', text: 'text-turtle', bg: 'bg-turtle/10' }
    if (s >= 50) return { stroke: 'text-tangerine', text: 'text-tangerine', bg: 'bg-tangerine/10' }
    if (s > 0) return { stroke: 'text-coral', text: 'text-coral', bg: 'bg-coral/10' }
    return { stroke: 'text-metal', text: 'text-galactic', bg: 'bg-metal/10' }
  }

  const colors = getColor(score)
  const getLabel = (s) => {
    if (s >= 90) return 'Excellent'
    if (s >= 75) return 'Good'
    if (s >= 50) return 'Fair'
    if (s > 0) return 'Needs Work'
    return 'N/A'
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-metal/20" />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={`${colors.stroke} transition-all duration-700`} />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${colors.text}`}>
          {score}
        </span>
      </div>
      {label && (
        <div className="text-center">
          <span className="block text-[10px] text-galactic leading-tight">{label}</span>
          <span className={`block text-[10px] font-medium ${colors.text}`}>{getLabel(score)}</span>
        </div>
      )}
    </div>
  )
}

function MetricRow({ label, value, detail, color = 'text-cloudy' }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-metal/10 last:border-0">
      <span className="text-xs text-galactic">{label}</span>
      <div className="text-right">
        <span className={`text-xs font-semibold ${color}`}>{value}</span>
        {detail && <p className="text-[10px] text-galactic max-w-[200px] mt-0.5">{detail}</p>}
      </div>
    </div>
  )
}

export default function OverallScoreCard({ overallScore, sectionScores, targetKeyword }) {
  if (!overallScore || overallScore.overall === 0) return null

  const { persuasiveness, readability, benefitToFeature, wordCount, seoReadiness } = overallScore

  const readabilityColor = readability.score >= 70 ? 'text-turtle' : readability.score >= 40 ? 'text-tangerine' : 'text-coral'
  const bfColor = benefitToFeature.score >= 70 ? 'text-turtle' : benefitToFeature.score >= 40 ? 'text-tangerine' : 'text-coral'

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-5 mt-4">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-azure">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
        Description Score Card
      </h3>

      {/* Score Rings */}
      <div className="flex items-start justify-around mb-4 pb-4 border-b border-metal/20">
        <ScoreRing score={overallScore.overall} size={56} strokeWidth={5} label="Overall" />
        <ScoreRing score={persuasiveness} size={44} label="Persuasion" />
        <ScoreRing score={readability.score} size={44} label="Readability" />
        <ScoreRing score={benefitToFeature.score} size={44} label="Benefits" />
      </div>

      {/* Detailed Metrics */}
      <div className="space-y-0">
        <MetricRow
          label="Readability"
          value={`Grade ${readability.grade}`}
          detail={readability.grade > 8 ? 'Aim for grade 6-8 for web copy' : 'Good readability for web'}
          color={readabilityColor}
        />
        <MetricRow
          label="Benefit:Feature Ratio"
          value={benefitToFeature.ratio}
          detail={benefitToFeature.features > benefitToFeature.benefits
            ? `${benefitToFeature.features} features but only ${benefitToFeature.benefits} benefits. Aim for 2:1 benefit-to-feature.`
            : 'Good balance of benefits vs features'
          }
          color={bfColor}
        />
        <MetricRow
          label="Word Count"
          value={`${wordCount.words} words`}
          color="text-cloudy"
        />
        {targetKeyword && targetKeyword.trim() && (
          <MetricRow
            label={`Keyword: "${targetKeyword}"`}
            value={`${seoReadiness.density}% density (${seoReadiness.count}x)`}
            detail={seoReadiness.count === 0
              ? 'Keyword not found. Add it naturally to improve SEO.'
              : seoReadiness.density < 1
                ? 'Density below 1%. Consider adding the keyword once more.'
                : seoReadiness.density > 3
                  ? 'Density above 3%. May appear like keyword stuffing.'
                  : 'Good keyword density for SEO.'
            }
            color={seoReadiness.score >= 70 ? 'text-turtle' : seoReadiness.score >= 40 ? 'text-tangerine' : 'text-coral'}
          />
        )}
      </div>

      {/* Section Breakdown */}
      {Object.keys(sectionScores).length > 0 && (
        <div className="mt-4 pt-3 border-t border-metal/20">
          <span className="text-[10px] text-galactic uppercase tracking-wider font-medium block mb-2">Section Breakdown</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(sectionScores).map(([key, s]) => {
              if (!s || s.overall === 0) return null
              const color = s.overall >= 70 ? 'border-turtle/30 text-turtle' : s.overall >= 40 ? 'border-tangerine/30 text-tangerine' : 'border-coral/30 text-coral'
              return (
                <div key={key} className={`rounded-lg border px-2 py-1.5 text-center ${color}`}>
                  <span className="block text-[10px] text-galactic capitalize">{key}</span>
                  <span className="text-sm font-bold">{s.overall}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
