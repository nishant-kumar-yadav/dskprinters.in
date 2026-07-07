import { NavLink } from 'react-router-dom'
import { Home, Package, Phone, MessageCircle } from 'lucide-react'
import { COMPANY } from '../api.js'
import { useQuoteModal } from './QuoteModal.jsx'
import './widgets.css'

export default function MobileBottomNav() {
  const { openQuote } = useQuoteModal()

  return (
    <nav className="bottom-nav" aria-label="Mobile quick navigation">
      <NavLink to="/" end className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
        <Home size={20} aria-hidden="true" />
        <span>Home</span>
      </NavLink>
      <NavLink to="/products" className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
        <Package size={20} aria-hidden="true" />
        <span>Products</span>
      </NavLink>
      <button className="bottom-nav-item bottom-nav-cta" onClick={() => openQuote({ source: 'bottom_nav' })}>
        <MessageCircle size={20} aria-hidden="true" />
        <span>Quote</span>
      </button>
      <a href={`tel:${COMPANY.phone}`} className="bottom-nav-item">
        <Phone size={20} aria-hidden="true" />
        <span>Call</span>
      </a>
    </nav>
  )
}
