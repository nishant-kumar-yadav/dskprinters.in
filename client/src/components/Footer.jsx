import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { fetchCategories, COMPANY } from '../api.js'
import './footer.css'

export default function Footer() {
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })
  const topCategories = (categories || []).slice(0, 6)

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label="DSK Printers home">
            <img src="/images/logo.png" alt="DSK Printers logo" width="44" height="44" />
            <span>
              <strong>DSK Printers</strong>
              <small>Since {COMPANY.established}</small>
            </span>
          </Link>
          <p>{COMPANY.tagline}. GST: {COMPANY.gst}</p>
          <div className="footer-contact">
            <a href={`tel:${COMPANY.phone}`}>
              <Phone size={15} aria-hidden="true" /> {COMPANY.phone}
            </a>
            <a href={`mailto:${COMPANY.email}`}>
              <Mail size={15} aria-hidden="true" /> {COMPANY.email}
            </a>
            <span>
              <MapPin size={15} aria-hidden="true" /> {COMPANY.location}
            </span>
          </div>
        </div>

        <nav className="footer-col" aria-label="Footer quick links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/products">All Products</Link>
          <Link to="/about">About Us</Link>
          <Link to="/reviews">Reviews</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <nav className="footer-col" aria-label="Footer product categories">
          <h4>Products</h4>
          {topCategories.map((c) => (
            <Link key={c.slug} to={`/category/${c.slug}`}>
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="footer-col">
          <h4>Business Hours</h4>
          <p className="footer-hours">Monday – Saturday</p>
          <p className="footer-hours">9:30 AM – 7:00 PM IST</p>
          <a
            href={COMPANY.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-blue footer-wa"
          >
            <MessageCircle size={16} aria-hidden="true" /> Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <p>DTF &amp; UV DTF Sticker Manufacturer — New Delhi, India</p>
        </div>
      </div>
    </footer>
  )
}
