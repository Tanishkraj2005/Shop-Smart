const express = require('express')
const db = require('../db')
const { authMiddleware } = require('../auth')

const router = express.Router()

// ─── GET /api/reviews/:productId ─────────────────────────────────────────────
router.get('/:productId', (req, res) => {
  const productId = parseInt(req.params.productId, 10)
  if (isNaN(productId)) return res.status(400).json({ error: 'Invalid product ID.' })

  const rows = db.prepare(
    'SELECT id, name, text, rating, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC LIMIT 50'
  ).all(productId)

  res.json(rows.map(r => ({
    ...r,
    date: new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  })))
})

// ─── POST /api/reviews/:productId 
router.post('/:productId', (req, res) => {
  const productId = parseInt(req.params.productId, 10)
  if (isNaN(productId)) return res.status(400).json({ error: 'Invalid product ID.' })

  const { name, text, rating } = req.body
  if (!name || !text || !rating)
    return res.status(400).json({ error: 'Name, text and rating are required.' })

  const r = parseInt(rating, 10)
  if (r < 1 || r > 5)
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' })

  try {
    const result = db.prepare(
      'INSERT INTO reviews (product_id, name, text, rating) VALUES (?, ?, ?, ?)'
    ).run(productId, name.trim(), text.trim(), r)

    const row = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid)
    res.status(201).json({
      ...row,
      date: new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    })
  } catch (err) {
    console.error('Review error:', err)
    res.status(500).json({ error: 'Failed to save review.' })
  }
})

module.exports = router
