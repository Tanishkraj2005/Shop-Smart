import { createContext, useContext, useState } from 'react'
const CURRENCIES = {
    INR: { symbol: '₹', label: 'INR', rate: 1, flag: '🇮🇳' },
    USD: { symbol: '$', label: 'USD', rate: 0.012, flag: '🇺🇸' },
    EUR: { symbol: '€', label: 'EUR', rate: 0.011, flag: '🇪🇺' },
    GBP: { symbol: '£', label: 'GBP', rate: 0.0096, flag: '🇬🇧' },
    AED: { symbol: 'د.إ', label: 'AED', rate: 0.044, flag: '🇦🇪' },
}
const CurrencyContext = createContext()
export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'INR')
    const changeCurrency = (code) => {
        setCurrency(code)
        localStorage.setItem('currency', code)
    }
    const formatPrice = (inrPrice) => {
        const c = CURRENCIES[currency]
        const converted = inrPrice * c.rate
        const formatted = currency === 'INR'
            ? converted.toLocaleString('en-IN', { maximumFractionDigits: 0 })
            : converted.toLocaleString('en-US', { maximumFractionDigits: 2 })
        return `${c.symbol}${formatted}`
    }
    return (
        <CurrencyContext.Provider value={{ currency, changeCurrency, formatPrice, CURRENCIES }}>
            {children}
        </CurrencyContext.Provider>
    )
}
export const useCurrency = () => useContext(CurrencyContext)
