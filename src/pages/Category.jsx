import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import QuickViewModal from '../components/QuickViewModal'
import { products, CATEGORY_META } from '../data/products'
import { useCurrency } from '../context/CurrencyContext'
import { useNotification } from '../components/Notification'
import usePageTitle from '../hooks/usePageTitle'
const FILTERS = ['All', '🏷️ Sale', '✨ New', '⭐ Popular']
const SORTS = [
    { label: 'Featured', value: 'default' },
    { label: 'Price: Low–High', value: 'price-low' },
    { label: 'Price: High–Low', value: 'price-high' },
    { label: 'Top Rated', value: 'rating' },
    { label: 'Most Reviews', value: 'reviews' },
]
export default function Category() {
    const { category } = useParams()
    const cat = CATEGORY_META[category]
    usePageTitle(cat ? cat.name : 'Category')
    const { formatPrice } = useCurrency()
    const [filter, setFilter] = useState('All')
    const [sort, setSort] = useState('default')
    const [priceMax, setPriceMax] = useState(null)
    const [quickProduct, setQuickProduct] = useState(null)
    const [compareList, setCompareList] = useState([])
    const { notify } = useNotification()
    const catProducts = products.filter(p => p.cat === category)
    const maxPrice = Math.max(...catProducts.map(p => p.price))
    const effectiveMax = priceMax ?? maxPrice
    const filtered = useMemo(() => {
        let list = [...catProducts].filter(p => p.price <= effectiveMax)
        if (filter === '🏷️ Sale') list = list.filter(p => p.badge === 'Sale')
        if (filter === '✨ New') list = list.filter(p => p.badge === 'New')
        if (filter === '⭐ Popular') list = list.filter(p => p.rev > 10000)
        if (sort === 'price-low') list.sort((a, b) => a.price - b.price)
        if (sort === 'price-high') list.sort((a, b) => b.price - a.price)
        if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
        if (sort === 'reviews') list.sort((a, b) => b.rev - a.rev)
        return list
    }, [category, filter, sort, effectiveMax])
    const handleCompare = (p) => {
        if (compareList.find(x => x.id === p.id)) {
            setCompareList(c => c.filter(x => x.id !== p.id))
        } else if (compareList.length >= 3) {
            notify('Max 3 products to compare!', 'warning')
        } else {
            setCompareList(c => [...c, p]); notify(`${p.name} added to compare ⚖️`)
        }
    }
    if (!cat) return (
        <div className="p-20 text-center text-gray-500 dark:text-gray-400">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-lg font-semibold mb-4">Category not found.</p>
            <Link to="/" className="btn-primary px-6 py-2 rounded-xl">← Go Home</Link>
        </div>
    )
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-8">
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <h1 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="text-2xl">{cat.icon}</span>
                        {cat.name}
                        <span className="hidden sm:inline text-sm font-normal text-gray-400 ml-1">— {cat.desc}</span>
                    </h1>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                        {filtered.length} of {catProducts.length} products
                    </span>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-wrap gap-2 items-center justify-between mb-6 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex gap-1.5 flex-wrap">
                        {FILTERS.map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${filter === f ? 'bg-amber-400 text-gray-900' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-600'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 whitespace-nowrap">Max:</span>
                            <input type="range" className="w-24 accent-amber-400" min={0} max={maxPrice} step={100}
                                value={effectiveMax} onChange={e => setPriceMax(Number(e.target.value))} />
                            <span className="text-xs font-bold text-amber-500 whitespace-nowrap min-w-[60px]">{formatPrice(effectiveMax)}</span>
                        </div>
                        <select value={sort} onChange={e => setSort(e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium outline-none focus:border-amber-400">
                            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        <span className="text-xs text-gray-400">{filtered.length} items</span>
                    </div>
                </div>
                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <div className="text-5xl mb-4">😕</div>
                        <p className="text-lg font-medium mb-4">No products match your filters.</p>
                        <button onClick={() => { setFilter('All'); setPriceMax(null) }} className="btn-primary px-6 py-2 rounded-lg text-sm">Reset Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filtered.map(p => (
                            <ProductCard key={p.id} product={p} onQuickView={setQuickProduct} showCompare onCompare={handleCompare} />
                        ))}
                    </div>
                )}
            </div>
            {compareList.length > 0 && (
                <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-gray-900 text-white px-4 py-3 z-40 shadow-2xl border-t border-white/10">
                    <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-bold text-amber-400 flex-shrink-0">⚖️ Compare</span>
                        <div className="flex gap-2 flex-1 flex-wrap">
                            {compareList.map(p => (
                                <div key={p.id} className="bg-white/10 rounded-lg px-3 py-1 flex items-center gap-2 text-sm">
                                    <span className="truncate max-w-[100px] font-medium">{p.name}</span>
                                    <button onClick={() => setCompareList(c => c.filter(x => x.id !== p.id))} className="text-white/60 hover:text-white">✕</button>
                                </div>
                            ))}
                        </div>
                        {compareList.length >= 2 && (
                            <Link to="/compare" onClick={() => localStorage.setItem('compareList', JSON.stringify(compareList))}
                                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-4 py-1.5 rounded-lg text-sm transition-colors">Compare →</Link>
                        )}
                        <button onClick={() => setCompareList([])} className="text-white/50 hover:text-white text-sm px-3 py-1.5 border border-white/20 rounded-lg">Clear</button>
                    </div>
                </div>
            )}
            {quickProduct && <QuickViewModal product={quickProduct} onClose={() => setQuickProduct(null)} />}
        </div>
    )
}
