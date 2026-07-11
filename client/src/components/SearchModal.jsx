import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight, Package, Clock, TrendingUp, Sparkles } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../api.js'
import './search-modal.css'

const RECENT_KEY = 'dsk_recent_searches'
const MAX_RECENT = 5
const POPULAR_TAGS = ['DTF', 'UV', 'Sticker', 'T-Shirt', 'Mug', 'Tumbler']

function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
  } catch { return [] }
}

function saveRecentSearch(q) {
  const trimmed = q.trim()
  if (!trimmed) return
  const prev = getRecentSearches().filter(s => s !== trimmed)
  const next = [trimmed, ...prev].slice(0, MAX_RECENT)
  localStorage.setItem(RECENT_KEY, JSON.stringify(next))
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_KEY)
}

/* Highlight matching text in a string */
function HighlightMatch({ text, query }) {
  if (!query || !text) return <>{text}</>
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="search-highlight">{part}</mark>
          : part
      )}
    </>
  )
}

/* Skeleton loading row */
function SkeletonRow() {
  return (
    <div className="search-skeleton-row">
      <div className="skeleton-img shimmer" />
      <div className="skeleton-info">
        <div className="skeleton-title shimmer" />
        <div className="skeleton-sub shimmer" />
      </div>
      <div className="skeleton-price shimmer" />
    </div>
  )
}

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState(getRecentSearches)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()

  // Only fetch products when the modal is open to save initial load
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    enabled: isOpen
  })

  // Debounce the search query (250ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250)
    return () => clearTimeout(timer)
  }, [query])

  // Autofocus when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setRecentSearches(getRecentSearches())
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setDebouncedQuery('')
      setActiveIndex(-1)
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Filter and group products
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return []
    const q = debouncedQuery.toLowerCase()
    return products.filter(p => {
      const matchName = p.name?.toLowerCase().includes(q)
      const matchCategory = p.category?.toLowerCase().includes(q)
      const matchTags = p.tags?.some(tag => tag.toLowerCase().includes(q))
      const matchApps = p.applications?.some(app => app.toLowerCase().includes(q))
      const matchAlt = p.alternateNames?.some(alt => alt.toLowerCase().includes(q))
      return matchName || matchCategory || matchTags || matchApps || matchAlt
    })
  }, [debouncedQuery, products])

  // Group results by category (show max 2 per category for quick view)
  const groupedResults = useMemo(() => {
    const groups = {}
    searchResults.forEach(p => {
      const cat = p.category || 'Other'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(p)
    })
    return groups
  }, [searchResults])

  // Flat list for keyboard nav
  const flatResults = useMemo(() => {
    const flat = []
    Object.values(groupedResults).forEach(items => {
      items.slice(0, 3).forEach(item => flat.push(item))
    })
    return flat
  }, [groupedResults])

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => Math.min(prev + 1, flatResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && flatResults[activeIndex]) {
        saveRecentSearch(query)
        onClose()
        navigate(`/product/${flatResults[activeIndex].slug}`)
      } else if (query.trim()) {
        saveRecentSearch(query)
        onClose()
        navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      }
    }
  }, [activeIndex, flatResults, navigate, onClose, query])

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('.search-result-item')
      items[activeIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  // Reset active index when results change
  useEffect(() => { setActiveIndex(-1) }, [searchResults])

  const handleQuickSearch = (term) => {
    setQuery(term)
    setDebouncedQuery(term)
    inputRef.current?.focus()
  }

  const handleClearRecent = () => {
    clearRecentSearches()
    setRecentSearches([])
  }

  const handleViewAll = () => {
    if (query.trim()) {
      saveRecentSearch(query)
      onClose()
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  if (!isOpen) return null

  const showEmptyState = debouncedQuery.trim() === ''
  const showResults = !showEmptyState && searchResults.length > 0
  const showNoResults = !showEmptyState && !isLoading && searchResults.length === 0
  const showLoading = !showEmptyState && isLoading

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div
        className="search-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
      >
        {/* Search Input */}
        <div className="search-modal-header">
          <Search size={20} className="search-icon-input" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, materials, applications..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-modal-input"
            aria-label="Search products"
            autoComplete="off"
          />
          {query && (
            <button
              className="search-clear-btn"
              onClick={() => { setQuery(''); setDebouncedQuery(''); inputRef.current?.focus() }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <div className="search-kbd-hint">
            <kbd>ESC</kbd>
          </div>
          <button className="search-modal-close" onClick={onClose} aria-label="Close search">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="search-modal-body">
          {/* Loading Skeletons */}
          {showLoading && (
            <div className="search-skeleton-container">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          )}

          {/* Empty State: Popular & Recent */}
          {showEmptyState && (
            <div className="search-empty-state">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="search-section">
                  <div className="search-section-header">
                    <span className="search-section-label">
                      <Clock size={14} /> Recent
                    </span>
                    <button className="search-clear-recent" onClick={handleClearRecent}>
                      Clear
                    </button>
                  </div>
                  <div className="search-tags">
                    {recentSearches.map((s) => (
                      <button key={s} className="search-tag recent" onClick={() => handleQuickSearch(s)}>
                        <Clock size={12} /> {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div className="search-section">
                <span className="search-section-label">
                  <TrendingUp size={14} /> Popular
                </span>
                <div className="search-tags">
                  {POPULAR_TAGS.map((tag) => (
                    <button key={tag} className="search-tag popular" onClick={() => handleQuickSearch(tag)}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tip */}
              <div className="search-tip">
                <Sparkles size={14} />
                <span>Try searching by <strong>application</strong> — e.g. "mug", "tumbler", "cap"</span>
              </div>
            </div>
          )}

          {/* Grouped Results */}
          {showResults && (
            <>
              <div className="search-result-count">
                <span>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found</span>
              </div>
              <div ref={listRef} className="search-results-grouped" role="listbox">
                {Object.entries(groupedResults).map(([category, items], groupIdx) => (
                  <div key={category} className="search-group" style={{ animationDelay: `${groupIdx * 60}ms` }}>
                    <div className="search-group-header">
                      <span>{category.replace(/-/g, ' ')}</span>
                      <span className="search-group-count">{items.length}</span>
                    </div>
                    {items.slice(0, 3).map((product) => {
                      const flatIdx = flatResults.indexOf(product)
                      return (
                        <Link
                          key={product.slug}
                          to={`/product/${product.slug}`}
                          className={`search-result-item${flatIdx === activeIndex ? ' active' : ''}`}
                          onClick={() => { saveRecentSearch(query); onClose() }}
                          role="option"
                          aria-selected={flatIdx === activeIndex}
                        >
                          <div className="result-img">
                            <img src={product.image || '/placeholder.webp'} alt={product.name} loading="lazy" />
                          </div>
                          <div className="result-info">
                            <h4><HighlightMatch text={product.name} query={debouncedQuery} /></h4>
                            <span>
                              <HighlightMatch text={product.category?.replace(/-/g, ' ')} query={debouncedQuery} />
                            </span>
                            {product.tags?.length > 0 && (
                              <div className="result-tags">
                                {product.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="result-tag-chip">{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="result-price">
                            {product.price}
                          </div>
                          <div className="result-action">
                            <ArrowRight size={16} />
                          </div>
                        </Link>
                      )
                    })}
                    {items.length > 3 && (
                      <button className="search-group-more" onClick={handleViewAll}>
                        +{items.length - 3} more in {category.replace(/-/g, ' ')}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* View All Results Footer */}
              <div className="search-footer">
                <button className="search-view-all" onClick={handleViewAll}>
                  View all {searchResults.length} results
                  <ArrowRight size={16} />
                </button>
                <div className="search-nav-hint">
                  <kbd>↑</kbd> <kbd>↓</kbd> to navigate &nbsp; <kbd>↵</kbd> to select
                </div>
              </div>
            </>
          )}

          {/* No Results */}
          {showNoResults && (
            <div className="search-no-results">
              <Package size={42} className="empty-icon" />
              <h4>No results for "{debouncedQuery}"</h4>
              <p>Try different keywords or browse all products</p>
              <div className="search-no-results-actions">
                <button className="btn btn-primary" onClick={() => { onClose(); navigate('/products') }}>
                  Browse All Products
                </button>
                <button className="btn btn-outline" onClick={() => { onClose(); navigate('/contact') }}>
                  Ask Us
                </button>
              </div>
              <div className="search-section" style={{ marginTop: 24, width: '100%' }}>
                <span className="search-section-label">
                  <TrendingUp size={14} /> Try these instead
                </span>
                <div className="search-tags" style={{ justifyContent: 'center' }}>
                  {POPULAR_TAGS.map((tag) => (
                    <button key={tag} className="search-tag popular" onClick={() => handleQuickSearch(tag)}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
