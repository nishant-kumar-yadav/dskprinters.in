// ---------------------------------------------------------------------------
// SEO Keyword Matrix — single source of truth (see SEO-PLAN.md)
// Used by:
//   1. SeoLandingPage.jsx  — parses /s/:keyword slugs, generates H1/title/meta
//   2. scripts/generate-sitemap.js — generates every sitemap.xml URL
// Plain ESM with no browser/React dependencies so Node scripts can import it.
// ---------------------------------------------------------------------------

export const SITE_URL = 'https://dskprinters.in'

// Each SEO "product" maps a human name + slug fragment to the real catalog
// category slugs whose products should be shown on that landing page.
export const SEO_PRODUCTS = [
  {
    slug: 'uv-dtf-sticker',
    name: 'UV DTF Sticker',
    categorySlugs: ['uv-dtf-sticker'],
    aliases: [
      { slug: 'uv-dtf-label', name: 'UV DTF Label' },
      { slug: 'ink-transfer-sticker', name: 'INK Transfer Sticker' },
      { slug: 'vinyl-sticker', name: 'Vinyl Sticker' },
      { slug: 'waterproof-sticker', name: 'Waterproof Sticker' },
    ],
    applications: ['glass', 'wood', 'metal', 'plastic', 'mug', 'bottle', 'phone-cover', 'laptop'],
  },
  {
    slug: 'dtf-sticker',
    name: 'DTF Sticker',
    categorySlugs: ['dtf-sticker', 't-shirt-sticker'],
    aliases: [
      { slug: 'dtf-transfer', name: 'DTF Transfer' },
      { slug: 'heat-press-transfer', name: 'Heat Press Transfer' },
      { slug: 'garment-transfer', name: 'Garment Transfer' },
    ],
    applications: ['tshirt', 'sweatshirt', 'bags', 'hoodies', 'caps', 'uniforms'],
  },
  {
    slug: 'heat-transfer-sticker',
    name: 'Heat Transfer Sticker',
    categorySlugs: ['heat-transfer-stickers', 'heat-transfer-sticker'],
    aliases: [
      { slug: 'heat-press-sticker', name: 'Heat Press Sticker' },
      { slug: 'iron-on-transfer', name: 'Iron-on Transfer' },
    ],
    applications: ['fabric', 'cotton', 'polyester', 'sportswear'],
  },
  {
    slug: 'heat-transfer-labels',
    name: 'Heat Transfer Labels',
    categorySlugs: ['garment-labels', 'transfer-label', 'clothing-labels'],
    aliases: [
      { slug: 'garment-labels', name: 'Garment Labels' },
      { slug: 'clothing-tags', name: 'Clothing Tags' },
      { slug: 'neck-labels', name: 'Neck Labels' },
      { slug: 'care-labels', name: 'Care Labels' },
    ],
    applications: ['tshirts', 'uniforms', 'sportswear', 'fashion-brands'],
  },
  {
    slug: 'silicone-heat-transfer-labels',
    name: 'Silicone Heat Transfer Labels',
    categorySlugs: ['silicone-heat-transfer-label'],
    aliases: [
      { slug: '3d-labels', name: '3D Labels' },
      { slug: 'raised-labels', name: 'Raised Labels' },
      { slug: 'rubber-labels', name: 'Rubber Labels' },
    ],
    applications: ['sportswear', 'luxury-fashion', 'premium-branding'],
  },
  {
    slug: 'custom-printed-tshirts',
    name: 'Custom Printed T-Shirts',
    categorySlugs: ['t-shirt-printing-services', 'corporate-t-shirt', 'customized-t-shirt', 'promotional-t-shirt'],
    aliases: [
      { slug: 'corporate-tshirts', name: 'Corporate T-Shirts' },
      { slug: 'promotional-tshirts', name: 'Promotional T-Shirts' },
      { slug: 'event-tshirts', name: 'Event T-Shirts' },
      { slug: 'custom-tshirt-printing', name: 'Custom T-Shirt Printing' },
    ],
    applications: ['corporate-events', 'brand-merchandise', 'uniforms'],
  },
]

export const BUSINESS_TYPES = [
  { slug: 'manufacturer', name: 'Manufacturer' },
  { slug: 'supplier', name: 'Supplier' },
  { slug: 'wholesaler', name: 'Wholesaler' },
]

export const LOCATIONS = [
  { slug: 'delhi', name: 'Delhi' },
  { slug: 'noida', name: 'Noida' },
  { slug: 'gurgaon', name: 'Gurgaon' },
  { slug: 'mumbai', name: 'Mumbai' },
  { slug: 'india', name: 'India' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function titleCase(slugFragment) {
  return slugFragment
    .split('-')
    .map((w) => {
      if (w === 'uv' || w === 'dtf' || w === 'ink' || w === '3d') return w.toUpperCase()
      if (w === 'tshirt' || w === 'tshirts') return 'T-Shirt' + (w.endsWith('s') ? 's' : '')
      return w.charAt(0).toUpperCase() + w.slice(1)
    })
    .join(' ')
}

/**
 * Parse an /s/:keyword slug into its dimensions.
 * Handles: [product]-for-[application], [product]-[businessType]-[location],
 * and any combination of the three, plus unknown/free-form slugs.
 */
export function parseKeywordSlug(slug) {
  let rest = slug.toLowerCase()

  // 1. Match product (canonical slug or alias) — longest match wins
  let matchedProduct = null
  let matchedName = null
  const candidates = []
  for (const p of SEO_PRODUCTS) {
    candidates.push({ slug: p.slug, name: p.name, product: p })
    for (const a of p.aliases) candidates.push({ slug: a.slug, name: a.name, product: p })
  }
  candidates.sort((a, b) => b.slug.length - a.slug.length)
  for (const c of candidates) {
    if (rest === c.slug || rest.startsWith(c.slug + '-')) {
      matchedProduct = c.product
      matchedName = c.name
      rest = rest.slice(c.slug.length).replace(/^-/, '')
      break
    }
  }

  // 2. Match location (always at the end)
  let location = null
  for (const loc of LOCATIONS) {
    if (rest === loc.slug || rest.endsWith('-' + loc.slug)) {
      location = loc
      rest = rest.slice(0, rest.length - loc.slug.length).replace(/-$/, '')
      break
    }
  }

  // 3. Match business type
  let businessType = null
  for (const bt of BUSINESS_TYPES) {
    if (rest === bt.slug || rest.endsWith('-' + bt.slug)) {
      businessType = bt
      rest = rest.slice(0, rest.length - bt.slug.length).replace(/-$/, '')
      break
    }
  }

  // 4. Whatever remains after "for-" is the application
  let application = null
  const forMatch = rest.match(/^for-(.+)$/) || rest.match(/^(.+)$/)
  if (forMatch && forMatch[1]) application = forMatch[1]

  return {
    product: matchedProduct,
    productName: matchedName,
    application: application ? titleCase(application) : null,
    applicationSlug: application || null,
    businessType,
    location,
  }
}

/** Build the H1 for a parsed keyword, e.g. "UV DTF Sticker for Glass Manufacturer in Delhi" */
export function buildH1(parsed, fallbackSlug) {
  if (!parsed.productName) return titleCase(fallbackSlug)
  let h1 = parsed.productName
  if (parsed.application) h1 += ` for ${parsed.application}`
  if (parsed.businessType) h1 += ` ${parsed.businessType.name}`
  if (parsed.location) h1 += ` in ${parsed.location.name}`
  return h1
}

/** Build the <title> tag */
export function buildTitle(h1) {
  return `${h1} | Best Price & Bulk Quote | DSK Printers`
}

/** Build meta description */
export function buildMetaDescription(h1, parsed) {
  const loc = parsed.location ? parsed.location.name : 'India'
  return `Looking for ${h1.toLowerCase()}? DSK Printers is a trusted ${
    parsed.businessType ? parsed.businessType.name.toLowerCase() : 'manufacturer & supplier'
  } based in New Delhi serving ${loc}. GST registered, bulk pricing, pan-India delivery. Get a free quote today.`
}

/**
 * Score a product's relevance against a parsed keyword (0 = irrelevant).
 * Uses category mapping first, then tags/applications/alternateNames/name/desc.
 */
export function scoreProduct(product, parsed, rawSlug) {
  let score = 0
  const words = rawSlug.toLowerCase().split('-').filter((w) => w.length > 2)
  const haystackParts = [
    product.name,
    product.desc,
    ...(product.tags || []),
    ...(product.applications || []),
    ...(product.alternateNames || []),
  ]
  const haystack = haystackParts.join(' ').toLowerCase()

  if (parsed.product && parsed.product.categorySlugs.includes(product.category)) score += 10
  if (parsed.applicationSlug) {
    const app = parsed.applicationSlug.replace(/-/g, ' ')
    if (haystack.includes(app)) score += 5
  }
  for (const w of words) {
    if (haystack.includes(w)) score += 1
  }
  return score
}

/** Generate every keyword slug combination for the sitemap. */
export function generateAllKeywordSlugs() {
  const slugs = new Set()

  for (const p of SEO_PRODUCTS) {
    const names = [{ slug: p.slug }, ...p.aliases]

    for (const n of names) {
      // Product alone
      slugs.add(n.slug)

      // Product + application
      for (const app of p.applications) {
        slugs.add(`${n.slug}-for-${app}`)
      }

      // Product + business type (+ location)
      for (const bt of BUSINESS_TYPES) {
        slugs.add(`${n.slug}-${bt.slug}`)
        for (const loc of LOCATIONS) {
          slugs.add(`${n.slug}-${bt.slug}-${loc.slug}`)
        }
      }

      // Product + location
      for (const loc of LOCATIONS) {
        slugs.add(`${n.slug}-${loc.slug}`)
      }

      // Product + application + business type + location (canonical name only,
      // to keep the sitemap focused and avoid thin-content explosion)
      if (n.slug === p.slug) {
        for (const app of p.applications) {
          for (const bt of BUSINESS_TYPES) {
            for (const loc of LOCATIONS) {
              slugs.add(`${n.slug}-for-${app}-${bt.slug}-${loc.slug}`)
            }
          }
        }
      }
    }
  }

  return [...slugs].sort()
}

/** Related keywords for internal linking on a landing page. */
export function relatedKeywords(parsed, limit = 12) {
  if (!parsed.product) return []
  const p = parsed.product
  const out = []

  for (const app of p.applications) {
    out.push({ slug: `${p.slug}-for-${app}`, label: `${p.name} for ${titleCase(app)}` })
  }
  for (const bt of BUSINESS_TYPES) {
    for (const loc of LOCATIONS) {
      out.push({
        slug: `${p.slug}-${bt.slug}-${loc.slug}`,
        label: `${p.name} ${bt.name} in ${loc.name}`,
      })
    }
  }
  for (const a of p.aliases) {
    out.push({ slug: a.slug, label: a.name })
  }

  return out.slice(0, limit)
}
