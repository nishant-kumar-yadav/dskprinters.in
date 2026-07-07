import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import './widgets.css'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

// Shows a banner if the API server is slow to respond (e.g. free-tier cold start)
export default function ColdStartBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      if (!cancelled) setShow(true)
    }, 4000)

    fetch(`${API_BASE}/products/meta/categories`)
      .then(() => {
        cancelled = true
        clearTimeout(timer)
        setShow(false)
      })
      .catch(() => {})

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  if (!show) return null

  return (
    <div className="coldstart-banner" role="status">
      <Loader2 size={15} className="spin" aria-hidden="true" />
      <span>Our server is waking up — products will load in a few seconds. Thanks for your patience!</span>
    </div>
  )
}
