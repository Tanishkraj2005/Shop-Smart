import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products'
import { db } from '../firebase/config'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import usePageTitle from '../hooks/usePageTitle'
const STATUS_STYLES = {
    Confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Processing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}
export default function Orders() {
    usePageTitle('My Orders')
    const { user } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const load = async () => {
            try {
                if (db && user?.uid) {
                    const [snapUid, snapEmail] = await Promise.all([
                        getDocs(query(collection(db, 'orders'), where('userId', '==', user.uid))),
                        getDocs(query(collection(db, 'orders'), where('userId', '==', user.email))),
                    ])
                    const fromUid = snapUid.docs.map(d => ({ ...d.data(), _docId: d.id }))
                    const fromEmail = snapEmail.docs.map(d => ({ ...d.data(), _docId: d.id }))
                    const seen = new Set()
                    const merged = [...fromUid, ...fromEmail].filter(o => {
                        if (seen.has(o._docId)) return false
                        seen.add(o._docId); return true
                    })
                    merged.sort((a, b) => {
                        const ta = a.createdAt?.toMillis?.() || 0
                        const tb = b.createdAt?.toMillis?.() || 0
                        return tb - ta
                    })
                    setOrders(merged)
                } else {
                    const local = JSON.parse(localStorage.getItem('orders') || '[]')
                    setOrders(local)
                }
            } catch (e) {
                console.warn('Orders fetch error:', e)
                const local = JSON.parse(localStorage.getItem('orders') || '[]')
                setOrders(local)
            }
            setLoading(false)
        }
        load()
    }, [user])
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
            <div className="text-center">
                <div className="animate-spin w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Loading your orders...</p>
            </div>
        </div>
    )
    return (
        <div className="min-h-screen dark:bg-gray-950 pb-24 md:pb-8">
            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">📦 My Orders</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {orders.length > 0 ? `${orders.length} order${orders.length > 1 ? 's' : ''} found` : 'Track and manage your orders'}
                    </p>
                </div>
                {orders.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="text-7xl mb-5">📦</div>
                        <h2 className="text-2xl font-extrabold text-gray-700 dark:text-gray-200 mb-2">No orders yet</h2>
                        <p className="text-gray-400 mb-8">Your orders will appear here once you place one.</p>
                        <Link to="/" className="btn-primary px-10 py-3.5 rounded-xl text-base font-bold">
                            Start Shopping →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, idx) => {
                            const status = order.status || 'Confirmed'
                            const date = order.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            }) || new Date().toLocaleDateString('en-IN')
                            const orderId = order.id || order._docId || ('SS' + (1001 + idx))
                            return (
                                <div key={order._docId || idx} className="card p-6">
                                    <div className="flex justify-between items-start mb-5 flex-wrap gap-2">
                                        <div>
                                            <p className="font-extrabold text-gray-900 dark:text-white text-sm">
                                                Order <span className="text-amber-500">#{orderId}</span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">Placed on {date}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[status] || STATUS_STYLES.Confirmed}`}>
                                            {status === 'Confirmed' && '✅ '}{status}
                                        </span>
                                    </div>
                                    <div className="space-y-3 mb-5">
                                        {(order.items || []).map((item, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <img src={item.img} alt={item.name}
                                                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                                                    onError={e => { e.target.style.display = 'none' }} />
                                                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
                                                    {item.name} <span className="text-gray-400">× {item.qty}</span>
                                                </span>
                                                <span className="text-sm font-bold text-amber-500 flex-shrink-0">
                                                    {formatPrice(item.price * item.qty)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-4 flex-wrap gap-3">
                                        <div>
                                            <p className="text-xs text-gray-400">
                                                {order.address?.city && `📍 ${order.address.city}, ${order.address.state}`}
                                            </p>
                                            <p className="font-extrabold text-gray-900 dark:text-white mt-0.5">
                                                Total: <span className="text-amber-500">{formatPrice(order.total || 0)}</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => alert(`Order #${orderId}\nStatus: ${status}\nDelivery: ${order.address?.city || 'N/A'}\n\nEstimated delivery: 2-5 business days`)}
                                            className="btn-outline px-5 py-2 rounded-xl text-sm font-semibold">
                                            Track Order 📍
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
