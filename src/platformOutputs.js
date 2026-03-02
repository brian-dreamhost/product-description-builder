// ============================================================
// Platform-Specific Output Generators
// Formats product descriptions for Amazon, Shopify, Google
// Shopping, Etsy, and general web HTML.
// ============================================================

function stripMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#+\s/gm, '')
    .replace(/^-\s/gm, '')
    .replace(/^---$/gm, '')
    .trim()
}

function truncate(text, max) {
  if (!text || text.length <= max) return text
  return text.slice(0, max - 3).replace(/\s+\S*$/, '') + '...'
}

// ---- Amazon Listing ----
export function generateAmazonOutput(framework, data, commonData) {
  const { productName, targetAudience, priceCta } = commonData
  const name = productName?.trim() || 'Product'
  const sections = []

  // Title (200 chars max)
  let title = name
  if (framework === 'aida' && data.attention) {
    title = `${name} - ${stripMarkdown(data.attention)}`
  } else if (framework === 'pas' && data.solution) {
    title = `${name} - ${stripMarkdown(data.solution).split('.')[0]}`
  } else if (framework === 'fab' && data[0]?.benefit) {
    title = `${name} - ${stripMarkdown(data[0].benefit).split('.')[0]}`
  }
  sections.push({ label: 'Product Title', content: truncate(title, 200), maxChars: 200, type: 'text' })

  // Bullet Points (5 bullets, each 500 chars max)
  const bullets = []
  if (framework === 'aida') {
    if (data.interest) bullets.push(truncate(stripMarkdown(data.interest), 500))
    if (data.desire) {
      const sentences = stripMarkdown(data.desire).split(/[.!?]+/).filter(s => s.trim())
      sentences.forEach(s => bullets.push(truncate(s.trim(), 500)))
    }
    if (data.action) bullets.push(truncate(stripMarkdown(data.action), 500))
  } else if (framework === 'pas') {
    if (data.problem) bullets.push(truncate(stripMarkdown(data.problem), 500))
    if (data.agitate) bullets.push(truncate(stripMarkdown(data.agitate), 500))
    if (data.solution) {
      const sentences = stripMarkdown(data.solution).split(/[.!?]+/).filter(s => s.trim())
      sentences.forEach(s => bullets.push(truncate(s.trim(), 500)))
    }
  } else if (framework === 'fab') {
    data.forEach(item => {
      const parts = []
      if (item.feature?.trim()) parts.push(item.feature.trim())
      if (item.advantage?.trim()) parts.push(item.advantage.trim())
      if (item.benefit?.trim()) parts.push(item.benefit.trim())
      if (parts.length) bullets.push(truncate(parts.join(' - '), 500))
    })
  }

  // Ensure exactly 5 bullets
  while (bullets.length < 5 && bullets.length > 0) {
    bullets.push('')
  }
  sections.push({
    label: 'Key Feature Bullets (5 max, 500 chars each)',
    items: bullets.slice(0, 5).filter(b => b),
    type: 'bullets',
  })

  // Description (2000 chars)
  let desc = ''
  if (framework === 'aida') {
    desc = [data.attention, data.interest, data.desire, data.action].filter(s => s?.trim()).map(s => stripMarkdown(s)).join('\n\n')
  } else if (framework === 'pas') {
    desc = [data.problem, data.agitate, data.solution].filter(s => s?.trim()).map(s => stripMarkdown(s)).join('\n\n')
  } else if (framework === 'fab') {
    desc = data.filter(item => item.feature?.trim() || item.benefit?.trim()).map(item => {
      const parts = []
      if (item.feature?.trim()) parts.push(item.feature.trim())
      if (item.advantage?.trim()) parts.push(item.advantage.trim())
      if (item.benefit?.trim()) parts.push(item.benefit.trim())
      return parts.join('. ')
    }).join('\n\n')
  }
  if (targetAudience) desc = `For ${targetAudience}.\n\n${desc}`
  if (priceCta) desc += `\n\n${priceCta}`

  sections.push({ label: 'Product Description', content: truncate(desc, 2000), maxChars: 2000, type: 'text' })

  return { platform: 'amazon', sections }
}

// ---- Shopify (HTML formatted) ----
export function generateShopifyOutput(framework, data, commonData) {
  const { productName, targetAudience, priceCta } = commonData
  const name = productName?.trim() || 'Product'
  let html = ''

  if (framework === 'aida') {
    html += `<h2>${name}</h2>\n`
    if (targetAudience) html += `<p><em>For ${targetAudience}</em></p>\n`
    if (data.attention?.trim()) html += `\n<h3>Why ${name}?</h3>\n<p>${stripMarkdown(data.attention)}</p>\n`
    if (data.interest?.trim()) html += `\n<h3>How It Works</h3>\n<p>${stripMarkdown(data.interest)}</p>\n`
    if (data.desire?.trim()) html += `\n<h3>What You Get</h3>\n<p>${stripMarkdown(data.desire)}</p>\n`
    if (data.action?.trim()) html += `\n<p><strong>${stripMarkdown(data.action)}</strong></p>\n`
  } else if (framework === 'pas') {
    html += `<h2>${name}</h2>\n`
    if (targetAudience) html += `<p><em>For ${targetAudience}</em></p>\n`
    if (data.problem?.trim()) html += `\n<p>${stripMarkdown(data.problem)}</p>\n`
    if (data.agitate?.trim()) html += `\n<p>${stripMarkdown(data.agitate)}</p>\n`
    if (data.solution?.trim()) html += `\n<h3>The Solution</h3>\n<p>${stripMarkdown(data.solution)}</p>\n`
  } else if (framework === 'fab') {
    html += `<h2>${name}</h2>\n`
    if (targetAudience) html += `<p><em>For ${targetAudience}</em></p>\n`
    html += '\n<ul>\n'
    data.filter(item => item.feature?.trim()).forEach(item => {
      html += `  <li><strong>${item.feature.trim()}</strong>`
      if (item.advantage?.trim()) html += ` &mdash; ${item.advantage.trim()}`
      if (item.benefit?.trim()) html += `. ${item.benefit.trim()}`
      html += `</li>\n`
    })
    html += '</ul>\n'
  }

  if (priceCta) html += `\n<p><strong>${priceCta}</strong></p>`

  return {
    platform: 'shopify',
    sections: [
      { label: 'Shopify HTML Description', content: html.trim(), type: 'html' },
    ],
  }
}

// ---- Google Shopping ----
export function generateGoogleShoppingOutput(framework, data, commonData) {
  const { productName, targetAudience, priceCta } = commonData
  const name = productName?.trim() || 'Product'

  // Short description (150 chars)
  let shortDesc = name
  if (framework === 'aida' && data.attention?.trim()) {
    shortDesc = `${name}: ${stripMarkdown(data.attention)}`
  } else if (framework === 'pas' && data.problem?.trim()) {
    shortDesc = `${name}: ${stripMarkdown(data.problem).split('.')[0]}`
  } else if (framework === 'fab' && data[0]?.benefit?.trim()) {
    shortDesc = `${name}: ${stripMarkdown(data[0].benefit).split('.')[0]}`
  }

  // Full description (5000 chars)
  let fullDesc = ''
  if (framework === 'aida') {
    fullDesc = [data.attention, data.interest, data.desire, data.action]
      .filter(s => s?.trim()).map(s => stripMarkdown(s)).join(' ')
  } else if (framework === 'pas') {
    fullDesc = [data.problem, data.agitate, data.solution]
      .filter(s => s?.trim()).map(s => stripMarkdown(s)).join(' ')
  } else if (framework === 'fab') {
    fullDesc = data.filter(item => item.feature?.trim())
      .map(item => [item.feature, item.advantage, item.benefit].filter(s => s?.trim()).join('. '))
      .join(' ')
  }
  if (targetAudience) fullDesc = `For ${targetAudience}. ${fullDesc}`
  if (priceCta) fullDesc += ` ${priceCta}`

  return {
    platform: 'google_shopping',
    sections: [
      { label: 'Short Description', content: truncate(shortDesc, 150), maxChars: 150, type: 'text' },
      { label: 'Full Description', content: truncate(fullDesc, 5000), maxChars: 5000, type: 'text' },
    ],
  }
}

// ---- Etsy ----
export function generateEtsyOutput(framework, data, commonData) {
  const { productName, targetAudience, priceCta } = commonData
  const name = productName?.trim() || 'Product'

  // Title (140 chars)
  let title = name
  if (framework === 'aida' && data.attention?.trim()) {
    title = `${name} - ${stripMarkdown(data.attention).split('.')[0]}`
  } else if (framework === 'fab' && data[0]?.benefit?.trim()) {
    title = `${name} - ${stripMarkdown(data[0].benefit).split('.')[0]}`
  }

  // Tags (13 max)
  const allText = framework === 'fab'
    ? data.map(item => [item.feature, item.advantage, item.benefit].join(' ')).join(' ')
    : Object.values(data).filter(v => typeof v === 'string').join(' ')

  // Extract meaningful words for tags
  const words = (allText + ' ' + (name || '') + ' ' + (targetAudience || ''))
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3)

  const stopWords = new Set(['that', 'this', 'with', 'from', 'your', 'they', 'have', 'will', 'been', 'more', 'when', 'what', 'than', 'each', 'about', 'them', 'into', 'just', 'also', 'were', 'does'])
  const tagCandidates = [...new Set(words.filter(w => !stopWords.has(w)))]
  const tags = tagCandidates.slice(0, 13)

  // Description
  let desc = ''
  if (framework === 'aida') {
    desc = [data.attention, data.interest, data.desire, data.action]
      .filter(s => s?.trim()).map(s => stripMarkdown(s)).join('\n\n')
  } else if (framework === 'pas') {
    desc = [data.problem, data.agitate, data.solution]
      .filter(s => s?.trim()).map(s => stripMarkdown(s)).join('\n\n')
  } else if (framework === 'fab') {
    desc = data.filter(item => item.feature?.trim())
      .map(item => [item.feature, item.advantage, item.benefit].filter(s => s?.trim()).join('. '))
      .join('\n\n')
  }
  if (targetAudience) desc = `Perfect for ${targetAudience}.\n\n${desc}`
  if (priceCta) desc += `\n\n${priceCta}`

  return {
    platform: 'etsy',
    sections: [
      { label: 'Listing Title', content: truncate(title, 140), maxChars: 140, type: 'text' },
      { label: 'Tags (13 max)', items: tags, type: 'tags' },
      { label: 'Description', content: desc, type: 'text' },
    ],
  }
}

// ---- General Web HTML ----
export function generateWebHtmlOutput(framework, data, commonData) {
  const { productName, targetAudience, priceCta } = commonData
  const name = productName?.trim() || 'Product'
  let html = ''

  html += `<article itemscope itemtype="https://schema.org/Product">\n`
  html += `  <h1 itemprop="name">${name}</h1>\n`
  if (targetAudience) html += `  <p class="audience"><em>For ${targetAudience}</em></p>\n`
  html += `\n  <div itemprop="description">\n`

  if (framework === 'aida') {
    if (data.attention?.trim()) html += `    <p class="hook">${stripMarkdown(data.attention)}</p>\n`
    if (data.interest?.trim()) html += `    <h2>What It Does</h2>\n    <p>${stripMarkdown(data.interest)}</p>\n`
    if (data.desire?.trim()) html += `    <h2>Why You Need It</h2>\n    <p>${stripMarkdown(data.desire)}</p>\n`
    if (data.action?.trim()) html += `    <p class="cta"><strong>${stripMarkdown(data.action)}</strong></p>\n`
  } else if (framework === 'pas') {
    if (data.problem?.trim()) html += `    <p>${stripMarkdown(data.problem)}</p>\n`
    if (data.agitate?.trim()) html += `    <p>${stripMarkdown(data.agitate)}</p>\n`
    if (data.solution?.trim()) html += `    <h2>The Solution</h2>\n    <p>${stripMarkdown(data.solution)}</p>\n`
  } else if (framework === 'fab') {
    html += `    <ul>\n`
    data.filter(item => item.feature?.trim()).forEach(item => {
      html += `      <li>\n`
      html += `        <strong>${item.feature.trim()}</strong>\n`
      if (item.advantage?.trim()) html += `        <span>${item.advantage.trim()}</span>\n`
      if (item.benefit?.trim()) html += `        <p>${item.benefit.trim()}</p>\n`
      html += `      </li>\n`
    })
    html += `    </ul>\n`
  }

  html += `  </div>\n`
  if (priceCta) html += `\n  <p class="cta"><strong>${priceCta}</strong></p>\n`
  html += `</article>`

  return {
    platform: 'web_html',
    sections: [
      { label: 'SEO-Friendly HTML', content: html.trim(), type: 'html' },
    ],
  }
}

// ---- Main Generator ----
export function generatePlatformOutput(platform, framework, frameworkData, commonData) {
  const generators = {
    amazon: generateAmazonOutput,
    shopify: generateShopifyOutput,
    google_shopping: generateGoogleShoppingOutput,
    etsy: generateEtsyOutput,
    web_html: generateWebHtmlOutput,
  }

  const generator = generators[platform]
  if (!generator) return null

  return generator(framework, frameworkData, commonData)
}
