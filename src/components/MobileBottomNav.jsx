import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
export default function MobileBottomNav() {
    const { cartCount } = useCart()
    const location = useLocation()
    const path = location.pathname
    const items = [
        { icon: '🏠', label: 'Home', href: '/' },
        { icon: '📱', label: 'Shop', href: '/electronics' },
        { icon: '❤️', label: 'Wishlist', href: '/wishlist' },
        { icon: '🛒', label: 'Cart', href: '/cart', badge: cartCount },
        { icon: '👤', label: 'Account', href: '/login' },
    ]
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 shadow-2xl">
            <div className="flex">
                {items.map(item => (
                    <Link key={item.href} to={item.href}
                        className={`flex-1 flex flex-col items-center py-3 gap-0.5 relative transition-colors ${path === item.href ? 'text-amber-500' : 'text-gray-500 dark:text-gray-400 hover:text-amber-500'}`}>
                        <span className="text-xl leading-none">{item.icon}</span>
                        <span className="text-[10px] font-semibold">{item.label}</span>
                        {item.badge > 0 && (
                            <span className="absolute top-1.5 left-1/2 ml-1 bg-amber-400 text-gray-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                                {item.badge}
                            </span>
                        )}
                    </Link>
                ))}
            </div>
        </nav>
    )
}
