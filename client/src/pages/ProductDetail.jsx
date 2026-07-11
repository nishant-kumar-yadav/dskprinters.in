import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import {
  ChevronRight, MessageCircle, Phone, Star, Truck, Shield, FileText,
  Share2, Copy, Check, Download, ZoomIn, Package, Sparkles,
  Droplets, Palette, Ruler, ShoppingBag, Shirt, Coffee, CupSoda,
  Smartphone, Briefcase, Gift, Layers, Settings, LayoutGrid, TreePine,
  HardHat, Building2, Scissors, Laptop, Car, Monitor, Lightbulb
} from 'lucide-react'
import { fetchProduct, fetchProducts, COMPANY } from '../api.js'
import { useQuoteModal } from '../components/QuoteModal.jsx'
import ProductCard from '../components/ProductCard.jsx'
import CTABand from '../components/CTABand.jsx'
import { useReveal } from '../hooks/useReveal.js'
import './product-detail.css'

/* ── Icon map for application tags ── */
const APP_ICONS = {
  't-shirt': Shirt, 'tshirt': Shirt, 'shirt': Shirt, 'apparel': Shirt,
  'mug': Coffee, 'cup': Coffee, 'ceramic': Coffee,
  'tumbler': CupSoda, 'bottle': CupSoda,
  'cap': HardHat, 'hat': HardHat, 'helmet': HardHat,
  'bag': ShoppingBag, 'tote': ShoppingBag,
  'phone': Smartphone, 'case': Smartphone, 'mobile': Smartphone,
  'glass': LayoutGrid, 'window': LayoutGrid,
  'wood': TreePine, 'wooden': TreePine,
  'metal': Settings, 'steel': Settings,
  'fabric': Scissors, 'textile': Scissors,
  'leather': Briefcase,
  'paper': FileText, 'card': FileText,
  'gift': Gift,
  'corporate': Building2,
  'laptop': Laptop,
  'car': Car, 'auto': Car,
  'monitor': Monitor,
  'plastic': Layers,
}

function getAppIcon(app) {
  const lower = app.toLowerCase()
  let IconComponent = Sparkles // default
  for (const [key, Icon] of Object.entries(APP_ICONS)) {
    if (lower.includes(key)) {
      IconComponent = Icon
      break
    }
  }
  return <IconComponent size={32} strokeWidth={1.5} color="var(--blue)" className="pd-app-lucide" />
}

/* ── Star rating component ── */
function StarRating({ rating = 4.8, count = '500+' }) {
  return (
    <div className="pd-rating">
      <div className="pd-stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < Math.floor(rating) ? '#f59e0b' : (i < rating ? '#f59e0b' : 'none')}
            stroke={i < rating ? '#f59e0b' : '#d1d5db'}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <span className="pd-rating-number">{rating}</span>
      <span className="pd-rating-separator">·</span>
      <span className="pd-rating-count">Trusted by {count} buyers</span>
    </div>
  )
}

/* ── Image Zoom Viewer ── */
function ImageViewer({ src, alt }) {
  const [zoomed, setZoomed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const containerRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  return (
    <div
      ref={containerRef}
      className={`pd-image-viewer ${zoomed ? 'zoomed' : ''}`}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src || '/placeholder.webp'}
        alt={alt}
        style={zoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
        onError={(e) => { e.currentTarget.src = '/placeholder.webp' }}
      />
      <div className="pd-zoom-hint">
        <ZoomIn size={16} />
        <span>Hover to zoom</span>
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const ref = useReveal()
  const { openQuote } = useQuoteModal()
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const ctaRef = useRef(null)

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['product', slug], queryFn: () => fetchProduct(slug) })
  const { data: products } = useQuery({ queryKey: ['products'], queryFn: fetchProducts })

  // Reset active image when slug changes
  useEffect(() => {
    setActiveImageIndex(0)
  }, [slug])

  // Scroll detection for sticky bar — show after CTA buttons scroll out of view
  useEffect(() => {
    const handleScroll = () => {
      if (ctaRef.current) {
        const rect = ctaRef.current.getBoundingClientRect()
        setShowStickyBar(rect.bottom < 0)
      } else {
        setShowStickyBar(window.scrollY > 400)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (showStickyBar) {
      document.body.classList.add('has-sticky-bar')
    } else {
      document.body.classList.remove('has-sticky-bar')
    }
    return () => document.body.classList.remove('has-sticky-bar')
  }, [showStickyBar])

  const related = (products || [])
    .filter((p) => product && p.category === product.category && p.slug !== product.slug)
    .slice(0, 4)

  const galleryImages = useMemo(() => {
    if (!product) return []
    // If product has an `images` array from the database, use it
    if (product.images && product.images.length > 0) {
      return product.images
    }
    // Otherwise, just the single image — no forced extras
    return [product.image || '/placeholder.webp']
  }, [product])

  // Direct title + JSON-LD injection (Helmet backup)
  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} | Buy Online | DSK Printers New Delhi`

    // Inject JSON-LD structured data
    const scriptId = 'pd-jsonld'
    let script = document.getElementById(scriptId)
    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.desc,
      "image": product.image ? `https://dskprinters.in${product.image}` : undefined,
      "brand": { "@type": "Brand", "name": "DSK Printers" },
      "manufacturer": {
        "@type": "Organization",
        "name": "DSK Printers",
        "address": { "@type": "PostalAddress", "addressLocality": "New Delhi", "addressRegion": "Delhi", "addressCountry": "IN" }
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": { "@type": "Organization", "name": "DSK Printers" }
      },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "500" }
    })

    return () => {
      const el = document.getElementById(scriptId)
      if (el) el.remove()
    }
  }, [product])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleShare = () => {
    const text = `Check out ${product?.name} from DSK Printers: ${window.location.href}`
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(waUrl, '_blank')
  }

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="page">
        <div className="container section">
          <div className="pd-grid">
            <div className="pd-image-skeleton shimmer" />
            <div className="pd-info-skeleton">
              <div className="shimmer" style={{ height: 20, width: '30%', borderRadius: 8 }} />
              <div className="shimmer" style={{ height: 32, width: '80%', borderRadius: 8 }} />
              <div className="shimmer" style={{ height: 16, width: '50%', borderRadius: 8 }} />
              <div className="shimmer" style={{ height: 28, width: '25%', borderRadius: 8 }} />
              <div className="shimmer" style={{ height: 60, width: '100%', borderRadius: 8 }} />
              <div className="shimmer" style={{ height: 48, width: '100%', borderRadius: 12 }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Error State ──
  if (isError || !product) {
    return (
      <div className="page">
        <div className="empty-state">
          <h1>Product not found</h1>
          <p>The product you are looking for does not exist or was removed.</p>
          <Link to="/products" className="btn btn-primary">
            Browse All Products
          </Link>
        </div>
      </div>
    )
  }

  const specs = product.specs || {}
  const specEntries = Object.entries(specs)
  const applications = product.applications || []
  const tags = product.tags || []

  // Quick spec highlights from specs map
  const quickSpecs = []
  for (const [key, value] of specEntries) {
    if (quickSpecs.length >= 4) break
    const lower = key.toLowerCase()
    let icon = <Package size={14} />
    if (lower.includes('size') || lower.includes('dimension')) icon = <Ruler size={14} />
    else if (lower.includes('color') || lower.includes('colour')) icon = <Palette size={14} />
    else if (lower.includes('wash') || lower.includes('water')) icon = <Droplets size={14} />
    else if (lower.includes('material') || lower.includes('type')) icon = <Sparkles size={14} />
    quickSpecs.push({ icon, label: value, key })
  }

  return (
    <div className="page pd-page" ref={ref}>
      <Helmet>
        <title>{product.name} | Buy Online | DSK Printers New Delhi</title>
        <meta name="description" content={`${product.name} — ${product.desc || `Premium quality from DSK Printers, New Delhi. ${product.price}. Bulk pricing available. Pan-India delivery.`}`} />
      </Helmet>

      {/* ── Breadcrumb ── */}
      <section className="pd-breadcrumb-section">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link to="/products">Products</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link to={`/category/${product.category}`}>{product.category.replace(/-/g, ' ')}</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span>{product.name}</span>
          </nav>
        </div>
      </section>

      {/* ── Product Hero ── */}
      <section className="pd-hero-section">
        <div className="container">
          <div className="pd-grid">
            {/* Left: Image */}
            <div className="pd-image-col">
              <ImageViewer src={galleryImages[activeImageIndex]} alt={product.name} />

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="pd-thumbnails">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      className={`pd-thumbnail-btn ${idx === activeImageIndex ? 'active' : ''}`}
                      onClick={() => setActiveImageIndex(idx)}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img src={img} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}

              {/* Share bar (desktop) */}
              <div className="pd-share-bar desktop-only">
                <button className="pd-share-btn" onClick={handleShare} aria-label="Share on WhatsApp">
                  <Share2 size={16} /> Share
                </button>
                <button className="pd-share-btn" onClick={handleCopyLink} aria-label="Copy link">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Right: Info */}
            <div className="pd-info-col">
              {/* Category + Badge */}
              <div className="pd-meta-row">
                <Link to={`/category/${product.category}`} className="pd-category-pill">
                  {product.category.replace(/-/g, ' ')}
                </Link>
                {product.featured && <span className="badge badge-red">Popular</span>}
                {product.inStock !== false && <span className="pd-stock-badge">✓ In Stock</span>}
              </div>

              {/* Product Name */}
              <h1 className="pd-title">{product.name}</h1>

              {/* Star Rating */}
              <StarRating />

              {/* Price */}
              <div className="pd-price-row">
                <span className="pd-price">{product.price}</span>
                <span className="pd-price-note">* GST Invoice Available</span>
              </div>

              {/* Short Description */}
              {product.desc && <p className="pd-desc">{product.desc}</p>}

              {/* Quick Spec Pills */}
              {quickSpecs.length > 0 && (
                <div className="pd-quick-specs">
                  {quickSpecs.map(qs => (
                    <div key={qs.key} className="pd-spec-pill">
                      {qs.icon}
                      <span>{qs.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="pd-actions" ref={ctaRef}>
                <button
                  className="btn btn-primary pd-cta-main"
                  onClick={() => openQuote({ 
                    product: product.name, 
                    productLink: `/product/${product.slug}`,
                    productImage: galleryImages[0] || '',
                    source: 'product_detail' 
                  })}
                >
                  <ShoppingBag size={18} />
                  Get Best Quote
                </button>
                <a
                  href={`${COMPANY.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Please share the best price.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn pd-cta-whatsapp"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a href={`tel:${COMPANY.phone}`} className="btn btn-outline pd-cta-call">
                  <Phone size={16} /> Call Us
                </a>
              </div>

              {/* Trust Strip */}
              <div className="pd-trust-strip">
                <div className="pd-trust-item">
                  <Truck size={16} />
                  <span>Ships in 2-3 days</span>
                </div>
                <div className="pd-trust-item">
                  <FileText size={16} />
                  <span>GST Invoice</span>
                </div>
                <div className="pd-trust-item">
                  <Shield size={16} />
                  <span>Secure Order</span>
                </div>
              </div>

              {/* Share bar (mobile) */}
              <div className="pd-share-bar mobile-only">
                <button className="pd-share-btn" onClick={handleShare} aria-label="Share on WhatsApp">
                  <Share2 size={16} /> Share
                </button>
                <button className="pd-share-btn" onClick={handleCopyLink} aria-label="Copy link">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabbed Content ── */}
      <section className="pd-tabs-section">
        <div className="container">
          {/* Tab Headers */}
          <div className="pd-tab-headers" role="tablist">
            <button
              className={`pd-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
              role="tab"
              aria-selected={activeTab === 'details'}
            >
              Details
            </button>
            {specEntries.length > 0 && (
              <button
                className={`pd-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
                role="tab"
                aria-selected={activeTab === 'specs'}
              >
                Specifications
              </button>
            )}
            {applications.length > 0 && (
              <button
                className={`pd-tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={() => setActiveTab('applications')}
                role="tab"
                aria-selected={activeTab === 'applications'}
              >
                Applications
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="pd-tab-content" role="tabpanel">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="pd-tab-panel" key="details">
                {product.desc && (
                  <div className="pd-detail-text">
                    <h3>About this product</h3>
                    <p>{product.desc}</p>
                  </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="pd-detail-tags">
                    <h4>Tags</h4>
                    <div className="pd-tags-row">
                      {tags.map(tag => (
                        <span key={tag} className="pd-tag-chip">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}


              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specs' && specEntries.length > 0 && (
              <div className="pd-tab-panel" key="specs">
                <table className="pd-specs-table">
                  <tbody>
                    {specEntries.map(([key, value], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'even' : 'odd'}>
                        <th scope="row">{key}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && applications.length > 0 && (
              <div className="pd-tab-panel" key="applications">
                <h3>Where can you use this product?</h3>
                <div className="pd-app-grid">
                  {applications.map(app => (
                    <div key={app} className="pd-app-card">
                      <span className="pd-app-icon">{getAppIcon(app)}</span>
                      <span className="pd-app-name">{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Conversion Section (Why Buy + Bulk) ── */}
      <section className="pd-conversion-section section bg-light">
        <div className="container">
          <div className="pd-conversion-grid reveal">
            {/* Why Buy Trust Points */}
            <div className="pd-why-buy">
              <h3>Why Buy from DSK Printers?</h3>
              <div className="pd-why-grid">
                <div className="pd-why-item">
                  <span className="pd-why-icon">✓</span>
                  <div>
                    <strong>50+ Wash Durability</strong>
                    <p>Tested to survive 50+ wash cycles without cracking or peeling</p>
                  </div>
                </div>
                <div className="pd-why-item">
                  <span className="pd-why-icon">✓</span>
                  <div>
                    <strong>High Color Accuracy</strong>
                    <p>Rich color saturation and high-resolution sharpness</p>
                  </div>
                </div>
                <div className="pd-why-item">
                  <span className="pd-why-icon">✓</span>
                  <div>
                    <strong>Flexible & Stretchable</strong>
                    <p>Perfect for activewear, cotton, and polyester fabrics</p>
                  </div>
                </div>
                <div className="pd-why-item">
                  <span className="pd-why-icon">✓</span>
                  <div>
                    <strong>Safe Nationwide Dispatch</strong>
                    <p>Dispatched pan-India in thick cardboard rolls for safety</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bulk Order Pricing */}
            <div className="pd-bulk-card">
              <div className="pd-bulk-header">
                <Package size={20} />
                <h3>Bulk Order Pricing</h3>
              </div>
              <div className="pd-bulk-tiers">
                <div className="pd-tier">
                  <span className="pd-tier-qty">1 – 99 pcs</span>
                  <span className="pd-tier-line" />
                  <span className="pd-tier-label">Standard Rate</span>
                </div>
                <div className="pd-tier highlight">
                  <span className="pd-tier-qty">100 – 499 pcs</span>
                  <span className="pd-tier-line" />
                  <span className="pd-tier-label popular">5% Off</span>
                </div>
                <div className="pd-tier">
                  <span className="pd-tier-qty">500+ pcs</span>
                  <span className="pd-tier-line" />
                  <span className="pd-tier-label">Custom Quote</span>
                </div>
              </div>
              <button
                className="btn btn-primary pd-bulk-cta"
                onClick={() => openQuote({ 
                  product: product.name, 
                  productLink: `/product/${product.slug}`,
                  productImage: galleryImages[0] || '',
                  source: 'bulk_pricing' 
                })}
              >
                Get Bulk Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head reveal">
              <span className="section-eyebrow">More Like This</span>
              <h2 className="section-title">Related Products</h2>
            </div>
            <div className="grid grid-4 mobile-swipe-list reveal">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Band ── */}
      <CTABand
        headline={`Need a Custom Quote for ${product.name}?`}
        subtext={`Tell us your order volume and custom size requirements. We respond to ${COMPANY.responseRate} of enquiries within a few hours.`}
        variant="red"
      />

      {/* ── Sticky Bottom Bar (Mobile) ── */}
      {showStickyBar && (
        <div className="pd-sticky-bar">
          <div className="pd-sticky-content">
            <div className="pd-sticky-img">
              <img src={galleryImages[activeImageIndex] || '/placeholder.webp'} alt="" />
            </div>
            <div className="pd-sticky-info">
              <strong>{product.name}</strong>
              <span>{product.price}</span>
            </div>
            <div className="pd-sticky-actions">
              <a
                href={`${COMPANY.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Please share the best price.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn pd-sticky-wa"
              >
                <MessageCircle size={16} />
              </a>
              <button
                className="btn btn-primary pd-sticky-quote"
                onClick={() => openQuote({ 
                  product: product.name, 
                  productLink: `/product/${product.slug}`,
                  productImage: galleryImages[activeImageIndex] || galleryImages[0] || '',
                  source: 'mobile_sticky_bar' 
                })}
              >
                Get Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
