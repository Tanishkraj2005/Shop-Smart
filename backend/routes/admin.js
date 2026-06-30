const express = require('express')
const db = require('../db')
const { authMiddleware } = require('../auth')

const router = express.Router()

// ─── GET /api/admin/stats ────────────────────────────────────────────────────
router.get('/stats', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ error: 'Admin access required.' })

  const totalOrders = db.prepare('SELECT COUNT(*) AS n FROM orders').get().n
  const revenue = db.prepare('SELECT COALESCE(SUM(total), 0) AS r FROM orders').get().r
  const totalUsers = db.prepare('SELECT COUNT(*) AS n FROM users').get().n
  const totalReviews = db.prepare('SELECT COUNT(*) AS n FROM reviews').get().n

  res.json({ totalOrders, revenue, totalUsers, totalReviews })
})

// ─── GET /api/admin/users ────────────────────────────────────────────────────
router.get('/users', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ error: 'Admin access required.' })

  const users = db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC').all()
  res.json(users)
})

// ─── PATCH /api/admin/orders/:id/status ──────────────────────────────────────
router.patch('/orders/:id/status', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ error: 'Admin access required.' })

  const { status } = req.body
  const allowed = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  if (!allowed.includes(status))
    return res.status(400).json({ error: 'Invalid status value.' })

  const info = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id)
  if (info.changes === 0) return res.status(404).json({ error: 'Order not found.' })
  res.json({ success: true })
})

module.exports = router
