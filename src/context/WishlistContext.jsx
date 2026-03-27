import { createContext, useContext, useState, useEffect } from 'react'
const WishlistContext = createContext()
export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState(() => {
        try { return JSON.parse(localStorage.getItem('wishlist')) || [] }
        catch { return [] }
    })
    useEffect(() => { localStorage.setItem('wishlist', JSON.stringify(wishlist)) }, [wishlist])
    const toggleWishlist = (product) => {
        setWishlist(prev =>
            prev.find(i => i.id === product.id)
                ? prev.filter(i => i.id !== product.id)
                : [...prev, product]
        )
    }
    const isWishlisted = (id) => wishlist.some(i => i.id === id)
    const wishlistCount = wishlist.length
    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, wishlistCount }}>
            {children}
        </WishlistContext.Provider>
    )
}
export const useWishlist = () => useContext(WishlistContext)
