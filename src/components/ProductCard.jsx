import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { renderStars, getDiscount, toSlug } from '../data/products'
import { useCurrency } from '../context/CurrencyContext'
import { useNotification } from './Notification'
import { Heart, ShoppingCart, Scale, Search, ShieldAlert, CheckCircle } from 'lucide-react'
export default function ProductCard({ product, onQuickView }) {
    const { addToCart } = useCart()
    const { toggleWishlist, isWishlisted } = useWishlist()
    const { notify } = useNotification()
    const { formatPrice } = useCurrency()
    const [adding, setAdding] = useState(false)
    const navigate = useNavigate()
    const wished = isWishlisted(product.id)
    const disc = getDiscount(product.price, product.orig)
    const handleAddToCart = (e) => {
        e.preventDefault(); e.stopPropagation()
        setAdding(true)
        addToCart(product, 1)
        notify(`${product.name} added to cart! 🛒`)
        setTimeout(() => setAdding(false), 800)
    }
    const handleWishlist = (e) => {
        e.preventDefault(); e.stopPropagation()
        toggleWishlist(product)
        notify(wished ? 'Removed from wishlist' : `${product.name} saved! ❤️`, wished ? 'warning' : 'success')
    }
    const handleCompare = (e) => {
        e.preventDefault(); e.stopPropagation()
        const saved = JSON.parse(localStorage.getItem('compareList') || '[]')
        if (!saved.find(p => p.id === product.id)) {
            if (saved.length >= 3) saved.shift()
            saved.push(product)
            localStorage.setItem('compareList', JSON.stringify(saved))
        }
        notify(`${product.name} added to compare list! ⚖️`)
    }
    const badgeColors = {
        'Best Seller': 'bg-green-500 text-white',
        'Sale': 'bg-red-500 text-white',
        'Hot': 'bg-orange-500 text-white',
        'New': 'bg-blue-500 text-white',
    }
    const stockLevel = (() => {
        const levels = { 1: 3, 3: 1, 5: 8, 7: 2, 9: 15, 11: 5, 13: 0, 15: 20 }
        return levels[product.id] ?? (product.id % 10) + 5
    })()
    return (
        <div className="card group flex flex-col relative">
            <Link to={`/product/${toSlug(product.name)}`} className="block overflow-hidden relative" onClick={e => { }}>
                <div className="relative overflow-hidden h-52">
                    <img src={product.img} alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop'; e.target.onerror = null }}
                    />
                    {product.badge && <span className={`badge absolute top-2 left-2 ${badgeColors[product.badge]}`}>{product.badge}</span>}
                    {disc > 0 && <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-bold">{disc}% OFF</span>}
                    <button onClick={handleWishlist}
                        className={`absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${wished ? 'bg-red-500 text-white scale-110' : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white hover:scale-110'}`}>
                        <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
                    </button>
                    {onQuickView && (
                        <button onClick={(e) => { e.preventDefault(); onQuickView(product) }}
                            className="absolute bottom-2 right-2 bg-black/70 text-white flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">
                            <Search size={14} /> Quick View
                        </button>
                    )}
                </div>
            </Link>
            <div className="p-4 flex-1 flex flex-col">
                {stockLevel === 0 && <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold text-red-500 mb-1"><ShieldAlert size={12} /> Out of Stock</span>}
                {stockLevel > 0 && stockLevel <= 3 && <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold text-orange-500 mb-1"><ShieldAlert size={12} /> Only {stockLevel} left!</span>}
                <Link to={`/product/${toSlug(product.name)}`}>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-2 line-clamp-2 hover:text-amber-500 transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-amber-400 text-sm tracking-wider">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
                    <span className="text-xs text-gray-400">({product.rev.toLocaleString('en-IN')})</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap mt-auto mb-3">
                    <span className="text-lg font-extrabold text-amber-500">{formatPrice(product.price)}</span>
                    {product.orig && product.orig > product.price && <span className="text-sm text-gray-400 line-through">{formatPrice(product.orig)}</span>}
                </div>
            </div>
            <div className="px-4 pb-4">
                <button onClick={handleAddToCart} disabled={adding || stockLevel === 0}
                    className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${stockLevel === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700' : adding ? 'bg-green-500 text-white scale-95' : 'bg-amber-400 hover:bg-amber-500 text-gray-900 hover:shadow-lg hover:-translate-y-0.5'}`}>
                    {stockLevel === 0 ? 'Out of Stock' : adding ? <><CheckCircle size={16} /> Added!</> : <><ShoppingCart size={16} /> Add to Cart</>}
                </button>
                <div className="flex gap-2 mt-2">
                    <button onClick={handleCompare} className="flex-1 py-2 rounded-lg text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-1">
                        <Scale size={14} /> Compare
                    </button>
                </div>
            </div>
        </div>
    )
}
