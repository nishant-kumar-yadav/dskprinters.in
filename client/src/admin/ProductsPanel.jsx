import { useCallback, useEffect, useState } from 'react'
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from '../api.js'

const EMPTY_FORM = {
  name: '',
  category: '',
  price: '',
  desc: '',
  image: '',
  inStock: true,
  featured: false,
}

function ProductEditor({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState(
    product
      ? {
          name: product.name,
          category: product.category,
          price: product.price,
          desc: product.desc || '',
          image: product.image || '',
          inStock: product.inStock ?? true,
          featured: product.featured ?? false,
        }
      : { ...EMPTY_FORM, category: categories[0]?.slug || '' }
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
      const saved = product
        ? await updateProduct(product._id, form)
        : await createProduct(form)
      onSaved(saved, !product)
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
        <h3>{product ? 'Edit Product' : 'Add Product'}</h3>
        {error && <div className="admin-error">{error}</div>}
        <div className="form-row two">
          <div className="field">
            <label htmlFor="p-name">Name</label>
            <input
              id="p-name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="p-price">Price</label>
            <input
              id="p-price"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder="e.g. ₹2 / Piece"
              required
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="p-category">Category</label>
          <select
            id="p-category"
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            required
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="p-desc">Description</label>
          <textarea
            id="p-desc"
            rows={3}
            value={form.desc}
            onChange={(e) => set('desc', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="p-image">Image</label>
          <div className="upload-preview">
            {form.image && <img src={form.image} alt="" />}
            <input
              id="p-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleUpload}
            />
          </div>
          {uploading && <span className="cell-muted">Uploading…</span>}
        </div>
        <div className="check-row">
          <label>
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => set('inStock', e.target.checked)}
            />
            In stock
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
            />
            Featured
          </label>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving || uploading}>
            {saving ? 'Saving…' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function ProductsPanel({ onAuthError }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | product

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([fetchProducts(), fetchCategories()])
      .then(([p, c]) => {
        setProducts(Array.isArray(p) ? p : p.products || [])
        setCategories(Array.isArray(c) ? c : c.categories || [])
      })
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
    if (!window.confirm('Delete this product permanently?')) return
    try {
      await deleteProduct(id)
      setProducts((list) => list.filter((p) => p._id !== id))
    } catch (err) {
      setError(err.message)
      onAuthError?.(err)
    }
  }

  const handleSaved = (saved, isNew) => {
    setProducts((list) =>
      isNew ? [saved, ...list] : list.map((p) => (p._id === saved._id ? saved : p))
    )
    setEditing(null)
  }

  const categoryName = (slug) => categories.find((c) => c.slug === slug)?.name || slug

  return (
    <section aria-label="Products management">
      <h2>Products</h2>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-toolbar">
        <span className="cell-muted">{products.length} products</span>
        <div className="spacer" />
        <button className="btn btn-primary btn-sm" onClick={() => setEditing('new')}>
          Add Product
        </button>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-empty">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="admin-empty">No products yet. Add your first one.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {p.image ? (
                        <img className="thumb" src={p.image} alt="" />
                      ) : (
                        <div className="thumb skeleton" style={{ width: 44, height: 44 }} />
                      )}
                      <div>
                        <strong>{p.name}</strong>
                        {p.featured && (
                          <span className="badge badge-red" style={{ marginLeft: 8 }}>
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="cell-muted">{categoryName(p.category)}</td>
                  <td>{p.price}</td>
                  <td>
                    <span className={`pill ${p.inStock ? 'pill-converted' : 'pill-lost'}`}>
                      {p.inStock ? 'In stock' : 'Out of stock'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setEditing(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(p._id)}
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
        <ProductEditor
          product={editing === 'new' ? null : editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
    </section>
  )
}
