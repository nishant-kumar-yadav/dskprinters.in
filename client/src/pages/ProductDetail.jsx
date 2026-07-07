import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { ChevronRight, MessageCircle, Phone } from 'lucide-react'
import { fetchProduct, fetchProducts, COMPANY } from '../api.js'
import { useQuoteModal } from '../components/QuoteModal.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useReveal } from '../hooks/useReveal.js'
import './pages.css'

export default function ProductDetail() {
  const { slug } = useParams()
  const ref = useReveal()
  const { openQuote } = useQuoteModal()
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['product', slug], queryFn: () => fetchProduct(slug) })
  const { data: products } = useQuery({ queryKey: ['products'], queryFn: fetchProducts })

  const related = (products || [])
    .filter((p) => product && p.category === product.category && p.slug !== product.slug)
    .slice(0, 4)

  if (isLoading) {
    return (
      <div className="page">
        <div className="container section">
          <div className="detail-grid">
            <div className="skeleton" style={{ aspectRatio: '1' }} />
            <div className="skeleton" style={{ height: 320 }} />
          </div>
        </div>
      </div>
    )
  }

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

  return (
    <div className="page" ref={ref}>
      <Helmet>
        <title>{product.name} | DSK Printers</title>
      </Helmet>

      <section className="section">
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

          <div className="detail-grid">
            <div className="detail-img">
              <img
                src={product.image || '/placeholder.jpg'}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.jpg'
                }}
              />
            </div>

            <div className="detail-info">
              {product.featured && <span className="badge badge-red" style={{ width: 'fit-content' }}>Popular</span>}
              <h1>{product.name}</h1>
              <p className="detail-price">{product.price}</p>
              <p className="detail-desc">{product.desc}</p>

              <div className="detail-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => openQuote({ product: product.name, source: 'product_detail' })}
                >
                  Get Best Quote
                </button>
                <a
                  href={`${COMPANY.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Please share the best price.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-blue"
                >
                  <MessageCircle size={16} aria-hidden="true" /> WhatsApp
                </a>
                <a href={`tel:${COMPANY.phone}`} className="btn btn-outline">
                  <Phone size={16} aria-hidden="true" /> Call Us
                </a>
              </div>

              {Object.keys(specs).length > 0 && (
                <>
                  <h2 style={{ fontSize: '1.05rem', marginTop: 8 }}>Specifications</h2>
                  <table className="specs-table">
                    <tbody>
                      {Object.entries(specs).map(([key, value]) => (
                        <tr key={key}>
                          <th scope="row">{key}</th>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head reveal">
              <span className="section-eyebrow">More Like This</span>
              <h2 className="section-title">Related Products</h2>
            </div>
            <div className="grid grid-4 reveal">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
