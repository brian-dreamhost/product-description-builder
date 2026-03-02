import { useState, useMemo, useCallback } from 'react'
import { scoreCompetitorDescription } from './scoringEngine.js'

function ComparisonBar({ label, yours, competitor, max = 100 }) {
  const yourPct = Math.min(100, (yours / max) * 100)
  const compPct = Math.min(100, (competitor / max) * 100)
  const youWin = yours >= competitor

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-galactic">{label}</span>
        <div className="flex items-center gap-3 text-[10px]">
          <span className={youWin ? 'text-turtle font-semibold' : 'text-cloudy'}>{yours}</span>
          <span className="text-metal">vs</span>
          <span className={!youWin ? 'text-coral font-semibold' : 'text-cloudy'}>{competitor}</span>
        </div>
      </div>
      <div className="flex gap-0.5 h-2">
        <div className="flex-1 bg-metal/20 rounded-l-full overflow-hidden">
          <div
            className={`h-full rounded-l-full transition-all duration-500 ${youWin ? 'bg-turtle' : 'bg-azure'}`}
            style={{ width: `${Math.max(2, yourPct)}%` }}
          />
        </div>
        <div className="flex-1 bg-metal/20 rounded-r-full overflow-hidden flex justify-end">
          <div
            className={`h-full rounded-r-full transition-all duration-500 ${!youWin ? 'bg-coral' : 'bg-metal/40'}`}
            style={{ width: `${Math.max(2, compPct)}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between text-[9px] mt-0.5">
        <span className="text-azure">You</span>
        <span className="text-galactic">Competitor</span>
      </div>
    </div>
  )
}

function WinLossBadge({ yours, competitor, metric }) {
  const diff = yours - competitor
  if (diff > 10) return <span className="text-[9px] text-turtle font-medium">+{diff} ahead on {metric}</span>
  if (diff < -10) return <span className="text-[9px] text-coral font-medium">{Math.abs(diff)} behind on {metric}</span>
  return <span className="text-[9px] text-galactic font-medium">Tied on {metric}</span>
}

export default function CompetitorAnalyzer({ yourScore }) {
  const [competitorText, setCompetitorText] = useState('')
  const [analyzed, setAnalyzed] = useState(false)

  const competitorScore = useMemo(() => {
    if (!competitorText.trim()) return null
    return scoreCompetitorDescription(competitorText)
  }, [competitorText])

  const handleAnalyze = useCallback(() => {
    if (competitorText.trim()) {
      setAnalyzed(true)
    }
  }, [competitorText])

  const handleClear = useCallback(() => {
    setCompetitorText('')
    setAnalyzed(false)
  }, [])

  const hasYourData = yourScore && yourScore.overall > 0

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-5 mt-4">
      <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-prince">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
        Competitor Comparison
      </h3>
      <p className="text-[11px] text-galactic mb-3">Paste a competitor's product description to compare against yours.</p>

      <textarea
        value={competitorText}
        onChange={(e) => {
          setCompetitorText(e.target.value)
          if (analyzed) setAnalyzed(false)
        }}
        placeholder="Paste a competitor's product description here..."
        rows={4}
        className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-sm text-white placeholder-galactic/60 focus:outline-none focus:ring-2 focus:ring-azure focus:border-azure transition-colors resize-y min-h-[80px] mb-3"
      />

      <div className="flex gap-2">
        <button
          onClick={handleAnalyze}
          disabled={!competitorText.trim()}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss ${
            competitorText.trim()
              ? 'bg-prince text-white hover:bg-prince/80'
              : 'bg-metal/20 text-galactic cursor-not-allowed'
          }`}
        >
          Analyze Competitor
        </button>
        {analyzed && (
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-lg text-sm font-medium text-galactic border border-metal/30 hover:text-white hover:border-metal/50 transition-colors focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results */}
      {analyzed && competitorScore && (
        <div className="mt-4 pt-4 border-t border-metal/20 animate-fadeIn">
          {hasYourData ? (
            <>
              {/* Comparison Bars */}
              <div className="mb-4">
                <ComparisonBar label="Overall Score" yours={yourScore.overall} competitor={competitorScore.overall} />
                <ComparisonBar label="Readability" yours={yourScore.readability?.score || 0} competitor={competitorScore.readability.score} />
                <ComparisonBar label="Emotional Impact" yours={yourScore.emotional?.score || 0} competitor={competitorScore.emotional.score} />
                <ComparisonBar label="Specificity" yours={yourScore.specificity?.score || 0} competitor={competitorScore.specificity.score} />
                <ComparisonBar label="CTA Strength" yours={yourScore.cta?.score || 0} competitor={competitorScore.cta.score} />
              </div>

              {/* Win/Loss Summary */}
              <div className="p-3 rounded-lg bg-midnight/50 border border-metal/10 mb-3">
                <span className="text-[10px] text-galactic uppercase tracking-wider font-medium block mb-1.5">Summary</span>
                <div className="space-y-1">
                  <WinLossBadge yours={yourScore.readability?.score || 0} competitor={competitorScore.readability.score} metric="readability" />
                  <br />
                  <WinLossBadge yours={yourScore.emotional?.score || 0} competitor={competitorScore.emotional.score} metric="emotional impact" />
                  <br />
                  <WinLossBadge yours={yourScore.specificity?.score || 0} competitor={competitorScore.specificity.score} metric="specificity" />
                  <br />
                  <WinLossBadge yours={yourScore.cta?.score || 0} competitor={competitorScore.cta.score} metric="CTA strength" />
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-galactic italic mb-3">Fill in your description above to compare side-by-side.</p>
          )}

          {/* Competitor Stats */}
          <div className="p-3 rounded-lg bg-midnight/50 border border-metal/10">
            <span className="text-[10px] text-galactic uppercase tracking-wider font-medium block mb-2">Competitor Analysis</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-galactic block">Words</span>
                <span className="text-white font-semibold">{competitorScore.words}</span>
              </div>
              <div>
                <span className="text-galactic block">Grade Level</span>
                <span className="text-white font-semibold">{competitorScore.readability.grade}</span>
              </div>
              <div>
                <span className="text-galactic block">Power Words</span>
                <span className="text-white font-semibold">{competitorScore.emotional.powerWords.count}</span>
              </div>
              <div>
                <span className="text-galactic block">Weak Words</span>
                <span className={`font-semibold ${competitorScore.emotional.weakWords.length > 0 ? 'text-coral' : 'text-turtle'}`}>
                  {competitorScore.emotional.weakWords.length}
                </span>
              </div>
              <div>
                <span className="text-galactic block">Specifics</span>
                <span className="text-white font-semibold">{competitorScore.specificity.details.totalSpecifics || 0}</span>
              </div>
              <div>
                <span className="text-galactic block">Overall</span>
                <span className={`font-semibold ${competitorScore.overall >= 70 ? 'text-turtle' : competitorScore.overall >= 40 ? 'text-tangerine' : 'text-coral'}`}>
                  {competitorScore.overall}/100
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
