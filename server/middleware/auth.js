import jwt from 'jsonwebtoken'

export const JWT_SECRET = process.env.JWT_SECRET || 'dsk-dev-secret-change-in-production'

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
    req.admin = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
