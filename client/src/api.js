const API_BASE = import.meta.env.VITE_API_URL || '/api'

const TOKEN_KEY = 'dsk_token'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.auth ? { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` } : {}),
      ...options.headers,
    },
    ...options,
  })
  if (!res.ok) {
    let msg = `Request failed (${res.status})`
    try {
      const data = await res.json()
      msg = data.error || msg
    } catch {}
    const err = new Error(msg)
    err.status = res.status
    throw err
  }
  return res.json()
}

// ---------- PUBLIC ----------

export const fetchProducts = () => request('/products')
export const fetchProduct = (slug) => request(`/products/${slug}`)
export const fetchCategories = () => request('/products/meta/categories')
export const submitLead = (data) =>
  request('/leads', { method: 'POST', body: JSON.stringify(data) })

// ---------- ADMIN ----------

export const adminLogin = async (username, password) => {
  const data = await request('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  localStorage.setItem(TOKEN_KEY, data.token)
  return data
}

export const adminLogout = () => localStorage.removeItem(TOKEN_KEY)
export const isAdminLoggedIn = () => !!localStorage.getItem(TOKEN_KEY)

export const fetchStats = () => request('/admin/stats', { auth: true })

export const fetchLeads = (status = 'all', page = 1) =>
  request(`/admin/leads?status=${status}&page=${page}`, { auth: true })

export const exportLeadsCSV = async (status = 'all') => {
  const res = await fetch(`${API_BASE}/admin/leads/export?status=${status}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
  })
  if (!res.ok) throw new Error('Export failed')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dsk-leads-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export const updateLead = (id, data) =>
  request(`/admin/leads/${id}`, { method: 'PATCH', body: JSON.stringify(data), auth: true })

export const deleteLead = (id) => request(`/admin/leads/${id}`, { method: 'DELETE', auth: true })

export const createProduct = (data) =>
  request('/admin/products', { method: 'POST', body: JSON.stringify(data), auth: true })

export const updateProduct = (id, data) =>
  request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data), auth: true })

export const deleteProduct = (id) =>
  request(`/admin/products/${id}`, { method: 'DELETE', auth: true })

export const createCategory = (data) =>
  request('/admin/categories', { method: 'POST', body: JSON.stringify(data), auth: true })

export const updateCategory = (id, data) =>
  request(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data), auth: true })

export const deleteCategory = (id) =>
  request(`/admin/categories/${id}`, { method: 'DELETE', auth: true })

export const uploadImage = async (file) => {
  const form = new FormData()
  form.append('image', file)
  const res = await fetch(`${API_BASE}/admin/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
    body: form,
  })
  if (!res.ok) {
    let msg = 'Upload failed'
    try {
      msg = (await res.json()).error || msg
    } catch {}
    throw new Error(msg)
  }
  return res.json()
}

// Company constants
export const COMPANY = {
  name: 'DSK Printers',
  tagline: "India's Trusted DTF & UV DTF Sticker Manufacturer",
  phone: '+917942540714',
  phoneRaw: '917942540714',
  whatsapp: 'https://wa.me/917942540714',
  email: 'support@dskprinters.in',
  gst: '07DOZPK8646J1ZV',
  location: 'New Delhi, Delhi, India',
  established: 2015,
  turnover: '₹1.5 - 5 Crore',
  employees: '20-50',
  responseRate: '85%',
}
