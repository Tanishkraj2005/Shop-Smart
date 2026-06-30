const express = require('express')
const bcrypt = require('bcryptjs')
const db = require('../db')
const { signToken, authMiddleware } = require('../auth')

const router = express.Router()

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required.' })

  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters.' })

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRx.test(email))
    return res.status(400).json({ error: 'Invalid email address.' })

  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase())
    if (existing)
      return res.status(409).json({ error: 'Email already registered. Try logging in.' })

    const hashed = await bcrypt.hash(password, 12)
    const result = db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    ).run(name.trim(), email.toLowerCase(), hashed, 'user')

    const user = { id: result.lastInsertRowid, name: name.trim(), email: email.toLowerCase(), role: 'user' }
    const token = signToken(user)

    res.status(201).json({ token, user })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Signup failed. Please try again.' })
  }
})

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' })

  try {
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase())
    if (!row)
      return res.status(401).json({ error: 'No account found with this email.' })

    const valid = await bcrypt.compare(password, row.password)
    if (!valid)
      return res.status(401).json({ error: 'Incorrect email or password.' })

    const user = { id: row.id, name: row.name, email: row.email, role: row.role }
    const token = signToken(user)

    res.json({ token, user })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed. Please try again.' })
  }
})

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', authMiddleware, (req, res) => {
  const row = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.user.id)
  if (!row) return res.status(404).json({ error: 'User not found.' })
  res.json(row)
})

// ─── PATCH /api/auth/profile ──────────────────────────────────────────────────
router.patch('/profile', authMiddleware, async (req, res) => {
  const { name, currentPassword, newPassword } = req.body
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
  if (!row) return res.status(404).json({ error: 'User not found.' })

  let updates = {}
  if (name) updates.name = name.trim()

  if (newPassword) {
    if (!currentPassword)
      return res.status(400).json({ error: 'Current password required to set a new one.' })
    const valid = await bcrypt.compare(currentPassword, row.password)
    if (!valid)
      return res.status(401).json({ error: 'Current password is incorrect.' })
    if (newPassword.length < 6)
      return res.status(400).json({ error: 'New password must be at least 6 characters.' })
    updates.password = await bcrypt.hash(newPassword, 12)
  }

  if (Object.keys(updates).length === 0)
    return res.status(400).json({ error: 'No changes provided.' })

  const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ')
  db.prepare(`UPDATE users SET ${setClauses} WHERE id = ?`).run(...Object.values(updates), req.user.id)

  const updated = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.id)
  const token = signToken({ id: updated.id, name: updated.name, email: updated.email, role: updated.role })
  res.json({ user: updated, token })
})

module.exports = router
