import { Helmet } from 'react-helmet-async'
import { COMPANY } from '../api.js'
import { useReveal } from '../hooks/useReveal.js'
import CTABand from '../components/CTABand.jsx'
import { Factory, Layers, FileText, Truck, Clock, ShieldCheck, CheckCircle } from 'lucide-react'
import './pages.css'

const reasons = [
  {
    icon: <Factory size={24} className="reason-icon-blue" />,
    title: "In-House Production",
    desc: "Everything is manufactured inside our Delhi factory using state-of-the-art machinery. No middleman, no outsourcing."
  },
  {
    icon: <Layers size={24} className="reason-icon-red" />,
    title: "100 to 100,000 Pieces",
    desc: "We support both startup fashion labels and bulk corporate requirements. Same quality check for 1 sheet or 10,000 sheets."
  },
  {
    icon: <FileText size={24} className="reason-icon-blue" />,
    title: "GST Registered Business",
    desc: `Get proper tax invoices for your business. Fully compliant GST registered entity (${COMPANY.gst}).`
  },
  {
    icon: <Truck size={24} className="reason-icon-red" />,
    title: "Pan-India Delivery",
    desc: "Fast, tracked shipping to pin codes all over India. Securely packed in tubes to prevent damage during transit."
  },
  {
    icon: <Clock size={24} className="reason-icon-blue" />,
    title: "Quick turnaround & support",
    desc: `We respond to ${COMPANY.responseRate} of enquiries within a few hours. Dedicated customer coordinators for every order.`
  },
  {
    icon: <ShieldCheck size={24} className="reason-icon-red" />,
    title: "50+ Wash Durability",
    desc: "Our prints use premium inks and hot-melt powders tested to survive 50+ wash cycles without fading or cracking."
  }
]

export default function About() {
  const ref = useReveal()

  return (
    <div className="page" ref={ref}>
      <Helmet>
        <title>About Us | DSK Printers — Since 2015</title>
        <meta name="description" content="DSK Printers is a trusted DTF & UV DTF sticker manufacturer established in 2015, based in New Delhi. GST registered, 500+ happy clients." />
      </Helmet>

      {/* Hero Strip */}
      <section className="about-hero">
        <div className="container">
          <span className="section-eyebrow">ESTABLISHED 2015</span>
          <h1>
            India's Trusted <span className="brand-red">DTF</span> & <span className="brand-blue">UV DTF</span> Manufacturer
          </h1>
          <p className="about-hero-sub">
            Direct-to-Film transfer stickers, UV transfer decals, heat press labels and customized apparel for growing brands.
          </p>
          
          <div className="about-hero-pills">
            <span className="hero-pill">
              <CheckCircle size={14} className="icon-green" /> 500+ Clients
            </span>
            <span className="hero-pill">
              <CheckCircle size={14} className="icon-green" /> 10+ Years Experience
            </span>
            <span className="hero-pill">
              <CheckCircle size={14} className="icon-green" /> 85% Response Rate
            </span>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section">
        <div className="container about-grid">
          <div className="about-visual reveal">
            <img
              src="/images/cat-tshirt-printing.png"
              alt="DSK Printers production facility in New Delhi"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.jpg'
              }}
            />
          </div>
          
          <div className="about-copy reveal">
            <span className="section-eyebrow">Our Journey</span>
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
              As a GST-registered business, we provide proper invoicing, reliable
              dispatch timelines and a dedicated support line with an {COMPANY.responseRate} enquiry
              response rate.
            </p>
          </div>
        </div>
      </section>

      {/* Facts Ticker */}
      <section className="about-ticker-section">
        <div className="container">
          <div className="about-ticker">
            <div className="ticker-item">
              <strong>Since 2015</strong>
              <span>Established</span>
            </div>
            <div className="ticker-item">
              <strong>{COMPANY.turnover}</strong>
              <span>Annual Turnover</span>
            </div>
            <div className="ticker-item">
              <strong>{COMPANY.employees}</strong>
              <span>Expert Team</span>
            </div>
            <div className="ticker-item">
              <strong>500+</strong>
              <span>Happy Brands</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-choose-section">
        <div className="container">
          <div className="section-head reveal text-center">
            <span className="section-eyebrow">Built for Quality</span>
            <h2 className="section-title">Why Garment Brands Trust Us</h2>
          </div>
          
          <div className="why-grid reveal">
            {reasons.map((r, index) => (
              <div key={index} className="reason-card card">
                <div className="reason-icon-wrapper">
                  {r.icon}
                </div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <CTABand 
        headline="Ready to Partner with Us?" 
        subtext="Upload your designs today and get high-quality custom samples dispatched fast." 
        variant="red"
      />
    </div>
  )
}
