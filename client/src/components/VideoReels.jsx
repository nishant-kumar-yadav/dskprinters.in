import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Play, Volume2, VolumeX, X, Maximize2, Minimize2, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
import { useQuoteModal } from './QuoteModal.jsx'
import './VideoReels.css'

/* ───── Scrollable Reel Feed Player (Mini → Expanded) ───── */
function ReelPlayer({ reels, startIndex, onClose }) {
  const [muted, setMuted] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(startIndex)
  const scrollRef = useRef(null)
  const videoRefs = useRef({})
  const { openQuote } = useQuoteModal()

  const currentReel = reels[currentIndex]

  // Scroll to starting reel on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current?.children[startIndex]
      if (el) el.scrollIntoView({ behavior: 'instant' })
    })
  }, [])

  // Re-scroll to current reel when toggling mini ↔ expanded
  useEffect(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current?.children[currentIndex]
      if (el) el.scrollIntoView({ behavior: 'instant' })
    })
  }, [expanded])

  // IntersectionObserver: auto-play visible video, pause others, track current
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.dataset.index)
          const video = videoRefs.current[idx]
          if (!video) return
          if (entry.isIntersecting) {
            setCurrentIndex(idx)
            video.currentTime = 0
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { root: container, threshold: 0.5 }
    )

    Array.from(container.children).forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [])

  // Sync muted state across all videos
  useEffect(() => {
    Object.values(videoRefs.current).forEach((v) => {
      if (v) v.muted = muted
    })
  }, [muted])

  // Keyboard: Escape to close/minimize
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (expanded) setExpanded(false)
        else onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, expanded])

  // Lock body scroll when expanded
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [expanded])

  return createPortal(
    <div className={`reel-feed ${expanded ? 'reel-feed--expanded' : 'reel-feed--mini'}`}>
      {/* Dark backdrop (expanded mode only) */}
      {expanded && <div className="reel-feed__backdrop" onClick={onClose} />}

      <div className="reel-feed__player">
        {/* Top control bar */}
        <div className="reel-feed__topbar">
          <button
            className="reel-feed__btn"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Minimize' : 'Expand'}
          >
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            className="reel-feed__btn"
            onClick={() => setMuted(!muted)}
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button className="reel-feed__btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Vertical scrollable reel feed */}
        <div className="reel-feed__scroll" ref={scrollRef}>
          {reels.map((reel, i) => (
            <div key={reel._id || i} className="reel-feed__slide" data-index={i}>
              <video
                ref={(el) => { videoRefs.current[i] = el }}
                src={reel.url}
                muted={muted}
                playsInline
                loop
                preload={Math.abs(i - startIndex) <= 1 ? 'metadata' : 'none'}
                poster={reel.thumbnail || undefined}
                className="reel-feed__video"
              />
            </div>
          ))}
        </div>

        {/* Bottom info card */}
        <div className="reel-feed__bottom">
          <div className="reel-feed__info">
            <strong>{currentReel?.title}</strong>
            {currentReel?.caption && <span className="reel-feed__caption">{currentReel.caption}</span>}
          </div>
          <button
            className="reel-feed__cta"
            onClick={() => openQuote({ product: currentReel?.title, source: 'gallery_reel' })}
          >
            <MessageCircle size={14} /> Get Quote
          </button>
        </div>

        {/* Scroll hint indicator */}
        {reels.length > 1 && (
          <div className="reel-feed__scroll-hint">
            <span className="reel-feed__scroll-dot" />
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

/* ───── Video Reels Carousel ───── */
export default function VideoReels({ reels = [], maxItems }) {
  const [activeReel, setActiveReel] = useState(null)
  const scrollRef = useRef(null)

  const displayReels = maxItems ? reels.slice(0, maxItems) : reels
  if (displayReels.length === 0) return null

  const scroll = (dir) => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.offsetWidth * 0.7
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <>
      <div className="video-reels">
        <div className="video-reels-wrap">
          <button className="reels-nav-arrow reels-nav-left" onClick={() => scroll('left')} aria-label="Scroll left">
            <ChevronLeft size={20} />
          </button>

          <div className="video-reels-scroll" ref={scrollRef}>
            {displayReels.map((reel, i) => (
              <ReelCard key={reel._id || i} reel={reel} onClick={() => setActiveReel(i)} />
            ))}
          </div>

          <button className="reels-nav-arrow reels-nav-right" onClick={() => scroll('right')} aria-label="Scroll right">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {activeReel !== null && (
        <ReelPlayer
          reels={displayReels}
          startIndex={activeReel}
          onClose={() => setActiveReel(null)}
        />
      )}
    </>
  )
}

/* ───── Individual Reel Card ───── */
function ReelCard({ reel, onClick }) {
  const videoRef = useRef(null)
  const cardRef = useRef(null)

  // Auto-play on scroll into view
  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {})
          } else {
            videoRef.current.pause()
          }
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <button className="reel-card" ref={cardRef} onClick={onClick} aria-label={`Watch: ${reel.title}`}>
      <video
        ref={videoRef}
        src={reel.url}
        muted
        playsInline
        loop
        preload="metadata"
        poster={reel.thumbnail || undefined}
        className="reel-card-video"
      />
      <div className="reel-card-overlay">
        <Play size={32} className="reel-card-play" />
      </div>
      <div className="reel-card-info">
        <span className="reel-card-title">{reel.title}</span>
        {reel.caption && <span className="reel-card-caption">{reel.caption}</span>}
      </div>
    </button>
  )
}
