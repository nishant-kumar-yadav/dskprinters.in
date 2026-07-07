import { useCallback, useEffect, useState } from 'react'
import { fetchLeads, updateLead, deleteLead, exportLeadsCSV } from '../api.js'

const STATUSES = ['new', 'contacted', 'quoted', 'converted', 'lost']

const SOURCE_LABELS = {
  quote_modal: 'Quote Modal',
  contact_form: 'Contact Form',
  navbar_cta: 'Navbar CTA',
}

export default function LeadsPanel({ onAuthError }) {
  const [data, setData] = useState({ leads: [], total: 0, page: 1, pages: 1 })
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notesDraft, setNotesDraft] = useState({})

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    fetchLeads(status, page)
      .then(setData)
      .catch((err) => {
        setError(err.message)
        onAuthError?.(err)
      })
      .finally(() => setLoading(false))
  }, [status, page, onAuthError])

  useEffect(() => {
    load()
  }, [load])

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updateLead(id, { status: newStatus })
      setData((d) => ({
        ...d,
        leads: d.leads.map((l) => (l._id === id ? updated : l)),
      }))
    } catch (err) {
      setError(err.message)
      onAuthError?.(err)
    }
  }

  const handleNotesBlur = async (id) => {
    if (notesDraft[id] === undefined) return
    try {
      const updated = await updateLead(id, { notes: notesDraft[id] })
      setData((d) => ({
        ...d,
        leads: d.leads.map((l) => (l._id === id ? updated : l)),
      }))
    } catch (err) {
      setError(err.message)
      onAuthError?.(err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead permanently?')) return
    try {
      await deleteLead(id)
      setData((d) => ({
        ...d,
        leads: d.leads.filter((l) => l._id !== id),
        total: d.total - 1,
      }))
    } catch (err) {
      setError(err.message)
      onAuthError?.(err)
    }
  }

  const handleExport = async () => {
    try {
      await exportLeadsCSV(status)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section aria-label="Leads management">
      <h2>Leads</h2>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-toolbar">
        <label htmlFor="lead-status-filter" className="sr-only">
          Filter by status
        </label>
        <select
          id="lead-status-filter"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <span className="cell-muted">{data.total} total</span>
        <div className="spacer" />
        <button className="btn btn-outline btn-sm" onClick={handleExport}>
          Export CSV
        </button>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-empty">Loading leads…</div>
        ) : data.leads.length === 0 ? (
          <div className="admin-empty">No leads found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Enquiry</th>
                <th>Source</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Date</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.leads.map((lead) => (
                <tr key={lead._id}>
                  <td>
                    <strong>{lead.name}</strong>
                    <div className="cell-muted">{lead.phone}</div>
                    {lead.email && <div className="cell-muted">{lead.email}</div>}
                  </td>
                  <td>
                    {lead.product && <div>{lead.product}</div>}
                    {lead.quantity && (
                      <div className="cell-muted">Qty: {lead.quantity}</div>
                    )}
                    {lead.message && (
                      <div className="cell-muted" title={lead.message}>
                        {lead.message.length > 60
                          ? lead.message.slice(0, 60) + '…'
                          : lead.message}
                      </div>
                    )}
                  </td>
                  <td className="cell-muted">
                    {SOURCE_LABELS[lead.source] || lead.source}
                  </td>
                  <td>
                    <span className={`pill pill-${lead.status}`}>{lead.status}</span>
                    <div style={{ marginTop: 6 }}>
                      <label className="sr-only" htmlFor={`status-${lead._id}`}>
                        Change status
                      </label>
                      <select
                        id={`status-${lead._id}`}
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td>
                    <label className="sr-only" htmlFor={`notes-${lead._id}`}>
                      Notes
                    </label>
                    <input
                      id={`notes-${lead._id}`}
                      className="notes-input"
                      placeholder="Add notes…"
                      value={notesDraft[lead._id] ?? lead.notes ?? ''}
                      onChange={(e) =>
                        setNotesDraft((d) => ({ ...d, [lead._id]: e.target.value }))
                      }
                      onBlur={() => handleNotesBlur(lead._id)}
                    />
                  </td>
                  <td className="cell-muted">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(lead._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data.pages > 1 && (
        <div className="admin-pagination">
          <button
            className="btn btn-outline btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span>
            Page {data.page} of {data.pages}
          </span>
          <button
            className="btn btn-outline btn-sm"
            disabled={page >= data.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  )
}
