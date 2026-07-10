#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Sitemap generator — combines Product Names + Applications + Business Types
// + Locations from the shared SEO keyword matrix (src/seo/keywords.js) into
// a full sitemap.xml with hundreds of /s/ URLs.
//
// Usage:  node scripts/generate-sitemap.js
// Output: client/public/sitemap.xml  (served at /sitemap.xml by Vite)
// Runs automatically before every `pnpm build` (see package.json).
// ---------------------------------------------------------------------------

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_URL, generateAllKeywordSlugs } from '../src/seo/keywords.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT = resolve(__dirname, '../public/sitemap.xml')

const today = new Date().toISOString().slice(0, 10)

// Static site pages
const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/about', priority: '0.7', changefreq: 'monthly' },
  { loc: '/products', priority: '0.9', changefreq: 'weekly' },
  { loc: '/reviews', priority: '0.6', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.8', changefreq: 'monthly' },
]

// Category pages (kept in sync with server/seedData.js categories)
const categorySlugs = [
  'uv-dtf-sticker',
  'dtf-sticker',
  'heat-transfer-stickers',
  'heat-transfer-sticker',
  't-shirt-sticker',
  't-shirt-printing-services',
  'garment-labels',
  'cartoon-character-heat-press',
  'transfer-label',
  'corporate-t-shirt',
  'silicone-heat-transfer-label',
  'polycarbonate-sticker',
  'clothing-labels',
  'customized-t-shirt',
  'promotional-t-shirt',
]

// Programmatic SEO keyword pages
const keywordSlugs = generateAllKeywordSlugs()

function urlEntry(loc, priority, changefreq) {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

const entries = [
  ...staticPages.map((p) => urlEntry(p.loc, p.priority, p.changefreq)),
  ...categorySlugs.map((slug) => urlEntry(`/category/${slug}`, '0.8', 'weekly')),
  ...keywordSlugs.map((slug) => urlEntry(`/s/${slug}`, '0.6', 'monthly')),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`

mkdirSync(dirname(OUTPUT), { recursive: true })
writeFileSync(OUTPUT, xml)

console.log(`sitemap.xml generated: ${OUTPUT}`)
console.log(`  static pages:   ${staticPages.length}`)
console.log(`  category pages: ${categorySlugs.length}`)
console.log(`  /s/ SEO pages:  ${keywordSlugs.length}`)
console.log(`  TOTAL URLs:     ${entries.length}`)
