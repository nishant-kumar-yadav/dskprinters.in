import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight, Play, MessageCircle } from 'lucide-react'
import { useQuoteModal } from './QuoteModal.jsx'
import './PhotoGallery.css'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'uv-dtf', label: 'UV DTF' },
  { value: 'dtf', label: 'DTF Transfers' },
  { value: 'apparel', label: 'Custom Apparel' },
  { value: 'labels', label: 'Labels & Tags' },
  { value: 'factory', label: 'Factory' },
]

const SWIPE_THRESHOLD = 50

export default function PhotoGallery({ items = [] }) {
  const [activeTab, setActiveTab] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const { openQuote } = useQuoteModal()

  // Swipe state
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchDeltaX = useRef(0)
  const isSwiping = useRef(false)
  const lightboxMediaRef = useRef(null)

  if (items.length === 0) return null

  const filtered = activeTab === 'all' ? items : items.filter((i) => i.category === activeTab)

  const openLightbox = (idx) => setLightboxIndex(idx)
  const closeLightbox = () => setLightboxIndex(null)

  const goNext = useCallback(() => {
    setLightboxIndex((p) => {
      if (p < filtered.length - 1) return p + 1
      return p
    })
  }, [filtered.length])

  const goPrev = useCallback(() => {
    setLightboxIndex((p) => {
      if (p > 0) return p - 1
      return p
    })
  }, [])

  // Touch handlers for swipe
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchDeltaX.current = 0
    isSwiping.current = false
  }, [])

  const handleTouchMove = useCallback((e) => {
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current

    // If horizontal movement is greater than vertical, it's a swipe
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      isSwiping.current = true
      e.preventDefault() // Prevent vertical scroll during horizontal swipe
    }

    touchDeltaX.current = dx

    // Visual drag feedback on the media container
    if (isSwiping.current && lightboxMediaRef.current) {
      const clampedDx = Math.max(-120, Math.min(120, dx))
      lightboxMediaRef.current.style.transform = `translateX(${clampedDx}px)`
      lightboxMediaRef.current.style.opacity = `${1 - Math.abs(clampedDx) / 400}`
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    // Reset visual drag
    if (lightboxMediaRef.current) {
      lightboxMediaRef.current.style.transform = ''
      lightboxMediaRef.current.style.opacity = ''
    }

    if (!isSwiping.current) return

    if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      goNext()
    } else if (touchDeltaX.current > SWIPE_THRESHOLD) {
      goPrev()
    }

    isSwiping.current = false
    touchDeltaX.current = 0
  }, [goNext, goPrev])

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, goNext, goPrev])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  const currentItem = lightboxIndex !== null ? filtered[lightboxIndex] : null

  return (
    <div className="photo-gallery">
      {/* Filter Tabs */}
      <div className="gallery-tabs">
        {TABS.map((tab) => {
          const count = tab.value === 'all' ? items.length : items.filter((i) => i.category === tab.value).length
          if (count === 0 && tab.value !== 'all') return null
          return (
            <button
              key={tab.value}
              className={`gallery-tab ${activeTab === tab.value ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
              <span className="gallery-tab-count">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Masonry Grid */}
      <div className="gallery-masonry">
        {filtered.map((item, i) => (
          <button
            key={item._id || i}
            className="gallery-item"
            onClick={() => openLightbox(i)}
            aria-label={`View ${item.title}`}
          >
            {item.type === 'video' ? (
              <>
                <video
                  src={item.url}
                  muted
                  playsInline
                  preload="metadata"
                  poster={item.thumbnail || undefined}
                  className="gallery-item-media"
                />
                <div className="gallery-item-play">
                  <Play size={24} />
                </div>
              </>
            ) : (
              <img
                src={item.url}
                alt={item.title}
                loading="lazy"
                className="gallery-item-media"
              />
            )}
            <div className="gallery-item-label">{item.title}</div>
          </button>
        ))}
      </div>

      {/* Lightbox — fullscreen, swipeable */}
      {currentItem && createPortal(
        <div className="gallery-lightbox" onClick={closeLightbox}>
          <div
            className="gallery-lightbox-inner"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top bar: counter + close */}
            <div className="gallery-lb-topbar">
              <span className="gallery-lb-counter">{lightboxIndex + 1} / {filtered.length}</span>
              <button className="gallery-lb-close" onClick={closeLightbox} aria-label="Close">
                <X size={22} />
              </button>
            </div>

            {/* Media — full height, swipeable area */}
            <div className="gallery-lb-media" ref={lightboxMediaRef}>
              {currentItem.type === 'video' ? (
                <video
                  key={lightboxIndex}
                  src={currentItem.url}
                  controls
                  autoPlay
                  playsInline
                  className="gallery-lb-content"
                />
              ) : (
                <img
                  src={currentItem.url}
                  alt={currentItem.title}
                  className="gallery-lb-content"
                />
              )}
            </div>

            {/* Bottom info + CTA */}
            <div className="gallery-lb-info">
              <div className="gallery-lb-info-text">
                <h4>{currentItem.title}</h4>
                {currentItem.caption && <p>{currentItem.caption}</p>}
              </div>
              <button
                className="gallery-lb-quote"
                onClick={() => openQuote({ product: currentItem.title, source: 'gallery_lightbox' })}
              >
                <MessageCircle size={16} /> Get Quote
              </button>
            </div>

            {/* Swipe hint on mobile, nav buttons on desktop */}
            <div className="gallery-lb-swipe-hint">Swipe to navigate</div>

            {lightboxIndex > 0 && (
              <button className="gallery-lb-nav gallery-lb-prev" onClick={goPrev} aria-label="Previous">
                <ChevronLeft size={24} />
              </button>
            )}
            {lightboxIndex < filtered.length - 1 && (
              <button className="gallery-lb-nav gallery-lb-next" onClick={goNext} aria-label="Next">
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
