import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Phone, Mail, MapPin, Clock, MessageCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { submitLead, COMPANY } from '../api.js'
import { useReveal } from '../hooks/useReveal.js'
import './pages.css'

export default function Contact() {
  const ref = useReveal()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    product: '',
    quantity: '',
    message: '',
    website: '', // honeypot
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await submitLead({ ...form, source: 'contact_page' })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  return (
    <div className="page" ref={ref}>
      <Helmet>
        <title>Contact Us | DSK Printers New Delhi</title>
        <meta name="description" content="Get in touch with DSK Printers for bulk orders, custom quotes, or product inquiries. Phone, WhatsApp, email. New Delhi, India." />
      </Helmet>

      {/* Hero with Direct Actions */}
      <section className="contact-hero">
        <div className="container">
          <span className="section-eyebrow text-center">GET IN TOUCH</span>
          <h1>Have a Question? Contact Us</h1>
          <p className="contact-hero-sub">
            We respond to {COMPANY.responseRate} of enquiries within a few hours. Connect with us directly for fast assistance.
          </p>

          <div className="contact-direct-actions">
            <a 
              href={COMPANY.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn contact-action-btn wa-action"
            >
              <MessageCircle size={22} aria-hidden="true" />
              <span>
                <strong>Chat on WhatsApp</strong>
                <small>Instant Response</small>
              </span>
            </a>
            <a 
              href={`tel:${COMPANY.phone}`} 
              className="btn contact-action-btn phone-action"
            >
              <Phone size={20} aria-hidden="true" />
              <span>
                <strong>Call Support</strong>
                <small>Direct Line</small>
              </span>
            </a>
          </div>

          <div className="contact-email-card card">
            <Mail size={18} className="email-icon" aria-hidden="true" />
            <span>Email: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></span>
          </div>
        </div>
      </section>

      {/* Contact Grid with info list and Form */}
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container contact-page-grid">
          
          {/* Info Side */}
          <div className="contact-side-info">
            <div className="compact-info-strip card">
              <div className="info-strip-row">
                <MapPin size={20} className="info-icon" aria-hidden="true" />
                <div>
                  <h3>Factory & Office Address</h3>
                  <p>{COMPANY.location}</p>
                </div>
              </div>
              <div className="info-strip-row">
                <Clock size={20} className="info-icon" aria-hidden="true" />
                <div>
                  <h3>Business Hours</h3>
                  <p>Monday – Saturday, 9:30 AM – 7:00 PM IST</p>
                </div>
              </div>
              <div className="info-strip-row">
                <CheckCircle2 size={20} className="info-icon" aria-hidden="true" />
                <div>
                  <h3>GST Registered Vendor</h3>
                  <p>Invoices issued with GSTIN: {COMPANY.gst}</p>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="map-container card">
              <iframe
                title="DSK Printers Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.8654316045864!2d77.1463835!3d28.6463439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03a35181f92d%3A0x91803867f4772e65!2sDSK%20Printers!5e0!3m2!1sen!2sin!4v1720616145290!5m2!1sen!2sin"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Form Side */}
          <div className="contact-form-section card reveal">
            {status === 'success' ? (
              <div className="form-success">
                <CheckCircle2 size={56} className="success-pulse" aria-hidden="true" />
                <h2>Requirement Submitted!</h2>
                <p>{"Thank you. A DSK representative will call you back within 2 hours with price quotes."}</p>
                <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => setStatus('idle')}>
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <>
                <div className="form-head">
                  <h2>Send Enquiry Details</h2>
                  <p>Fill out this form and our printing experts will get back to you with custom pricing.</p>
                </div>
                <form onSubmit={handleSubmit} className="custom-contact-form">
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={set('website')}
                    style={{ position: 'absolute', left: '-9999px' }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                  <div className="form-row-2">
                    <div className="field">
                      <label htmlFor="c-name">Your Name *</label>
                      <input id="c-name" required maxLength={100} value={form.name} onChange={set('name')} placeholder="e.g. Ramesh Kumar" />
                    </div>
                    <div className="field">
                      <label htmlFor="c-phone">Phone Number *</label>
                      <input id="c-phone" required type="tel" maxLength={15} value={form.phone} onChange={set('phone')} placeholder="10 digit mobile number" />
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="field">
                      <label htmlFor="c-email">Email Address</label>
                      <input id="c-email" type="email" maxLength={100} value={form.email} onChange={set('email')} placeholder="name@company.com" />
                    </div>
                    <div className="field">
                      <label htmlFor="c-product">Product Needed</label>
                      <input id="c-product" maxLength={200} value={form.product} onChange={set('product')} placeholder="e.g. UV DTF Sticker" />
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="c-qty">Estimated Quantity</label>
                    <input id="c-qty" maxLength={50} value={form.quantity} onChange={set('quantity')} placeholder="e.g. 500 meters, 1000 stickers" />
                  </div>
                  <div className="field">
                    <label htmlFor="c-msg">Specific Requirements / Message</label>
                    <textarea id="c-msg" rows={4} maxLength={1000} value={form.message} onChange={set('message')} placeholder="Provide size details, fabric type or designs link..." />
                  </div>
                  {status === 'error' && <p className="form-error">{error}</p>}
                  <button type="submit" className="btn btn-primary form-submit-btn" disabled={status === 'loading'}>
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={16} className="spin" aria-hidden="true" /> Processing...
                      </>
                    ) : (
                      'Request Free Quote'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
          
        </div>
      </section>
    </div>
  )
}
