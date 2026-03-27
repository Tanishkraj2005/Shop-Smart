import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../components/Notification'
import { useCurrency } from '../context/CurrencyContext'
import { db } from '../firebase/config'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import usePageTitle from '../hooks/usePageTitle'
import { Smartphone, CreditCard, Landmark, Banknote, PartyPopper, CheckCircle, ShoppingBag, Loader2, PackageOpen } from 'lucide-react'
const PAYMENT_METHODS = [
    { id: 'upi', label: 'UPI / Google Pay / PhonePe', icon: <Smartphone size={24} className="text-blue-500" /> },
    { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={24} className="text-purple-500" /> },
    { id: 'net', label: 'Net Banking', icon: <Landmark size={24} className="text-amber-500" /> },
    { id: 'cod', label: 'Cash on Delivery', icon: <Banknote size={24} className="text-emerald-500" /> },
]
export default function Checkout() {
    usePageTitle('Checkout')
    const { cart, subtotal, shipping, tax, total, clearCart } = useCart()
    const { user } = useAuth()
    const { notify } = useNotification()
    const { formatPrice } = useCurrency()
    const navigate = useNavigate()
    const { state } = useLocation()
    const { coupon, discountAmt } = state || { discountAmt: 0 }
    const finalTotal = total - discountAmt
    const [step, setStep] = useState(1)   
    const [payMethod, setPayMethod] = useState('upi')
    const [form, setForm] = useState({
        name: user?.name || '', email: user?.email || '',
        phone: '', address: '', city: '', state: '', pincode: ''
    })
    const [processing, setProcessing] = useState(false)
    const handleOrder = async () => {
        setProcessing(true)
        const order = {
            id: 'SS' + Date.now(),
            items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, img: i.img })),
            total: finalTotal, shipping, tax, subtotal, discount: discountAmt, coupon: coupon?.code || null,
            address: form,
            paymentMethod: payMethod,
            userId: user?.uid || user?.email || 'guest',
            status: 'Confirmed',
        }
        try {
            if (db) {
                await addDoc(collection(db, 'orders'), { ...order, createdAt: serverTimestamp() })
            } else {
                const orders = JSON.parse(localStorage.getItem('orders') || '[]')
                orders.unshift({ ...order, createdAt: new Date().toISOString() })
                localStorage.setItem('orders', JSON.stringify(orders))
            }
        } catch (e) {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]')
            orders.unshift({ ...order, createdAt: new Date().toISOString() })
            localStorage.setItem('orders', JSON.stringify(orders))
        }
        clearCart()
        setProcessing(false)
        setStep(3)
    }
    const handleShippingNext = () => {
        if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
            notify('Please fill all shipping fields', 'warning'); return
        }
        if (!/^\d{6}$/.test(form.pincode)) { notify('Enter a valid 6-digit pincode', 'warning'); return }
        if (!/^\d{10}$/.test(form.phone)) { notify('Enter a valid 10-digit phone number', 'warning'); return }
        setStep(2)
    }
    if (cart.length === 0 && step !== 3) { navigate('/cart'); return null }
    if (step === 3) return (
        <div className="min-h-screen flex items-center justify-center dark:bg-gray-950 p-8">
            <div className="max-w-lg w-full text-center">
                <PartyPopper size={80} className="mx-auto text-amber-500 mb-6 animate-bounce" />
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Order Placed!</h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                    Thank you, <span className="font-bold text-gray-800 dark:text-white">{form.name || user?.name || 'Customer'}</span>!
                </p>
                <p className="text-gray-400 mb-8">Your order is confirmed and will be delivered in 2–5 business days.</p>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 mb-6 text-left space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Order Total</span>
                        <span className="font-extrabold text-amber-500 text-xl">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Payment</span>
                        <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
                            {PAYMENT_METHODS.find(m => m.id === payMethod)?.icon} {PAYMENT_METHODS.find(m => m.id === payMethod)?.label}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Deliver to</span>
                        <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold text-right max-w-[200px]">
                            {form.address}, {form.city}, {form.state} — {form.pincode}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-green-200 dark:border-green-800">
                        <span className="text-gray-500 text-sm">Status</span>
                        <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <CheckCircle size={14} /> Confirmed
                        </span>
                    </div>
                </div>
                <div className="flex gap-3 justify-center flex-wrap mt-8">
                    <button onClick={() => navigate('/')} className="btn-primary px-8 py-3 rounded-xl flex items-center gap-2">
                        <ShoppingBag size={18} /> Continue Shopping
                    </button>
                    <button onClick={() => navigate('/orders')} className="btn-outline px-8 py-3 rounded-xl flex items-center gap-2">
                        <PackageOpen size={18} /> View My Orders
                    </button>
                </div>
            </div>
        </div>
    )
    return (
        <div className="min-h-screen dark:bg-gray-950 pb-24 md:pb-8">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">Secure Checkout</h1>
                <div className="flex items-center gap-2 mb-8 text-sm">
                    {['Shipping Info', 'Payment', 'Done'].map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${step > i ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-amber-400 text-gray-900' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                                {step > i ? '✓' : i + 1}
                            </div>
                            <span className={step === i + 1 ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-400 text-xs'}>
                                {s}
                            </span>
                            {i < 2 && <span className="text-gray-300 dark:text-gray-700 mx-1">—</span>}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {step === 1 && (
                            <div className="card p-6">
                                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><PackageOpen /> Shipping Details</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        ['Full Name', 'name', 'text'],
                                        ['Email', 'email', 'email'],
                                        ['Phone Number', 'phone', 'tel'],
                                        ['Full Address', 'address', 'text'],
                                    ].map(([label, key, type]) => (
                                        <div key={key} className={key === 'address' ? 'sm:col-span-2' : ''}>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                                            <input type={type} value={form[key]}
                                                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                                className="input" placeholder={
                                                    key === 'phone' ? '10-digit mobile number' :
                                                        key === 'address' ? 'House no., Street, Area' : ''
                                                } />
                                        </div>
                                    ))}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">City</label>
                                        <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="input" placeholder="Mumbai" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">State</label>
                                        <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} className="input">
                                            <option value="">Select State</option>
                                            {['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Pincode</label>
                                        <input type="text" value={form.pincode}
                                            onChange={e => setForm(f => ({ ...f, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                                            className="input" maxLength={6} placeholder="6-digit pincode" />
                                    </div>
                                </div>
                                <button onClick={handleShippingNext}
                                    className="btn-primary w-full py-3.5 rounded-xl mt-6 text-base font-bold">
                                    Continue to Payment →
                                </button>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="card p-6">
                                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><CreditCard /> Choose Payment Method</h2>
                                <div className="space-y-3 mb-6">
                                    {PAYMENT_METHODS.map(m => (
                                        <label key={m.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod === m.id ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'}`}>
                                            <input type="radio" name="pay" value={m.id} checked={payMethod === m.id} onChange={() => setPayMethod(m.id)} className="accent-amber-400" />
                                            <span className="flex-shrink-0">{m.icon}</span>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm">{m.label}</p>
                                                {m.id === 'cod' && <p className="text-xs text-gray-400 mt-0.5">Pay when your order arrives</p>}
                                                {m.id === 'upi' && <p className="text-xs text-gray-400 mt-0.5">Instant payment via UPI apps</p>}
                                                {m.id === 'card' && <p className="text-xs text-gray-400 mt-0.5">Visa, Mastercard, RuPay accepted</p>}
                                                {m.id === 'net' && <p className="text-xs text-gray-400 mt-0.5">All major banks supported</p>}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 mb-5 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                    🔒 Your order will be placed securely. Payment collected on delivery / via selected method.
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setStep(1)} className="btn-outline flex-1 py-3.5 rounded-xl font-semibold">← Back</button>
                                    <button onClick={handleOrder} disabled={processing}
                                        className="btn-primary flex-[2] py-3.5 rounded-xl text-base font-bold disabled:opacity-70">
                                        {processing
                                            ? <span className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" /> Placing Order...</span>
                                            : <span className="flex items-center justify-center gap-2"><CheckCircle size={18} /> Place Order · {formatPrice(finalTotal)}</span>
                                        }
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="card p-5 h-fit sticky top-24">
                        <h3 className="font-extrabold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <ShoppingBag /> Order Summary <span className="text-gray-400 text-sm font-normal">({cart.length} items)</span>
                        </h3>
                        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
                            {cart.map(i => (
                                <div key={i.id} className="flex gap-3 items-center">
                                    <img src={i.img} alt={i.name} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" onError={e => { e.target.style.display = 'none' }} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{i.name}</p>
                                        <p className="text-xs text-gray-400">× {i.qty}</p>
                                    </div>
                                    <span className="text-xs font-bold text-amber-500 flex-shrink-0">{formatPrice(i.price * i.qty)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                            <div className="flex justify-between text-gray-500"><span>Shipping</span><span className={shipping === 0 ? 'text-green-500 font-bold' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                            <div className="flex justify-between text-gray-500"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
                            {discountAmt > 0 && <div className="flex justify-between text-green-500 font-bold"><span>Coupon Discount</span><span>-{formatPrice(discountAmt)}</span></div>}
                            <div className="flex justify-between font-extrabold text-gray-900 dark:text-white text-base pt-2 border-t border-gray-100 dark:border-gray-700">
                                <span>Total</span><span className="text-amber-500">{formatPrice(finalTotal)}</span>
                            </div>
                        </div>
                        {shipping === 0 && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium text-center">🎉 You qualify for FREE shipping!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
