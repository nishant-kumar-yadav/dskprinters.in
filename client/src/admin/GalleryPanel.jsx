import { useState, useEffect } from 'react'
import {
  fetchAdminGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  uploadMedia,
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

const emptyItem = {
  title: '',
  caption: '',
  url: '',
  thumbnail: '',
  type: 'image',
  section: 'gallery',
  storyGroup: '',
  category: 'all',
  linkedProduct: '',
  order: 0,
  visible: true,
}

export default function GalleryPanel({ onAuthError }) {
  const [items, setItems] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null | 'new' | item object
  const [form, setForm] = useState({ ...emptyItem })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [filterSection, setFilterSection] = useState('all')

  const load = async () => {
    try {
      setLoading(true)
      const [galleryData, productsData] = await Promise.all([
        fetchAdminGallery(),
        fetchProducts(),
      ])
      setItems(galleryData)
      setProducts(productsData)
    } catch (err) {
      onAuthError?.(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const result = await uploadMedia(file)
      setForm((prev) => ({
        ...prev,
        url: result.url,
        type: result.type,
        thumbnail: result.thumbnail || '',
      }))
    } catch (err) {
      setError(err.message)
      onAuthError?.(err)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.url.trim()) {
      setError('Title and media file are required')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editing === 'new') {
        await createGalleryItem(form)
      } else {
        await updateGalleryItem(editing._id, form)
      }
      setEditing(null)
      await load()
    } catch (err) {
      setError(err.message)
      onAuthError?.(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery item?')) return
    try {
      await deleteGalleryItem(id)
      await load()
    } catch (err) {
      onAuthError?.(err)
    }
  }

  const openEditor = (item) => {
    if (item === 'new') {
      setForm({ ...emptyItem })
    } else {
      setForm({
        title: item.title || '',
        caption: item.caption || '',
        url: item.url || '',
        thumbnail: item.thumbnail || '',
        type: item.type || 'image',
        section: item.section || 'gallery',
        storyGroup: item.storyGroup || '',
        category: item.category || 'all',
        linkedProduct: item.linkedProduct || '',
        order: item.order || 0,
        visible: item.visible !== false,
      })
    }
    setEditing(item)
    setError('')
  }

  const filtered = filterSection === 'all'
    ? items
    : items.filter((i) => i.section === filterSection)

  const sectionLabel = (s) => SECTIONS.find((x) => x.value === s)?.label || s
  const categoryLabel = (c) => CATEGORIES.find((x) => x.value === c)?.label || c

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Gallery ({items.length})</h2>
        <button className="btn btn-primary" onClick={() => openEditor('new')}>
          + Add Media
        </button>
      </div>

      {/* Section Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${filterSection === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilterSection('all')}
        >
          All
        </button>
        {SECTIONS.map((s) => (
          <button
            key={s.value}
            className={`btn btn-sm ${filterSection === s.value ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterSection(s.value)}
          >
            {s.label} ({items.filter((i) => i.section === s.value).length})
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading gallery…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#64748b' }}>No gallery items yet. Click "+ Add Media" to upload your first photo or video.</p>
      ) : (
        <div className="gallery-admin-grid">
          {filtered.map((item) => (
            <div key={item._id} className="gallery-admin-card">
              <div className="gallery-admin-thumb">
                {item.type === 'video' ? (
                  <video src={item.url} muted preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <img src={item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                {item.type === 'video' && (
                  <span className="gallery-admin-video-badge">▶ Video</span>
                )}
                {!item.visible && (
                  <span className="gallery-admin-hidden-badge">Hidden</span>
                )}
                {item.source === 'instagram' && (
                  <span className="gallery-admin-ig-badge">📸 IG</span>
                )}
              </div>
              <div className="gallery-admin-info">
                <strong>{item.title}</strong>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {sectionLabel(item.section)} · {categoryLabel(item.category)}
                </div>
              </div>
              <div className="gallery-admin-actions">
                <button className="btn btn-sm btn-outline" onClick={() => openEditor(item)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <h3>{editing === 'new' ? 'Add Gallery Item' : 'Edit Gallery Item'}</h3>
            {error && <div className="admin-error">{error}</div>}

            <div className="field">
              <label>Media File *</label>
              <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
              {uploading && <small style={{ color: '#1d4ed8' }}>Uploading to Cloudinary…</small>}
              {form.url && (
                <div style={{ marginTop: 8 }}>
                  {form.type === 'video' ? (
                    <video src={form.url} controls muted style={{ width: '100%', maxHeight: 200, borderRadius: 8 }} />
                  ) : (
                    <img src={form.url} alt="Preview" style={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 8 }} />
                  )}
                </div>
              )}
            </div>

            <div className="field">
              <label>Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. DTF Printer Running at Full Speed"
              />
            </div>

            <div className="field">
              <label>Caption</label>
              <input
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="Optional description"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field">
                <label>Section *</label>
                <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>
                  {SECTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {form.section === 'story' && (
              <div className="field">
                <label>Story Group</label>
                <select value={form.storyGroup} onChange={(e) => setForm({ ...form, storyGroup: e.target.value })}>
                  {STORY_GROUPS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
            )}

            {form.section === 'reel' && (
              <div className="field">
                <label>Linked Product (for "Get Quote")</label>
                <select value={form.linkedProduct} onChange={(e) => setForm({ ...form, linkedProduct: e.target.value })}>
                  <option value="">— None —</option>
                  {products.map((p) => (
                    <option key={p.slug} value={p.slug}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field">
                <label>Display Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 24 }}>
                <input
                  type="checkbox"
                  id="gallery-visible"
                  checked={form.visible}
                  onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                />
                <label htmlFor="gallery-visible" style={{ margin: 0 }}>Visible on website</label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving || uploading}
              >
                {saving ? 'Saving…' : editing === 'new' ? 'Add Item' : 'Save Changes'}
              </button>
              <button className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
