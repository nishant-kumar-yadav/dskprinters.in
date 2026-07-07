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
        <title>Contact Us | DSK Printers</title>
      </Helmet>

      <section className="page-hero">
        <div className="container">
          <h1>
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p>
            Questions about products, pricing or bulk orders? Reach out — we respond to{' '}
            {COMPANY.responseRate} of enquiries within a few hours.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container contact-grid">
          <div className="contact-info">
            <div className="contact-item card">
              <div className="contact-item-icon">
                <Phone size={19} aria-hidden="true" />
              </div>
              <div>
                <h3>Phone</h3>
                <a href={`tel:${COMPANY.phone}`}>{COMPANY.phone}</a>
              </div>
            </div>
            <div className="contact-item card">
              <div className="contact-item-icon">
                <MessageCircle size={19} aria-hidden="true" />
              </div>
              <div>
                <h3>WhatsApp</h3>
                <a href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer">
                  Chat with us instantly
                </a>
              </div>
            </div>
            <div className="contact-item card">
              <div className="contact-item-icon">
                <Mail size={19} aria-hidden="true" />
              </div>
              <div>
                <h3>Email</h3>
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </div>
            </div>
            <div className="contact-item card">
              <div className="contact-item-icon">
                <MapPin size={19} aria-hidden="true" />
              </div>
              <div>
                <h3>Location</h3>
                <p>{COMPANY.location}</p>
                <p>GST: {COMPANY.gst}</p>
              </div>
            </div>
            <div className="contact-item card">
              <div className="contact-item-icon">
                <Clock size={19} aria-hidden="true" />
              </div>
              <div>
                <h3>Business Hours</h3>
                <p>Monday – Saturday, 9:30 AM – 7:00 PM IST</p>
              </div>
            </div>
          </div>

          <div className="contact-form-card card">
            {status === 'success' ? (
              <div className="form-success">
                <CheckCircle2 size={52} color="var(--success)" aria-hidden="true" />
                <h2>Message sent!</h2>
                <p>{"Thank you for reaching out. Our team will contact you within a few hours."}</p>
              </div>
            ) : (
              <>
                <h2>Send Your Requirement</h2>
                <form onSubmit={handleSubmit} className="contact-form">
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
                  <div className="field">
                    <label htmlFor="c-name">Name *</label>
                    <input id="c-name" required maxLength={100} value={form.name} onChange={set('name')} placeholder="Your name" />
                  </div>
                  <div className="field">
                    <label htmlFor="c-phone">Phone *</label>
                    <input id="c-phone" required type="tel" maxLength={15} value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
                  </div>
                  <div className="field">
                    <label htmlFor="c-email">Email</label>
                    <input id="c-email" type="email" maxLength={100} value={form.email} onChange={set('email')} placeholder="you@company.com" />
                  </div>
                  <div className="field">
                    <label htmlFor="c-product">Product</label>
                    <input id="c-product" maxLength={200} value={form.product} onChange={set('product')} placeholder="e.g. DTF Sticker" />
                  </div>
                  <div className="field form-full">
                    <label htmlFor="c-qty">Quantity</label>
                    <input id="c-qty" maxLength={50} value={form.quantity} onChange={set('quantity')} placeholder="e.g. 1000 pieces" />
                  </div>
                  <div className="field form-full">
                    <label htmlFor="c-msg">Message</label>
                    <textarea id="c-msg" rows={4} maxLength={1000} value={form.message} onChange={set('message')} placeholder="Describe your requirement..." />
                  </div>
                  {status === 'error' && <p className="form-error form-full">{error}</p>}
                  <button type="submit" className="btn btn-primary form-full" disabled={status === 'loading'}>
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={16} className="spin" aria-hidden="true" /> Sending...
                      </>
                    ) : (
                      'Send Message'
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
