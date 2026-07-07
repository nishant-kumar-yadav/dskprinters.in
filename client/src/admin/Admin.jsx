import { useState } from 'react'
import { adminLogin, adminLogout, isAdminLoggedIn } from '../api.js'
import StatsPanel from './StatsPanel.jsx'
import LeadsPanel from './LeadsPanel.jsx'
import ProductsPanel from './ProductsPanel.jsx'
import CategoriesPanel from './CategoriesPanel.jsx'
import './admin.css'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'leads', label: 'Leads' },
  { id: 'products', label: 'Products' },
  { id: 'categories', label: 'Categories' },
]

function Login({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await adminLogin(username, password)
      onSuccess()
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-root admin-login">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-logo gradient-text">DSK Printers</div>
        <h1>Admin Login</h1>
        {error && <div className="admin-error" role="alert">{error}</div>}
        <div className="field">
          <label htmlFor="admin-user">Username</label>
          <input
            id="admin-user"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="admin-pass">Password</label>
          <input
            id="admin-pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
        <a href="/" style={{ textAlign: 'center', fontSize: '0.85rem' }}>
          Back to website
        </a>
      </form>
    </div>
  )
}

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn())
  const [tab, setTab] = useState('dashboard')

  const handleLogout = () => {
    adminLogout()
    setLoggedIn(false)
  }

  const handleAuthError = (err) => {
    if (err && (err.status === 401 || err.status === 403)) {
      adminLogout()
      setLoggedIn(false)
    }
  }

  if (!loggedIn) {
    return <Login onSuccess={() => setLoggedIn(true)} />
  }

  return (
    <div className="admin-root admin-shell">
      <header className="admin-topbar">
        <div className="brand">
          <span>DSK</span> Admin
        </div>
        <nav className="admin-nav" aria-label="Admin sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? 'active' : ''}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? 'page' : undefined}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main className="admin-main">
        {tab === 'dashboard' && <StatsPanel onAuthError={handleAuthError} />}
        {tab === 'leads' && <LeadsPanel onAuthError={handleAuthError} />}
        {tab === 'products' && <ProductsPanel onAuthError={handleAuthError} />}
        {tab === 'categories' && <CategoriesPanel onAuthError={handleAuthError} />}
      </main>
    </div>
  )
}
