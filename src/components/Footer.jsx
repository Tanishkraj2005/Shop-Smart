import { Link } from 'react-router-dom'
const CATEGORIES = [
    ['📱 Electronics', '/electronics'],
    ['👔 Fashion', '/fashion'],
    ['🏠 Home & Living', '/home'],
    ['⚽ Sports', '/sports'],
    ['💄 Beauty', '/beauty'],
    ['📚 Books', '/books'],
]
const ACCOUNT_LINKS = [
    ['My Orders', '/orders'],
    ['Wishlist', '/wishlist'],
    ['Cart', '/cart'],
    ['Login', '/login'],
    ['Sign Up', '/signup'],
    ['Admin Panel', '/admin'],
]
const POLICIES = [
    ['Privacy Policy', '#'],
    ['Terms of Service', '#'],
    ['Return Policy', '#'],
    ['Shipping Info', '#'],
]
const SOCIAL = [
    { icon: '📷', label: 'Instagram', href: 'https://www.instagram.com/shop_smart12/' },
    { icon: '🐦', label: 'Twitter', href: 'https://x.com/shop_smart12' },
    { icon: '📘', label: 'Facebook', href: '#' },
    { icon: '▶️', label: 'YouTube', href: '#' },
]
const TRUST = [
    { icon: '🔒', text: 'Secure Payments' },
    { icon: '🚚', text: 'Free Shipping ₹999+' },
    { icon: '🔄', text: 'Easy Returns' },
    { icon: '🛡️', text: '2-Year Warranty' },
    { icon: '📞', text: '24/7 Support' },
]
export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-400 mt-auto">
            <div className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-5">
                    <div className="flex flex-wrap justify-center md:justify-between gap-4">
                        {TRUST.map(({ icon, text }) => (
                            <div key={text} className="flex items-center gap-2 text-sm text-gray-300">
                                <span className="text-xl">{icon}</span>
                                <span className="font-medium">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 pt-14 pb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    <div className="lg:col-span-1">
                        <Link to="/" className="inline-block text-2xl font-extrabold text-white mb-4">
                            Shop<span className="text-amber-400">Smart</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-500 mb-6">
                            India's smartest e-commerce platform. 50+ premium products across 6 categories at the best prices.
                        </p>
                        <div className="flex gap-3">
                            {SOCIAL.map(({ icon, label, href }) => (
                                <a key={label} href={href} target="_blank" rel="noreferrer" title={label}
                                    className="w-9 h-9 bg-gray-800 hover:bg-amber-400 rounded-xl flex items-center justify-center text-sm transition-all duration-200 hover:scale-110">
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Categories</h4>
                        <ul className="space-y-3 text-sm">
                            {CATEGORIES.map(([label, href]) => (
                                <li key={href}>
                                    <Link to={href}
                                        className="hover:text-amber-400 transition-colors duration-150 flex items-center gap-1 group">
                                        <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-amber-400">›</span>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">My Account</h4>
                        <ul className="space-y-3 text-sm">
                            {ACCOUNT_LINKS.map(([label, href]) => (
                                <li key={href}>
                                    <Link to={href}
                                        className="hover:text-amber-400 transition-colors duration-150 flex items-center gap-1 group">
                                        <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-amber-400">›</span>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Contact Us</h4>
                        <ul className="space-y-3 text-sm mb-6">
                            <li className="flex items-center gap-2"><span>📧</span> support@shopsmart.in</li>
                            <li className="flex items-center gap-2"><span>📞</span> +91-9876543210</li>
                            <li className="flex items-center gap-2"><span>🕒</span> Mon–Sat, 9AM–8PM IST</li>
                            <li className="flex items-center gap-2"><span>📍</span> Mumbai, Maharashtra</li>
                        </ul>
                        <div>
                            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Get exclusive deals</p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="your@email.com"
                                    className="flex-1 bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-amber-400 placeholder-gray-600" />
                                <button className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-xs px-3 py-2.5 rounded-lg transition-colors">
                                    Go
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 pb-6">
                    <p className="text-xs text-gray-600 uppercase tracking-wider mb-3 font-medium">Trending Searches</p>
                    <div className="flex flex-wrap gap-2">
                        {['iPhone', 'Samsung Galaxy', 'Laptop', 'Yoga Mat', 'Skincare', 'Jeans', 'Perfume', 'Books', 'Earbuds', 'Running Shoes'].map(t => (
                            <Link key={t} to={`/search?q=${t}`}
                                className="bg-gray-800 hover:bg-gray-700 hover:text-amber-400 text-xs px-3 py-1.5 rounded-full transition-all duration-150 border border-gray-700 hover:border-amber-400/30">
                                {t}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                    <span>© 2025 ShopSmart Technologies Pvt. Ltd. · Made with ❤️ in India 🇮🇳</span>
                    <div className="flex flex-wrap gap-4">
                        {POLICIES.map(([label, href]) => (
                            <a key={label} href={href} className="hover:text-amber-400 transition-colors">{label}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
