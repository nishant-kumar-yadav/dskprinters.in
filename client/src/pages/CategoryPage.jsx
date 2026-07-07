import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { ChevronRight } from 'lucide-react'
import { fetchProducts, fetchCategories } from '../api.js'
import ProductCard from '../components/ProductCard.jsx'
import { useReveal } from '../hooks/useReveal.js'
import './pages.css'

export default function CategoryPage() {
  const { slug } = useParams()
  const ref = useReveal()
  const { data: products, isLoading } = useQuery({ queryKey: ['products'], queryFn: fetchProducts })
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })

  const category = (categories || []).find((c) => c.slug === slug)
  const items = (products || []).filter((p) => p.category === slug)

  return (
    <div className="page" ref={ref}>
      <Helmet>
        <title>{category ? `${category.name} | DSK Printers` : 'Category | DSK Printers'}</title>
      </Helmet>

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link to="/products">Products</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span>{category?.name || slug}</span>
          </nav>
          <h1>{category?.name || 'Category'}</h1>
          <p>
            {items.length} product{items.length === 1 ? '' : 's'} available — get the best bulk
            quote on any item below.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton cat-skeleton" />)
              : items.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
          {!isLoading && items.length === 0 && (
            <div className="empty-state">
              <h1>No products here yet</h1>
              <p>This category is empty right now. Browse our full range instead.</p>
              <Link to="/products" className="btn btn-primary">
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
