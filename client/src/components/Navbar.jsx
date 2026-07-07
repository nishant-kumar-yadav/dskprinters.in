import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { fetchCategories, COMPANY } from '../api.js'
import { useQuoteModal } from './QuoteModal.jsx'
import './navbar.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products', mega: true },
  { to: '/about', label: 'About' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const { openQuote } = useQuoteModal()
  const location = useLocation()
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })

  useEffect(() => {
    setOpen(false)
    setMegaOpen(false)
  }, [location.pathname])

  return (
    <header className="navbar glass">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="DSK Printers home">
          <img src="/images/logo.png" alt="DSK Printers logo" width="42" height="42" />
          <span>
            <strong>
              <span className="brand-red">DS</span>
              <span className="brand-blue">K</span> Printers
            </strong>
            <small>New Delhi, India</small>
          </span>
        </Link>

        <nav className="navbar-links" aria-label="Main navigation">
          {links.map((l) =>
            l.mega ? (
              <div
                key={l.to}
                className="mega-wrap"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <NavLink to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                  {l.label} <ChevronDown size={14} aria-hidden="true" />
                </NavLink>
                {megaOpen && categories?.length > 0 && (
                  <div className="mega-menu card">
                    {categories.map((c) => (
                      <Link key={c.slug} to={`/category/${c.slug}`} className="mega-item">
                        {c.name}
                        <span>{c.productCount}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {l.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="navbar-actions">
          <a href={`tel:${COMPANY.phone}`} className="navbar-phone">
            <Phone size={16} aria-hidden="true" />
            {COMPANY.phone}
          </a>
          <button className="btn btn-primary navbar-cta" onClick={() => openQuote({ source: 'navbar_cta' })}>
            Get Quote
          </button>
          <button
            className="navbar-burger"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="navbar-mobile">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
          <button className="btn btn-primary" onClick={() => openQuote({ source: 'navbar_cta' })}>
            Get Quote
          </button>
        </div>
      )}
    </header>
  )
}
