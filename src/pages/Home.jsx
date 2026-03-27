import { useState } from 'react'
import { Link } from 'react-router-dom'
import HeroCarousel from '../components/HeroCarousel'
import FlashSaleTimer from '../components/FlashSaleTimer'
import ProductCard from '../components/ProductCard'
import QuickViewModal from '../components/QuickViewModal'
import NewsletterPopup from '../components/NewsletterPopup'
import { products, CATEGORY_META } from '../data/products'
import { useNotification } from '../components/Notification'
import { useCart } from '../context/CartContext'
import usePageTitle from '../hooks/usePageTitle'
const TABS = ['All', '⭐ Best Sellers', '✨ New Arrivals', '🏷️ On Sale']
export default function Home() {
    usePageTitle('Home — Best Deals on Electronics, Fashion & More')
    const [activeTab, setActiveTab] = useState('All')
    const [quickProduct, setQuickProduct] = useState(null)
    const [compareList, setCompareList] = useState([])
    const { notify } = useNotification()
    const { addToCart } = useCart()
    const getFiltered = () => {
        if (activeTab === '⭐ Best Sellers') return products.filter(p => p.badge === 'Best Seller').slice(0, 8)
        if (activeTab === '✨ New Arrivals') return products.filter(p => p.badge === 'New').slice(0, 8)
        if (activeTab === '🏷️ On Sale') return products.filter(p => p.badge === 'Sale').slice(0, 8)
        return products.slice(0, 8)
    }
    const handleCompare = (p) => {
        if (compareList.find(x => x.id === p.id)) {
            setCompareList(c => c.filter(x => x.id !== p.id))
        } else if (compareList.length >= 3) {
            notify('Max 3 products to compare!', 'warning')
        } else {
            setCompareList(c => [...c, p])
            notify(`${p.name} added to compare ⚖️`)
        }
    }
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <FlashSaleTimer />
            <HeroCarousel />
            <section className="py-14 max-w-7xl mx-auto px-4">
                <h2 className="section-title">Shop by Category</h2>
                <p className="section-subtitle">Explore 6 categories with 50+ curated products</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Object.entries(CATEGORY_META).map(([key, cat]) => (
                        <Link key={key} to={cat.path}
                            className="card flex flex-col items-center py-6 px-3 hover:border-amber-400 dark:hover:border-amber-400 text-center group hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all duration-300">
                            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white">{cat.name}</h3>
                            <p className="text-xs text-gray-400 mt-1">{cat.desc.split(',')[0]}</p>
                        </Link>
                    ))}
                </div>
            </section>
            <section className="py-8 pb-16 max-w-7xl mx-auto px-4">
                <h2 className="section-title">Featured Products</h2>
                <div className="flex justify-center mb-8">
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1.5 gap-1 flex-wrap justify-center">
                        {TABS.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === tab ? 'bg-amber-400 text-gray-900 shadow-md shadow-amber-200 dark:shadow-amber-900' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {getFiltered().map(p => (
                        <ProductCard key={p.id} product={p} onQuickView={setQuickProduct} showCompare onCompare={handleCompare} />
                    ))}
                </div>
                <div className="text-center mt-10">
                    <Link to="/electronics" className="btn-secondary inline-block rounded-xl px-8 py-4 text-base hover:-translate-y-1 transition-all">
                        Browse All Products →
                    </Link>
                </div>
            </section>
            {compareList.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white px-4 py-3 z-[8500] shadow-2xl animate-slide-up">
                    <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
                        <div className="flex gap-2 flex-1 flex-wrap">
                            {compareList.map(p => (
                                <div key={p.id} className="bg-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm">
                                    <span className="font-medium truncate max-w-[140px]">{p.name}</span>
                                    <button onClick={() => setCompareList(c => c.filter(x => x.id !== p.id))} className="text-white/50 hover:text-white">✕</button>
                                </div>
                            ))}
                        </div>
                        {compareList.length >= 2 && (
                            <Link to="/compare" onClick={() => localStorage.setItem('compareList', JSON.stringify(compareList))}
                                className="bg-amber-400 text-gray-900 font-bold px-5 py-2 rounded-lg text-sm transition-colors hover:bg-amber-500">
                                ⚖️ Compare
                            </Link>
                        )}
                        <button onClick={() => setCompareList([])} className="border border-white/30 text-white/70 hover:text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors">
                            Clear
                        </button>
                    </div>
                </div>
            )}
            {quickProduct && <QuickViewModal product={quickProduct} onClose={() => setQuickProduct(null)} />}
            <NewsletterPopup />
        </div>
    )
}
