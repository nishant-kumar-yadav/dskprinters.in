import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import {
  ArrowRight,
  BadgeCheck,
  Truck,
  Factory,
  Sparkles,
  Star,
  MessageCircle,
} from 'lucide-react'
import { fetchProducts, fetchCategories, COMPANY } from '../api.js'
import { useQuoteModal } from '../components/QuoteModal.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useReveal } from '../hooks/useReveal.js'
import './pages.css'

const stats = [
  { value: '10+', label: 'Years of Experience' },
  { value: '500+', label: 'Happy Clients' },
  { value: '85%', label: 'Response Rate' },
  { value: '50+', label: 'Wash Durability' },
]

const features = [
  {
    icon: Factory,
    title: 'In-House Manufacturing',
    desc: 'Complete production control from film to finished transfer — consistent quality on every order.',
  },
  {
    icon: Sparkles,
    title: 'Premium Print Quality',
    desc: 'Vibrant CMYK + white printing with fine detail, gradients and 50+ wash durability.',
  },
  {
    icon: Truck,
    title: 'Pan-India Delivery',
    desc: 'Fast, reliable dispatch to every state — bulk orders packed and shipped with care.',
  },
  {
    icon: BadgeCheck,
    title: 'GST Registered Business',
    desc: `Established ${COMPANY.established}. GST: ${COMPANY.gst}. Trusted by brands across India.`,
  },
]

export default function Home() {
  const ref = useReveal()
  const { openQuote } = useQuoteModal()
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const featured = (products || []).filter((p) => p.featured).slice(0, 8)
  const topCategories = (categories || []).slice(0, 8)

  return (
    <div className="page" ref={ref}>
      <Helmet>
        <title>DSK Printers | DTF &amp; UV DTF Sticker Manufacturer in New Delhi</title>
      </Helmet>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="badge badge-blue hero-badge">
              <Star size={12} aria-hidden="true" /> Trusted since {COMPANY.established}
            </span>
            <h1>
              India&apos;s Trusted <span className="gradient-text">DTF &amp; UV DTF</span> Sticker
              Manufacturer
            </h1>
            <p>
              Heat transfer stickers, garment labels and custom t-shirt printing from our New Delhi
              facility. Premium quality, bulk pricing and pan-India delivery.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => openQuote({ source: 'hero_cta' })}>
                Get Best Quote <ArrowRight size={16} aria-hidden="true" />
              </button>
              <Link to="/products" className="btn btn-outline">
                Browse Products
              </Link>
            </div>
            <div className="hero-stats">
              {stats.map((s) => (
                <div key={s.label} className="hero-stat">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="/images/cat-uv-dtf.png"
              alt="UV DTF stickers manufactured by DSK Printers"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.jpg'
              }}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="section-eyebrow">Our Range</span>
            <h2 className="section-title">Product Categories</h2>
            <p className="section-sub">
              From UV DTF stickers to corporate t-shirts — everything you need for garment
              decoration and branding.
            </p>
          </div>
          <div className="grid grid-4 reveal">
            {categoriesLoading
              ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton cat-skeleton" />)
              : topCategories.map((c) => (
                  <Link key={c.slug} to={`/category/${c.slug}`} className="cat-card card">
                    <img
                      src={c.image || '/placeholder.jpg'}
                      alt={c.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg'
                      }}
                    />
                    <div className="cat-card-body">
                      <h3>{c.name}</h3>
                      <span>{c.productCount} products</span>
                    </div>
                  </Link>
                ))}
          </div>
          <div className="section-cta reveal">
            <Link to="/products" className="btn btn-outline">
              View All Categories <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head reveal">
            <span className="section-eyebrow">Best Sellers</span>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-sub">Our most ordered transfers and labels, loved by brands across India.</p>
          </div>
          <div className="grid grid-4 reveal">
            {productsLoading
              ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton cat-skeleton" />)
              : featured.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="section-eyebrow">Why DSK Printers</span>
            <h2 className="section-title">Built for Quality &amp; Scale</h2>
          </div>
          <div className="grid grid-4 reveal">
            {features.map((f) => (
              <div key={f.title} className="feature-card card">
                <div className="feature-icon">
                  <f.icon size={22} aria-hidden="true" />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="cta-band">
        <div className="container cta-band-inner reveal">
          <div>
            <h2>Ready to place a bulk order?</h2>
            <p>Share your requirement — we respond within a few hours with the best quote.</p>
          </div>
          <div className="cta-band-actions">
            <button className="btn btn-white" onClick={() => openQuote({ source: 'home_cta_band' })}>
              Get Best Quote
            </button>
            <a
              href={COMPANY.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-blue"
            >
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
