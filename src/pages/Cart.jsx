import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useNotification } from '../components/Notification'
import { useCurrency } from '../context/CurrencyContext'
import { VALID_COUPONS } from '../data/products'
import usePageTitle from '../hooks/usePageTitle'
import { ShoppingCart, Tag, CheckCircle, Lock, RefreshCw } from 'lucide-react'
export default function Cart() {
    usePageTitle('My Shopping Cart')
    const { cart, removeFromCart, updateQty, subtotal, shipping, tax, total } = useCart()
    const { notify } = useNotification()
    const navigate = useNavigate()
    const { formatPrice } = useCurrency()
    const [coupon, setCoupon] = useState('')
    const [appliedCoupon, setApplied] = useState(null)
    const [couponErr, setCouponErr] = useState('')
    const discountAmt = appliedCoupon ? Math.round(subtotal * appliedCoupon.pct / 100) : 0
    const finalTotal = total - discountAmt
    const applyCoupon = () => {
        const pct = VALID_COUPONS[coupon.toUpperCase()]
        if (pct) {
            setApplied({ code: coupon.toUpperCase(), pct })
            setCouponErr('')
            notify(`Coupon "${coupon.toUpperCase()}" applied — ${pct}% OFF! 🎉`)
        } else {
            setCouponErr('Invalid coupon code. Try: SMART50, SAVE20, NEW10')
            setApplied(null)
        }
    }
    if (cart.length === 0) return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-6 dark:bg-gray-950 px-4">
            <ShoppingCart size={80} className="text-gray-300 dark:text-gray-700" />
            <h2 className="text-2xl font-extrabold text-gray-700 dark:text-white">Your cart is empty!</h2>
            <p className="text-gray-400">Add some products and come back.</p>
            <Link to="/" className="btn-primary px-8 py-3 rounded-xl">Start Shopping →</Link>
        </div>
    )
    return (
        <div className="min-h-screen dark:bg-gray-950 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                    <ShoppingCart size={32} /> Shopping Cart
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="card p-4 flex gap-4">
                                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                                    <img src={item.img} alt={item.name} className="w-20 h-20 object-cover rounded-xl" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=100&h=100&fit=crop'; e.target.onerror = null }} />
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link to={`/product/${item.id}`}><h3 className="font-bold text-gray-900 dark:text-white mb-1 hover:text-amber-500 truncate">{item.name}</h3></Link>
                                    <p className="text-amber-500 font-extrabold text-lg">{formatPrice(item.price)}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                                            <button onClick={() => { updateQty(item.id, item.qty - 1); if (item.qty <= 1) notify(`${item.name} removed`, 'warning') }} className="w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-lg">-</button>
                                            <span className="w-10 text-center font-bold">{item.qty}</span>
                                            <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-lg">+</button>
                                        </div>
                                        <span className="text-gray-400 text-sm">{formatPrice(item.price * item.qty)}</span>
                                        <button onClick={() => { removeFromCart(item.id); notify(`${item.name} removed`, 'warning') }} className="ml-auto text-red-400 hover:text-red-600 text-sm font-medium hover:underline transition-colors">Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="card p-6 sticky top-24">
                            <h2 className="font-extrabold text-xl text-gray-900 dark:text-white mb-5">Order Summary</h2>
                            <div className="border-2 border-dashed border-amber-400 rounded-xl p-4 mb-4 bg-amber-50/50 dark:bg-amber-900/10">
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Tag size={16} /> Have a Coupon?
                                </p>
                                <div className="flex gap-2">
                                    <input type="text" value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="SMART50"
                                        className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm font-mono outline-none focus:border-amber-400"
                                        onKeyDown={e => e.key === 'Enter' && applyCoupon()} />
                                    <button onClick={applyCoupon} className="btn-primary px-4 py-2 rounded-lg text-sm">Apply</button>
                                </div>
                                {appliedCoupon && <p className="text-green-600 text-xs mt-1.5 font-semibold flex items-center gap-1">
                                    <CheckCircle size={14} /> {appliedCoupon.pct}% off applied!
                                </p>}
                                {couponErr && <p className="text-red-500 text-xs mt-1.5">{couponErr}</p>}
                                <p className="text-xs text-gray-400 mt-2">Try: SMART50, SAVE20, NEW10, FIRST30</p>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Shipping</span><span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>GST (18%)</span><span className="font-semibold">{formatPrice(tax)}</span></div>
                                {discountAmt > 0 && <div className="flex justify-between text-green-600 font-semibold"><span>Coupon ({appliedCoupon.code})</span><span>-{formatPrice(discountAmt)}</span></div>}
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 flex justify-between items-center">
                                <span className="font-extrabold text-gray-900 dark:text-white text-lg">Total</span>
                                <span className="font-extrabold text-amber-500 text-2xl">{formatPrice(finalTotal)}</span>
                            </div>
                            {subtotal < 999 && <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Add {formatPrice(999 - subtotal)} more for free shipping!</p>}
                            <button onClick={() => navigate('/checkout', { state: { coupon: appliedCoupon, discountAmt } })} className="btn-primary w-full py-4 rounded-xl mt-5 text-base">
                                Proceed to Checkout →
                            </button>
                            <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mt-4">
                                <span className="flex items-center gap-1"><Lock size={12} /> Secure</span>
                                <span className="flex items-center gap-1"><RefreshCw size={12} /> 7-day returns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
