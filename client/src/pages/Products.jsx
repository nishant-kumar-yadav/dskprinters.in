import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { fetchCategories } from '../api.js'
import { useReveal } from '../hooks/useReveal.js'
import { useQuoteModal } from '../components/QuoteModal.jsx'
import './pages.css'

export default function Products() {
  const ref = useReveal()
  const { openQuote } = useQuoteModal()
  const { data: categories, isLoading } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })

  return (
    <div className="page" ref={ref}>
      <Helmet>
        <title>Our Products | DTF & UV DTF Stickers, Heat Transfer Labels | DSK Printers</title>
        <meta name="description" content="Browse DTF stickers, UV DTF stickers, heat transfer labels, silicone labels and custom printed apparel from DSK Printers, New Delhi. Bulk pricing, pan-India delivery." />
      </Helmet>

      <section className="page-hero">
        <div className="container">
          <h1>
            Our <span className="gradient-text">Products</span>
          </h1>
          <p>
            Browse by category to find exactly what your business needs. 
            Bulk pricing on all items.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton cat-skeleton" />)
              : (categories || []).map((cat) => (
                  <Link key={cat.slug} to={`/category/${cat.slug}`} className="category-directory-card card">
                    <div className="cat-dir-image">
                      <img src={cat.image || '/placeholder.webp'} alt={cat.name} loading="lazy" width={400} height={300} />
                    </div>
                    <div className="cat-dir-body">
                      <h2>{cat.name}</h2>
                      <p className="cat-dir-count">{cat.productCount} products available</p>
                      <span className="cat-dir-arrow">
                        Browse <ArrowRight size={14} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                ))}
          </div>

          {!isLoading && (!categories || categories.length === 0) && (
            <div className="empty-state">
              <p>No categories found.</p>
            </div>
          )}
        </div>
      </section>

      <section className="seo-directory-banner bg-light section">
        <div className="container" style={{ textAlign: 'center', padding: '40px 0' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', fontWeight: '800' }}>Explore Our Local Manufacturing Network</h2>
          <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '1.1rem' }}>
            Looking for local manufacturing or wholesale supply? Browse our popular searches and service areas across India.
          </p>
          <Link to="/popular-searches" className="btn btn-outline" style={{ display: 'inline-flex', padding: '12px 24px' }}>
            View All Locations & Categories
          </Link>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band-inner reveal">
          <div>
            <h2>Can't find what you need?</h2>
            <p>We manufacture custom prints too. Tell us your requirement.</p>
          </div>
          <div className="cta-band-actions">
            <button className="btn btn-white" onClick={() => openQuote({ source: 'products_cta_band' })}>
              Get Custom Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
