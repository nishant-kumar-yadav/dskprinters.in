import { useEffect, useState } from 'react'
import { fetchStats } from '../api.js'

const STAT_LABELS = [
  { key: 'totalLeads', label: 'Total Leads' },
  { key: 'todayLeads', label: 'Leads Today' },
  { key: 'newLeads', label: 'New (Uncontacted)' },
  { key: 'products', label: 'Products' },
  { key: 'categories', label: 'Categories' },
]

export default function StatsPanel({ onAuthError }) {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetchStats()
      .then((data) => active && setStats(data))
      .catch((err) => {
        if (!active) return
        setError(err.message)
        onAuthError?.(err)
      })
    return () => {
      active = false
    }
  }, [onAuthError])

  return (
    <section aria-label="Dashboard overview">
      <h2>Dashboard</h2>
      {error && <div className="admin-error">{error}</div>}
      <div className="stats-grid">
        {STAT_LABELS.map(({ key, label }) => (
          <div className="stat-card" key={key}>
            <div className="stat-value">
              {stats ? stats[key] : '—'}
            </div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
