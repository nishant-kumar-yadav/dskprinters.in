import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import {
  X, User, Phone, Mail, Package, MessageSquare, Hash,
  ChevronRight, ChevronLeft, Loader2, CheckCircle2, Send,
  Clock, ShieldCheck, MessageCircle
} from 'lucide-react'
import { submitLead, COMPANY } from '../api.js'
import './quote-modal.css'

const QuoteModalContext = createContext(null)

export function useQuoteModal() {
  return useContext(QuoteModalContext)
}

export function QuoteModalProvider({ children }) {
  const [state, setState] = useState(null)

  const openQuote = useCallback((opts = {}) => {
    setState({ 
      product: opts.product || '', 
      productLink: opts.productLink || '',
      productImage: opts.productImage || '',
      source: opts.source || 'quote_modal' 
    })
  }, [])

  const closeQuote = useCallback(() => setState(null), [])

  return (
    <QuoteModalContext.Provider value={{ openQuote, closeQuote }}>
      {children}
      {state && <QuoteModal initial={state} onClose={closeQuote} />}
    </QuoteModalContext.Provider>
  )
}

const STEPS = [
  { id: 1, label: 'Your Info', icon: User },
  { id: 2, label: 'Requirement', icon: Package },
  { id: 3, label: 'Confirm', icon: Send },
]

const PHONE_RE = /^[+\d][\d\s-]{7,14}$/

function QuoteModal({ initial, onClose }) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState('next') // 'next' | 'prev'
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    product: initial.product || '',
    productLink: initial.productLink || '',
    productImage: initial.productImage || '',
    quantity: '',
    message: '',
    website: '', // honeypot
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const contentRef = useRef(null)

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    // Clear field error on typing
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: '' }))
    }
  }

  // Auto-focus first input on step change
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = contentRef.current?.querySelector('input, textarea, select')
      if (el) el.focus()
    }, 350)
    return () => clearTimeout(timer)
  }, [step])

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function validateStep1() {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Please enter your name'
    if (!form.phone.trim()) errors.phone = 'Please enter your phone number'
    else if (!PHONE_RE.test(form.phone.trim())) errors.phone = 'Enter a valid phone number'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function goNext() {
    if (step === 1 && !validateStep1()) return
    setDirection('next')
    setStep((s) => Math.min(s + 1, 3))
  }

  function goBack() {
    setDirection('prev')
    setStep((s) => Math.max(s - 1, 1))
  }

  async function handleSubmit() {
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

  const whatsappLink = `https://wa.me/${COMPANY.phoneRaw}?text=${encodeURIComponent(
    `Hi, I just submitted a quote request for "${form.product || 'your products'}". My name is ${form.name}. Looking forward to hearing from you!`
  )}`

  return (
    <div className="qm-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Get a quote">
      <div className="qm-card" onClick={(e) => e.stopPropagation()}>
        <button className="qm-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {status === 'success' ? (
          <SuccessView name={form.name} whatsappLink={whatsappLink} onClose={onClose} />
        ) : (
          <>
            {/* Header */}
            <div className="qm-header">
              <h3 className="qm-title">Get Best Quote</h3>
              <p className="qm-subtitle">
                {step === 1 && "Let's start with your contact details"}
                {step === 2 && 'Tell us what you need'}
                {step === 3 && 'Review and send your request'}
              </p>
            </div>

            {/* Step indicator */}
            <div className="qm-steps">
              {STEPS.map((s, i) => {
                const Icon = s.icon
                const isActive = step === s.id
                const isDone = step > s.id
                return (
                  <div key={s.id} className="qm-step-item">
                    <div
                      className={`qm-step-dot ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                    >
                      {isDone ? <CheckCircle2 size={16} /> : <Icon size={14} />}
                    </div>
                    <span className={`qm-step-label ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                      {s.label}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div className={`qm-step-line ${isDone ? 'done' : ''}`} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Honeypot */}
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

            {/* Step content with slide animation */}
            <div className="qm-content-wrap">
              <div
                ref={contentRef}
                className={`qm-content qm-slide-${direction}`}
                key={step}
              >
                {step === 1 && (
                  <Step1 form={form} set={set} fieldErrors={fieldErrors} />
                )}
                {step === 2 && (
                  <Step2 form={form} set={set} clearProduct={() => setForm(f => ({ ...f, product: '', productLink: '', productImage: '' }))} initialProduct={initial.product} initialImage={initial.productImage} />
                )}
                {step === 3 && (
                  <Step3 form={form} />
                )}
              </div>
            </div>

            {/* Error */}
            {status === 'error' && (
              <div className="qm-error">
                <span>⚠</span> {error}
              </div>
            )}

            {/* Footer actions */}
            <div className="qm-footer">
              {step > 1 && (
                <button
                  type="button"
                  className="qm-btn qm-btn-back"
                  onClick={goBack}
                  disabled={status === 'loading'}
                >
                  <ChevronLeft size={16} /> Back
                </button>
              )}
              <div className="qm-footer-spacer" />
              {step < 3 ? (
                <button
                  type="button"
                  className="qm-btn qm-btn-next"
                  onClick={goNext}
                >
                  {step === 1 ? 'Continue' : 'Review'} <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  className="qm-btn qm-btn-submit"
                  onClick={handleSubmit}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <><Loader2 size={16} className="spin" /> Sending...</>
                  ) : (
                    <><Send size={16} /> Send Request</>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Step 1: Contact Info ── */
function Step1({ form, set, fieldErrors }) {
  return (
    <div className="qm-fields">
      <div className={`qm-field ${fieldErrors.name ? 'has-error' : ''}`}>
        <label htmlFor="q-name">
          <User size={14} /> Full Name <span className="qm-req">*</span>
        </label>
        <input
          id="q-name"
          required
          maxLength={100}
          value={form.name}
          onChange={set('name')}
          placeholder="Enter your full name"
        />
        {fieldErrors.name && <span className="qm-field-error">{fieldErrors.name}</span>}
      </div>

      <div className={`qm-field ${fieldErrors.phone ? 'has-error' : ''}`}>
        <label htmlFor="q-phone">
          <Phone size={14} /> Phone Number <span className="qm-req">*</span>
        </label>
        <input
          id="q-phone"
          required
          type="tel"
          maxLength={15}
          value={form.phone}
          onChange={set('phone')}
          placeholder="+91 98765 43210"
        />
        {fieldErrors.phone && <span className="qm-field-error">{fieldErrors.phone}</span>}
      </div>

      <div className="qm-field">
        <label htmlFor="q-email">
          <Mail size={14} /> Email <span className="qm-opt">(optional)</span>
        </label>
        <input
          id="q-email"
          type="email"
          maxLength={100}
          value={form.email}
          onChange={set('email')}
          placeholder="you@company.com"
        />
      </div>

      <div className="qm-trust">
        <div className="qm-trust-item">
          <ShieldCheck size={14} />
          <span>Your info is safe & never shared</span>
        </div>
        <div className="qm-trust-item">
          <Clock size={14} />
          <span>We respond within 2 hours</span>
        </div>
      </div>
    </div>
  )
}

/* ── Step 2: Requirement Details ── */
function Step2({ form, set, clearProduct, initialProduct, initialImage }) {
  const isPrefilled = initialProduct && form.product === initialProduct;
  
  return (
    <div className="qm-fields">
      {isPrefilled ? (
        <div className="qm-prefilled">
          <span className="qm-prefilled-badge">
            {initialImage ? (
              <img src={initialImage} alt={form.product} className="qm-prefilled-img" />
            ) : (
              <Package size={14} />
            )}
            {form.product}
          </span>
          <button type="button" onClick={clearProduct}>
            Change
          </button>
        </div>
      ) : (
        <div className="qm-field">
          <label htmlFor="q-product">
            <Package size={14} /> Product / Service
          </label>
          <input
            id="q-product"
            maxLength={200}
            value={form.product}
            onChange={set('product')}
            placeholder="e.g. UV DTF Sticker, Clothing Label..."
          />
        </div>
      )}

      <div className="qm-field">
        <label htmlFor="q-qty">
          <Hash size={14} /> Quantity
        </label>
        <input
          id="q-qty"
          maxLength={50}
          value={form.quantity}
          onChange={set('quantity')}
          placeholder="e.g. 500 pieces, 1000 sheets"
        />
      </div>

      <div className="qm-field">
        <label htmlFor="q-msg">
          <MessageSquare size={14} /> Additional Details
        </label>
        <textarea
          id="q-msg"
          rows={4}
          maxLength={1000}
          value={form.message}
          onChange={set('message')}
          placeholder="Tell us about size, material, design, or any special requirements..."
        />
      </div>
    </div>
  )
}

/* ── Step 3: Review ── */
function Step3({ form }) {
  return (
    <div className="qm-review">
      <p className="qm-review-intro">Please review your details before sending:</p>

      <div className="qm-review-card">
        <div className="qm-review-section">
          <h4><User size={14} /> Contact</h4>
          <div className="qm-review-row">
            <span>Name</span>
            <strong>{form.name}</strong>
          </div>
          <div className="qm-review-row">
            <span>Phone</span>
            <strong>{form.phone}</strong>
          </div>
          {form.email && (
            <div className="qm-review-row">
              <span>Email</span>
              <strong>{form.email}</strong>
            </div>
          )}
        </div>

        <div className="qm-review-divider" />

        <div className="qm-review-section">
          <h4><Package size={14} /> Requirement</h4>
          {form.product && (
            <div className="qm-review-row">
              <span>Product</span>
              <strong>{form.product}</strong>
            </div>
          )}
          {form.quantity && (
            <div className="qm-review-row">
              <span>Quantity</span>
              <strong>{form.quantity}</strong>
            </div>
          )}
          {form.message && (
            <div className="qm-review-row qm-review-msg">
              <span>Message</span>
              <strong>{form.message}</strong>
            </div>
          )}
          {!form.product && !form.quantity && !form.message && (
            <p className="qm-review-empty">No specific requirements added — that's okay, our team will discuss with you.</p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Success State ── */
function SuccessView({ name, whatsappLink, onClose }) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowConfetti(true), 200)
  }, [])

  return (
    <div className="qm-success">
      <div className={`qm-success-icon ${showConfetti ? 'celebrate' : ''}`}>
        <div className="qm-success-ring" />
        <CheckCircle2 size={48} />
      </div>

      <h3>Request Sent Successfully!</h3>
      <p className="qm-success-name">Thank you, {name}! 🎉</p>
      <p className="qm-success-desc">
        Our team has received your requirement and will contact you within <strong>2 hours</strong> with the best quote.
      </p>

      <div className="qm-success-timeline">
        <div className="qm-timeline-item active">
          <div className="qm-timeline-dot" />
          <div>
            <strong>Request received</strong>
            <span>Just now</span>
          </div>
        </div>
        <div className="qm-timeline-item">
          <div className="qm-timeline-dot" />
          <div>
            <strong>Team reviews your requirement</strong>
            <span>Within 30 min</span>
          </div>
        </div>
        <div className="qm-timeline-item">
          <div className="qm-timeline-dot" />
          <div>
            <strong>You receive the best quote</strong>
            <span>Within 2 hours</span>
          </div>
        </div>
      </div>

      <div className="qm-success-actions">
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="qm-btn qm-btn-whatsapp">
          <MessageCircle size={18} /> Chat on WhatsApp
        </a>
        <button className="qm-btn qm-btn-done" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  )
}
