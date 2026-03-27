import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useCurrency } from '../context/CurrencyContext'
import { products, toSlug, getSearchText } from '../data/products'
import { Home, Smartphone, Shirt, Armchair, Dumbbell, Sparkles, Book, Scale, Package, Search, Sun, Moon, Heart, ShoppingCart, User, LogOut, Key, Settings, X, PackageOpen, Clock } from 'lucide-react'

const CATEGORIES = [
    { label: 'Home', path: '/', icon: <Home size={16} /> },
    { label: 'Electronics', path: '/electronics', icon: <Smartphone size={16} /> },
    { label: 'Fashion', path: '/fashion', icon: <Shirt size={16} /> },
    { label: 'Home & Living', path: '/home', icon: <Armchair size={16} /> },
    { label: 'Sports', path: '/sports', icon: <Dumbbell size={16} /> },
    { label: 'Beauty', path: '/beauty', icon: <Sparkles size={16} /> },
    { label: 'Books', path: '/books', icon: <Book size={16} /> },
    { label: 'Compare', path: '/compare', icon: <Scale size={16} /> },
    { label: 'Orders', path: '/orders', icon: <Package size={16} /> },
]

export default function Navbar() {
    const { cartCount } = useCart()
    const { wishlistCount } = useWishlist()
    const { user, logout } = useAuth()
    const { dark, toggleTheme } = useTheme()
    const { currency, changeCurrency, CURRENCIES } = useCurrency()

    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [showSugg, setShowSugg] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [mobileMenu, setMobileMenu] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()
    const searchRef = useRef()
    const menuRef = useRef()

    useEffect(() => {
        const h = e => { if (!searchRef.current?.contains(e.target)) setShowSugg(false) }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [])

    useEffect(() => {
        const h = e => { if (!menuRef.current?.contains(e.target)) setMenuOpen(false) }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [])

    useEffect(() => { setMenuOpen(false); setMobileMenu(false) }, [location.pathname])

    const handleSearch = q => {
        if (!q.trim()) return
        const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
        localStorage.setItem('recentSearches', JSON.stringify([q, ...recent.filter(s => s !== q)].slice(0, 5)))
        navigate(`/search?q=${encodeURIComponent(q)}`)
        setShowSugg(false); setQuery('')
    }

    const handleInput = v => {
        setQuery(v)
        if (v.length > 1) {
            const terms = v.toLowerCase().trim().split(/\s+/)
            setSuggestions(products.filter(p => {
                const text = getSearchText(p)
                return terms.every(t => text.includes(t))
            }).slice(0, 6))
            setShowSugg(true)
        } else {
            const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
            setSuggestions([]); setShowSugg(recent.length > 0)
        }
    }

    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]')

    return (
        <>
            
            <div className="sticky top-0 z-50 shadow-xl">
                <nav className="bg-gray-900 text-white">

                    <div className="max-w-7xl mx-auto px-4 h-14 grid grid-cols-[auto_1fr_auto] items-center gap-4">

                        <div className="flex items-center gap-2">
                            <button className="lg:hidden flex flex-col justify-center gap-1 w-6 h-6"
                                onClick={() => setMobileMenu(o => !o)} aria-label="Menu">
                                <span className={`block h-0.5 bg-white rounded transition-all duration-300 origin-center ${mobileMenu ? 'rotate-45 translate-y-[6px]' : ''}`} />
                                <span className={`block h-0.5 bg-white rounded transition-all duration-200 ${mobileMenu ? 'opacity-0 scale-x-0' : ''}`} />
                                <span className={`block h-0.5 bg-white rounded transition-all duration-300 origin-center ${mobileMenu ? '-rotate-45 -translate-y-[6px]' : ''}`} />
                            </button>
                            <Link to="/" className="text-base font-extrabold tracking-tight whitespace-nowrap">
                                Shop<span className="text-amber-400">Smart</span>
                            </Link>
                        </div>

                        <div className="hidden sm:flex justify-center">
                            <div className="relative w-full max-w-xs" ref={searchRef}>
                                <div className="flex rounded-lg overflow-hidden border border-white/15 focus-within:border-amber-400/70 transition-colors items-stretch bg-white/10">
                                    <input
                                        type="text" value={query}
                                        placeholder="Search products..."
                                        className="flex-1 px-3 py-1.5 bg-transparent text-white placeholder-white/40 outline-none text-sm min-w-0"
                                        onChange={e => handleInput(e.target.value)}
                                        onFocus={() => { if (!query) setShowSugg(recentSearches.length > 0) }}
                                        onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
                                    />
                                    {query && (
                                        <button onClick={() => { setQuery(''); setShowSugg(false); searchRef.current?.querySelector('input')?.focus() }}
                                            className="px-2 text-white/40 hover:text-white flex items-center justify-center">
                                            <X size={14} />
                                        </button>
                                    )}
                                    <button onClick={() => handleSearch(query)}
                                        className="bg-amber-400 hover:bg-amber-500 px-3 text-gray-900 transition-colors flex-shrink-0 flex items-center justify-center">
                                        <Search size={16} strokeWidth={3} />
                                    </button>
                                </div>

                                {showSugg && (
                                    <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mt-1 shadow-2xl z-[999] overflow-hidden">
                                        {suggestions.length > 0 ? suggestions.map(p => (
                                            <div key={p.id}
                                                className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3"
                                                onClick={() => { navigate(`/product/${toSlug(p.name)}`); setShowSugg(false); setQuery('') }}>
                                                <img src={p.img} alt={p.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                                                <span className="text-sm text-gray-800 dark:text-gray-200 flex-1 truncate">{p.name}</span>
                                                <span className="text-xs text-amber-500 font-bold flex-shrink-0">₹{p.price.toLocaleString('en-IN')}</span>
                                            </div>
                                        )) : recentSearches.length > 0 && (
                                            <div>
                                                <p className="text-xs text-gray-400 px-4 py-2 border-b border-gray-100 dark:border-gray-700">Recent Searches</p>
                                                {recentSearches.map(s => (
                                                    <div key={s}
                                                        className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
                                                        onClick={() => { setQuery(s); handleSearch(s) }}>
                                                        <Clock size={14} className="text-gray-400" /> {s}
                                                    </div>
                                                ))}
                                                <button className="w-full text-right px-4 py-2 text-xs text-amber-500 border-t border-gray-100 dark:border-gray-700"
                                                    onClick={() => { localStorage.removeItem('recentSearches'); setShowSugg(false) }}>
                                                    Clear all
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            
                            <select value={currency} onChange={e => changeCurrency(e.target.value)}
                                className="hidden lg:block bg-transparent text-white text-xs font-semibold px-1.5 py-1.5 rounded-lg border border-white/20 outline-none cursor-pointer hover:bg-white/10 transition-colors">
                                {Object.entries(CURRENCIES).map(([code, c]) => (
                                    <option key={code} value={code} className="bg-gray-800 text-white">{c.flag} {code}</option>
                                ))}
                            </select>

                            <button onClick={toggleTheme}
                                className="hover:bg-white/10 p-2 rounded-lg transition-colors flex items-center justify-center" title="Toggle Theme">
                                {dark ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            <Link to="/wishlist" className="relative hover:bg-white/10 p-2 rounded-lg transition-colors flex items-center justify-center">
                                <Heart size={18} />
                                {wishlistCount > 0 && (
                                    <span className="absolute top-0.5 right-0.5 bg-amber-400 text-gray-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            <Link to="/cart" className="relative hover:bg-white/10 p-2 rounded-lg transition-colors flex items-center justify-center">
                                <ShoppingCart size={18} />
                                {cartCount > 0 && (
                                    <span className="absolute top-0.5 right-0.5 bg-amber-400 text-gray-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <div className="relative" ref={menuRef}>
                                <button onClick={() => setMenuOpen(o => !o)}
                                    className="hover:bg-white/10 px-2 py-2 rounded-lg text-sm transition-colors flex items-center gap-1">
                                    <User size={18} />
                                    <span className="hidden md:block text-xs max-w-[60px] truncate">
                                        {user ? user.name?.split(' ')[0] : 'Account'}
                                    </span>
                                    <span className="hidden md:block text-white/40 text-xs">▾</span>
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[200]">
                                        {user ? (
                                            <>
                                                <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-700 border-b border-gray-100 dark:border-gray-600">
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                                </div>
                                                <Link to="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"><PackageOpen size={16} className="text-gray-400" /> My Orders</Link>
                                                <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"><Heart size={16} className="text-gray-400" /> Wishlist</Link>
                                                <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"><Settings size={16} className="text-gray-400" /> Admin Panel</Link>
                                                <button onClick={() => { logout(); setMenuOpen(false) }}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
                                                    <LogOut size={16} /> Logout
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold"><Key size={16} className="text-gray-400" /> Login</Link>
                                                <Link to="/signup" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold"><Sparkles size={16} className="text-gray-400" /> Sign Up Free</Link>
                                                <div className="border-t border-gray-100 dark:border-gray-600 mx-4" />
                                                <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-xs text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"><Settings size={16} /> Admin Panel</Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="sm:hidden px-4 pb-3">
                        <div className="flex rounded-lg overflow-hidden border border-white/15 bg-white/10 items-stretch">
                            <input type="text" value={query} placeholder="Search products..."
                                className="flex-1 px-3 py-2 bg-transparent text-white placeholder-white/40 outline-none text-sm"
                                onChange={e => handleInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch(query)} />
                            {query && (
                                <button onClick={() => setQuery('')} className="px-2 text-white/40 hover:text-white flex items-center justify-center">
                                    <X size={16} />
                                </button>
                            )}
                            <button onClick={() => handleSearch(query)}
                                className="bg-amber-400 px-4 text-gray-900 flex items-center justify-center">
                                <Search size={16} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    {mobileMenu && (
                        <div className="lg:hidden bg-gray-800 border-t border-white/10 px-4 pb-4 pt-2 flex flex-col gap-1">
                            {CATEGORIES.map(c => (
                                <Link key={c.path} to={c.path} onClick={() => setMobileMenu(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${location.pathname === c.path ? 'bg-amber-400 text-gray-900' : 'text-white/80 hover:bg-white/10'}`}>
                                    <span className="flex-shrink-0 text-white/70">{c.icon}</span>{c.label}
                                </Link>
                            ))}
                            
                            <div className="mt-2 border-t border-white/10 pt-3">
                                <p className="text-xs text-white/40 mb-2 px-3">Currency</p>
                                <div className="flex flex-wrap gap-2 px-3">
                                    {Object.entries(CURRENCIES).map(([code, c]) => (
                                        <button key={code} onClick={() => { changeCurrency(code); setMobileMenu(false) }}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${currency === code ? 'bg-amber-400 text-gray-900' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                                            {c.flag} {code}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </nav>

                <div className="hidden lg:block bg-gray-800 border-t border-white/10 overflow-x-auto scrollbar-hide">
                    <div className="max-w-7xl mx-auto flex justify-center">
                        {CATEGORIES.map(c => (
                            <Link key={c.path} to={c.path}
                                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${location.pathname === c.path ? 'text-white border-amber-400' : 'text-white/60 border-transparent hover:text-white hover:border-amber-400/40'}`}>
                                {c.icon} {c.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
