import { useState, useEffect } from 'react'
export default function FlashSaleTimer() {
    const [time, setTime] = useState({ h: '00', m: '00', s: '00' })
    useEffect(() => {
        const tick = () => {
            const now = new Date(), end = new Date(now)
            end.setHours(23, 59, 59, 0)
            const diff = Math.max(0, end - now)
            const pad = n => String(Math.floor(n)).padStart(2, '0')
            setTime({ h: pad(diff / 3600000), m: pad((diff % 3600000) / 60000), s: pad((diff % 60000) / 1000) })
        }
        tick(); const t = setInterval(tick, 1000); return () => clearInterval(t)
    }, [])
    return (
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap">
                <span className="font-bold text-sm md:text-base">⚡ FLASH SALE ENDS IN:</span>
                <div className="flex items-center gap-2">
                    {[['h', 'Hours'], ['m', 'Mins'], ['s', 'Secs']].map(([k, lbl], i) => (
                        <div key={k} className="flex items-center gap-2">
                            <div className="bg-black/30 rounded-lg px-3 py-1 text-center min-w-[50px]">
                                <div className="text-xl md:text-2xl font-black leading-tight">{time[k]}</div>
                                <div className="text-[10px] opacity-75 uppercase tracking-wide">{lbl}</div>
                            </div>
                            {i < 2 && <span className="text-2xl font-black opacity-70 animate-pulse">:</span>}
                        </div>
                    ))}
                </div>
                <a href="/electronics" className="bg-white text-red-600 font-bold text-sm px-4 py-2 rounded-full hover:bg-red-50 transition-colors">
                    Shop Now →
                </a>
            </div>
        </div>
    )
}
