import { COMPANY } from '../api.js'
import { useQuoteModal } from './QuoteModal.jsx'
import { MessageCircle } from 'lucide-react'
import './cta-band.css'

export default function CTABand({ 
  headline = "Ready to Start Your Next Order?", 
  subtext = "Get in touch with us today for direct pricing and custom sizing.",
  variant = "red"
}) {
  const { openQuote } = useQuoteModal()

  return (
    <section className={`cta-band cta-band-${variant}`}>
      <div className="container cta-band-inner">
        <div className="cta-band-content">
          <h2>{headline}</h2>
          {subtext && <p>{subtext}</p>}
        </div>
        <div className="cta-band-actions">
          <button 
            className="btn cta-btn-main" 
            onClick={() => openQuote({ source: 'cta_band' })}
          >
            Get Quote
          </button>
          <a 
            href={COMPANY.whatsapp} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn cta-btn-alt"
          >
            <MessageCircle size={16} aria-hidden="true" /> WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  )
}
