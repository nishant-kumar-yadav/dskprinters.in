import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { ChevronRight, Search } from 'lucide-react'
import { fetchProducts, fetchCategories } from '../api.js'
import ProductCard from '../components/ProductCard.jsx'
import { useReveal } from '../hooks/useReveal.js'
import './pages.css'

export default function CategoryPage() {
  const { slug } = useParams()
  const ref = useReveal()
  const [searchQuery, setSearchQuery] = useState('')
  
  const { data: products, isLoading: productsLoading } = useQuery({ queryKey: ['products'], queryFn: fetchProducts })
  const { data: categories, isLoading: categoriesLoading } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })

  const category = (categories || []).find((c) => c.slug === slug)
  const items = (products || []).filter((p) => p.category === slug)

  const filteredItems = items.filter(p => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      p.desc?.toLowerCase().includes(q) ||
      p.price?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="page" ref={ref}>
      <Helmet>
        <title>{category ? `${category.name} | Buy Online | DSK Printers New Delhi` : 'Category | DSK Printers'}</title>
        {category && <meta name="description" content={`Buy ${category.name} from DSK Printers, a trusted manufacturer in New Delhi. ${items.length} products, bulk pricing, pan-India delivery.`} />}
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
          
          <div className="category-search-bar">
            <Search size={18} />
            <input 
              type="text" 
              placeholder={`Search in ${category?.name || 'this category'}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="category-jump-bar">
            {(categories || []).map(cat => (
              <Link 
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className={`jump-pill ${cat.slug === slug ? 'active' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="grid grid-3">
            {productsLoading
              ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton cat-skeleton" />)
              : filteredItems.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>

          {!productsLoading && filteredItems.length === 0 && (
            <div className="empty-state">
              <h2>No products match "{searchQuery}"</h2>
              <p>Try searching for a different keyword or browse other categories.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
