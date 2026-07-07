import { Helmet } from 'react-helmet-async'
import { COMPANY } from '../api.js'
import { useQuoteModal } from '../components/QuoteModal.jsx'
import { useReveal } from '../hooks/useReveal.js'
import './pages.css'

const facts = [
  { value: `Est. ${COMPANY.established}`, label: 'Serving India for 10+ years' },
  { value: COMPANY.turnover, label: 'Annual Turnover' },
  { value: COMPANY.employees, label: 'Team Members' },
  { value: COMPANY.responseRate, label: 'Enquiry Response Rate' },
]

export default function About() {
  const ref = useReveal()
  const { openQuote } = useQuoteModal()

  return (
    <div className="page" ref={ref}>
      <Helmet>
        <title>About Us | DSK Printers</title>
      </Helmet>

      <section className="page-hero">
        <div className="container">
          <h1>
            About <span className="gradient-text">DSK Printers</span>
          </h1>
          <p>
            A New Delhi based manufacturer of DTF stickers, UV DTF transfers, heat transfer labels
            and custom printed apparel — trusted by brands across India since {COMPANY.established}.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container about-grid">
          <div className="about-copy reveal">
            <span className="section-eyebrow">Our Story</span>
            <h2 className="section-title">Print Partners to Growing Brands</h2>
            <p>
              DSK Printers started in {COMPANY.established} with a single heat press and a simple
              goal: give Indian garment brands access to world-class transfer printing without
              world-class prices. Today we operate a full in-house production line in New Delhi
              covering DTF, UV DTF, screen-printed plastisol transfers, silicone labels and
              polycarbonate stickers.
            </p>
            <p>
              We work with fashion labels, uniform suppliers, sportswear teams, corporate gifting
              agencies and print shops across the country. Every order — from 100 stickers to
              100,000 — goes through the same quality checks: color accuracy, wash durability and
              precise cutting.
            </p>
            <p>
              As a GST-registered business ({COMPANY.gst}), we provide proper invoicing, reliable
              dispatch timelines and a dedicated support line with an {COMPANY.responseRate} enquiry
              response rate.
            </p>
            <button
              className="btn btn-primary"
              style={{ width: 'fit-content', marginTop: 8 }}
              onClick={() => openQuote({ source: 'about_page' })}
            >
              Work With Us
            </button>
          </div>
          <div className="about-visual reveal">
            <img
              src="/images/cat-tshirt-printing.png"
              alt="DSK Printers production facility in New Delhi"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.jpg'
              }}
            />
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head reveal">
            <span className="section-eyebrow">At a Glance</span>
            <h2 className="section-title">Company Facts</h2>
          </div>
          <div className="grid grid-4 reveal">
            {facts.map((f) => (
              <div key={f.label} className="fact-card card">
                <strong>{f.value}</strong>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
