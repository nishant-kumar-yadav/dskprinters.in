import { useState, useEffect } from 'react'
import {
  fetchAdminBlogPosts,
  fetchAdminBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  uploadImage,
} from '../api.js'

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'dtf', label: 'DTF' },
  { value: 'uv-dtf', label: 'UV DTF' },
  { value: 'heat-transfer', label: 'Heat Transfer' },
  { value: 'industry', label: 'Industry' },
  { value: 'tutorials', label: 'Tutorials / How-To' },
]

const emptyPost = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  category: 'general',
  tags: '',
  author: 'DSK Printers',
  published: false,
  metaTitle: '',
  metaDesc: '',
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function BlogPanel({ onAuthError }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null | 'new' | post object
  const [form, setForm] = useState({ ...emptyPost })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const load = async () => {
    try {
      setLoading(true)
      const data = await fetchAdminBlogPosts()
      setPosts(data)
    } catch (err) {
      onAuthError?.(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      setError('')
      const result = await uploadImage(file)
      setForm((f) => ({ ...f, coverImage: result.url }))
    } catch (err) {
      setError(err.message)
      onAuthError?.(err)
    } finally {
      setUploading(false)
    }
  }

  const startNew = () => {
    setEditing('new')
    setForm({ ...emptyPost })
    setError('')
  }

  const startEdit = async (post) => {
    try {
      const fullPost = await fetchAdminBlogPost(post._id)
      setEditing(post)
      setForm({
        title: fullPost.title || '',
        slug: fullPost.slug || '',
        excerpt: fullPost.excerpt || '',
        content: fullPost.content || '',
        coverImage: fullPost.coverImage || '',
        category: fullPost.category || 'general',
        tags: (fullPost.tags || []).join(', '),
        author: fullPost.author || 'DSK Printers',
        published: fullPost.published || false,
        metaTitle: fullPost.metaTitle || '',
        metaDesc: fullPost.metaDesc || '',
      })
      setError('')
    } catch (err) {
      onAuthError?.(err)
    }
  }

  const cancel = () => {
    setEditing(null)
    setForm({ ...emptyPost })
    setError('')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      }

      // Auto-generate slug if empty
      if (!payload.slug && payload.title) {
        payload.slug = slugify(payload.title)
      }

      if (editing === 'new') {
        await createBlogPost(payload)
      } else {
        await updateBlogPost(editing._id, payload)
      }
      cancel()
      await load()
    } catch (err) {
      setError(err.message)
      onAuthError?.(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post? This cannot be undone.')) return
    try {
      await deleteBlogPost(id)
      await load()
    } catch (err) {
      onAuthError?.(err)
    }
  }

  const handleTogglePublish = async (post) => {
    try {
      await updateBlogPost(post._id, { published: !post.published })
      await load()
    } catch (err) {
      onAuthError?.(err)
    }
  }

  // Auto-generate slug when title changes (only for new posts)
  const handleTitleChange = (value) => {
    setForm((f) => ({
      ...f,
      title: value,
      ...(editing === 'new' && !f.slug ? { slug: slugify(value) } : {}),
    }))
  }

  // Filter posts
  const filtered =
    filterStatus === 'all'
      ? posts
      : filterStatus === 'published'
        ? posts.filter((p) => p.published)
        : posts.filter((p) => !p.published)

  if (loading) return <p>Loading blog posts…</p>

  // FORM VIEW
  if (editing) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2>{editing === 'new' ? '✍️ New Blog Post' : '✏️ Edit Post'}</h2>
          <button className="btn btn-outline btn-sm" onClick={cancel}>
            ← Back
          </button>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSave} className="admin-form">
          {/* Title */}
          <div className="field">
            <label>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. How to Apply DTF Stickers on T-Shirts"
              required
            />
          </div>

          {/* Slug */}
          <div className="field">
            <label>
              Slug{' '}
              <small style={{ color: 'var(--muted)', fontWeight: 400 }}>
                (auto-generated, editable)
              </small>
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="how-to-apply-dtf-stickers"
            />
          </div>

          {/* Category + Author row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Author</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="field">
            <label>Cover Image</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input type="file" accept="image/*" onChange={handleCoverUpload} />
              {uploading && <span>Uploading…</span>}
            </div>
            {form.coverImage && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={form.coverImage}
                  alt="Cover preview"
                  style={{
                    maxWidth: 300,
                    maxHeight: 180,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ marginLeft: 10 }}
                  onClick={() => setForm((f) => ({ ...f, coverImage: '' }))}
                >
                  Remove
                </button>
              </div>
            )}
            {!form.coverImage && (
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                placeholder="Or paste image URL"
                style={{ marginTop: 8 }}
              />
            )}
          </div>

          {/* Excerpt */}
          <div className="field">
            <label>
              Excerpt{' '}
              <small style={{ color: 'var(--muted)', fontWeight: 400 }}>
                (auto-generated from content if left empty)
              </small>
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="Brief summary shown on blog cards (max 300 chars)"
              rows={2}
              maxLength={300}
            />
          </div>

          {/* Content */}
          <div className="field">
            <label>Content * (HTML)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Write your blog post content in HTML format..."
              rows={16}
              required
              style={{ fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.6 }}
            />
          </div>

          {/* Tags */}
          <div className="field">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="dtf, stickers, t-shirt, printing"
            />
          </div>

          {/* SEO Overrides */}
          <details style={{ marginTop: 8, marginBottom: 16 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--muted)' }}>
              🔍 SEO Overrides (optional)
            </summary>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="field">
                <label>Meta Title</label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
                  placeholder="Custom page title for SEO"
                />
              </div>
              <div className="field">
                <label>Meta Description</label>
                <textarea
                  value={form.metaDesc}
                  onChange={(e) => setForm((f) => ({ ...f, metaDesc: e.target.value }))}
                  placeholder="Custom meta description for search engines"
                  rows={2}
                />
              </div>
            </div>
          </details>

          {/* Publish toggle + Save */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              marginTop: 8,
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                style={{ width: 18, height: 18 }}
              />
              <span style={{ fontWeight: 600 }}>
                {form.published ? '✅ Published' : '📝 Draft'}
              </span>
            </label>

            <button className="btn btn-primary" type="submit" disabled={saving || uploading}>
              {saving ? 'Saving…' : editing === 'new' ? 'Create Post' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  // LIST VIEW
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <h2>📝 Blog Posts ({posts.length})</h2>
        <button className="btn btn-primary btn-sm" onClick={startNew}>
          + New Post
        </button>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['all', 'published', 'drafts'].map((s) => (
          <button
            key={s}
            className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterStatus(s)}
          >
            {s === 'all' ? 'All' : s === 'published' ? '✅ Published' : '📝 Drafts'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>
          No blog posts yet. Click &quot;+ New Post&quot; to create your first post.
        </p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((post) => (
              <tr key={post._id}>
                <td>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt=""
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '1px solid var(--border)',
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          background: '#f1f5f9',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#94a3b8',
                          fontSize: '1.2rem',
                          flexShrink: 0,
                        }}
                      >
                        📄
                      </div>
                    )}
                    <div>
                      <strong style={{ fontSize: '0.9rem' }}>{post.title}</strong>
                      {post.slug && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>
                          /blog/{post.slug}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: 'var(--surface)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {CATEGORIES.find((c) => c.value === post.category)?.label || post.category}
                  </span>
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${post.published ? 'btn-blue' : 'btn-outline'}`}
                    onClick={() => handleTogglePublish(post)}
                    style={{ fontSize: '0.75rem', padding: '3px 10px' }}
                  >
                    {post.published ? '✅ Published' : '📝 Draft'}
                  </button>
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                  {new Date(post.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => startEdit(post)}
                      style={{ fontSize: '0.78rem' }}
                    >
                      Edit
                    </button>
                    {post.published && (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.78rem' }}
                      >
                        View
                      </a>
                    )}
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleDelete(post._id)}
                      style={{ fontSize: '0.78rem', color: 'var(--red)' }}
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
  )
}
