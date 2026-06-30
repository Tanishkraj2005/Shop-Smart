const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'shopsmart_super_secret_key_2025'
const JWT_EXPIRES = '7d'

/**
 * Sign a JWT for the given user payload
 */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

/**
 * Express middleware: verifies Bearer token and attaches req.user
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'No token provided.' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

/**
 * Express middleware: requires admin role
 */
function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' })
    }
    next()
  })
}

module.exports = { signToken, authMiddleware, adminMiddleware }
