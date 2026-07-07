import { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle2, Loader2 } from 'lucide-react'
import { submitLead } from '../api.js'
import './quote-modal.css'

const QuoteModalContext = createContext(null)

export function useQuoteModal() {
  return useContext(QuoteModalContext)
}

export function QuoteModalProvider({ children }) {
  const [state, setState] = useState(null) // { product, source }

  const openQuote = useCallback((opts = {}) => {
    setState({ product: opts.product || '', source: opts.source || 'quote_modal' })
  }, [])

  const closeQuote = useCallback(() => setState(null), [])

  return (
    <QuoteModalContext.Provider value={{ openQuote, closeQuote }}>
      {children}
      {state && <QuoteModal initial={state} onClose={closeQuote} />}
    </QuoteModalContext.Provider>
  )
}

function QuoteModal({ initial, onClose }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    product: initial.product,
    quantity: '',
    message: '',
    website: '', // honeypot
  })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await submitLead({ ...form, source: initial.source })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Get a quote">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {status === 'success' ? (
          <div className="modal-success">
            <CheckCircle2 size={52} color="var(--success)" aria-hidden="true" />
            <h3>Request received!</h3>
            <p>{"Thank you! Our team will contact you within a few hours with the best quote."}</p>
            <button className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <h3 className="modal-title">Get Best Quote</h3>
            <p className="modal-sub">{"Share your requirement and we'll respond quickly — 85% response rate."}</p>
            <form onSubmit={handleSubmit} className="modal-form">
              {/* Honeypot — hidden from real users */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={set('website')}
                className="hp-field"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div className="field">
                <label htmlFor="q-name">Name *</label>
                <input id="q-name" required maxLength={100} value={form.name} onChange={set('name')} placeholder="Your name" />
              </div>
              <div className="field">
                <label htmlFor="q-phone">Phone *</label>
                <input id="q-phone" required type="tel" maxLength={15} value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
              </div>
              <div className="field">
                <label htmlFor="q-email">Email</label>
                <input id="q-email" type="email" maxLength={100} value={form.email} onChange={set('email')} placeholder="you@company.com" />
              </div>
              <div className="field">
                <label htmlFor="q-product">Product</label>
                <input id="q-product" maxLength={200} value={form.product} onChange={set('product')} placeholder="e.g. UV DTF Sticker" />
              </div>
              <div className="field">
                <label htmlFor="q-qty">Quantity</label>
                <input id="q-qty" maxLength={50} value={form.quantity} onChange={set('quantity')} placeholder="e.g. 500 pieces" />
              </div>
              <div className="field modal-full">
                <label htmlFor="q-msg">Message</label>
                <textarea id="q-msg" rows={3} maxLength={1000} value={form.message} onChange={set('message')} placeholder="Describe your requirement..." />
              </div>
              {status === 'error' && <p className="modal-error modal-full">{error}</p>}
              <button type="submit" className="btn btn-primary modal-full" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <>
                    <Loader2 size={16} className="spin" aria-hidden="true" /> Sending...
                  </>
                ) : (
                  'Send Requirement'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
