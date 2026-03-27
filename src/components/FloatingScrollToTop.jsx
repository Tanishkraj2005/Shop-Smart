import { useState, useEffect } from 'react'
export default function FloatingScrollToTop() {
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const toggleVisible = () => setVisible(window.scrollY > 500)
        window.addEventListener('scroll', toggleVisible)
        return () => window.removeEventListener('scroll', toggleVisible)
    }, [])
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    if (!visible) return null
    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-44 md:bottom-32 right-4 z-[7900] bg-gray-900 border border-white/10 text-white w-12 h-12 rounded-2xl shadow-2xl flex items-center justify-center hover:bg-amber-400 hover:text-gray-900 transition-all duration-300 group hover:-translate-y-1 active:scale-95"
            aria-label="Scroll to top"
        >
            <span className="text-xl group-hover:scale-125 transition-transform duration-300">↑</span>
        </button>
    )
}
