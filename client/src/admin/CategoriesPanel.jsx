import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ChipInput, SpecsEditor } from './FormControls.jsx'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
} from '../api.js'

function CategoryEditor({ category, onClose, onSaved }) {
  const parseSpecs = (specsObj) => {
    if (!specsObj) return []
    if (specsObj instanceof Map) return Array.from(specsObj.entries()).map(([key, value]) => ({ key, value }))
    if (typeof specsObj === 'object') return Object.entries(specsObj).map(([key, value]) => ({ key, value }))
    return []
  }

  const [form, setForm] = useState(
    category
      ? {
          name: category.name,
          image: category.image || '',
          order: category.order ?? 0,
          description: category.description || '',
          startingPrice: category.startingPrice || '',
          showInHero: category.showInHero ?? false,
          defaultTags: category.defaultTags || [],
          defaultApplications: category.defaultApplications || [],
          defaultAlternateNames: category.defaultAlternateNames || [],
          defaultSpecs: parseSpecs(category.defaultSpecs),
        }
      : {
          name: '',
          image: '',
          order: 0,
          description: '',
          startingPrice: '',
          showInHero: false,
          defaultTags: [],
          defaultApplications: [],
          defaultAlternateNames: [],
          defaultSpecs: [],
        }
  )
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const { url } = await uploadImage(file)
      set('image', url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const specsObj = {}
      form.defaultSpecs.forEach((s) => {
        if (s.key.trim()) specsObj[s.key.trim()] = s.value.trim()
      })

      const payload = { 
        ...form, 
        order: Number(form.order) || 0,
        defaultSpecs: specsObj
      }
      const saved = category
        ? await updateCategory(category._id, payload)
        : await createCategory(payload)
      onSaved(saved, !category)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <form
        className="admin-modal admin-modal-wide"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h3>{category ? 'Edit Category' : 'Add Category'}</h3>
        {error && <div className="admin-error">{error}</div>}
        <div className="form-row two">
          <div className="field">
            <label htmlFor="c-name">Name</label>
            <input
              id="c-name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="c-order">Display order</label>
            <input
              id="c-order"
              type="number"
              value={form.order}
              onChange={(e) => set('order', e.target.value)}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="c-desc">Description</label>
            <textarea
              id="c-desc"
              className="notes-input"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
            />
          </div>
          <div className="field">
            <label htmlFor="c-price">Starting Price</label>
            <input
              id="c-price"
              value={form.startingPrice}
              placeholder="e.g. ₹2.50 / sq. inch"
              onChange={(e) => set('startingPrice', e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label>
            <input
              type="checkbox"
              checked={form.showInHero}
              onChange={(e) => set('showInHero', e.target.checked)}
            />
            Show on Hero Carousel
          </label>
        </div>
        <div className="field">
          <label htmlFor="c-image">Image</label>
          <div className="upload-preview">
            {form.image && <img src={form.image} alt="" />}
            <input
              id="c-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleUpload}
            />
          </div>
          {uploading && <span className="cell-muted">Uploading…</span>}
        </div>
        
        <div style={{ padding: '16px 0', borderTop: '1px solid var(--border)', marginTop: '8px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>Category Product Templates</h4>
          <p className="cell-muted" style={{ marginBottom: '16px', fontSize: '0.9rem' }}>
            When a product is assigned this category, these fields will be auto-filled by default.
          </p>
          
          <SpecsEditor specs={form.defaultSpecs} onChange={(s) => set('defaultSpecs', s)} />
          
          <ChipInput
            label="Default Tags"
            placeholder="e.g. uv dtf, waterproof"
            values={form.defaultTags}
            onChange={(t) => set('defaultTags', t)}
          />
          <ChipInput
            label="Default Applications"
            placeholder="e.g. glass, plastic"
            values={form.defaultApplications}
            onChange={(a) => set('defaultApplications', a)}
          />
          <ChipInput
            label="Default Alternate Names"
            placeholder="e.g. Dome Sticker"
            values={form.defaultAlternateNames}
            onChange={(a) => set('defaultAlternateNames', a)}
          />
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving || uploading}>
            {saving ? 'Saving…' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function CategoriesPanel({ onAuthError }) {
  const queryClient = useQueryClient()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | category
  const [searchQuery, setSearchQuery] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    fetchCategories()
      .then((c) => setCategories(Array.isArray(c) ? c : c.categories || []))
      .catch((err) => {
        setError(err.message)
        onAuthError?.(err)
      })
      .finally(() => setLoading(false))
  }, [onAuthError])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      await deleteCategory(id)
      setCategories((list) => list.filter((c) => c._id !== id))
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    } catch (err) {
      setError(err.message)
      onAuthError?.(err)
    }
  }

  const handleSaved = (saved, isNew) => {
    setCategories((list) =>
      isNew ? [...list, saved] : list.map((c) => (c._id === saved._id ? saved : c))
    )
    setEditing(null)
    queryClient.invalidateQueries({ queryKey: ['categories'] })
  }

  return (
    <section aria-label="Categories management">
      <h2>Categories</h2>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-toolbar">
        <span className="cell-muted">{categories.length} categories</span>
        <div className="spacer" />
        <div className="search-wrap" style={{ width: '250px', maxWidth: '100%' }}>
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            className="notes-input" 
            placeholder="Search categories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setEditing('new')}>
          Add Category
        </button>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-empty">Loading categories…</div>
        ) : categories.length === 0 ? (
          <div className="admin-empty">No categories yet. Add your first one.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Order</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {categories
                .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((c) => (
                <tr key={c._id}>
                  <td data-label="Category">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {c.image ? (
                        <img className="thumb" src={c.image} alt="" />
                      ) : (
                        <div className="thumb skeleton" style={{ width: 44, height: 44 }} />
                      )}
                      <strong>{c.name}</strong>
                    </div>
                  </td>
                  <td data-label="Slug" className="cell-muted">{c.slug}</td>
                  <td data-label="Order" className="cell-muted">{c.order ?? 0}</td>
                  <td data-label="Actions">
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setEditing(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <CategoryEditor
          category={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
    </section>
  )
}
