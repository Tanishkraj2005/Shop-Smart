/**
 * Central API client for ShopSmart backend.
 * All requests go to http://localhost:5000/api
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getToken() {
  return localStorage.getItem('token') || ''
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const api = {
  // ─── Auth ──────────────────────────────────────────────────────────────────
  signup: (name, email, password) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  me: () => request('/auth/me'),

  updateProfile: (data) =>
    request('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) }),

  // ─── Orders ────────────────────────────────────────────────────────────────
  createOrder: (order) =>
    request('/orders', { method: 'POST', body: JSON.stringify(order) }),

  getOrders: () => request('/orders'),

  getAllOrders: () => request('/orders/all'),

  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // ─── Reviews ───────────────────────────────────────────────────────────────
  getReviews: (productId) => request(`/reviews/${productId}`),

  postReview: (productId, review) =>
    request(`/reviews/${productId}`, { method: 'POST', body: JSON.stringify(review) }),

  // ─── Admin ─────────────────────────────────────────────────────────────────
  getAdminStats: () => request('/admin/stats'),

  getAdminUsers: () => request('/admin/users'),
}
