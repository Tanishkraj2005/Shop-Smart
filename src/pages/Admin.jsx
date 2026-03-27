import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { products as initialProducts, CATEGORY_META, formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'
import usePageTitle from '../hooks/usePageTitle'
const ADMIN_PASS = 'admin123'
export default function Admin() {
    usePageTitle('Admin Dashboard')
    const { user } = useAuth()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [authed, setAuthed] = useState(sessionStorage.getItem('adminAuthed') === '1')
    const [authErr, setAuthErr] = useState('')
    const [activeTab, setActiveTab] = useState('products')
    const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('adminProducts')) || initialProducts)
    const [editProduct, setEditProduct] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [searchQ, setSearchQ] = useState('')
    const [filterCat, setFilterCat] = useState('all')
    const [formData, setFormData] = useState({ name: '', price: '', orig: '', cat: 'electronics', rating: '4.5', rev: '0', badge: '', desc: '', img: '' })
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0)
    const signIn = () => {
        if (password === ADMIN_PASS || user?.email?.includes('admin')) {
            sessionStorage.setItem('adminAuthed', '1')
            setAuthed(true)
        } else setAuthErr('Wrong password. Try: admin123')
    }
    const saveProducts = (updated) => {
        setProducts(updated)
        localStorage.setItem('adminProducts', JSON.stringify(updated))
    }
    const deleteProduct = (id) => {
        if (!confirm('Delete this product?')) return
        saveProducts(products.filter(p => p.id !== id))
    }
    const openEdit = (p) => {
        setFormData({ name: p.name, price: p.price, orig: p.orig || '', cat: p.cat, rating: p.rating, rev: p.rev, badge: p.badge || '', desc: p.desc, img: p.img })
        setEditProduct(p)
        setShowForm(true)
    }
    const openAdd = () => {
        setFormData({ name: '', price: '', orig: '', cat: 'electronics', rating: '4.5', rev: '0', badge: '', desc: '', img: '' })
        setEditProduct(null)
        setShowForm(true)
    }
    const saveForm = () => {
        if (!formData.name || !formData.price) return alert('Name and price are required.')
        if (editProduct) {
            saveProducts(products.map(p => p.id === editProduct.id ? { ...p, ...formData, price: Number(formData.price), orig: Number(formData.orig), rating: Number(formData.rating), rev: Number(formData.rev) } : p))
        } else {
            const newP = { ...formData, id: Date.now(), price: Number(formData.price), orig: Number(formData.orig), rating: Number(formData.rating), rev: Number(formData.rev) }
            saveProducts([newP, ...products])
        }
        setShowForm(false)
    }
    const filtered = products.filter(p => {
        const matchCat = filterCat === 'all' || p.cat === filterCat
        const matchQ = p.name.toLowerCase().includes(searchQ.toLowerCase())
        return matchCat && matchQ
    })
    const STATS = [
        { label: 'Total Products', value: products.length, icon: '📦', color: 'from-blue-500 to-blue-600' },
        { label: 'Total Orders', value: orders.length, icon: '🛒', color: 'from-green-500 to-green-600' },
        { label: 'Revenue', value: `₹${revenue.toLocaleString('en-IN')}`, icon: '💰', color: 'from-amber-500 to-orange-500' },
        { label: 'Categories', value: Object.keys(CATEGORY_META).length, icon: '🏷️', color: 'from-purple-500 to-violet-600' },
    ]
    if (!authed) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-10 w-full max-w-sm shadow-2xl text-center">
                <div className="text-5xl mb-4">🔐</div>
                <h1 className="text-2xl font-extrabold text-white mb-2">Admin Panel</h1>
                <p className="text-gray-400 text-sm mb-6">Enter admin password to continue</p>
                {authErr && <p className="text-red-400 text-sm mb-3">{authErr}</p>}
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
                    onKeyDown={e => e.key === 'Enter' && signIn()}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white outline-none focus:border-amber-400 mb-4" />
                <button onClick={signIn} className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-extrabold py-3 rounded-xl transition-colors">
                    Sign In →
                </button>
                <p className="text-xs text-gray-500 mt-4">Demo password: <code className="text-amber-400">admin123</code></p>
            </div>
        </div>
    )
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
            <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">⚙️</span>
                    <div>
                        <h1 className="font-extrabold text-lg">Shop Smart Admin</h1>
                        <p className="text-gray-400 text-xs">Management Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-white transition-colors">← View Site</button>
                    <button onClick={() => { sessionStorage.removeItem('adminAuthed'); setAuthed(false) }} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Logout</button>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {STATS.map(s => (
                        <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-lg`}>
                            <div className="text-3xl mb-2">{s.icon}</div>
                            <div className="text-2xl font-extrabold">{s.value}</div>
                            <div className="text-sm opacity-80 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 rounded-xl p-1.5 border border-gray-200 dark:border-gray-700 w-fit shadow-sm">
                    {[['📦 Products', 'products'], ['🛒 Orders', 'orders']].map(([label, tab]) => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-amber-400 text-gray-900' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                            {label}
                        </button>
                    ))}
                </div>
                {activeTab === 'products' && (
                    <div>
                        <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
                            <div className="flex gap-3 flex-wrap">
                                <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
                                    placeholder="Search products..." className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:border-amber-400 min-w-[200px]" />
                                <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:border-amber-400">
                                    <option value="all">All Categories</option>
                                    {Object.entries(CATEGORY_META).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.name}</option>)}
                                </select>
                                <span className="text-sm text-gray-400 self-center">{filtered.length} products</span>
                            </div>
                            <button onClick={openAdd} className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-md">
                                + Add Product
                            </button>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            {['Image', 'Name', 'Category', 'Price', 'Rating', 'Badge', 'Actions'].map(h => (
                                                <th key={h} className="py-3.5 px-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {filtered.map(p => (
                                            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="py-3 px-4">
                                                    <img src={p.img} alt={p.name} className="w-12 h-12 rounded-xl object-cover" onError={e => { e.target.style.display = 'none' }} />
                                                </td>
                                                <td className="py-3 px-4"><p className="font-semibold text-gray-900 dark:text-white max-w-[200px] truncate">{p.name}</p></td>
                                                <td className="py-3 px-4"><span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">{CATEGORY_META[p.cat]?.icon} {p.cat}</span></td>
                                                <td className="py-3 px-4 font-bold text-amber-500">{formatPrice(p.price)}</td>
                                                <td className="py-3 px-4">⭐ {p.rating}</td>
                                                <td className="py-3 px-4">
                                                    {p.badge && <span className={`text-xs px-2 py-1 rounded-full font-bold ${p.badge === 'Best Seller' ? 'bg-green-100 text-green-700' : p.badge === 'Sale' ? 'bg-red-100 text-red-700' : p.badge === 'Hot' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{p.badge}</span>}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => openEdit(p)} className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">Edit</button>
                                                        <button onClick={() => deleteProduct(p.id)} className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'orders' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {orders.length === 0 ? (
                            <div className="py-20 text-center text-gray-400">
                                <div className="text-5xl mb-4">📭</div>
                                <p className="text-lg font-semibold">No orders yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status'].map(h => (
                                                <th key={h} className="py-3.5 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {orders.map((o, i) => (
                                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="py-3 px-4 font-mono text-xs font-bold text-gray-600 dark:text-gray-400">{o.id || `SS${1000 + i}`}</td>
                                                <td className="py-3 px-4">
                                                    <p className="font-semibold text-gray-900 dark:text-white">{o.address?.name || 'Guest'}</p>
                                                    <p className="text-xs text-gray-400">{o.userId}</p>
                                                </td>
                                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{o.items?.length || 0} item(s)</td>
                                                <td className="py-3 px-4 font-bold text-amber-500">₹{(o.total || 0).toLocaleString('en-IN')}</td>
                                                <td className="py-3 px-4 text-gray-500 capitalize text-xs">{o.paymentMethod || 'COD'}</td>
                                                <td className="py-3 px-4">
                                                    <select className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-bold px-2 py-1 rounded-full border-none outline-none cursor-pointer">
                                                        {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                {showForm && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
                                <h2 className="font-extrabold text-lg">{editProduct ? '✏️ Edit Product' : '➕ Add Product'}</h2>
                                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
                            </div>
                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                {[['Product Name', 'name', 'text'], ['Price (₹)', 'price', 'number'], ['Original Price (₹)', 'orig', 'number'], ['Description', 'desc', 'text']].map(([label, key, type]) => (
                                    <div key={key}>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>
                                        <input type={type} value={formData[key]} onChange={e => setFormData(f => ({ ...f, [key]: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:border-amber-400 text-sm" />
                                    </div>
                                ))}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Category</label>
                                        <select value={formData.cat} onChange={e => setFormData(f => ({ ...f, cat: e.target.value }))}
                                            className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none text-sm">
                                            {Object.entries(CATEGORY_META).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Badge</label>
                                        <select value={formData.badge} onChange={e => setFormData(f => ({ ...f, badge: e.target.value }))}
                                            className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none text-sm">
                                            <option value="">None</option>
                                            {['Best Seller', 'Sale', 'Hot', 'New'].map(b => <option key={b}>{b}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Image URL</label>
                                    <input value={formData.img} onChange={e => setFormData(f => ({ ...f, img: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:border-amber-400 text-sm" placeholder="https://..." />
                                    {formData.img && <img src={formData.img} alt="preview" className="mt-2 h-20 object-cover rounded-xl" onError={e => { e.target.style.display = 'none' }} />}
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={saveForm} className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 font-extrabold py-3 rounded-xl transition-colors">
                                        {editProduct ? '💾 Save Changes' : '✅ Add Product'}
                                    </button>
                                    <button onClick={() => setShowForm(false)} className="px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
