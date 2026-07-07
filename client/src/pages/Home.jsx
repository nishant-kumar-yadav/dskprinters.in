import { useState, useEffect, useRef } from 'react'
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
  ChevronLeft,
  ChevronRight,
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

const heroSlides = [
  {
    title: "UV DTF Stickers",
    price: "₹2.50 / sq. inch onwards",
    desc: "Permanent scratch-proof stickers for metal, glass, plastic, wood and leather branding.",
    badge: "Most Popular for Merch",
    image: "/images/cat-uv-dtf.png",
    slug: "uv-dtf-sticker"
  },
  {
    title: "DTF Stickers",
    price: "₹1.20 / sq. inch onwards",
    desc: "High stretch garment transfer stickers for fabrics, t-shirts, caps, bags and uniforms.",
    badge: "Garment Decoration Standard",
    image: "/images/cat-dtf.png",
    slug: "dtf-sticker"
  },
  {
    title: "Custom Printed Apparel",
    price: "₹150 / piece onwards",
    desc: "Premium quality corporate t-shirts, promotional t-shirts and uniforms with your branding.",
    badge: "Corporate & Event Merch",
    image: "/images/cat-custom-tshirt.png",
    slug: "customized-t-shirt"
  },
  {
    title: "Silicone Heat Transfer Labels",
    price: "₹3.50 / piece onwards",
    desc: "Tactile premium 3D labels for luxury sportswear, shirts, and fashion brand tagging.",
    badge: "Premium Sportswear Detail",
    image: "/images/cat-silicone.png",
    slug: "silicone-heat-transfer-label"
  }
]

export default function Home() {
  const ref = useReveal()
  const { openQuote } = useQuoteModal()
  const [activeSlide, setActiveSlide] = useState(0)

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

  // Carousel Autoplay
  const timerRef = useRef(null)

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length)
    }, 4500)
  }

  useEffect(() => {
    resetTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length)
    resetTimer()
  }
  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    resetTimer()
  }
  const goToSlide = (index) => {
    setActiveSlide(index)
    resetTimer()
  }

  const currentSlide = heroSlides[activeSlide]

  return (
    <div className="page" ref={ref}>
      <Helmet>
        <title>DSK Printers | DTF & UV DTF Sticker Manufacturer in New Delhi</title>
        <meta name="description" content="Buy DTF stickers, UV DTF stickers, heat transfer labels and custom printed t-shirts from DSK Printers, a trusted manufacturer in New Delhi. Bulk pricing, pan-India delivery." />
      </Helmet>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-visual">
            <div className="hero-carousel-container">
              <Link to={`/category/${currentSlide.slug}`} className="hero-carousel-link">
                <img
                  key={activeSlide}
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="hero-carousel-image fade-in"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.jpg'
                  }}
                />
              </Link>
              <button onClick={prevSlide} className="carousel-btn prev" aria-label="Previous product">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextSlide} className="carousel-btn next" aria-label="Next product">
                <ChevronRight size={20} />
              </button>
              <div className="carousel-dots">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`carousel-dot ${index === activeSlide ? 'active' : ''}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="hero-copy">
            <span className="badge badge-blue hero-badge">
              <Star size={12} aria-hidden="true" /> {currentSlide.badge}
            </span>
            <h1 className="hero-carousel-title">
              {currentSlide.title}
            </h1>
            <div className="hero-carousel-price">
              Starting from <span className="text-highlight">{currentSlide.price.split(' ')[0]}</span> {currentSlide.price.split(' ').slice(1).join(' ')}
            </div>
            <p className="hero-carousel-desc">
              {currentSlide.desc}
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => openQuote({ source: `hero_carousel_${currentSlide.slug}` })}>
                Get Best Quote <ArrowRight size={16} aria-hidden="true" />
              </button>
              <Link to={`/category/${currentSlide.slug}`} className="btn btn-outline">
                View Details
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
          <div className="grid grid-4 mobile-swipe-list reveal">
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
          <div className="grid grid-4 mobile-swipe-list reveal">
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
