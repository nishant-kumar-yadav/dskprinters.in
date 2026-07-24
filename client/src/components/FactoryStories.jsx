import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { X, Play, Volume2, VolumeX, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
import { useQuoteModal } from './QuoteModal.jsx'
import './FactoryStories.css'

const STORY_GROUP_META = {
  design: { label: 'Design & Pre-Press', emoji: '🖥️' },
  printing: { label: 'Printing in Action', emoji: '🖨️' },
  cutting: { label: 'Cutting & Finishing', emoji: '✂️' },
  qc: { label: 'Quality Check', emoji: '🔍' },
  packing: { label: 'Packing & Dispatch', emoji: '📦' },
  factory: { label: 'Our Factory', emoji: '🏢' },
  products: { label: 'Finished Products', emoji: '🎨' },
}

/* ───── Story Viewer Modal ─────
 * Now receives ALL group keys + storyGroups so it can auto-advance
 * from one group to the next, Instagram-style.
 */
function StoryViewer({ groupKeys, storyGroups, startGroupIndex, onClose }) {
  const [groupIdx, setGroupIdx] = useState(startGroupIndex)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(true)
  const [videoProgress, setVideoProgress] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const videoRef = useRef(null)
  const timerRef = useRef(null)
  const { openQuote } = useQuoteModal()

  const groupKey = groupKeys[groupIdx]
  const slides = storyGroups[groupKey] || []
  const slide = slides[current]
  const isVideo = slide?.type === 'video'
  const meta = STORY_GROUP_META[groupKey] || { label: groupKey, emoji: '📷' }

  const goNext = useCallback(() => {
    if (current < slides.length - 1) {
      // More slides in current group
      setCurrent((p) => p + 1)
    } else if (groupIdx < groupKeys.length - 1) {
      // Jump to next group (Instagram-style continuous playback)
      setGroupIdx((p) => p + 1)
      setCurrent(0)
    } else {
      // All groups finished
      onClose()
    }
  }, [current, slides.length, groupIdx, groupKeys.length, onClose])

  const goPrev = useCallback(() => {
    if (current > 0) {
      // Go back in current group
      setCurrent((p) => p - 1)
    } else if (groupIdx > 0) {
      // Jump to previous group's last slide
      const prevGroupKey = groupKeys[groupIdx - 1]
      const prevSlides = storyGroups[prevGroupKey] || []
      setGroupIdx((p) => p - 1)
      setCurrent(Math.max(0, prevSlides.length - 1))
    } else {
      onClose()
    }
  }, [current, groupIdx, groupKeys, storyGroups, onClose])

  // Reset video progress when slide or group changes
  useEffect(() => {
    setVideoProgress(0)
    setVideoDuration(0)
  }, [current, groupIdx])

  // Auto-advance for image slides (5 seconds)
  useEffect(() => {
    if (isVideo || paused) return
    timerRef.current = setTimeout(goNext, 5000)
    return () => clearTimeout(timerRef.current)
  }, [current, groupIdx, isVideo, paused, goNext])

  // Play video when slide changes
  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }, [current, groupIdx, isVideo])

  // Video time update handler
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video || !video.duration || !isFinite(video.duration)) return
    const pct = (video.currentTime / video.duration) * 100
    setVideoProgress(Math.min(pct, 100))
  }, [])

  // Video loaded — get actual duration
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current
    if (video && isFinite(video.duration)) {
      setVideoDuration(video.duration)
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') onClose()
      if (e.key === ' ') {
        e.preventDefault()
        if (isVideo && videoRef.current) {
          if (videoRef.current.paused) videoRef.current.play().catch(() => {})
          else videoRef.current.pause()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev, onClose, isVideo])

  // Hold to pause
  const holdTimerRef = useRef(null)
  const wasHeldRef = useRef(false)

  const handlePointerDown = useCallback(() => {
    wasHeldRef.current = false
    holdTimerRef.current = setTimeout(() => {
      wasHeldRef.current = true
      setPaused(true)
      if (isVideo && videoRef.current) videoRef.current.pause()
    }, 200)
  }, [isVideo])

  const handlePointerUp = useCallback(() => {
    clearTimeout(holdTimerRef.current)
    if (paused) {
      setPaused(false)
      if (isVideo && videoRef.current) videoRef.current.play().catch(() => {})
    }
  }, [paused, isVideo])

  // Tap zone handler — Instagram-style tap left/right
  const handleTap = useCallback(
    (e) => {
      if (wasHeldRef.current) {
        wasHeldRef.current = false
        return
      }
      const rect = e.currentTarget.getBoundingClientRect()
      const tapX = e.clientX - rect.left
      const tapPercent = tapX / rect.width

      if (tapPercent < 0.3) {
        goPrev()
      } else {
        goNext()
      }
    },
    [goPrev, goNext]
  )

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return createPortal(
    <div className="story-viewer-overlay" onClick={onClose}>
      <div className="story-viewer" onClick={(e) => e.stopPropagation()}>
        {/* Progress bars — for slides within current group */}
        <div className="story-progress-bar">
          {slides.map((_, i) => (
            <div key={i} className={`story-progress-segment ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`}>
              {i === current && isVideo ? (
                <div
                  className="story-progress-fill"
                  style={{ width: `${videoProgress}%`, transition: 'width 0.15s linear', animation: 'none' }}
                />
              ) : (
                <div
                  className="story-progress-fill"
                  style={
                    i === current && !isVideo
                      ? { animationDuration: '5s', animationPlayState: paused ? 'paused' : 'running' }
                      : {}
                  }
                />
              )}
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="story-header">
          <span className="story-group-label">{meta.emoji} {meta.label}</span>
          <div className="story-header-actions">
            {isVideo && (
              <button className="story-icon-btn" onClick={() => setMuted(!muted)} aria-label={muted ? 'Unmute' : 'Mute'}>
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            )}
            <button className="story-icon-btn" onClick={onClose} aria-label="Close story">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Media */}
        <div className="story-media">
          {isVideo ? (
            <video
              ref={videoRef}
              key={`${groupKey}-${current}`}
              src={slide.url}
              muted={muted}
              playsInline
              autoPlay
              onEnded={goNext}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="story-media-content"
            />
          ) : (
            <img src={slide.url} alt={slide.title} className="story-media-content" key={`${groupKey}-${current}`} />
          )}
        </div>

        {/* Tap zones */}
        <div
          className="story-tap-zone"
          onClick={handleTap}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />

        {/* Caption */}
        {slide.title && (
          <div className="story-caption">
            <h4>{slide.title}</h4>
            {slide.caption && <p>{slide.caption}</p>}
            <button className="story-cta-btn" onClick={(e) => { e.stopPropagation(); openQuote({ product: slide.title, source: 'story' }) }}>
              <MessageCircle size={16} /> Get Quote
            </button>
          </div>
        )}

      </div>
    </div>,
    document.body
  )
}

/* ───── Factory Stories Bar ───── */
export default function FactoryStories({ storyGroups = {}, compact = false }) {
  const [activeGroupIndex, setActiveGroupIndex] = useState(null)
  const scrollRef = useRef(null)

  const groupKeys = Object.keys(storyGroups).filter((k) => storyGroups[k]?.length > 0)
  if (groupKeys.length === 0) return null

  const handleOpen = (groupKey) => {
    const idx = groupKeys.indexOf(groupKey)
    setActiveGroupIndex(idx >= 0 ? idx : 0)
  }

  return (
    <>
      <div className={`factory-stories ${compact ? 'factory-stories-compact' : ''}`}>
        <div className="factory-stories-scroll" ref={scrollRef}>
          {groupKeys.map((key) => {
            const meta = STORY_GROUP_META[key] || { label: key, emoji: '📷' }
            const cover = storyGroups[key][0]
            const isVideo = cover?.type === 'video'
            return (
              <button
                key={key}
                className="story-bubble"
                onClick={() => handleOpen(key)}
                aria-label={`View ${meta.label} story`}
              >
                <div className="story-ring">
                  {isVideo ? (
                    <video
                      src={cover.url}
                      muted
                      playsInline
                      className="story-cover"
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={cover.thumbnail || cover.url}
                      alt={meta.label}
                      className="story-cover"
                      loading="lazy"
                    />
                  )}
                  {isVideo && <Play size={16} className="story-play-icon" />}
                </div>
                <span className="story-label">{meta.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {activeGroupIndex !== null && (
        <StoryViewer
          groupKeys={groupKeys}
          storyGroups={storyGroups}
          startGroupIndex={activeGroupIndex}
          onClose={() => setActiveGroupIndex(null)}
        />
      )}
    </>
  )
}
