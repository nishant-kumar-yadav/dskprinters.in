import { Helmet } from 'react-helmet-async'
import { Star } from 'lucide-react'
import CTABand from '../components/CTABand.jsx'
import { useReveal } from '../hooks/useReveal.js'
import './pages.css'

const reviews = [
  {
    name: 'Rohit Malhotra',
    company: 'StreetVibe Clothing, Mumbai',
    rating: 5,
    date: 'June 2026',
    text: 'We order DTF gang sheets every month for our streetwear drops. Colors are always spot-on and the prints survive 50+ washes easily. Best vendor we have worked with.'
  },
  {
    name: 'Priya Sharma',
    company: 'Kidsy Wear, Jaipur',
    rating: 5,
    date: 'May 2026',
    text: 'The cartoon character heat press stickers are a hit with our kidswear line. Non-toxic inks were important for us and DSK delivered exactly what they promised.'
  },
  {
    name: 'Amandeep Singh',
    company: 'Punjab Sports Kits, Ludhiana',
    rating: 5,
    date: 'April 2026',
    text: 'Name and number DTF transfers for 800 jerseys delivered in 6 days. Perfect opacity on dark fabrics. Highly recommended for bulk sports orders.'
  },
  {
    name: 'Neha Gupta',
    company: 'Corporate Gifting Co., Gurugram',
    rating: 4,
    date: 'March 2026',
    text: 'Ordered 500 corporate polos with logo printing. Quality was excellent and pricing was better than three other vendors we compared. Will order again.'
  },
  {
    name: 'Vikram Reddy',
    company: 'Hyderabad Print House',
    rating: 5,
    date: 'February 2026',
    text: 'As a print shop we resell their UV DTF stickers. The 3D glossy finish sells itself — our customers keep coming back. Dispatch is always on time.'
  },
  {
    name: 'Sana Khan',
    company: 'Label Studio, Delhi',
    rating: 5,
    date: 'January 2026',
    text: 'Silicone heat transfer labels with deep 3D relief — exactly the premium feel our activewear client wanted. Great communication throughout the order.'
  }
]

const trustTags = [
  { label: "🔥 Bulk Orders", count: 18 },
  { label: "🎨 Color Accuracy", count: 14 },
  { label: "🧵 Wash Durable", count: 22 },
  { label: "📦 On-Time Delivery", count: 19 },
  { label: "💬 Great Support", count: 15 }
]

export default function Reviews() {
  const ref = useReveal()
  const totalReviews = 524
  const averageRating = 4.8

  // Distribution chart data
  const ratingDistribution = [
    { stars: 5, percentage: 82 },
    { stars: 4, percentage: 12 },
    { stars: 3, percentage: 4 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 }
  ]

  return (
    <div className="page" ref={ref}>
      <Helmet>
        <title>Customer Reviews | DSK Printers</title>
        <meta name="description" content="Read reviews from 500+ happy clients of DSK Printers. Trusted DTF and UV DTF sticker manufacturer in New Delhi." />
      </Helmet>

      {/* Aggregate Rating Hero Section */}
      <section className="reviews-hero">
        <div className="container reviews-hero-inner">
          <div className="reviews-summary-card card">
            <span className="section-eyebrow text-center">TRUST & REPUTATION</span>
            <div className="aggregate-score">
              <h2>{averageRating}</h2>
              <div className="aggregate-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={24} fill="#eab308" color="#eab308" />
                ))}
              </div>
              <p>Based on {totalReviews}+ verified ratings</p>
            </div>

            <div className="rating-bars">
              {ratingDistribution.map((dist) => (
                <div key={dist.stars} className="rating-bar-row">
                  <span className="bar-label">{dist.stars}★</span>
                  <div className="bar-bg">
                    <div className="bar-fill" style={{ width: `${dist.percentage}%` }} />
                  </div>
                  <span className="bar-value">{dist.percentage}%</span>
                </div>
              ))}
            </div>

            <div className="trust-platforms">
              <span className="badge badge-trust">Google Business ★★★★★</span>
              <span className="badge badge-trust">IndiaMART Verified ★★★★★</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Tags horizontally scrollable row */}
      <section className="tags-section">
        <div className="container">
          <h3 className="tags-title">Popular mentions in reviews</h3>
          <div className="trust-tags-scroll">
            {trustTags.map((tag, idx) => (
              <span key={idx} className="trust-tag-pill">
                {tag.label} <span>({tag.count})</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="section-head text-center">
            <span className="section-eyebrow">TESTIMONIALS</span>
            <h2 className="section-title">What Our Partners Say</h2>
          </div>

          <div className="reviews-masonry reveal">
            {reviews.map((r, index) => {
              const initials = r.name.split(' ').map(n => n[0]).join('')
              const isEven = index % 2 === 0
              return (
                <div key={r.name} className="review-custom-card card">
                  <div className="review-card-header">
                    <div className={`avatar ${isEven ? 'avatar-blue' : 'avatar-red'}`}>
                      {initials}
                    </div>
                    <div className="author-meta">
                      <strong>{r.name}</strong>
                      <span>{r.company}</span>
                    </div>
                    <span className="review-date">{r.date}</span>
                  </div>

                  <div className="review-card-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        fill={i < r.rating ? '#eab308' : 'none'}
                        color={i < r.rating ? '#eab308' : '#e2e8f0'}
                      />
                    ))}
                  </div>

                  <blockquote>&ldquo;{r.text}&rdquo;</blockquote>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Reusable CTA Component */}
      <CTABand 
        headline="Ready to experience premium print quality?" 
        subtext="Join 500+ garment manufacturers and retailers who trust DSK Printers." 
        variant="blue"
      />
    </div>
  )
}
