import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import { products, getSearchText } from '../data/products'
import ProductCard from '../components/ProductCard'
import usePageTitle from '../hooks/usePageTitle'
export default function Search() {
    const [params] = useSearchParams()
    const q = params.get('q') || ''
    usePageTitle(q ? `Search results for "${q}"` : 'Search Products')
    const results = useMemo(() => {
        if (!q.trim()) return []
        const terms = q.toLowerCase().trim().split(/\s+/)
        return products.filter(p => {
            const text = getSearchText(p)
            return terms.every(term => text.includes(term))
        })
    }, [q])
    return (
        <div className="min-h-screen dark:bg-gray-950 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                    🔍 Search Results for "<span className="text-amber-500">{q}</span>"
                </h1>
                <p className="text-gray-500 mb-8">{results.length} product{results.length !== 1 ? 's' : ''} found</p>
                {results.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="text-6xl mb-4">😕</div>
                        <p className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">No results for "{q}"</p>
                        <p className="text-gray-400">Try: iPhone, Samsung, Laptop, Shoes, Yoga Mat, Perfume...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {results.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                )}
            </div>
        </div>
    )
}
