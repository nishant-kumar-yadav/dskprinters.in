import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useQuoteModal } from './QuoteModal.jsx'
import './product-card.css'

export default function ProductCard({ product }) {
  const { openQuote } = useQuoteModal()

  return (
    <article className="product-card card">
      <Link to={`/product/${product.slug}`} className="product-card-img">
        <img
          src={product.image || '/placeholder.webp'}
          alt={product.name}
          loading="lazy"
          width={400}
          height={400}
          onError={(e) => {
            e.currentTarget.src = '/placeholder.webp'
          }}
        />
        {product.featured && <span className="badge badge-red product-card-badge">Popular</span>}
      </Link>
      <div className="product-card-body">
        <h3>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="product-card-price">{product.price}</p>
        <div className="product-card-actions">
          <button
            className="btn btn-primary"
            onClick={() => openQuote({ 
              product: product.name, 
              productLink: `/product/${product.slug}`,
              productImage: product.image,
              source: 'product_card' 
            })}
          >
            Get Quote
          </button>
          <Link to={`/product/${product.slug}`} className="product-card-link">
            Details <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
