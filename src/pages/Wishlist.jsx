import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useNotification } from '../components/Notification'
import { formatPrice } from '../data/products'
import usePageTitle from '../hooks/usePageTitle'
export default function Wishlist() {
    usePageTitle('My Wishlist')
    const { wishlist, toggleWishlist } = useWishlist()
    const { addToCart } = useCart()
    const { notify } = useNotification()
    if (!wishlist.length) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 dark:bg-gray-950 p-8">
            <div className="text-8xl">❤️</div>
            <h2 className="text-2xl font-extrabold text-gray-700 dark:text-white">Your wishlist is empty!</h2>
            <p className="text-gray-400">Save products you love for later.</p>
            <Link to="/" className="btn-primary px-8 py-3 rounded-xl">Browse Products →</Link>
        </div>
    )
    return (
        <div className="min-h-screen dark:bg-gray-950 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">❤️ My Wishlist</h1>
                <p className="text-gray-500 mb-8">{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map(p => (
                        <div key={p.id} className="card flex flex-col overflow-hidden group">
                            <Link to={`/product/${p.id}`} className="block overflow-hidden h-48">
                                <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop'; e.target.onerror = null }} />
                            </Link>
                            <div className="p-4 flex-1">
                                <Link to={`/product/${p.id}`}><h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-amber-500 text-sm">{p.name}</h3></Link>
                                <div className="text-amber-500 font-extrabold text-lg">{formatPrice(p.price)}</div>
                                {p.orig > p.price && <div className="text-gray-400 text-sm line-through">{formatPrice(p.orig)}</div>}
                            </div>
                            <div className="px-4 pb-4 space-y-2">
                                <button onClick={() => { addToCart(p, 1); notify(`${p.name} added to cart! 🛒`) }} className="btn-primary w-full py-2.5 rounded-xl text-sm">🛒 Add to Cart</button>
                                <button onClick={() => { toggleWishlist(p); notify('Removed from wishlist', 'warning') }} className="btn-outline w-full py-2.5 rounded-xl text-sm">Remove ✕</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
