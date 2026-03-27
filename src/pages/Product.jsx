import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { products, getDiscount, CATEGORY_META, toSlug } from '../data/products'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useNotification } from '../components/Notification'
import { useCurrency } from '../context/CurrencyContext'
import ProductCard from '../components/ProductCard'
import { db } from '../firebase/config'
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore'
import usePageTitle from '../hooks/usePageTitle'
function ReviewForm({ productId, onSubmit }) {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [name, setName] = useState('')
    const [text, setText] = useState('')
    const [msg, setMsg] = useState('')
    const submit = async () => {
        if (!rating || !name || !text) { setMsg('Please fill all fields and select a rating.'); return }
        const review = { name, text, rating, date: new Date().toLocaleDateString('en-IN') }
        onSubmit(review)
        setRating(0); setName(''); setText(''); setMsg('✅ Review submitted! Thank you.')
        setTimeout(() => setMsg(''), 3000)
    }
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-lg mb-4">Write a Review</h3>
            <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setRating(n)}
                        className={`text-3xl transition-transform hover:scale-110 ${n <= (hover || rating) ? 'text-amber-400' : 'text-gray-300'}`}>★</button>
                ))}
            </div>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="input mb-3" />
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Share your thoughts about this product..." rows={3} className="input mb-3 resize-none" />
            <button onClick={submit} className="btn-primary w-full rounded-xl">Submit Review ✍️</button>
            {msg && <p className={`mt-2 text-sm font-medium ${msg.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}
        </div>
    )
}
export default function Product() {
    const { slug } = useParams()
    const product = products.find(p => toSlug(p.name) === slug)
    usePageTitle(product ? product.name : 'Product Details')
    const navigate = useNavigate()
    const { addToCart } = useCart()
    const { toggleWishlist, isWishlisted } = useWishlist()
    const { notify } = useNotification()
    const { formatPrice } = useCurrency()
    const [mainImg, setMainImg] = useState(product?.img)
    const [qty, setQty] = useState(1)
    const [reviews, setReviews] = useState([])
    const [adding, setAdding] = useState(false)
    const relatedProducts = products.filter(p => p.cat === product?.cat && p.id !== product?.id).slice(0, 4)
    const disc = getDiscount(product?.price, product?.orig)
    const wished = isWishlisted(product?.id)
    useEffect(() => {
        if (!product) return
        setMainImg(product.img)
        const loadReviews = async () => {
            try {
                if (db) {
                    const q = query(collection(db, 'reviews'), where('productId', '==', product.id), orderBy('createdAt', 'desc'))
                    const snap = await getDocs(q)
                    const r = snap.docs.map(d => d.data())
                    setReviews(r.length ? r : defaultReviews())
                } else setReviews(JSON.parse(localStorage.getItem(`reviews_${product.id}`)) || defaultReviews())
            } catch { setReviews(defaultReviews()) }
        }
        loadReviews()
    }, [product?.id])
    const defaultReviews = () => ([
        { name: 'Priya Sharma', rating: 5, text: 'Absolutely love it! Great quality and fast delivery.', date: '15 Jan 2025' },
        { name: 'Rahul Mehta', rating: 4, text: 'Good product, exactly as described. Would recommend!', date: '10 Jan 2025' },
    ])
    const handleAddToCart = () => {
        if (!product) return
        setAdding(true)
        addToCart(product, qty)
        notify(`${product.name} added to cart! 🛒`)
        setTimeout(() => setAdding(false), 1000)
    }
    const handleReviewSubmit = async (review) => {
        const r = { ...review, productId: product.id }
        setReviews(prev => [review, ...prev])
        try {
            if (db) await addDoc(collection(db, 'reviews'), { ...r, createdAt: serverTimestamp() })
            else { const k = `reviews_${product.id}`; const prev = JSON.parse(localStorage.getItem(k) || '[]'); localStorage.setItem(k, JSON.stringify([r, ...prev])) }
        } catch (e) { console.warn(e) }
    }
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        notify('Link copied! 🔗')
    }
    if (!product) return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
            <div className="text-6xl">😕</div>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-300">Product not found</p>
            <Link to="/" className="btn-primary px-6 py-3 rounded-xl">← Back to Home</Link>
        </div>
    )
    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : product.rating
    return (
        <div className="min-h-screen dark:bg-gray-950 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <nav className="text-sm text-gray-400 mb-6">
                    <Link to="/" className="hover:text-amber-500">Home</Link> /
                    <Link to={`/${product.cat}`} className="mx-1 hover:text-amber-500">{CATEGORY_META[product.cat]?.name}</Link> /
                    <span className="text-gray-600 dark:text-gray-300"> {product.name}</span>
                </nav>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div>
                        <div className="rounded-2xl overflow-hidden mb-4 h-96 cursor-zoom-in group border border-gray-100 dark:border-gray-800">
                            <img src={mainImg} alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={e => { e.target.src = product.img; e.target.onerror = null }} />
                        </div>
                    </div>
                    <div>
                        {product.badge && (
                            <span className={`badge mb-3 inline-block ${product.badge === 'Best Seller' ? 'bg-green-500 text-white' : product.badge === 'Sale' ? 'bg-red-500 text-white' : product.badge === 'Hot' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'}`}>
                                {product.badge}
                            </span>
                        )}
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">{product.name}</h1>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-amber-400 text-xl">{'★'.repeat(Math.floor(avgRating))}{'☆'.repeat(5 - Math.floor(avgRating))}</span>
                            <span className="font-bold text-gray-700 dark:text-gray-300">{avgRating}</span>
                            <span className="text-gray-400 text-sm">({product.rev.toLocaleString('en-IN')} reviews)</span>
                        </div>
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-3xl font-extrabold text-amber-500">{formatPrice(product.price)}</span>
                            {product.orig > product.price && <>
                                <span className="text-lg text-gray-400 line-through">{formatPrice(product.orig)}</span>
                                <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-bold px-2 py-1 rounded-lg">{disc}% OFF</span>
                            </>}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{product.desc}</p>
                        <div className="mb-6">
                            <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Quantity:</p>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 font-bold text-lg hover:bg-amber-100 transition-colors">-</button>
                                <span className="w-10 text-center font-bold text-lg">{qty}</span>
                                <button onClick={() => setQty(q => Math.min(10, q + 1))} className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 font-bold text-lg hover:bg-amber-100 transition-colors">+</button>
                            </div>
                        </div>
                        <div className="flex gap-3 mb-4 flex-wrap">
                            <button onClick={handleAddToCart}
                                className={`flex-1 py-4 rounded-xl font-bold text-base transition-all duration-200 ${adding ? 'bg-green-500 text-white' : 'bg-amber-400 hover:bg-amber-500 text-gray-900 hover:shadow-xl hover:-translate-y-1'}`}>
                                {adding ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                            </button>
                            <button onClick={() => { addToCart(product, qty); navigate('/checkout') }}
                                className="flex-1 btn-secondary py-4 rounded-xl text-base">⚡ Buy Now</button>
                            <button onClick={() => { toggleWishlist(product); notify(wished ? 'Removed from wishlist' : 'Saved! ❤️', wished ? 'warning' : 'success') }}
                                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-xl transition-all ${wished ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500' : 'border-gray-200 dark:border-gray-600 hover:border-red-400'}`}>
                                ♥
                            </button>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">📤 Share:</p>
                            <div className="flex gap-2 flex-wrap">
                                <button onClick={() => window.open(`https://wa.me/?text=Check out ${product.name} on Shop Smart! ${window.location.href}`, '_blank')}
                                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium hover:bg-green-50 hover:border-green-400 hover:text-green-600 transition-all dark:hover:bg-green-900/20">📱 WhatsApp</button>
                                <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${product.name}&url=${window.location.href}`, '_blank')}
                                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all dark:hover:bg-blue-900/20">🐦 Twitter</button>
                                <button onClick={copyLink}
                                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium hover:bg-amber-50 hover:border-amber-400 hover:text-amber-600 transition-all dark:hover:bg-amber-900/20">🔗 Copy</button>
                            </div>
                        </div>
                    </div>
                </div>
                {relatedProducts.length > 0 && (
                    <section className="mb-16">
                        <h2 className="section-title text-left text-2xl mb-6">🛍️ Customers Also Bought</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </section>
                )}
                <section>
                    <h2 className="section-title text-left text-2xl mb-8">⭐ Customer Reviews</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm text-center h-fit">
                            <div className="text-7xl font-black text-amber-500 leading-none">{avgRating}</div>
                            <div className="text-3xl text-amber-400 my-2">{'★'.repeat(Math.floor(avgRating))}{'☆'.repeat(5 - Math.floor(avgRating))}</div>
                            <p className="text-sm text-gray-400">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                            <div className="mt-5 space-y-2 text-left">
                                {[5, 4, 3, 2, 1].map(n => {
                                    const count = reviews.filter(r => r.rating === n).length
                                    const pct = reviews.length ? Math.round(count / reviews.length * 100) : 0
                                    return (
                                        <div key={n} className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-500 w-5 text-right">{n}★</span>
                                            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="text-gray-400 w-8 text-right">{pct}%</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            <ReviewForm productId={product.id} onSubmit={handleReviewSubmit} />
                            <div className="space-y-4">
                                {reviews.slice(0, 5).map((r, i) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                                        <div className="flex justify-between mb-2">
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{r.name}</p>
                                                <p className="text-xs text-gray-400">{r.date}</p>
                                            </div>
                                            <span className="text-amber-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{r.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
