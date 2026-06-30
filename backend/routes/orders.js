const express = require('express')
const db = require('../db')
const { authMiddleware } = require('../auth')

const router = express.Router()

// ─── POST /api/orders ─────────────────────────────────────────────────────────
router.post('/', authMiddleware, (req, res) => {
  const {
    id, items, address, subtotal, shipping, tax,
    discount = 0, coupon, total, paymentMethod = 'cod'
  } = req.body

  if (!items?.length || !address || !total)
    return res.status(400).json({ error: 'Missing order fields.' })

  const orderId = id || ('SS' + Date.now())

  try {
    db.prepare(`
      INSERT INTO orders
        (id, user_id, user_email, items_json, address_json, subtotal, shipping, tax, discount, coupon_code, total, payment_method, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed')
    `).run(
      orderId,
      req.user.id?.toString() || null,
      req.user.email || null,
      JSON.stringify(items),
      JSON.stringify(address),
      subtotal, shipping, tax, discount,
      coupon || null,
      total, paymentMethod
    )

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId)
    res.status(201).json(formatOrder(order))
  } catch (err) {
    console.error('Create order error:', err)
    res.status(500).json({ error: 'Failed to create order.' })
  }
})

// ─── GET /api/orders ──────────────────────────────────────────────────────────
// Returns all orders for the authenticated user
router.get('/', authMiddleware, (req, res) => {
  const userId = req.user.id?.toString()
  const email = req.user.email

  try {
    const rows = db.prepare(`
      SELECT * FROM orders
      WHERE user_id = ? OR user_email = ?
      ORDER BY created_at DESC
    `).all(userId, email)

    res.json(rows.map(formatOrder))
  } catch (err) {
    console.error('Get orders error:', err)
    res.status(500).json({ error: 'Failed to fetch orders.' })
  }
})

// ─── GET /api/orders/all  (admin) ─────────────────────────────────────────────
router.get('/all', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ error: 'Admin access required.' })

  const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()
  res.json(rows.map(formatOrder))
})

// ─── PATCH /api/orders/:id/status  (admin) ───────────────────────────────────
router.patch('/:id/status', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ error: 'Admin access required.' })

  const { status } = req.body
  const allowed = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  if (!allowed.includes(status))
    return res.status(400).json({ error: 'Invalid status.' })

  const info = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id)
  if (info.changes === 0) return res.status(404).json({ error: 'Order not found.' })

  res.json({ success: true })
})

// ─── Helper ───────────────────────────────────────────────────────────────────
function formatOrder(row) {
  return {
    ...row,
    items: JSON.parse(row.items_json),
    address: JSON.parse(row.address_json),
    items_json: undefined,
    address_json: undefined,
  }
}

module.exports = router
