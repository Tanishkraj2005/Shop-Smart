import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { products, formatPrice, CATEGORY_META } from '../data/products'
import { useCart } from '../context/CartContext'
import { useNotification } from '../components/Notification'
import usePageTitle from '../hooks/usePageTitle'
import { Scale, ShoppingCart } from 'lucide-react'
export default function Compare() {
    usePageTitle('Compare Products')
    const [compareList, setCompareList] = useState([])
    const { addToCart } = useCart()
    const { notify } = useNotification()
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('compareList') || '[]')
        setCompareList(saved)
    }, [])
    if (!compareList.length) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 dark:bg-gray-950 p-8">
            <Scale size={80} className="text-gray-300 dark:text-gray-700" />
            <h2 className="text-2xl font-extrabold text-gray-700 dark:text-white">Nothing to compare yet!</h2>
            <p className="text-gray-400">Add 2–3 products using the Compare button on any product page.</p>
            <Link to="/" className="btn-primary px-8 py-3 rounded-xl">Browse Products →</Link>
        </div>
    )
    const ROWS = [
        ['Price', p => formatPrice(p.price)],
        ['Original', p => p.orig > p.price ? formatPrice(p.orig) : '—'],
        ['Discount', p => p.orig > p.price ? `${Math.round((1 - p.price / p.orig) * 100)}% OFF` : '—'],
        ['Rating', p => `${'★'.repeat(Math.floor(p.rating))} ${p.rating}`],
        ['Reviews', p => p.rev.toLocaleString('en-IN')],
        ['Category', p => CATEGORY_META[p.cat]?.name || p.cat],
        ['Badge', p => p.badge || '—'],
    ]
    return (
        <div className="min-h-screen dark:bg-gray-950 pb-24 md:pb-8">
            <div className="max-w-6xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center gap-3"><Scale size={32} /> Compare Products</h1>
                <div className="overflow-x-auto">
                    <table className="w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                                <th className="py-4 px-5 text-left font-bold text-sm w-32">Feature</th>
                                {compareList.map(p => (
                                    <th key={p.id} className="py-4 px-5 text-center">
                                        <img src={p.img} alt={p.name} className="w-16 h-16 object-cover rounded-xl mx-auto mb-2" onError={e => { e.target.style.display = 'none' }} />
                                        <p className="text-sm font-bold leading-tight">{p.name}</p>
                                        <button onClick={() => { addToCart(p, 1); notify(`${p.name} added to cart!`) }}
                                            className="mt-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-xs px-4 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 mx-auto">
                                            <ShoppingCart size={14} /> Add to Cart
                                        </button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ROWS.map(([label, fmt]) => (
                                <tr key={label} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="py-4 px-5 font-semibold text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">{label}</td>
                                    {compareList.map(p => (
                                        <td key={p.id} className="py-4 px-5 text-center text-sm text-gray-800 dark:text-gray-200 font-medium">{fmt(p)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={() => { setCompareList([]); localStorage.removeItem('compareList') }}
                    className="mt-6 btn-outline px-6 py-3 rounded-xl">Clear Comparison</button>
            </div>
        </div>
    )
}
