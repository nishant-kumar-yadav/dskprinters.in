import { useCallback, useEffect, useState } from 'react'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
} from '../api.js'

function CategoryEditor({ category, onClose, onSaved }) {
  const [form, setForm] = useState(
    category
      ? { name: category.name, image: category.image || '', order: category.order ?? 0 }
      : { name: '', image: '', order: 0 }
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
      const payload = { ...form, order: Number(form.order) || 0 }
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
        className="admin-modal"
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
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | category

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
    if (!window.confirm('Delete this category? Products in it will remain but lose their category link.')) return
    try {
      await deleteCategory(id)
      setCategories((list) => list.filter((c) => c._id !== id))
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
  }

  return (
    <section aria-label="Categories management">
      <h2>Categories</h2>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-toolbar">
        <span className="cell-muted">{categories.length} categories</span>
        <div className="spacer" />
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
              {categories.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {c.image ? (
                        <img className="thumb" src={c.image} alt="" />
                      ) : (
                        <div className="thumb skeleton" style={{ width: 44, height: 44 }} />
                      )}
                      <strong>{c.name}</strong>
                    </div>
                  </td>
                  <td className="cell-muted">{c.slug}</td>
                  <td className="cell-muted">{c.order ?? 0}</td>
                  <td>
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
