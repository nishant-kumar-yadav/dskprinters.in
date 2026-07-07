// Custom MongoDB query sanitizer (Express 5 compatible)
// Strips keys starting with '$' or containing '.' to prevent NoSQL injection
function sanitizeObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }
  if (obj && typeof obj === 'object') {
    const clean = {}
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) continue
      clean[key] = sanitizeObject(obj[key])
    }
    return clean
  }
  return obj
}

export function mongoSanitize(req, res, next) {
  if (req.body) req.body = sanitizeObject(req.body)
  if (req.params) req.params = sanitizeObject(req.params)
  // req.query is a getter in Express 5; sanitize values in place
  if (req.query) {
    for (const key of Object.keys(req.query)) {
      if (key.startsWith('$') || key.includes('.')) delete req.query[key]
    }
  }
  next()
}
