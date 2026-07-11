import Category from './models/Category.js'
import Product from './models/Product.js'

const IMG = (name) => `/images/${name}.webp`

export const categories = [
  { name: 'UV DTF Sticker', slug: 'uv-dtf-sticker', image: IMG('cat-uv-dtf'), order: 1, defaultTags: ['uv dtf', 'uv label', 'ink transfer', 'waterproof sticker', 'vinyl sticker', 'sticker for mug', 'sticker for bottle'], defaultApplications: ['glass', 'wood', 'metal', 'plastic', 'mug', 'bottle', 'phone cover', 'laptop'], defaultAlternateNames: ['UV DTF Label', 'INK Transfer Sticker', 'Vinyl Sticker', 'Waterproof Sticker'] },
  { name: 'DTF Sticker', slug: 'dtf-sticker', image: IMG('cat-dtf'), order: 2, defaultTags: ['dtf', 'dtf transfer', 'heat press transfer', 'garment transfer', 'tshirt print'], defaultApplications: ['t-shirt', 'sweatshirt', 'bags', 'hoodies', 'caps', 'uniforms'], defaultAlternateNames: ['DTF Transfer', 'Heat Press Transfer', 'Garment Transfer'] },
  { name: 'Heat Transfer Stickers', slug: 'heat-transfer-stickers', image: IMG('cat-heat-transfer'), order: 3, defaultTags: ['heat transfer', 'heat press sticker', 'iron-on transfer', 'htv'], defaultApplications: ['fabric', 'cotton', 'polyester', 'sportswear'], defaultAlternateNames: ['Heat Press Sticker', 'Iron-on Transfer'] },
  { name: 'Heat Transfer Sticker', slug: 'heat-transfer-sticker', image: IMG('cat-heat-transfer-2'), order: 4, defaultTags: ['heat transfer', 'heat press sticker', 'iron-on transfer', 'plastisol transfer'], defaultApplications: ['fabric', 'cotton', 'polyester', 'sportswear'], defaultAlternateNames: ['Heat Press Sticker', 'Iron-on Transfer'] },
  { name: 'T-Shirt Sticker', slug: 't-shirt-sticker', image: IMG('cat-tshirt-sticker'), order: 5, defaultTags: ['tshirt sticker', 'dtf', 'heat press transfer', 'garment transfer'], defaultApplications: ['t-shirt', 'hoodies', 'sweatshirt', 'streetwear'], defaultAlternateNames: ['T-Shirt Transfer', 'Heat Press Transfer'] },
  { name: 'T Shirt Printing Services', slug: 't-shirt-printing-services', image: IMG('cat-tshirt-printing'), order: 6, defaultTags: ['tshirt printing', 'custom tshirt', 'corporate tshirt', 'promotional tshirt', 'event tshirt'], defaultApplications: ['corporate events', 'brand merchandise', 'uniforms'], defaultAlternateNames: ['Corporate T-shirts', 'Promotional T-shirts', 'Event T-shirts'] },
  { name: 'Garment Labels', slug: 'garment-labels', image: IMG('cat-garment-labels'), order: 7, defaultTags: ['garment label', 'clothing tag', 'neck label', 'care label', 'heat transfer label'], defaultApplications: ['t-shirts', 'uniforms', 'sportswear', 'fashion brands'], defaultAlternateNames: ['Garment Labels', 'Clothing Tags', 'Neck Labels', 'Care Labels'] },
  { name: 'Cartoon Character Heat Press', slug: 'cartoon-character-heat-press', image: IMG('cat-cartoon'), order: 8, defaultTags: ['cartoon sticker', 'heat press transfer', 'kidswear transfer', 'dtf'], defaultApplications: ['t-shirt', 'kidswear', 'uniforms', 'bags'], defaultAlternateNames: ['Cartoon Transfer', 'Kids Heat Press Sticker'] },
  { name: 'Transfer Label', slug: 'transfer-label', image: IMG('cat-transfer-label'), order: 9, defaultTags: ['transfer label', 'garment label', 'neck label', 'care label', 'heat transfer label'], defaultApplications: ['t-shirts', 'uniforms', 'sportswear', 'fashion brands'], defaultAlternateNames: ['Garment Labels', 'Clothing Tags', 'Neck Labels', 'Care Labels'] },
  { name: 'Corporate T-Shirt', slug: 'corporate-t-shirt', image: IMG('cat-corporate-tshirt'), order: 10, defaultTags: ['corporate tshirt', 'custom tshirt', 'uniform tshirt', 'tshirt printing'], defaultApplications: ['corporate events', 'brand merchandise', 'uniforms'], defaultAlternateNames: ['Corporate T-shirts', 'Promotional T-shirts', 'Event T-shirts'] },
  { name: 'Silicone Heat Transfer Label', slug: 'silicone-heat-transfer-label', image: IMG('cat-silicone'), order: 11, defaultTags: ['silicone label', '3d label', 'raised label', 'rubber label'], defaultApplications: ['sportswear', 'luxury fashion', 'premium branding'], defaultAlternateNames: ['3D Labels', 'Raised Labels', 'Rubber Labels'] },
  { name: 'Polycarbonate Sticker', slug: 'polycarbonate-sticker', image: IMG('cat-polycarbonate'), order: 12, defaultTags: ['polycarbonate sticker', 'dome sticker', 'waterproof sticker', 'industrial sticker'], defaultApplications: ['metal', 'plastic', 'appliances', 'machinery'], defaultAlternateNames: ['Dome Sticker', 'Panel Sticker', 'Waterproof Sticker'] },
  { name: 'Clothing Labels', slug: 'clothing-labels', image: IMG('cat-clothing-labels'), order: 13, defaultTags: ['clothing label', 'garment label', 'clothing tag', 'care label', 'brand label'], defaultApplications: ['t-shirts', 'uniforms', 'sportswear', 'fashion brands'], defaultAlternateNames: ['Garment Labels', 'Clothing Tags', 'Neck Labels', 'Care Labels'] },
  { name: 'Customized T Shirt', slug: 'customized-t-shirt', image: IMG('cat-custom-tshirt'), order: 14, defaultTags: ['custom tshirt', 'customized tshirt', 'tshirt printing', 'personalized tshirt'], defaultApplications: ['corporate events', 'brand merchandise', 'gifting', 'celebrations'], defaultAlternateNames: ['Corporate T-shirts', 'Promotional T-shirts', 'Event T-shirts'] },
  { name: 'Promotional T Shirt', slug: 'promotional-t-shirt', image: IMG('cat-promo-tshirt'), order: 15, defaultTags: ['promotional tshirt', 'event tshirt', 'tshirt printing', 'bulk tshirt'], defaultApplications: ['corporate events', 'trade shows', 'brand promotion', 'marathons'], defaultAlternateNames: ['Promotional T-shirts', 'Event T-shirts', 'Bulk T-shirts'] },
]

// ---------------------------------------------------------------------------
// SEO ENRICHMENT (see SEO-PLAN.md)
// Category-level tags / applications / alternateNames merged into every
// product below. Per-product overrides can be added in PRODUCT_SEO_OVERRIDES.
// ---------------------------------------------------------------------------

const CATEGORY_SEO = {
  'uv-dtf-sticker': {
    tags: ['uv dtf', 'uv label', 'ink transfer', 'waterproof sticker', 'vinyl sticker', 'sticker for mug', 'sticker for bottle'],
    applications: ['glass', 'wood', 'metal', 'plastic', 'mug', 'bottle', 'phone cover', 'laptop'],
    alternateNames: ['UV DTF Label', 'INK Transfer Sticker', 'Vinyl Sticker', 'Waterproof Sticker'],
  },
  'dtf-sticker': {
    tags: ['dtf', 'dtf transfer', 'heat press transfer', 'garment transfer', 'tshirt print'],
    applications: ['t-shirt', 'sweatshirt', 'bags', 'hoodies', 'caps', 'uniforms'],
    alternateNames: ['DTF Transfer', 'Heat Press Transfer', 'Garment Transfer'],
  },
  'heat-transfer-stickers': {
    tags: ['heat transfer', 'heat press sticker', 'iron-on transfer', 'htv'],
    applications: ['fabric', 'cotton', 'polyester', 'sportswear'],
    alternateNames: ['Heat Press Sticker', 'Iron-on Transfer'],
  },
  'heat-transfer-sticker': {
    tags: ['heat transfer', 'heat press sticker', 'iron-on transfer', 'plastisol transfer'],
    applications: ['fabric', 'cotton', 'polyester', 'sportswear'],
    alternateNames: ['Heat Press Sticker', 'Iron-on Transfer'],
  },
  't-shirt-sticker': {
    tags: ['tshirt sticker', 'dtf', 'heat press transfer', 'garment transfer'],
    applications: ['t-shirt', 'hoodies', 'sweatshirt', 'streetwear'],
    alternateNames: ['T-Shirt Transfer', 'Heat Press Transfer'],
  },
  't-shirt-printing-services': {
    tags: ['tshirt printing', 'custom tshirt', 'corporate tshirt', 'promotional tshirt', 'event tshirt'],
    applications: ['corporate events', 'brand merchandise', 'uniforms'],
    alternateNames: ['Corporate T-shirts', 'Promotional T-shirts', 'Event T-shirts'],
  },
  'garment-labels': {
    tags: ['garment label', 'clothing tag', 'neck label', 'care label', 'heat transfer label'],
    applications: ['t-shirts', 'uniforms', 'sportswear', 'fashion brands'],
    alternateNames: ['Garment Labels', 'Clothing Tags', 'Neck Labels', 'Care Labels'],
  },
  'cartoon-character-heat-press': {
    tags: ['cartoon sticker', 'heat press transfer', 'kidswear transfer', 'dtf'],
    applications: ['t-shirt', 'kidswear', 'uniforms', 'bags'],
    alternateNames: ['Cartoon Transfer', 'Kids Heat Press Sticker'],
  },
  'transfer-label': {
    tags: ['transfer label', 'garment label', 'neck label', 'care label', 'heat transfer label'],
    applications: ['t-shirts', 'uniforms', 'sportswear', 'fashion brands'],
    alternateNames: ['Garment Labels', 'Clothing Tags', 'Neck Labels', 'Care Labels'],
  },
  'corporate-t-shirt': {
    tags: ['corporate tshirt', 'custom tshirt', 'uniform tshirt', 'tshirt printing'],
    applications: ['corporate events', 'brand merchandise', 'uniforms'],
    alternateNames: ['Corporate T-shirts', 'Promotional T-shirts', 'Event T-shirts'],
  },
  'silicone-heat-transfer-label': {
    tags: ['silicone label', '3d label', 'raised label', 'rubber label'],
    applications: ['sportswear', 'luxury fashion', 'premium branding'],
    alternateNames: ['3D Labels', 'Raised Labels', 'Rubber Labels'],
  },
  'polycarbonate-sticker': {
    tags: ['polycarbonate sticker', 'dome sticker', 'waterproof sticker', 'industrial sticker'],
    applications: ['metal', 'plastic', 'appliances', 'machinery'],
    alternateNames: ['Dome Sticker', 'Panel Sticker', 'Waterproof Sticker'],
  },
  'clothing-labels': {
    tags: ['clothing label', 'garment label', 'clothing tag', 'care label', 'brand label'],
    applications: ['t-shirts', 'uniforms', 'sportswear', 'fashion brands'],
    alternateNames: ['Garment Labels', 'Clothing Tags', 'Neck Labels', 'Care Labels'],
  },
  'customized-t-shirt': {
    tags: ['custom tshirt', 'customized tshirt', 'tshirt printing', 'personalized tshirt'],
    applications: ['corporate events', 'brand merchandise', 'gifting', 'celebrations'],
    alternateNames: ['Corporate T-shirts', 'Promotional T-shirts', 'Event T-shirts'],
  },
  'promotional-t-shirt': {
    tags: ['promotional tshirt', 'event tshirt', 'campaign tshirt', 'tshirt printing'],
    applications: ['corporate events', 'brand merchandise', 'elections', 'marketing campaigns'],
    alternateNames: ['Corporate T-shirts', 'Promotional T-shirts', 'Event T-shirts'],
  },
}

// Per-product extra keywords (merged on top of the category defaults)
const PRODUCT_SEO_OVERRIDES = {
  'uv-dtf-bottle-wrap-sticker': { extraTags: ['bottle wrap', 'tumbler sticker', 'drinkware sticker'] },
  'dtf-name-number-print': { extraTags: ['jersey print', 'name number print', 'sports kit'] },
  'reflective-heat-transfer-sticker': { extraTags: ['reflective sticker', 'safety wear'] },
  'glitter-heat-transfer-sticker': { extraTags: ['glitter sticker'] },
  '3d-puff-t-shirt-sticker': { extraTags: ['3d puff', 'puff print'] },
  'election-campaign-t-shirt': { extraTags: ['election tshirt', 'campaign tshirt'] },
}

const rawProducts = [
  // UV DTF Sticker (4)
  {
    name: 'Multicolor UV DTF Sticker',
    slug: 'multicolor-uv-dtf-sticker',
    category: 'uv-dtf-sticker',
    price: '₹2 / Piece',
    desc: 'Premium multicolor UV DTF sticker with vibrant CMYK printing. Perfect for bottles, mugs, phone cases and hard surfaces. Waterproof, scratch-resistant and long-lasting with a glossy 3D finish.',
    image: IMG('cat-uv-dtf'),
    specs: { Material: 'PET', Color: 'Multicolor', Printing: 'CMYK UV', Finish: 'Glossy 3D', Packaging: 'Box', Size: 'Customized', 'Minimum Order': '100 Pieces' },
    featured: true,
    order: 1,
  },
  {
    name: 'Custom UV DTF Transfer Sticker',
    slug: 'custom-uv-dtf-transfer-sticker',
    category: 'uv-dtf-sticker',
    price: '₹2.50 / Piece',
    desc: 'Custom-shaped UV DTF transfer stickers for branding on glass, metal, plastic and ceramic surfaces. No heat required — simply peel and apply for a professional embossed look.',
    image: IMG('prod-uv-dtf-2'),
    specs: { Material: 'PET Film', Color: 'Multicolor', Application: 'Peel & Stick', Durability: 'Waterproof', Packaging: 'Carton', Size: '100x125mm' },
    featured: true,
    order: 2,
  },
  {
    name: 'UV DTF Logo Sticker',
    slug: 'uv-dtf-logo-sticker',
    category: 'uv-dtf-sticker',
    price: '₹3 / Piece',
    desc: 'High-definition UV DTF logo stickers for corporate branding. Crystal-clear detail reproduction with raised texture effect. Suitable for premium packaging and merchandise.',
    image: IMG('cat-uv-dtf'),
    specs: { Material: 'PET', Color: 'CMYK + White', Finish: 'Raised Gloss', Packaging: 'Polythene', Size: '50x38mm' },
    order: 3,
  },
  {
    name: 'UV DTF Bottle Wrap Sticker',
    slug: 'uv-dtf-bottle-wrap-sticker',
    category: 'uv-dtf-sticker',
    price: 'Get Best Quote',
    desc: 'Full-wrap UV DTF stickers designed for tumblers, water bottles and drinkware. Dishwasher-safe adhesion with brilliant color retention.',
    image: IMG('prod-uv-dtf-2'),
    specs: { Material: 'PET', Color: 'Multicolor', 'Wash Care': 'Dishwasher Safe', Packaging: 'Box', Size: 'Customized' },
    order: 4,
  },

  // DTF Sticker (4)
  {
    name: 'DTF Heat Transfer Sticker',
    slug: 'dtf-heat-transfer-sticker',
    category: 'dtf-sticker',
    price: '₹1.50 / Piece',
    desc: 'Direct-to-film heat transfer stickers for cotton, polyester and blended fabrics. Soft-hand feel with excellent stretch and rebound. Withstands 50+ washes without cracking or fading.',
    image: IMG('cat-dtf'),
    specs: { Material: 'TPU', Color: 'Multicolor', 'Wash Care': '50+ Washes', Application: 'Heat Press 160°C', Packaging: 'Polythene', Size: 'Customized' },
    featured: true,
    order: 1,
  },
  {
    name: 'Multicolor DTF Print Sticker',
    slug: 'multicolor-dtf-print-sticker',
    category: 'dtf-sticker',
    price: '₹2 / Piece',
    desc: 'Vibrant multicolor DTF prints with fine detail and gradient support. Ideal for fashion brands, sportswear and custom apparel businesses.',
    image: IMG('prod-dtf-2'),
    specs: { Material: 'TPU Film', Color: 'CMYK + White', 'Wash Care': 'Machine Wash', Packaging: 'Box', Size: '100x125mm' },
    featured: true,
    order: 2,
  },
  {
    name: 'DTF Gang Sheet Print',
    slug: 'dtf-gang-sheet-print',
    category: 'dtf-sticker',
    price: 'Get Best Quote',
    desc: 'Cost-effective DTF gang sheets — fit multiple designs on one sheet and cut as needed. Perfect for small businesses managing multiple designs.',
    image: IMG('cat-dtf'),
    specs: { Material: 'PET Film + TPU', Color: 'Multicolor', 'Sheet Size': '60x100cm', Packaging: 'Roll', 'Minimum Order': '10 Sheets' },
    order: 3,
  },
  {
    name: 'DTF Name & Number Print',
    slug: 'dtf-name-number-print',
    category: 'dtf-sticker',
    price: '₹1 / Piece',
    desc: 'Durable DTF name and number transfers for sports jerseys and team kits. High-opacity white base for bold results on dark fabrics.',
    image: IMG('prod-dtf-2'),
    specs: { Material: 'TPU', Color: 'Black, Red, Green, White', 'Wash Care': '50+ Washes', Packaging: 'Bag', Size: 'Customized' },
    order: 4,
  },

  // Heat Transfer Stickers (3)
  {
    name: 'Heat Transfer Vinyl Sticker',
    slug: 'heat-transfer-vinyl-sticker',
    category: 'heat-transfer-stickers',
    price: '₹2 / Piece',
    desc: 'Premium heat transfer vinyl stickers with strong adhesion and flexible finish. Suitable for t-shirts, hoodies, bags and caps.',
    image: IMG('cat-heat-transfer'),
    specs: { Material: 'PVC', Color: 'Multicolor', Application: 'Heat Press', 'Wash Care': 'Machine Wash', Packaging: 'Box' },
    featured: true,
    order: 1,
  },
  {
    name: 'Glitter Heat Transfer Sticker',
    slug: 'glitter-heat-transfer-sticker',
    category: 'heat-transfer-stickers',
    price: '₹3 / Piece',
    desc: 'Sparkling glitter heat transfer stickers that add premium shimmer to garments. Flake-free formula keeps its shine wash after wash.',
    image: IMG('prod-heat-2'),
    specs: { Material: 'PET Glitter Film', Color: 'Gold, Silver, Red, Multicolor', 'Wash Care': '40+ Washes', Packaging: 'Polythene', Size: 'Customized' },
    order: 2,
  },
  {
    name: 'Reflective Heat Transfer Sticker',
    slug: 'reflective-heat-transfer-sticker',
    category: 'heat-transfer-stickers',
    price: 'Get Best Quote',
    desc: 'High-visibility reflective heat transfers for safety wear, activewear and uniforms. Meets industrial reflectivity standards.',
    image: IMG('cat-heat-transfer'),
    specs: { Material: 'Reflective PET', Color: 'Silver Grey', Application: 'Heat Press 150°C', Packaging: 'Roll', Size: 'Customized' },
    order: 3,
  },

  // Heat Transfer Sticker (2)
  {
    name: 'Plastisol Heat Transfer Sticker',
    slug: 'plastisol-heat-transfer-sticker',
    category: 'heat-transfer-sticker',
    price: '₹1.50 / Piece',
    desc: 'Screen-printed plastisol heat transfers with bold, opaque colors. The industry standard for bulk garment decoration.',
    image: IMG('cat-heat-transfer-2'),
    specs: { Material: 'Plastisol Ink', Color: 'Multicolor', 'Wash Care': '50+ Washes', Packaging: 'Carton', 'Minimum Order': '500 Pieces' },
    order: 1,
  },
  {
    name: 'Custom Heat Transfer Sticker',
    slug: 'custom-heat-transfer-sticker',
    category: 'heat-transfer-sticker',
    price: '₹2 / Piece',
    desc: 'Fully customized heat transfer stickers made to your artwork, size and quantity requirements. Fast turnaround with pan-India delivery.',
    image: IMG('prod-heat-2'),
    specs: { Material: 'TPU / PVC', Color: 'As per Design', Packaging: 'Box', Size: 'Customized', 'Minimum Order': '100 Pieces' },
    featured: true,
    order: 2,
  },

  // T-Shirt Sticker (3)
  {
    name: 'Printed T-Shirt Sticker',
    slug: 'printed-t-shirt-sticker',
    category: 't-shirt-sticker',
    price: '₹1 / Piece',
    desc: 'Economical printed t-shirt stickers for bulk apparel decoration. Sharp print quality with soft feel on fabric.',
    image: IMG('cat-tshirt-sticker'),
    specs: { Material: 'TPU', Color: 'Multicolor', 'Wash Care': 'Machine Wash', Packaging: 'Polythene', Size: '50x38mm' },
    order: 1,
  },
  {
    name: '3D Puff T-Shirt Sticker',
    slug: '3d-puff-t-shirt-sticker',
    category: 't-shirt-sticker',
    price: '₹3 / Piece',
    desc: 'Raised 3D puff effect stickers that give garments a premium embossed look. Popular for streetwear and fashion brands.',
    image: IMG('prod-tshirt-sticker-2'),
    specs: { Material: 'Puff TPU', Color: 'Black, White, Red', Effect: '3D Raised', 'Wash Care': '40+ Washes', Packaging: 'Box' },
    featured: true,
    order: 2,
  },
  {
    name: 'Metallic Foil T-Shirt Sticker',
    slug: 'metallic-foil-t-shirt-sticker',
    category: 't-shirt-sticker',
    price: 'Get Best Quote',
    desc: 'Shiny metallic foil transfers in gold, silver and rose gold. Adds a luxury accent to apparel and merchandise.',
    image: IMG('cat-tshirt-sticker'),
    specs: { Material: 'Metallic Foil', Color: 'Gold, Silver, Rose Gold', Packaging: 'Polythene', Size: 'Customized' },
    order: 3,
  },

  // T Shirt Printing Services (2)
  {
    name: 'Custom T-Shirt Printing Service',
    slug: 'custom-t-shirt-printing-service',
    category: 't-shirt-printing-services',
    price: 'Get Best Quote',
    desc: 'End-to-end custom t-shirt printing service — DTF, screen print or vinyl. Send your design, we handle printing, quality check and delivery.',
    image: IMG('cat-tshirt-printing'),
    specs: { 'Print Methods': 'DTF, Screen, Vinyl', Fabric: 'Cotton, Polyester, Blends', 'Minimum Order': '50 Pieces', Delivery: 'Pan India' },
    featured: true,
    order: 1,
  },
  {
    name: 'Bulk T-Shirt Printing',
    slug: 'bulk-t-shirt-printing',
    category: 't-shirt-printing-services',
    price: 'Get Best Quote',
    desc: 'High-volume t-shirt printing for events, colleges and corporate orders. Competitive bulk pricing with consistent quality across thousands of pieces.',
    image: IMG('cat-tshirt-printing'),
    specs: { 'Print Method': 'Screen / DTF', Capacity: '5000+ Pieces/Week', 'Minimum Order': '200 Pieces', Packaging: 'Carton' },
    order: 2,
  },

  // Garment Labels (3)
  {
    name: 'Woven Garment Label',
    slug: 'woven-garment-label',
    category: 'garment-labels',
    price: '₹1 / Piece',
    desc: 'Premium woven damask labels for necklines and side seams. Soft edges, high thread density and precise logo reproduction.',
    image: IMG('cat-garment-labels'),
    specs: { Material: 'Damask Polyester', Color: 'Multicolor', Type: 'End Fold / Center Fold', Packaging: 'Bag', 'Minimum Order': '1000 Pieces' },
    order: 1,
  },
  {
    name: 'Printed Satin Garment Label',
    slug: 'printed-satin-garment-label',
    category: 'garment-labels',
    price: '₹0.80 / Piece',
    desc: 'Smooth satin wash-care and brand labels with crisp printing. Skin-friendly and durable through repeated washing.',
    image: IMG('prod-garment-2'),
    specs: { Material: 'Satin', Color: 'White, Black', Printing: 'Single/Double Side', 'Wash Care': 'Machine Wash', Packaging: 'Roll' },
    order: 2,
  },
  {
    name: 'Heat Transfer Garment Label',
    slug: 'heat-transfer-garment-label',
    category: 'garment-labels',
    price: '₹1.50 / Piece',
    desc: 'Tagless heat transfer labels — no itch, no sew. Ideal for innerwear, kidswear and activewear brands.',
    image: IMG('cat-garment-labels'),
    specs: { Material: 'TPU', Color: 'Multicolor', Type: 'Tagless', 'Wash Care': '50+ Washes', Packaging: 'Polythene' },
    featured: true,
    order: 3,
  },

  // Cartoon Character Heat Press (2)
  {
    name: 'Cartoon Character Heat Press Sticker',
    slug: 'cartoon-character-heat-press-sticker',
    category: 'cartoon-character-heat-press',
    price: '₹2 / Piece',
    desc: 'Colorful cartoon character heat press transfers for kidswear. Bright, playful designs with child-safe, non-toxic inks.',
    image: IMG('cat-cartoon'),
    specs: { Material: 'TPU', Color: 'Multicolor', Safety: 'Non-Toxic Inks', 'Wash Care': 'Machine Wash', Packaging: 'Box', Size: '100x125mm' },
    featured: true,
    order: 1,
  },
  {
    name: 'Custom Cartoon Design Transfer',
    slug: 'custom-cartoon-design-transfer',
    category: 'cartoon-character-heat-press',
    price: '₹2.50 / Piece',
    desc: 'Custom cartoon and mascot design transfers made from your artwork. Perfect for school uniforms, events and kids brands.',
    image: IMG('cat-cartoon'),
    specs: { Material: 'TPU', Color: 'As per Design', 'Wash Care': '40+ Washes', Packaging: 'Polythene', Size: 'Customized' },
    order: 2,
  },

  // Transfer Label (2)
  {
    name: 'Heat Transfer Neck Label',
    slug: 'heat-transfer-neck-label',
    category: 'transfer-label',
    price: '₹1 / Piece',
    desc: 'Tagless neck labels with size, brand and wash-care info in one transfer. Clean professional finish for apparel brands.',
    image: IMG('cat-transfer-label'),
    specs: { Material: 'TPU', Color: 'White, Black, Multicolor', Type: 'Tagless Neck', 'Wash Care': '50+ Washes', Packaging: 'Bag' },
    order: 1,
  },
  {
    name: 'Size Transfer Label Set',
    slug: 'size-transfer-label-set',
    category: 'transfer-label',
    price: '₹0.50 / Piece',
    desc: 'Standard size indicator transfer labels (S/M/L/XL/XXL) ready to press. Stocked for immediate dispatch.',
    image: IMG('cat-transfer-label'),
    specs: { Material: 'TPU', Color: 'Black, White', Sizes: 'S to XXL', Packaging: 'Polythene', 'Minimum Order': '1000 Pieces' },
    order: 2,
  },

  // Corporate T-Shirt (2)
  {
    name: 'Corporate Polo T-Shirt with Logo',
    slug: 'corporate-polo-t-shirt-with-logo',
    category: 'corporate-t-shirt',
    price: 'Get Best Quote',
    desc: 'Premium polo t-shirts with embroidered or printed company logos. Ideal for staff uniforms, events and corporate gifting.',
    image: IMG('cat-corporate-tshirt'),
    specs: { Fabric: 'Cotton Pique 220 GSM', Color: 'Navy, Black, White, Grey', Branding: 'Logo Print / Embroidery', 'Minimum Order': '50 Pieces' },
    featured: true,
    order: 1,
  },
  {
    name: 'Corporate Round Neck T-Shirt',
    slug: 'corporate-round-neck-t-shirt',
    category: 'corporate-t-shirt',
    price: 'Get Best Quote',
    desc: 'Comfortable round-neck cotton t-shirts customized with your company branding. Bulk pricing for large teams.',
    image: IMG('cat-corporate-tshirt'),
    specs: { Fabric: 'Cotton 180 GSM', Color: 'All Colors', Branding: 'DTF / Screen Print', 'Minimum Order': '100 Pieces', Packaging: 'Polythene' },
    order: 2,
  },

  // Silicone Heat Transfer Label (2)
  {
    name: 'Silicone Heat Transfer Label',
    slug: 'silicone-heat-transfer-label',
    category: 'silicone-heat-transfer-label',
    price: '₹3 / Piece',
    desc: '3D silicone heat transfer labels with a premium rubberized finish. Extremely durable — perfect for sportswear, caps and outdoor gear.',
    image: IMG('cat-silicone'),
    specs: { Material: 'Silicone Rubber', Color: 'Multicolor', Effect: '3D Raised', 'Wash Care': '60+ Washes', Packaging: 'Box', Size: 'Customized' },
    featured: true,
    order: 1,
  },
  {
    name: 'High-Density Silicone Logo Label',
    slug: 'high-density-silicone-logo-label',
    category: 'silicone-heat-transfer-label',
    price: 'Get Best Quote',
    desc: 'High-density silicone logo labels with sharp edges and deep 3D relief. The choice of premium activewear brands.',
    image: IMG('cat-silicone'),
    specs: { Material: 'Silicone', Color: 'Black, White, Custom', Thickness: 'Up to 1mm', Packaging: 'Carton', 'Minimum Order': '500 Pieces' },
    order: 2,
  },

  // Polycarbonate Sticker (2)
  {
    name: 'Polycarbonate Dome Sticker',
    slug: 'polycarbonate-dome-sticker',
    category: 'polycarbonate-sticker',
    price: '₹2.50 / Piece',
    desc: 'Crystal-clear polycarbonate dome stickers for appliances, electronics and machinery branding. Scratch and chemical resistant.',
    image: IMG('cat-polycarbonate'),
    specs: { Material: 'Polycarbonate', Color: 'Multicolor', Finish: 'Dome / Flat', Adhesive: '3M Grade', Packaging: 'Box', Size: '50x38mm' },
    order: 1,
  },
  {
    name: 'Industrial Polycarbonate Panel Sticker',
    slug: 'industrial-polycarbonate-panel-sticker',
    category: 'polycarbonate-sticker',
    price: 'Get Best Quote',
    desc: 'Durable polycarbonate panel overlays and stickers for control panels and industrial equipment. UV-stable printing that lasts years.',
    image: IMG('cat-polycarbonate'),
    specs: { Material: 'Polycarbonate 0.25mm', Printing: 'Reverse UV Print', Durability: '5+ Years Outdoor', Packaging: 'Carton', Size: 'Customized' },
    order: 2,
  },

  // Clothing Labels (2)
  {
    name: 'Custom Clothing Brand Label',
    slug: 'custom-clothing-brand-label',
    category: 'clothing-labels',
    price: '₹1 / Piece',
    desc: 'Custom brand labels for clothing lines — woven, printed or heat transfer. Elevate your brand with professional labeling.',
    image: IMG('cat-clothing-labels'),
    specs: { Material: 'Polyester / TPU', Color: 'Multicolor', Types: 'Woven, Printed, Transfer', Packaging: 'Bag', 'Minimum Order': '500 Pieces' },
    order: 1,
  },
  {
    name: 'Wash Care Clothing Label',
    slug: 'wash-care-clothing-label',
    category: 'clothing-labels',
    price: '₹0.60 / Piece',
    desc: 'Standard and custom wash-care labels with care symbols, fabric content and origin details. Compliant with textile labeling norms.',
    image: IMG('cat-clothing-labels'),
    specs: { Material: 'Satin / Taffeta', Color: 'White, Black', Printing: 'Care Symbols + Text', Packaging: 'Roll', 'Minimum Order': '1000 Pieces' },
    order: 2,
  },

  // Customized T Shirt (2)
  {
    name: 'Customized Printed T-Shirt',
    slug: 'customized-printed-t-shirt',
    category: 'customized-t-shirt',
    price: 'Get Best Quote',
    desc: 'Fully customized t-shirts printed with your design, photo or text. Single piece to bulk orders with premium DTF quality.',
    image: IMG('cat-custom-tshirt'),
    specs: { Fabric: 'Cotton 180-240 GSM', Color: 'All Colors', Printing: 'DTF Full Color', Sizes: 'XS to 5XL', Packaging: 'Polythene' },
    featured: true,
    order: 1,
  },
  {
    name: 'Couple & Family Custom T-Shirts',
    slug: 'couple-family-custom-t-shirts',
    category: 'customized-t-shirt',
    price: 'Get Best Quote',
    desc: 'Matching custom t-shirt sets for couples, families and friend groups. Popular for birthdays, trips and celebrations.',
    image: IMG('cat-custom-tshirt'),
    specs: { Fabric: 'Cotton', Color: 'All Colors', Printing: 'DTF', Sizes: 'Kids to Adults', Packaging: 'Box' },
    order: 2,
  },

  // Promotional T Shirt (2)
  {
    name: 'Promotional Event T-Shirt',
    slug: 'promotional-event-t-shirt',
    category: 'promotional-t-shirt',
    price: 'Get Best Quote',
    desc: 'Budget-friendly promotional t-shirts for marketing campaigns, elections and events. Fast bulk production with logo printing.',
    image: IMG('cat-promo-tshirt'),
    specs: { Fabric: 'Polyester / Cotton Blend', Color: 'All Colors', Printing: 'Screen / DTF', 'Minimum Order': '200 Pieces', Packaging: 'Carton' },
    order: 1,
  },
  {
    name: 'Election Campaign T-Shirt',
    slug: 'election-campaign-t-shirt',
    category: 'promotional-t-shirt',
    price: 'Get Best Quote',
    desc: 'High-volume election and campaign t-shirts with party branding. Capacity for very large orders with rapid delivery.',
    image: IMG('cat-promo-tshirt'),
    specs: { Fabric: 'Polyester 140 GSM', Color: 'White, Custom', Printing: 'Screen Print', 'Minimum Order': '1000 Pieces', Delivery: 'Pan India' },
    order: 2,
  },
]

// Merge category-level SEO data + per-product overrides into each product
export const products = rawProducts.map((p) => {
  const seo = CATEGORY_SEO[p.category] || { tags: [], applications: [], alternateNames: [] }
  const override = PRODUCT_SEO_OVERRIDES[p.slug] || {}
  return {
    ...p,
    tags: [...new Set([...seo.tags, ...(override.extraTags || [])])],
    applications: [...new Set([...seo.applications, ...(override.extraApplications || [])])],
    alternateNames: [...new Set([...seo.alternateNames, ...(override.extraAlternateNames || [])])],
  }
})

export async function seedDatabase() {
  await Category.deleteMany({})
  await Product.deleteMany({})
  await Category.insertMany(categories)
  await Product.insertMany(products)
  return { categories: categories.length, products: products.length }
}
