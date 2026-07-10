import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { ChevronRight, Phone, MessageCircle, BadgeCheck, Truck, IndianRupee } from 'lucide-react'
import { fetchProducts, COMPANY } from '../api.js'
import ProductCard from '../components/ProductCard.jsx'
import { useQuoteModal } from '../components/QuoteModal.jsx'
import { useReveal } from '../hooks/useReveal.js'
import {
  SITE_URL,
  parseKeywordSlug,
  buildH1,
  buildTitle,
  buildMetaDescription,
  scoreProduct,
  relatedKeywords,
} from '../seo/keywords.js'
import './pages.css'

export default function SeoLandingPage() {
  const { keyword } = useParams()
  const ref = useReveal()
  const { openQuote } = useQuoteModal() || {}

  const { data: products, isLoading } = useQuery({ queryKey: ['products'], queryFn: fetchProducts })

  const parsed = useMemo(() => parseKeywordSlug(keyword || ''), [keyword])
  const h1 = useMemo(() => buildH1(parsed, keyword || ''), [parsed, keyword])
  const title = buildTitle(h1)
  const metaDescription = buildMetaDescription(h1, parsed)
  const related = useMemo(() => relatedKeywords(parsed), [parsed])

  const matchedProducts = useMemo(() => {
    if (!products) return []
    return products
      .map((p) => ({ product: p, score: scoreProduct(p, parsed, keyword || '') }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 9)
      .map((x) => x.product)
  }, [products, parsed, keyword])

  // Fall back to featured products so the page is never empty (avoids thin content)
  const displayProducts = matchedProducts.length > 0
    ? matchedProducts
    : (products || []).filter((p) => p.featured).slice(0, 6)

  const locationName = parsed.location ? parsed.location.name : 'India'

  return (
    <div className="page" ref={ref}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={`${SITE_URL}/s/${keyword}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: COMPANY.name,
            description: metaDescription,
            url: `${SITE_URL}/s/${keyword}`,
            telephone: COMPANY.phone,
            email: COMPANY.email,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'New Delhi',
              addressRegion: 'Delhi',
              addressCountry: 'IN',
            },
            areaServed: locationName,
          })}
        </script>
      </Helmet>

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link to="/products">Products</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span>{h1}</span>
          </nav>
          <h1>{h1}</h1>
          <p>
            DSK Printers is a GST-registered {parsed.businessType ? parsed.businessType.name.toLowerCase() : 'manufacturer and supplier'} of{' '}
            {parsed.productName ? parsed.productName.toLowerCase() + 's' : 'printing products'} based in New Delhi, serving {locationName} with bulk
            pricing and pan-India delivery since {COMPANY.established}.
          </p>
          <div className="hero-cta-row" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button type="button" className="btn btn-primary" onClick={() => openQuote && openQuote()}>
              Get Best Quote
            </button>
            <a className="btn btn-outline" href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp Us
            </a>
            <a className="btn btn-outline" href={`tel:${COMPANY.phone}`}>
              <Phone size={16} aria-hidden="true" /> Call Now
            </a>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="seo-trust-row" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '1rem 0' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BadgeCheck size={18} aria-hidden="true" /> GST: {COMPANY.gst}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Truck size={18} aria-hidden="true" /> Pan-India Delivery
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <IndianRupee size={18} aria-hidden="true" /> Wholesale Bulk Pricing
            </span>
          </div>

          <h2 style={{ marginTop: '1rem' }}>
            {matchedProducts.length > 0 ? `Our ${h1} Range` : 'Popular Products'}
          </h2>

          <div className="grid grid-3" style={{ marginTop: '1rem' }}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton cat-skeleton" />)
              : displayProducts.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>

          {!isLoading && displayProducts.length === 0 && (
            <div className="empty-state">
              <h2>No products found for this keyword</h2>
              <p>
                Browse our <Link to="/products">full product catalog</Link> or{' '}
                <Link to="/contact">contact us</Link> for a custom requirement.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2>{'Why Choose DSK Printers?'}</h2>
          <p style={{ maxWidth: '46rem', lineHeight: 1.6 }}>
            Established in {COMPANY.established}, DSK Printers has grown into one of {locationName === 'India' ? "India's" : `${locationName}'s`} trusted
            names for {parsed.productName ? parsed.productName.toLowerCase() + 's' : 'DTF and UV DTF printing products'}.
            {parsed.application ? ` Our products are specially suited for ${parsed.application.toLowerCase()} applications with durable, wash-resistant and vibrant results.` : ''}{' '}
            With a team of {COMPANY.employees} specialists, an annual turnover of {COMPANY.turnover} and a {COMPANY.responseRate} response rate, we handle
            everything from single-design sample orders to high-volume bulk production with fast turnaround and reliable pan-India logistics.
          </p>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2>Related Searches</h2>
            <div className="category-jump-bar" style={{ marginTop: '1rem' }}>
              {related.map((r) => (
                <Link key={r.slug} to={`/s/${r.slug}`} className="jump-pill">
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
