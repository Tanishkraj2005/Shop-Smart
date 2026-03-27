import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useNavigate } from 'react-router-dom'
import { formatPrice, getDiscount } from '../data/products'
import { useNotification } from './Notification'
export default function QuickViewModal({ product, onClose }) {
    const { addToCart } = useCart()
    const { toggleWishlist, isWishlisted } = useWishlist()
    const { notify } = useNotification()
    const navigate = useNavigate()
    const disc = getDiscount(product.price, product.orig)
    const wished = isWishlisted(product.id)
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9000] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-gray-100 dark:bg-gray-700 hover:bg-red-500 hover:text-white w-9 h-9 rounded-full flex items-center justify-center transition-all text-gray-600 dark:text-gray-300">✕</button>
                <div className="grid sm:grid-cols-2">
                    <div className="h-64 sm:h-auto overflow-hidden">
                        <img src={product.img} alt={product.name} className="w-full h-full object-cover"
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop'; e.target.onerror = null }} />
                    </div>
                    <div className="p-6 flex flex-col">
                        {product.badge && (
                            <span className={`badge self-start mb-3 ${product.badge === 'Best Seller' ? 'bg-green-500 text-white' : product.badge === 'Sale' ? 'bg-red-500 text-white' : product.badge === 'Hot' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'}`}>
                                {product.badge}
                            </span>
                        )}
                        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">{product.name}</h2>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-amber-400">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
                            <span className="text-sm text-gray-400">({product.rev.toLocaleString('en-IN')} reviews)</span>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl font-extrabold text-amber-500">{formatPrice(product.price)}</span>
                            {disc > 0 && <>
                                <span className="text-sm text-gray-400 line-through">{formatPrice(product.orig)}</span>
                                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">{disc}% OFF</span>
                            </>}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-5 flex-1">{product.desc}</p>
                        <div className="space-y-2">
                            <button onClick={() => { addToCart(product, 1); notify(`${product.name} added to cart! 🛒`); onClose() }}
                                className="btn-primary w-full py-3 rounded-xl">🛒 Add to Cart</button>
                            <button onClick={() => { navigate(`/product/${product.id}`); onClose() }}
                                className="btn-outline w-full py-3 rounded-xl text-sm">View Full Details →</button>
                            <button onClick={() => { toggleWishlist(product); notify(wished ? 'Removed from wishlist' : 'Saved! ❤️', wished ? 'warning' : 'success') }}
                                className={`w-full py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${wished ? 'border-red-400 text-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-red-400'}`}>
                                {wished ? '❤️ Saved' : '♡ Save to Wishlist'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
