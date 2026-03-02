// ============================================================
// Scoring Engine for Product Description Builder
// Provides real-time analysis of copy quality, readability,
// emotional language, specificity, and CTA strength.
// ============================================================

// ---- Power Words Database (100+ words, categorized) ----
export const POWER_WORDS = {
  urgency: [
    'now', 'today', 'immediately', 'hurry', 'instant', 'fast', 'quick',
    'limited', 'deadline', 'expires', 'rush', 'don\'t miss', 'act now',
    'before', 'last chance', 'running out', 'countdown', 'urgent', 'asap',
    'right now', 'time-sensitive'
  ],
  exclusivity: [
    'exclusive', 'members-only', 'insider', 'secret', 'private', 'invitation',
    'vip', 'elite', 'premium', 'select', 'handpicked', 'curated', 'rare',
    'first', 'only', 'unique', 'one-of-a-kind', 'custom', 'bespoke',
    'personalized', 'tailored'
  ],
  trust: [
    'proven', 'guaranteed', 'certified', 'tested', 'verified', 'trusted',
    'backed', 'endorsed', 'award-winning', 'rated', 'reviewed', 'recommended',
    'official', 'authentic', 'legitimate', 'secure', 'safe', 'reliable',
    'dependable', 'accredited', 'recognized'
  ],
  emotion: [
    'love', 'amazing', 'incredible', 'powerful', 'stunning', 'remarkable',
    'extraordinary', 'breakthrough', 'revolutionary', 'transform', 'unlock',
    'discover', 'imagine', 'dream', 'inspire', 'empower', 'thrive',
    'effortless', 'seamless', 'brilliant', 'delightful', 'exciting'
  ],
  action: [
    'get', 'start', 'try', 'join', 'claim', 'grab', 'download', 'sign up',
    'subscribe', 'order', 'buy', 'shop', 'create', 'build', 'launch',
    'boost', 'grow', 'achieve', 'master', 'dominate', 'crush', 'accelerate',
    'supercharge', 'maximize', 'optimize', 'upgrade', 'level up'
  ],
  value: [
    'free', 'save', 'discount', 'bonus', 'deal', 'bargain', 'affordable',
    'value', 'worth', 'investment', 'roi', 'profit', 'revenue', 'income',
    'earn', 'gain', 'benefit', 'advantage', 'reward', 'perk'
  ],
  sensory: [
    'feel', 'touch', 'see', 'hear', 'taste', 'smooth', 'crisp', 'sharp',
    'bright', 'vivid', 'bold', 'rich', 'warm', 'cool', 'fresh', 'sleek',
    'elegant', 'luxurious', 'silky', 'vibrant'
  ],
}

// Flat set for fast lookup
const ALL_POWER_WORDS = new Set(
  Object.values(POWER_WORDS).flat().map(w => w.toLowerCase())
)

// ---- Weak / Filler Words ----
export const WEAK_WORDS = {
  'very': 'extremely, remarkably, exceptionally',
  'really': 'genuinely, truly, significantly',
  'nice': 'excellent, outstanding, impressive',
  'good': 'exceptional, superior, outstanding',
  'things': 'features, tools, capabilities, elements',
  'stuff': 'materials, resources, components',
  'great': 'exceptional, remarkable, outstanding',
  'a lot': 'numerous, substantial, significant',
  'kind of': 'somewhat, partially, moderately',
  'sort of': 'somewhat, partially, fairly',
  'basically': '(remove — adds no value)',
  'actually': '(remove — adds no value)',
  'just': '(remove — weakens your statement)',
  'maybe': 'consider, potentially, likely',
  'probably': 'likely, typically, generally',
  'pretty': 'fairly, quite, reasonably',
  'some': 'specific number or percentage',
  'many': 'specific number, e.g., "12,000+"',
  'big': 'massive, substantial, significant',
  'small': 'compact, streamlined, precise',
  'fast': 'instant, 2x faster, sub-second',
  'easy': 'effortless, one-click, zero-setup',
  'help': 'enable, empower, equip',
  'make': 'create, build, deliver, generate',
  'use': 'leverage, harness, deploy',
}

// ---- Word Count Targets per Section ----
export const WORD_COUNT_TARGETS = {
  aida: {
    attention: { min: 15, max: 30, ideal: 22 },
    interest: { min: 40, max: 80, ideal: 60 },
    desire: { min: 50, max: 100, ideal: 75 },
    action: { min: 15, max: 30, ideal: 22 },
  },
  pas: {
    problem: { min: 30, max: 60, ideal: 45 },
    agitate: { min: 40, max: 80, ideal: 60 },
    solution: { min: 50, max: 100, ideal: 75 },
  },
  fab: {
    feature: { min: 10, max: 20, ideal: 15 },
    advantage: { min: 15, max: 30, ideal: 22 },
    benefit: { min: 20, max: 40, ideal: 30 },
  },
}

// ---- Overall Description Ideal Word Counts ----
export const OVERALL_WORD_TARGETS = {
  structured: { min: 150, max: 300, ideal: 225, label: 'Structured' },
  paragraph: { min: 120, max: 250, ideal: 185, label: 'Paragraph' },
  bullet: { min: 100, max: 200, ideal: 150, label: 'Bullet Points' },
  amazon: { min: 200, max: 400, ideal: 300, label: 'Amazon Listing' },
  shopify: { min: 150, max: 350, ideal: 250, label: 'Shopify' },
  google_shopping: { min: 80, max: 200, ideal: 140, label: 'Google Shopping' },
  etsy: { min: 100, max: 300, ideal: 200, label: 'Etsy' },
  web_html: { min: 150, max: 350, ideal: 250, label: 'Web HTML' },
}

// ---- Utility Functions ----

function countWords(text) {
  if (!text || !text.trim()) return 0
  return text.trim().split(/\s+/).length
}

function countSentences(text) {
  if (!text || !text.trim()) return 0
  const sentences = text.trim().split(/[.!?]+/).filter(s => s.trim().length > 0)
  return Math.max(sentences.length, 1)
}

function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  const matches = word.match(/[aeiouy]{1,2}/g)
  return matches ? matches.length : 1
}

function totalSyllables(text) {
  if (!text || !text.trim()) return 0
  const words = text.trim().split(/\s+/)
  return words.reduce((sum, w) => sum + countSyllables(w), 0)
}

// ---- Readability (Flesch-Kincaid Grade Level) ----

export function fleschKincaidGrade(text) {
  const words = countWords(text)
  if (words < 3) return 0
  const sentences = countSentences(text)
  const syllables = totalSyllables(text)
  const grade = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
  return Math.max(0, Math.round(grade * 10) / 10)
}

export function fleschReadingEase(text) {
  const words = countWords(text)
  if (words < 3) return 100
  const sentences = countSentences(text)
  const syllables = totalSyllables(text)
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  return Math.max(0, Math.min(100, Math.round(score * 10) / 10))
}

// ---- Power Word Detection ----

export function findPowerWords(text) {
  if (!text || !text.trim()) return { found: [], count: 0, byCategory: {} }
  const lower = text.toLowerCase()
  const found = []
  const byCategory = {}

  for (const [category, words] of Object.entries(POWER_WORDS)) {
    byCategory[category] = []
    for (const word of words) {
      // Use word boundary matching for multi-word phrases and single words
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      const matches = lower.match(regex)
      if (matches) {
        found.push({ word, category, count: matches.length })
        byCategory[category].push(word)
      }
    }
  }

  return { found, count: found.reduce((s, f) => s + f.count, 0), byCategory }
}

// ---- Weak Word Detection ----

export function findWeakWords(text) {
  if (!text || !text.trim()) return []
  const lower = text.toLowerCase()
  const found = []

  for (const [word, suggestion] of Object.entries(WEAK_WORDS)) {
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    const matches = lower.match(regex)
    if (matches) {
      found.push({ word, suggestion, count: matches.length })
    }
  }

  return found
}

// ---- Specificity Detection ----

export function analyzeSpecificity(text) {
  if (!text || !text.trim()) return { score: 0, numbers: [], percentages: [], timeframes: [], namedOutcomes: [] }

  const numbers = text.match(/\b\d+[\d,]*\.?\d*\b/g) || []
  const percentages = text.match(/\d+%/g) || []
  const timeframes = text.match(/\b(\d+\s*(?:seconds?|minutes?|hours?|days?|weeks?|months?|years?|mins?|hrs?))\b/gi) || []

  // Named outcomes: phrases like "saves X", "reduces X", "increases X", "cuts X"
  const outcomePatterns = text.match(/\b(saves?|reduces?|increases?|improves?|boosts?|cuts?|eliminates?|delivers?|generates?|earns?|grows?)\s+\w+/gi) || []

  // Specific comparisons like "2x faster", "3x more"
  const comparisons = text.match(/\b\d+x\s+\w+/gi) || []

  const totalSpecifics = numbers.length + percentages.length + timeframes.length + outcomePatterns.length + comparisons.length

  // Score: 0 specifics = 0, 1 = 30, 2 = 50, 3 = 70, 4 = 85, 5+ = 100
  const scoreMap = [0, 30, 50, 70, 85, 100]
  const score = totalSpecifics >= scoreMap.length ? 100 : scoreMap[totalSpecifics]

  return { score, numbers, percentages, timeframes, namedOutcomes: outcomePatterns, comparisons, totalSpecifics }
}

// ---- CTA Strength (for Action sections) ----

export function analyzeCTAStrength(text) {
  if (!text || !text.trim()) return { score: 0, hasActionVerb: false, hasUrgency: false, hasBenefit: false, hasFrictionReducer: false }

  const lower = text.toLowerCase()

  // Action verbs
  const actionVerbs = ['start', 'get', 'try', 'join', 'claim', 'grab', 'download', 'sign up',
    'subscribe', 'order', 'buy', 'shop', 'create', 'build', 'launch', 'begin', 'request',
    'schedule', 'book', 'reserve', 'activate', 'unlock', 'discover', 'explore']
  const hasActionVerb = actionVerbs.some(v => {
    const regex = new RegExp(`\\b${v}\\b`, 'i')
    return regex.test(lower)
  })

  // Urgency words
  const urgencyWords = ['now', 'today', 'limited', 'hurry', 'instant', 'immediately', 'before', 'last chance', 'don\'t wait', 'act fast']
  const hasUrgency = urgencyWords.some(w => lower.includes(w))

  // Benefit in CTA
  const benefitIndicators = ['free', 'save', 'boost', 'grow', 'improve', 'increase', 'reduce', 'faster', 'easier', 'better', 'more']
  const hasBenefit = benefitIndicators.some(w => lower.includes(w))

  // Friction reducers
  const frictionReducers = ['free', 'no credit card', 'no commitment', 'cancel anytime', 'risk-free',
    'money-back', 'guarantee', 'no obligation', 'no strings', 'trial', '30-day', '14-day', '7-day',
    'no setup', 'instant access', 'no download', 'no installation']
  const hasFrictionReducer = frictionReducers.some(w => lower.includes(w))

  let score = 0
  if (hasActionVerb) score += 30
  if (hasUrgency) score += 25
  if (hasBenefit) score += 25
  if (hasFrictionReducer) score += 20

  return { score: Math.min(100, score), hasActionVerb, hasUrgency, hasBenefit, hasFrictionReducer }
}

// ---- Section-Level Scoring ----

export function scoreSection(text, sectionKey, framework) {
  if (!text || !text.trim()) {
    return {
      length: { score: 0, words: 0, target: WORD_COUNT_TARGETS[framework]?.[sectionKey] || { min: 10, max: 50, ideal: 30 }, status: 'empty' },
      readability: { score: 0, grade: 0, ease: 100, label: '' },
      emotional: { score: 0, powerWords: { found: [], count: 0, byCategory: {} }, weakWords: [] },
      specificity: { score: 0, details: { numbers: [], percentages: [], timeframes: [], namedOutcomes: [] } },
      cta: null,
      overall: 0,
    }
  }

  const words = countWords(text)
  const target = WORD_COUNT_TARGETS[framework]?.[sectionKey] || { min: 10, max: 50, ideal: 30 }

  // Length score
  let lengthScore = 0
  if (words >= target.min && words <= target.max) {
    // In range: score 70-100 based on distance from ideal
    const distFromIdeal = Math.abs(words - target.ideal)
    const maxDist = Math.max(target.ideal - target.min, target.max - target.ideal)
    lengthScore = Math.round(100 - (distFromIdeal / maxDist) * 30)
  } else if (words < target.min) {
    // Below range
    lengthScore = Math.max(0, Math.round((words / target.min) * 60))
  } else {
    // Above range
    const overshoot = words - target.max
    lengthScore = Math.max(10, Math.round(60 - (overshoot / target.max) * 40))
  }

  const lengthStatus = words < target.min ? 'short' : words > target.max ? 'long' : 'good'

  // Readability
  const grade = fleschKincaidGrade(text)
  const ease = fleschReadingEase(text)
  let readabilityScore = 0
  // Ideal for web copy: grade 6-8
  if (grade >= 6 && grade <= 8) readabilityScore = 100
  else if (grade < 6) readabilityScore = Math.round(70 + (grade / 6) * 30)
  else readabilityScore = Math.max(0, Math.round(100 - (grade - 8) * 12))

  let readabilityLabel = ''
  if (grade <= 5) readabilityLabel = 'Very Easy'
  else if (grade <= 8) readabilityLabel = 'Ideal for Web'
  else if (grade <= 10) readabilityLabel = 'Slightly Complex'
  else if (grade <= 12) readabilityLabel = 'Complex'
  else readabilityLabel = 'Very Complex'

  // Emotional Language
  const powerWords = findPowerWords(text)
  const weakWords = findWeakWords(text)
  // Target: 5-7 power words per 100 words
  const pwPer100 = words > 0 ? (powerWords.count / words) * 100 : 0
  let emotionalScore = 0
  if (pwPer100 >= 5 && pwPer100 <= 10) emotionalScore = 100
  else if (pwPer100 < 5) emotionalScore = Math.round((pwPer100 / 5) * 80)
  else emotionalScore = Math.max(50, Math.round(100 - (pwPer100 - 10) * 5))

  // Penalize for weak words
  const weakPenalty = Math.min(30, weakWords.reduce((s, w) => s + w.count * 8, 0))
  emotionalScore = Math.max(0, emotionalScore - weakPenalty)

  // Specificity
  const specificityDetails = analyzeSpecificity(text)

  // CTA (only for action-type sections)
  const ctaSections = ['action']
  let ctaResult = null
  if (ctaSections.includes(sectionKey)) {
    ctaResult = analyzeCTAStrength(text)
  }

  // Overall section score (weighted)
  let overall = 0
  if (ctaResult) {
    overall = Math.round(lengthScore * 0.15 + readabilityScore * 0.2 + emotionalScore * 0.2 + specificityDetails.score * 0.2 + ctaResult.score * 0.25)
  } else {
    overall = Math.round(lengthScore * 0.2 + readabilityScore * 0.25 + emotionalScore * 0.3 + specificityDetails.score * 0.25)
  }

  return {
    length: { score: lengthScore, words, target, status: lengthStatus },
    readability: { score: readabilityScore, grade, ease, label: readabilityLabel },
    emotional: { score: emotionalScore, powerWords, weakWords },
    specificity: { score: specificityDetails.score, details: specificityDetails },
    cta: ctaResult,
    overall,
  }
}

// ---- Overall Description Scoring ----

export function scoreOverallDescription(allText, framework, sectionScores, targetKeyword = '') {
  if (!allText || !allText.trim()) {
    return {
      persuasiveness: 0,
      readability: { score: 0, grade: 0, ease: 100, label: '' },
      benefitToFeature: { score: 0, benefits: 0, features: 0, ratio: '0:0' },
      wordCount: { score: 0, words: 0, target: null },
      seoReadiness: { score: 0, keyword: '', density: 0, count: 0 },
      overall: 0,
    }
  }

  // Persuasiveness: weighted average of section scores
  const sectionValues = Object.values(sectionScores).filter(s => s && s.overall > 0)
  const persuasiveness = sectionValues.length > 0
    ? Math.round(sectionValues.reduce((s, v) => s + v.overall, 0) / sectionValues.length)
    : 0

  // Overall readability
  const grade = fleschKincaidGrade(allText)
  const ease = fleschReadingEase(allText)
  let readabilityScore = 0
  if (grade >= 6 && grade <= 8) readabilityScore = 100
  else if (grade < 6) readabilityScore = Math.round(70 + (grade / 6) * 30)
  else readabilityScore = Math.max(0, Math.round(100 - (grade - 8) * 12))

  let readabilityLabel = ''
  if (grade <= 5) readabilityLabel = 'Very Easy'
  else if (grade <= 8) readabilityLabel = 'Ideal for Web'
  else if (grade <= 10) readabilityLabel = 'Slightly Complex'
  else if (grade <= 12) readabilityLabel = 'Complex'
  else readabilityLabel = 'Very Complex'

  // Benefit-to-Feature ratio
  const lower = allText.toLowerCase()
  const featureIndicators = ['feature', 'includes', 'built-in', 'equipped', 'comes with', 'has', 'offers', 'provides', 'supports', 'integrates']
  const benefitIndicators = ['save', 'grow', 'increase', 'improve', 'reduce', 'eliminate', 'boost', 'achieve', 'enjoy', 'feel', 'spend less', 'spend more', 'get more', 'never worry', 'gain', 'earn']

  let featureCount = 0
  let benefitCount = 0
  featureIndicators.forEach(w => {
    const regex = new RegExp(`\\b${w}\\b`, 'gi')
    const matches = lower.match(regex)
    if (matches) featureCount += matches.length
  })
  benefitIndicators.forEach(w => {
    const regex = new RegExp(`\\b${w}\\b`, 'gi')
    const matches = lower.match(regex)
    if (matches) benefitCount += matches.length
  })

  let bfScore = 0
  if (benefitCount >= featureCount * 2) bfScore = 100
  else if (benefitCount >= featureCount) bfScore = 70
  else if (benefitCount > 0) bfScore = Math.round((benefitCount / Math.max(featureCount, 1)) * 60)
  else bfScore = featureCount > 0 ? 10 : 0

  const bfRatio = `${benefitCount}:${featureCount}`

  // Word count
  const words = countWords(allText)

  // SEO readiness
  let seoScore = 0
  let keywordDensity = 0
  let keywordCount = 0
  if (targetKeyword && targetKeyword.trim()) {
    const kwLower = targetKeyword.trim().toLowerCase()
    const regex = new RegExp(`\\b${kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    const matches = allText.match(regex)
    keywordCount = matches ? matches.length : 0
    keywordDensity = words > 0 ? Math.round((keywordCount / words) * 100 * 100) / 100 : 0

    // Ideal density: 1-3%
    if (keywordDensity >= 1 && keywordDensity <= 3) seoScore = 100
    else if (keywordDensity > 0 && keywordDensity < 1) seoScore = Math.round(keywordDensity * 60)
    else if (keywordDensity > 3) seoScore = Math.max(20, Math.round(100 - (keywordDensity - 3) * 20))
    else seoScore = 0
  }

  // Overall
  const weights = targetKeyword ? [0.3, 0.25, 0.2, 0.1, 0.15] : [0.35, 0.3, 0.2, 0.15, 0]
  const overall = Math.round(
    persuasiveness * weights[0] +
    readabilityScore * weights[1] +
    bfScore * weights[2] +
    50 * weights[3] + // word count gets a baseline
    seoScore * weights[4]
  )

  return {
    persuasiveness,
    readability: { score: readabilityScore, grade, ease, label: readabilityLabel },
    benefitToFeature: { score: bfScore, benefits: benefitCount, features: featureCount, ratio: bfRatio },
    wordCount: { score: 0, words },
    seoReadiness: { score: seoScore, keyword: targetKeyword, density: keywordDensity, count: keywordCount },
    overall,
  }
}

// ---- Competitor Scoring (same engine, different context) ----

export function scoreCompetitorDescription(text) {
  if (!text || !text.trim()) return null

  const words = countWords(text)
  const grade = fleschKincaidGrade(text)
  const ease = fleschReadingEase(text)
  const powerWords = findPowerWords(text)
  const weakWords = findWeakWords(text)
  const specificity = analyzeSpecificity(text)
  const cta = analyzeCTAStrength(text)

  let readabilityScore = 0
  if (grade >= 6 && grade <= 8) readabilityScore = 100
  else if (grade < 6) readabilityScore = Math.round(70 + (grade / 6) * 30)
  else readabilityScore = Math.max(0, Math.round(100 - (grade - 8) * 12))

  let readabilityLabel = ''
  if (grade <= 5) readabilityLabel = 'Very Easy'
  else if (grade <= 8) readabilityLabel = 'Ideal for Web'
  else if (grade <= 10) readabilityLabel = 'Slightly Complex'
  else if (grade <= 12) readabilityLabel = 'Complex'
  else readabilityLabel = 'Very Complex'

  const pwPer100 = words > 0 ? (powerWords.count / words) * 100 : 0
  let emotionalScore = 0
  if (pwPer100 >= 5 && pwPer100 <= 10) emotionalScore = 100
  else if (pwPer100 < 5) emotionalScore = Math.round((pwPer100 / 5) * 80)
  else emotionalScore = Math.max(50, Math.round(100 - (pwPer100 - 10) * 5))
  const weakPenalty = Math.min(30, weakWords.reduce((s, w) => s + w.count * 8, 0))
  emotionalScore = Math.max(0, emotionalScore - weakPenalty)

  const overall = Math.round(readabilityScore * 0.25 + emotionalScore * 0.3 + specificity.score * 0.25 + cta.score * 0.2)

  return {
    words,
    readability: { score: readabilityScore, grade, ease, label: readabilityLabel },
    emotional: { score: emotionalScore, powerWords, weakWords },
    specificity: { score: specificity.score, details: specificity },
    cta,
    overall,
  }
}

// ---- Keyword Placement Suggestions ----

export function analyzeKeywordPlacement(sections, targetKeyword) {
  if (!targetKeyword || !targetKeyword.trim()) return null

  const kwLower = targetKeyword.trim().toLowerCase()
  const regex = new RegExp(`\\b${kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
  const results = {}

  for (const [key, text] of Object.entries(sections)) {
    if (!text || !text.trim()) {
      results[key] = { found: false, count: 0, suggestion: `Consider naturally including "${targetKeyword}" in your ${key} section.` }
      continue
    }
    const matches = text.match(regex)
    const count = matches ? matches.length : 0
    results[key] = {
      found: count > 0,
      count,
      suggestion: count === 0 ? `Consider naturally including "${targetKeyword}" in your ${key} section.` : null,
    }
  }

  return results
}
