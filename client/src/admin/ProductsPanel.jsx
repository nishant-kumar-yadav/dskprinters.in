import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ChipInput, SpecsEditor } from './FormControls.jsx'
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from '../api.js'

const UNIVERSAL_SPECS = [
  { key: 'Material', value: '' },
  { key: 'Size / Dimensions', value: '' },
  { key: 'Min. Order Qty', value: '' },
  { key: 'Delivery Time', value: '' },
]

const EMPTY_FORM = {
  name: '',
  category: '',
  price: '',
  desc: '',
  image: '',
  inStock: true,
  featured: false,
  showInHero: false,
  order: 0,
  specs: UNIVERSAL_SPECS,
  tags: [],
  applications: [],
  alternateNames: [],
}



/* ---- Step Indicator ---- */
function StepIndicator({ step, total }) {
  return (
    <div className="step-indicator">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`step-dot ${i + 1 <= step ? 'active' : ''}`}>
          {i + 1}
        </div>
      ))}
    </div>
  )
}

/* ---- Full Product Editor ---- */
function ProductEditor({ product, categories, onClose, onSaved }) {
  const [step, setStep] = useState(1)
  const TOTAL_STEPS = 3

  // Parse existing product specs Map into array
  const parseSpecs = (specsObj) => {
    if (!specsObj) return []
    if (specsObj instanceof Map) return Array.from(specsObj.entries()).map(([key, value]) => ({ key, value }))
    if (typeof specsObj === 'object') return Object.entries(specsObj).map(([key, value]) => ({ key, value }))
    return []
  }

  // Get category defaults for auto-fill
  const getCategoryDefaults = (slug) => {
    const cat = categories.find((c) => c.slug === slug)
    if (!cat) return {}
    return {
      tags: cat.defaultTags || [],
      applications: cat.defaultApplications || [],
      alternateNames: cat.defaultAlternateNames || [],
      specs: parseSpecs(cat.defaultSpecs),
    }
  }

  const initCategory = categories[0]?.slug || ''
  const initDefaults = product ? {} : getCategoryDefaults(initCategory)

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
          showInHero: product.showInHero ?? false,
          order: product.order ?? 0,
          specs: parseSpecs(product.specs),
          tags: product.tags || [],
          applications: product.applications || [],
          alternateNames: product.alternateNames || [],
        }
      : {
          ...EMPTY_FORM,
          category: initCategory,
          tags: initDefaults.tags || [],
          applications: initDefaults.applications || [],
          alternateNames: initDefaults.alternateNames || [],
          specs: initDefaults.specs?.length ? initDefaults.specs : UNIVERSAL_SPECS,
        }
  )
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [autoFilled, setAutoFilled] = useState(!product) // track if defaults applied

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  // When category changes on NEW product, auto-fill from category defaults
  const handleCategoryChange = (newSlug) => {
    set('category', newSlug)
    if (!product) {
      const defaults = getCategoryDefaults(newSlug)
      setForm((f) => ({
        ...f,
        category: newSlug,
        tags: defaults.tags || [],
        applications: defaults.applications || [],
        alternateNames: defaults.alternateNames || [],
        specs: defaults.specs?.length ? defaults.specs : f.specs,
      }))
      setAutoFilled(true)
    }
  }

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

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer?.files?.[0]
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
      // Convert specs array back to object for API
      const specsObj = {}
      form.specs.forEach((s) => {
        if (s.key.trim()) specsObj[s.key.trim()] = s.value.trim()
      })

      const payload = {
        ...form,
        specs: specsObj,
        order: Number(form.order) || 0,
      }
      const saved = product
        ? await updateProduct(product._id, payload)
        : await createProduct(payload)
      onSaved(saved, !product)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  const canGoNext = () => {
    if (step === 1) return form.name.trim() && form.category && form.price.trim()
    return true
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <form
        className="admin-modal admin-modal-wide"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="modal-header-row">
          <h3>{product ? 'Edit Product' : 'Add Product'}</h3>
          <StepIndicator step={step} total={TOTAL_STEPS} />
        </div>
        {error && <div className="admin-error">{error}</div>}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="step-content">
            <p className="step-label">Step 1 — Basic Information</p>
            <div className="form-row two">
              <div className="field">
                <label htmlFor="p-name">Product Name *</label>
                <input
                  id="p-name"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Premium Visiting Cards"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="p-price">Price *</label>
                <input
                  id="p-price"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="e.g. ₹2 / Piece"
                  required
                />
              </div>
            </div>
            <div className="form-row two">
              <div className="field">
                <label htmlFor="p-category">Category *</label>
                <select
                  id="p-category"
                  value={form.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
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
                <label htmlFor="p-order">Display Order</label>
                <input
                  id="p-order"
                  type="number"
                  value={form.order}
                  onChange={(e) => set('order', e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="p-desc">Description</label>
              <textarea
                id="p-desc"
                rows={4}
                value={form.desc}
                onChange={(e) => set('desc', e.target.value)}
                placeholder="Detailed product description for customers..."
              />
            </div>
            <div className="field">
              <label>Product Image</label>
              <div
                className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {form.image ? (
                  <div className="drop-has-image">
                    <img src={form.image} alt="" className="drop-preview" />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => set('image', '')}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="drop-placeholder">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                    <span>Drag & drop image here</span>
                    <span className="drop-sub">or click to browse</span>
                  </div>
                )}
                <input
                  id="p-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleUpload}
                  className={form.image ? 'hidden-input' : ''}
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
                In Stock
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set('featured', e.target.checked)}
                />
                Featured
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.showInHero}
                  onChange={(e) => set('showInHero', e.target.checked)}
                />
                Show on Hero
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Specifications */}
        {step === 2 && (
          <div className="step-content">
            <p className="step-label">Step 2 — Specifications & Details</p>
            {autoFilled && (
              <div className="admin-success">Auto-filled from category defaults. Feel free to edit or add more.</div>
            )}
            <SpecsEditor specs={form.specs} onChange={(s) => set('specs', s)} />
            <ChipInput
              label="Tags"
              placeholder="Type tag + Enter (e.g. premium, glossy)"
              values={form.tags}
              onChange={(t) => set('tags', t)}
            />
          </div>
        )}

        {/* Step 3: SEO & Alternate Names */}
        {step === 3 && (
          <div className="step-content">
            <p className="step-label">Step 3 — SEO & Discoverability</p>
            {autoFilled && (
              <div className="admin-success">Auto-filled from category defaults. Feel free to edit or add more.</div>
            )}
            <ChipInput
              label="Applications"
              placeholder="e.g. Business, Marketing, Events"
              values={form.applications}
              onChange={(a) => set('applications', a)}
            />
            <ChipInput
              label="Alternate Names"
              placeholder="e.g. Business Card, Name Card"
              values={form.alternateNames}
              onChange={(a) => set('alternateNames', a)}
            />
          </div>
        )}

        {/* Navigation & Actions */}
        <div className="modal-actions">
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
            Cancel
          </button>
          <div className="spacer" />
          {step > 1 && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </button>
          )}
          {step < TOTAL_STEPS ? (
            <button
              key="next-btn"
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!canGoNext()}
              onClick={() => setStep((s) => s + 1)}
            >
              Next
            </button>
          ) : (
            <button
              key="submit-btn"
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={saving || uploading}
            >
              {saving ? 'Saving…' : product ? 'Update Product' : 'Create Product'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default function ProductsPanel({ onAuthError }) {
  const queryClient = useQueryClient()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | product
  const [searchQuery, setSearchQuery] = useState('')

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
      queryClient.invalidateQueries({ queryKey: ['products'] })
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
    queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  const categoryName = (slug) => categories.find((c) => c.slug === slug)?.name || slug

  return (
    <section aria-label="Products management">
      <h2>Products</h2>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-toolbar">
        <span className="cell-muted">{products.length} products</span>
        <div className="spacer" />
        <div className="search-wrap" style={{ width: '250px', maxWidth: '100%' }}>
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="notes-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setEditing('new')}>
          + Add Product
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
              {products
                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((p) => (
                <tr key={p._id}>
                  <td data-label="Product">
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
                        {p.tags?.length > 0 && (
                          <div className="cell-muted" style={{ marginTop: 2 }}>
                            {p.tags.slice(0, 3).join(', ')}
                            {p.tags.length > 3 && ` +${p.tags.length - 3}`}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td data-label="Category" className="cell-muted">{categoryName(p.category)}</td>
                  <td data-label="Price">{p.price}</td>
                  <td data-label="Status">
                    <span className={`pill ${p.inStock ? 'pill-converted' : 'pill-lost'}`}>
                      {p.inStock ? 'In stock' : 'Out of stock'}
                    </span>
                  </td>
                  <td data-label="Actions">
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
