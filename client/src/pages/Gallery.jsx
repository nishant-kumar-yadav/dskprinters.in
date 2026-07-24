import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, MessageCircle, Cog, Clapperboard, Images } from 'lucide-react'
import { fetchGallery, COMPANY } from '../api.js'
import { useQuoteModal } from '../components/QuoteModal.jsx'
import { useReveal } from '../hooks/useReveal.js'
import FactoryStories from '../components/FactoryStories.jsx'
import VideoReels from '../components/VideoReels.jsx'
import PhotoGallery from '../components/PhotoGallery.jsx'
import CTABand from '../components/CTABand.jsx'
import './gallery.css'

export default function Gallery() {
  const ref = useReveal()
  const { openQuote } = useQuoteModal()

  const { data, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: fetchGallery,
  })

  const storyGroups = data?.storyGroups || {}
  const reels = data?.reels || []
  const galleryItems = data?.gallery || []

  const hasStories = Object.keys(storyGroups).some((k) => storyGroups[k]?.length > 0)
  const hasReels = reels.length > 0
  const hasGallery = galleryItems.length > 0
  const hasContent = hasStories || hasReels || hasGallery

  return (
    <div className="page" ref={ref}>
      <Helmet>
        <title>Factory Tour & Work Gallery | DSK Printers — New Delhi</title>
        <meta
          name="description"
          content="See inside DSK Printers factory in New Delhi. Watch our DTF & UV DTF printing process, quality checks, and finished work. Real production, real quality."
        />
      </Helmet>

      {/* Compact Page Header — no separate hero */}
      <section className="gallery-page-header">
        <div className="container">
          <span className="section-eyebrow">Factory Tour & Gallery</span>
          <h1>
            Inside <span className="brand-red">DSK</span> <span className="brand-blue">Printers</span>
          </h1>
          <p className="gallery-header-sub">
            Real machines, real process, real output — see how we manufacture premium stickers for brands across India.
          </p>
        </div>
      </section>

      {isLoading && (
        <section className="section">
          <div className="container" style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            Loading gallery…
          </div>
        </section>
      )}

      {!isLoading && !hasContent && (
        <section className="section">
          <div className="container gallery-empty">
            <h2>Gallery Coming Soon!</h2>
            <p>
              We're setting up our factory tour and product showcase gallery. In the meantime, feel
              free to explore our products or get a quote.
            </p>
            <div className="gallery-empty-actions">
              <Link to="/products" className="btn btn-primary">
                Browse Products <ArrowRight size={16} />
              </Link>
              <button className="btn btn-outline" onClick={() => openQuote({ source: 'gallery_empty' })}>
                Get a Quote
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Story Highlights — directly after header, no extra section title */}
      {hasStories && (
        <section className="gallery-section">
          <div className="container">
            <h2 className="gallery-section-title">
              <Cog size={20} className="gallery-section-icon" /> Factory Highlights
            </h2>
            <p className="gallery-section-desc">Tap any highlight to see our production process</p>
            <FactoryStories storyGroups={storyGroups} />
          </div>
        </section>
      )}

      {/* Video Reels */}
      {hasReels && (
        <section className="gallery-section gallery-section-alt">
          <div className="container">
            <h2 className="gallery-section-title">
              <Clapperboard size={20} className="gallery-section-icon" /> See It in Action
            </h2>
            <p className="gallery-section-desc">Watch our printers running and orders being packed</p>
            <VideoReels reels={reels} />
          </div>
        </section>
      )}

      {/* Photo Gallery */}
      {hasGallery && (
        <section className="gallery-section">
          <div className="container">
            <h2 className="gallery-section-title">
              <Images size={20} className="gallery-section-icon" /> Product Gallery
            </h2>
            <p className="gallery-section-desc">Browse finished products and application shots</p>
            <PhotoGallery items={galleryItems} />
          </div>
        </section>
      )}

      {/* CTA Band */}
      {hasContent && <CTABand />}
    </div>
  )
}
