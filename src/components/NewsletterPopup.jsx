import { useState, useEffect } from 'react'
export default function NewsletterPopup() {
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState('')
    const [done, setDone] = useState(false)
    useEffect(() => {
        if (localStorage.getItem('nlDone')) return
        const timer = setTimeout(() => setOpen(true), 6000)
        return () => clearTimeout(timer)
    }, [])
    const dismiss = () => { setOpen(false); localStorage.setItem('nlDone', '1') }
    const subscribe = () => {
        if (!email.includes('@')) return
        setDone(true)
        localStorage.setItem('nlDone', '1')
        setTimeout(dismiss, 2500)
    }
    if (!open) return null
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990] flex items-center justify-center p-4" onClick={dismiss}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
                <button onClick={dismiss} className="absolute top-3 right-3 z-10 bg-white/30 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50 transition-colors">✕</button>
                <div className="bg-gradient-to-br from-purple-600 to-violet-700 p-8 text-center text-white relative">
                    <div className="text-5xl mb-3">🎁</div>
                    <h2 className="text-2xl font-extrabold mb-2">Get 10% OFF!</h2>
                    <p className="opacity-90 text-sm">Join 50,000+ smart shoppers. Get exclusive deals.</p>
                </div>
                <div className="p-6">
                    {done ? (
                        <div className="text-center py-4">
                            <div className="text-4xl mb-3">🎉</div>
                            <p className="font-bold text-green-600 text-lg">You're subscribed!</p>
                            <p className="text-gray-500 text-sm mt-1">Use code <strong className="text-amber-500">NEW10</strong> for 10% off</p>
                        </div>
                    ) : (
                        <>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email"
                                className="input mb-3" onKeyDown={e => e.key === 'Enter' && subscribe()} />
                            <button onClick={subscribe} className="w-full btn-primary py-3 rounded-xl text-base">
                                Subscribe & Get 10% OFF 🎉
                            </button>
                            <button onClick={dismiss} className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                                No thanks, I prefer paying full price
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
