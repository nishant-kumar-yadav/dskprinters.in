import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import './pages.css'

export default function NotFound() {
  return (
    <div className="page">
      <Helmet>
        <title>Page Not Found | DSK Printers</title>
      </Helmet>
      <div className="empty-state">
        <span className="gradient-text" style={{ fontSize: '4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
          404
        </span>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist or may have been moved.</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
