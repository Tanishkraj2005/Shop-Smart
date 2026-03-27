import { createContext, useContext, useState, useEffect } from 'react'
const CartContext = createContext()
export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try { return JSON.parse(localStorage.getItem('cart')) || [] }
        catch { return [] }
    })
    useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)) }, [cart])
    const addToCart = (product, qty = 1) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id)
            if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
            return [...prev, { ...product, qty }]
        })
    }
    const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))
    const updateQty = (id, qty) => {
        if (qty < 1) return removeFromCart(id)
        setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
    }
    const clearCart = () => setCart([])
    const cartCount = cart.reduce((s, i) => s + i.qty, 0)
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
    const shipping = subtotal > 999 ? 0 : 59
    const tax = Math.round(subtotal * 0.18)
    const total = subtotal + shipping + tax
    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, subtotal, shipping, tax, total }}>
            {children}
        </CartContext.Provider>
    )
}
export const useCart = () => useContext(CartContext)
