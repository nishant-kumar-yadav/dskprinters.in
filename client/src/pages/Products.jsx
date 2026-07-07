import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { fetchProducts, fetchCategories } from '../api.js'
import ProductCard from '../components/ProductCard.jsx'
import { useReveal } from '../hooks/useReveal.js'
import './pages.css'

export default function Products() {
  const ref = useReveal()
  const [filter, setFilter] = useState('all')
  const { data: products, isLoading } = useQuery({ queryKey: ['products'], queryFn: fetchProducts })
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })

  const filtered =
    filter === 'all' ? products || [] : (products || []).filter((p) => p.category === filter)

  return (
    <div className="page" ref={ref}>
      <Helmet>
        <title>All Products | DSK Printers</title>
      </Helmet>

      <section className="page-hero">
        <div className="container">
          <h1>
            Our <span className="gradient-text">Products</span>
          </h1>
          <p>
            Explore our full range of DTF stickers, UV DTF transfers, garment labels and custom
            printing services. Bulk pricing available on all items.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="filter-pills" role="group" aria-label="Filter products by category">
            <button
              className={`filter-pill${filter === 'all' ? ' active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({products?.length || 0})
            </button>
            {(categories || []).map((c) => (
              <button
                key={c.slug}
                className={`filter-pill${filter === c.slug ? ' active' : ''}`}
                onClick={() => setFilter(c.slug)}
              >
                {c.name} ({c.productCount})
              </button>
            ))}
          </div>

          <div className="grid grid-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton cat-skeleton" />)
              : filtered.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>

          {!isLoading && filtered.length === 0 && (
            <div className="empty-state">
              <p>No products found in this category yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
