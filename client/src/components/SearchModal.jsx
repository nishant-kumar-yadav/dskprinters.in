import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight, Package } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../api.js'
import './search-modal.css'

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()
  
  // Only fetch products when the modal is open to save initial load
  const { data: products = [], isLoading } = useQuery({ 
    queryKey: ['products'], 
    queryFn: fetchProducts,
    enabled: isOpen
  })

  // Autofocus when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
      setQuery('')
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

  if (!isOpen) return null

  // Filter products locally
  const searchResults = query.trim() 
    ? products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <Search size={20} className="search-icon-input" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search for DTF stickers, materials..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-modal-input"
          />
          <button className="search-modal-close" onClick={onClose} aria-label="Close search">
            <X size={20} />
          </button>
        </div>

        <div className="search-modal-body">
          {isLoading ? (
            <div className="search-empty-state">Loading products...</div>
          ) : query.trim() === '' ? (
            <div className="search-empty-state">
              <Package size={42} className="empty-icon" />
              <p>Type to search for products instantly</p>
              <div className="popular-searches">
                <span>Popular:</span>
                <button onClick={() => setQuery('DTF')}>DTF</button>
                <button onClick={() => setQuery('UV')}>UV</button>
                <button onClick={() => setQuery('Sticker')}>Sticker</button>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <ul className="search-results-list">
              {searchResults.map((product) => (
                <li key={product.slug}>
                  <Link to={`/product/${product.slug}`} className="search-result-item" onClick={onClose}>
                    <div className="result-img">
                      <img src={product.image || '/placeholder.jpg'} alt={product.name} />
                    </div>
                    <div className="result-info">
                      <h4>{product.name}</h4>
                      <span>{product.category.replace(/-/g, ' ')}</span>
                    </div>
                    <div className="result-price">
                      {product.price}
                    </div>
                    <div className="result-action">
                      <ArrowRight size={16} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="search-empty-state">
              <p>No products found for "{query}"</p>
              <button className="btn btn-outline" style={{marginTop: 16}} onClick={() => { onClose(); navigate('/products'); }}>
                Browse All Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
