import { useState, useEffect } from 'react'
import {
  fetchInstagramStatus,
  fetchInstagramMedia,
  importInstagramPost,
  refreshInstagramToken,
  fetchProducts,
} from '../api.js'

const SECTIONS = [
  { value: 'story', label: '📖 Story Highlight' },
  { value: 'reel', label: '🎬 Watch & Buy Reel' },
  { value: 'gallery', label: '🖼️ Gallery Grid' },
]

const CATEGORIES = [
  { value: 'all', label: 'All / General' },
  { value: 'uv-dtf', label: 'UV DTF Stickers' },
  { value: 'dtf', label: 'DTF Transfers' },
  { value: 'apparel', label: 'Custom Apparel' },
  { value: 'labels', label: 'Labels & Tags' },
  { value: 'factory', label: 'Factory / Process' },
]

const STORY_GROUPS = [
  { value: '', label: '— None —' },
  { value: 'design', label: '🖥️ Design & Pre-Press' },
  { value: 'printing', label: '🖨️ Printing in Action' },
  { value: 'cutting', label: '✂️ Cutting & Finishing' },
  { value: 'qc', label: '🔍 Quality Check' },
  { value: 'packing', label: '📦 Packing & Dispatch' },
  { value: 'factory', label: '🏢 Our Factory' },
  { value: 'products', label: '🎨 Finished Products' },
]

export default function InstagramPanel({ onAuthError }) {
  const [status, setStatus] = useState(null) // null = loading, object = loaded
  const [media, setMedia] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [nextCursor, setNextCursor] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Import modal state
  const [importing, setImporting] = useState(null) // The IG post being imported
  const [importForm, setImportForm] = useState({})
  const [saving, setSaving] = useState(false)

  // Filter: show all or only unimported
  const [showImported, setShowImported] = useState(true)

  // Selected carousel child for carousel posts
  const [selectedChild, setSelectedChild] = useState(0)

  const checkStatus = async () => {
    try {
      const data = await fetchInstagramStatus()
      setStatus(data)
      return data.configured && data.status === 'connected'
    } catch (err) {
      setStatus({ configured: false })
      onAuthError?.(err)
      return false
    }
  }

  const loadMedia = async (cursor = null) => {
    try {
      if (cursor) setLoadingMore(true)
      else setLoading(true)

      const data = await fetchInstagramMedia(cursor, 25)
      if (cursor) {
        setMedia((prev) => [...prev, ...data.items])
      } else {
        setMedia(data.items)
      }
      setNextCursor(data.paging?.hasNext ? data.paging.nextCursor : null)
    } catch (err) {
      setError(err.message)
      onAuthError?.(err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      const connected = await checkStatus()
      if (connected) {
        await Promise.all([loadMedia(), fetchProducts().then(setProducts).catch(() => {})])
      } else {
        setLoading(false)
      }
    }
    init()
  }, [])

  const openImportModal = (item) => {
    setSelectedChild(0)
    setImportForm({
      title: item.title || 'Instagram Post',
      caption: item.caption || '',
      section: item.mediaType === 'video' ? 'reel' : 'gallery',
      category: 'all',
      storyGroup: '',
      linkedProduct: '',
      order: 0,
      visible: true,
    })
    setImporting(item)
    setError('')
  }

  const handleImport = async () => {
    if (!importing) return
    setSaving(true)
    setError('')

    try {
      // Determine which URL to upload based on carousel selection
      let mediaUrl = importing.url
      let mediaType = importing.mediaType
      let thumbnailUrl = importing.thumbnailUrl
      let childIndex

      if (importing.isCarousel && importing.children.length > 0) {
        const child = importing.children[selectedChild]
        mediaUrl = child.url
        mediaType = child.mediaType
        thumbnailUrl = child.thumbnail
        childIndex = selectedChild
      }

      await importInstagramPost({
        instagramId: importing.instagramId,
        title: importForm.title,
        caption: importForm.caption,
        section: importForm.section,
        category: importForm.category,
        storyGroup: importForm.storyGroup,
        linkedProduct: importForm.linkedProduct,
        order: importForm.order,
        visible: importForm.visible,
        mediaUrl,
        mediaType,
        thumbnailUrl,
        permalink: importing.permalink,
        childIndex,
      })

      // Mark as imported in local state
      setMedia((prev) =>
        prev.map((m) =>
          m.instagramId === importing.instagramId ? { ...m, alreadyImported: true } : m
        )
      )

      setImporting(null)
      setSuccess('Post imported successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleRefreshToken = async () => {
    try {
      const result = await refreshInstagramToken()
      setSuccess(result.message)
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      setError(err.message)
    }
  }

  // Filtered media
  const displayMedia = showImported ? media : media.filter((m) => !m.alreadyImported)

  // ─── Not configured state ───
  if (status && !status.configured) {
    return (
      <section>
        <h2>📸 Import from Instagram</h2>
        <div className="ig-not-configured">
          <div className="ig-setup-icon">📱</div>
          <h3>Connect Your Instagram Account</h3>
          <p>
            To import photos and videos from your Instagram page, add the following to your
            server's <code>.env</code> file:
          </p>
          <div className="ig-env-block">
            <code>
              IG_ACCESS_TOKEN=your_long_lived_token_here
              <br />
              IG_USER_ID=your_instagram_user_id
            </code>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Get these from the{' '}
            <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer">
              Meta Developer Portal
            </a>
            . Your Instagram account must be a Business or Creator account.
          </p>
        </div>
      </section>
    )
  }

  // ─── Error / token expired state ───
  if (status && status.status === 'error') {
    return (
      <section>
        <h2>📸 Import from Instagram</h2>
        <div className="ig-not-configured">
          <div className="ig-setup-icon">⚠️</div>
          <h3>Connection Issue</h3>
          <p>{status.message}</p>
          {status.tokenExpired && (
            <button className="btn btn-primary" onClick={handleRefreshToken}>
              🔄 Refresh Token
            </button>
          )}
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="ig-header">
        <h2>📸 Import from Instagram</h2>
        <div className="ig-header-actions">
          <label className="ig-toggle-label">
            <input
              type="checkbox"
              checked={showImported}
              onChange={(e) => setShowImported(e.target.checked)}
            />
            Show imported
          </label>
          <button
            className="btn btn-sm btn-outline"
            onClick={handleRefreshToken}
            title="Refresh your IG access token"
          >
            🔄 Refresh Token
          </button>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">{success}</div>}

      {loading ? (
        <div className="ig-loading">
          <div className="ig-spinner" />
          <p>Loading your Instagram posts…</p>
        </div>
      ) : displayMedia.length === 0 ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '40px 0' }}>
          {media.length === 0
            ? 'No posts found on your Instagram account.'
            : 'All posts have been imported! Toggle "Show imported" to see them.'}
        </p>
      ) : (
        <>
          <div className="ig-grid">
            {displayMedia.map((item) => (
              <div
                key={item.instagramId}
                className={`ig-card ${item.alreadyImported ? 'ig-card-imported' : ''}`}
                onClick={() => !item.alreadyImported && openImportModal(item)}
              >
                <div className="ig-card-thumb">
                  {item.mediaType === 'video' ? (
                    <video
                      src={item.url}
                      muted
                      preload="metadata"
                      poster={item.thumbnailUrl || undefined}
                    />
                  ) : item.isCarousel ? (
                    <img
                      src={item.children?.[0]?.url || item.url}
                      alt={item.title}
                      loading="lazy"
                    />
                  ) : (
                    <img src={item.url} alt={item.title} loading="lazy" />
                  )}

                  {/* Type badges */}
                  {item.mediaType === 'video' && <span className="ig-badge ig-badge-video">▶ Reel</span>}
                  {item.isCarousel && <span className="ig-badge ig-badge-carousel">⊞ {item.children.length}</span>}
                  {item.alreadyImported && (
                    <div className="ig-imported-overlay">
                      <span>✅ Imported</span>
                    </div>
                  )}
                </div>
                <div className="ig-card-info">
                  <p className="ig-card-title">{item.title}</p>
                  <span className="ig-card-date">
                    {new Date(item.timestamp).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {nextCursor && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <button
                className="btn btn-outline"
                onClick={() => loadMedia(nextCursor)}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading…' : 'Load More Posts'}
              </button>
            </div>
          )}
        </>
      )}

      {/* ─── Import Modal ─── */}
      {importing && (
        <div className="modal-overlay" onClick={() => setImporting(null)}>
          <div className="modal-card ig-import-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Import to Gallery</h3>
            {error && <div className="admin-error">{error}</div>}

            {/* Media Preview */}
            <div className="ig-import-preview">
              {importing.isCarousel && importing.children.length > 0 ? (
                <>
                  <div className="ig-carousel-nav">
                    {importing.children.map((child, idx) => (
                      <button
                        key={child.id}
                        className={`ig-carousel-dot ${idx === selectedChild ? 'active' : ''}`}
                        onClick={() => setSelectedChild(idx)}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                  {importing.children[selectedChild]?.mediaType === 'video' ? (
                    <video
                      src={importing.children[selectedChild].url}
                      controls
                      muted
                      style={{ width: '100%', maxHeight: 220, borderRadius: 8 }}
                    />
                  ) : (
                    <img
                      src={importing.children[selectedChild]?.url}
                      alt="Preview"
                      style={{
                        width: '100%',
                        maxHeight: 220,
                        objectFit: 'contain',
                        borderRadius: 8,
                      }}
                    />
                  )}
                </>
              ) : importing.mediaType === 'video' ? (
                <video
                  src={importing.url}
                  controls
                  muted
                  poster={importing.thumbnailUrl || undefined}
                  style={{ width: '100%', maxHeight: 220, borderRadius: 8 }}
                />
              ) : (
                <img
                  src={importing.url}
                  alt="Preview"
                  style={{ width: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 8 }}
                />
              )}
              <a
                href={importing.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="ig-permalink"
              >
                View on Instagram ↗
              </a>
            </div>

            {/* Form Fields */}
            <div className="field">
              <label>Title *</label>
              <input
                value={importForm.title}
                onChange={(e) => setImportForm({ ...importForm, title: e.target.value })}
                placeholder="e.g. DTF Printer Running at Full Speed"
              />
            </div>

            <div className="field">
              <label>Caption</label>
              <input
                value={importForm.caption}
                onChange={(e) => setImportForm({ ...importForm, caption: e.target.value })}
                placeholder="Optional description"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field">
                <label>Section *</label>
                <select
                  value={importForm.section}
                  onChange={(e) => setImportForm({ ...importForm, section: e.target.value })}
                >
                  {SECTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Category</label>
                <select
                  value={importForm.category}
                  onChange={(e) => setImportForm({ ...importForm, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {importForm.section === 'story' && (
              <div className="field">
                <label>Story Group</label>
                <select
                  value={importForm.storyGroup}
                  onChange={(e) => setImportForm({ ...importForm, storyGroup: e.target.value })}
                >
                  {STORY_GROUPS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {importForm.section === 'reel' && (
              <div className="field">
                <label>Linked Product (for "Get Quote")</label>
                <select
                  value={importForm.linkedProduct}
                  onChange={(e) => setImportForm({ ...importForm, linkedProduct: e.target.value })}
                >
                  <option value="">— None —</option>
                  {products.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field">
                <label>Display Order</label>
                <input
                  type="number"
                  value={importForm.order}
                  onChange={(e) =>
                    setImportForm({ ...importForm, order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div
                className="field"
                style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 24 }}
              >
                <input
                  type="checkbox"
                  id="ig-visible"
                  checked={importForm.visible}
                  onChange={(e) => setImportForm({ ...importForm, visible: e.target.checked })}
                />
                <label htmlFor="ig-visible" style={{ margin: 0 }}>
                  Visible on website
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn btn-primary" onClick={handleImport} disabled={saving}>
                {saving ? 'Importing…' : '📥 Import to Gallery'}
              </button>
              <button className="btn btn-outline" onClick={() => setImporting(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
