import { Helmet } from 'react-helmet-async'
import { Star } from 'lucide-react'
import { useQuoteModal } from '../components/QuoteModal.jsx'
import { useReveal } from '../hooks/useReveal.js'
import './pages.css'

const reviews = [
  {
    name: 'Rohit Malhotra',
    company: 'StreetVibe Clothing, Mumbai',
    rating: 5,
    text: 'We order DTF gang sheets every month for our streetwear drops. Colors are always spot-on and the prints survive 50+ washes easily. Best vendor we have worked with.',
  },
  {
    name: 'Priya Sharma',
    company: 'Kidsy Wear, Jaipur',
    rating: 5,
    text: 'The cartoon character heat press stickers are a hit with our kidswear line. Non-toxic inks were important for us and DSK delivered exactly what they promised.',
  },
  {
    name: 'Amandeep Singh',
    company: 'Punjab Sports Kits, Ludhiana',
    rating: 5,
    text: 'Name and number DTF transfers for 800 jerseys delivered in 6 days. Perfect opacity on dark fabrics. Highly recommended for bulk sports orders.',
  },
  {
    name: 'Neha Gupta',
    company: 'Corporate Gifting Co., Gurugram',
    rating: 4,
    text: 'Ordered 500 corporate polos with logo printing. Quality was excellent and pricing was better than three other vendors we compared. Will order again.',
  },
  {
    name: 'Vikram Reddy',
    company: 'Hyderabad Print House',
    rating: 5,
    text: 'As a print shop we resell their UV DTF stickers. The 3D glossy finish sells itself — our customers keep coming back. Dispatch is always on time.',
  },
  {
    name: 'Sana Khan',
    company: 'Label Studio, Delhi',
    rating: 5,
    text: 'Silicone heat transfer labels with deep 3D relief — exactly the premium feel our activewear client wanted. Great communication throughout the order.',
  },
]

export default function Reviews() {
  const ref = useReveal()
  const { openQuote } = useQuoteModal()
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <div className="page" ref={ref}>
      <Helmet>
        <title>Customer Reviews | DSK Printers</title>
      </Helmet>

      <section className="page-hero">
        <div className="container">
          <h1>
            Customer <span className="gradient-text">Reviews</span>
          </h1>
          <p>
            Rated {avg}/5 by garment brands, print shops and corporate buyers across India. Here is
            what they say about working with us.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-3">
            {reviews.map((r) => (
              <div key={r.name} className="review-card card reveal">
                <div className="review-stars" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < r.rating ? 'currentColor' : 'none'}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote>&ldquo;{r.text}&rdquo;</blockquote>
                <div className="review-author">
                  <strong>{r.name}</strong>
                  <span>{r.company}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="section-cta">
            <button className="btn btn-primary" onClick={() => openQuote({ source: 'reviews_page' })}>
              Join Our Happy Customers
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
