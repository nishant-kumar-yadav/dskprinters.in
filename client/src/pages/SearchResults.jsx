import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search, SlidersHorizontal, Grid3X3, List, X, ArrowUpDown, Package, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../api.js'
import { useReveal } from '../hooks/useReveal.js'
import { useQuoteModal } from '../components/QuoteModal.jsx'
import './search-results.css'

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'name-az', label: 'Name: A → Z' },
  { value: 'name-za', label: 'Name: Z → A' },
]

/* Parse price string like "₹5/sq.ft" → number, for sorting */
function parsePrice(priceStr) {
  if (!priceStr) return Infinity
  const match = priceStr.replace(/,/g, '').match(/[\d.]+/)
  return match ? parseFloat(match[0]) : Infinity
}

/* Highlight matching text */
function HighlightMatch({ text, query }) {
  if (!query || !text) return <>{text}</>
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="sr-highlight">{part}</mark>
          : part
      )}
    </>
  )
}

export default function SearchResults() {
  const ref = useReveal()
  const [searchParams, setSearchParams] = useSearchParams()
  const { openQuote } = useQuoteModal()
  const urlQuery = searchParams.get('q') || ''

  const [localQuery, setLocalQuery] = useState(urlQuery)
  const [sort, setSort] = useState('relevance')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  })

  // Sync localQuery when URL changes
  useEffect(() => {
    setLocalQuery(urlQuery)
  }, [urlQuery])

  // Filter results
  const filteredResults = useMemo(() => {
    if (!urlQuery.trim()) return []
    const q = urlQuery.toLowerCase()
    let results = products.filter(p => {
      const matchName = p.name?.toLowerCase().includes(q)
      const matchCategory = p.category?.toLowerCase().includes(q)
      const matchTags = p.tags?.some(tag => tag.toLowerCase().includes(q))
      const matchApps = p.applications?.some(app => app.toLowerCase().includes(q))
      const matchAlt = p.alternateNames?.some(alt => alt.toLowerCase().includes(q))
      return matchName || matchCategory || matchTags || matchApps || matchAlt
    })

    // Category filter
    if (selectedCategory !== 'all') {
      results = results.filter(p => p.category === selectedCategory)
    }

    // Sort
    switch (sort) {
      case 'price-low':
        results.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
        break
      case 'price-high':
        results.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
        break
      case 'name-az':
        results.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        break
      case 'name-za':
        results.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
        break
      default: // relevance — name match first, then category match, then tag match
        results.sort((a, b) => {
          const aName = a.name?.toLowerCase().includes(q) ? 0 : 1
          const bName = b.name?.toLowerCase().includes(q) ? 0 : 1
          return aName - bName
        })
    }

    return results
  }, [urlQuery, products, selectedCategory, sort])

  // Extract unique categories from results for filters
  const availableCategories = useMemo(() => {
    if (!urlQuery.trim()) return []
    const q = urlQuery.toLowerCase()
    const allMatches = products.filter(p => {
      const matchName = p.name?.toLowerCase().includes(q)
      const matchCategory = p.category?.toLowerCase().includes(q)
      const matchTags = p.tags?.some(tag => tag.toLowerCase().includes(q))
      const matchApps = p.applications?.some(app => app.toLowerCase().includes(q))
      const matchAlt = p.alternateNames?.some(alt => alt.toLowerCase().includes(q))
      return matchName || matchCategory || matchTags || matchApps || matchAlt
    })
    const cats = {}
    allMatches.forEach(p => {
      const cat = p.category || 'Other'
      cats[cat] = (cats[cat] || 0) + 1
    })
    return Object.entries(cats).sort((a, b) => b[1] - a[1])
  }, [urlQuery, products])

  const handleSearch = (e) => {
    e.preventDefault()
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() })
      setSelectedCategory('all')
    }
  }

  return (
    <div className="page" ref={ref}>
      <Helmet>
        <title>{urlQuery ? `Search: "${urlQuery}" | DSK Printers` : 'Search Products | DSK Printers'}</title>
        <meta name="description" content={`Search results for "${urlQuery}" — DTF stickers, UV DTF, heat transfer labels and more from DSK Printers, New Delhi.`} />
      </Helmet>

      {/* Search Hero */}
      <section className="sr-hero">
        <div className="container">
          <h1>
            {urlQuery
              ? <>Results for "<span className="gradient-text">{urlQuery}</span>"</>
              : <>Search <span className="gradient-text">Products</span></>
            }
          </h1>
          {filteredResults.length > 0 && (
            <p className="sr-count">{filteredResults.length} product{filteredResults.length !== 1 ? 's' : ''} found</p>
          )}

          {/* Inline search bar */}
          <form className="sr-search-form" onSubmit={handleSearch}>
            <Search size={20} className="sr-search-icon" />
            <input
              type="text"
              placeholder="Refine your search..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="sr-search-input"
            />
            {localQuery && (
              <button
                type="button"
                className="sr-search-clear"
                onClick={() => { setLocalQuery(''); setSearchParams({}) }}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
            <button type="submit" className="sr-search-submit">Search</button>
          </form>
        </div>
      </section>

      {/* Toolbar: Sort + View + Filters */}
      {filteredResults.length > 0 && (
        <div className="sr-toolbar">
          <div className="container sr-toolbar-inner">
            {/* Filter toggle (mobile) */}
            <button
              className={`sr-filter-toggle ${filtersOpen ? 'active' : ''}`}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal size={16} />
              Filters
              {selectedCategory !== 'all' && <span className="sr-filter-badge">1</span>}
            </button>

            {/* Sort */}
            <div className="sr-sort">
              <ArrowUpDown size={14} />
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* View toggle */}
            <div className="sr-view-toggle">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <section className="section sr-content">
        <div className="container sr-layout">
          {/* Sidebar Filters */}
          {filteredResults.length > 0 && (
            <aside className={`sr-sidebar ${filtersOpen ? 'open' : ''}`}>
              <div className="sr-sidebar-section">
                <h3>Category</h3>
                <button
                  className={`sr-cat-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  <span>All Categories</span>
                  <span className="sr-cat-count">{availableCategories.reduce((sum, [, c]) => sum + c, 0)}</span>
                </button>
                {availableCategories.map(([cat, count]) => (
                  <button
                    key={cat}
                    className={`sr-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <span>{cat.replace(/-/g, ' ')}</span>
                    <span className="sr-cat-count">{count}</span>
                  </button>
                ))}
              </div>
            </aside>
          )}

          {/* Results Grid/List */}
          <div className="sr-results-area">
            {isLoading ? (
              <div className={`sr-grid ${viewMode}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="sr-skeleton-card">
                    <div className="sr-skeleton-img shimmer" />
                    <div className="sr-skeleton-body">
                      <div className="sr-skeleton-title shimmer" />
                      <div className="sr-skeleton-sub shimmer" />
                      <div className="sr-skeleton-price shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredResults.length > 0 ? (
              <div className={`sr-grid ${viewMode}`}>
                {filteredResults.map((product, idx) => (
                  <Link
                    key={product.slug}
                    to={`/product/${product.slug}`}
                    className="sr-product-card card"
                    style={{ animationDelay: `${Math.min(idx, 12) * 50}ms` }}
                  >
                    <div className="sr-card-img">
                      <img src={product.image || '/placeholder.webp'} alt={product.name} loading="lazy" />
                    </div>
                    <div className="sr-card-body">
                      <h3><HighlightMatch text={product.name} query={urlQuery} /></h3>
                      <span className="sr-card-category">
                        <HighlightMatch text={product.category?.replace(/-/g, ' ')} query={urlQuery} />
                      </span>
                      {product.tags?.length > 0 && (
                        <div className="sr-card-tags">
                          {product.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="sr-tag-chip">{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="sr-card-footer">
                        <span className="sr-card-price">{product.price || 'Get Quote'}</span>
                        <span className="sr-card-arrow"><ArrowRight size={14} /></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : urlQuery.trim() ? (
              <div className="sr-empty">
                <Package size={48} className="sr-empty-icon" />
                <h2>No products found for "{urlQuery}"</h2>
                <p>Try adjusting your search terms or browse all products</p>
                <div className="sr-empty-actions">
                  <Link to="/products" className="btn btn-primary">Browse All Products</Link>
                  <Link to="/contact" className="btn btn-outline">Contact Us</Link>
                </div>
              </div>
            ) : (
              <div className="sr-empty">
                <Search size={48} className="sr-empty-icon" />
                <h2>Search for Products</h2>
                <p>Type in the search bar above to find DTF stickers, UV transfers, and more</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="cta-band">
        <div className="container cta-band-inner reveal">
          <div>
            <h2>Can't find what you need?</h2>
            <p>We manufacture custom prints too. Tell us your requirement.</p>
          </div>
          <div className="cta-band-actions">
            <button className="btn btn-white" onClick={() => openQuote({ source: 'search_page_cta' })}>
              Get Custom Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
