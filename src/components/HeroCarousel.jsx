import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CAROUSEL_SLIDES } from '../data/products'
export default function HeroCarousel() {
    const [current, setCurrent] = useState(0)
    useEffect(() => {
        const timer = setInterval(() => setCurrent(c => (c + 1) % CAROUSEL_SLIDES.length), 4500)
        return () => clearInterval(timer)
    }, [])
    const goTo = (i) => setCurrent(i)
    const move = (dir) => setCurrent(c => (c + dir + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)
    const SLIDE_STYLES = [
        {
            bg: 'bg-[#0f0c29]',
            orb1: 'bg-violet-600/60 w-96 h-96 -top-20 -left-20',
            orb2: 'bg-rose-500/50 w-80 h-80 -bottom-10 right-10',
            orb3: 'bg-purple-400/30 w-64 h-64 top-10 right-1/3',
            accent: 'from-violet-500 via-fuchsia-500 to-rose-500',
            mesh: 'radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(244,63,94,0.35) 0%, transparent 55%), radial-gradient(ellipse at 60% 85%, rgba(168,85,247,0.3) 0%, transparent 50%)',
            ring1: 'border-violet-400/20 w-[600px] h-[600px] -top-40 -left-32',
            ring2: 'border-rose-400/15 w-[400px] h-[400px] bottom-0 right-0',
        },
        {
            bg: 'bg-[#1a0a00]',
            orb1: 'bg-orange-500/60 w-96 h-96 -top-24 right-10',
            orb2: 'bg-amber-400/50 w-72 h-72 bottom-0 -left-10',
            orb3: 'bg-yellow-300/25 w-56 h-56 top-1/4 left-1/3',
            accent: 'from-orange-500 via-amber-400 to-yellow-300',
            mesh: 'radial-gradient(ellipse at 75% 30%, rgba(249,115,22,0.5) 0%, transparent 55%), radial-gradient(ellipse at 20% 70%, rgba(251,191,36,0.4) 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, rgba(234,179,8,0.2) 0%, transparent 60%)',
            ring1: 'border-amber-400/20 w-[550px] h-[550px] -top-28 -right-28',
            ring2: 'border-orange-400/15 w-[350px] h-[350px] bottom-4 left-4',
        },
        {
            bg: 'bg-[#020617]',
            orb1: 'bg-blue-600/55 w-96 h-96 -top-16 -right-16',
            orb2: 'bg-cyan-500/45 w-80 h-80 bottom-0 left-5',
            orb3: 'bg-indigo-400/30 w-56 h-56 top-1/3 right-1/3',
            accent: 'from-blue-600 via-cyan-500 to-teal-400',
            mesh: 'radial-gradient(ellipse at 80% 20%, rgba(37,99,235,0.5) 0%, transparent 55%), radial-gradient(ellipse at 15% 80%, rgba(6,182,212,0.4) 0%, transparent 55%), radial-gradient(ellipse at 55% 45%, rgba(99,102,241,0.25) 0%, transparent 60%)',
            ring1: 'border-blue-400/20 w-[600px] h-[600px] -bottom-32 -right-32',
            ring2: 'border-cyan-400/15 w-[380px] h-[380px] top-2 left-2',
        },
        {
            bg: 'bg-[#011209]',
            orb1: 'bg-emerald-500/55 w-96 h-96 -top-20 left-10',
            orb2: 'bg-teal-400/45 w-72 h-72 bottom-0 right-6',
            orb3: 'bg-green-300/25 w-60 h-60 top-1/3 right-1/4',
            accent: 'from-emerald-500 via-teal-400 to-cyan-300',
            mesh: 'radial-gradient(ellipse at 25% 30%, rgba(16,185,129,0.5) 0%, transparent 55%), radial-gradient(ellipse at 75% 75%, rgba(20,184,166,0.4) 0%, transparent 55%), radial-gradient(ellipse at 50% 55%, rgba(52,211,153,0.25) 0%, transparent 60%)',
            ring1: 'border-emerald-400/20 w-[580px] h-[580px] -top-28 -left-28',
            ring2: 'border-teal-400/15 w-[370px] h-[370px] bottom-0 right-0',
        },
    ]
    return (
        <div className="relative overflow-hidden">
            <div className="carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
                {CAROUSEL_SLIDES.map((s, i) => {
                    const st = SLIDE_STYLES[i] || SLIDE_STYLES[0]
                    return (
                        <div
                            key={i}
                            className={`carousel-slide ${st.bg} min-h-[420px] md:min-h-[520px] flex items-center justify-center text-white text-center relative overflow-hidden`}
                        >
                            <div className="absolute inset-0" style={{ background: st.mesh }} />
                            <div className={`absolute rounded-full blur-3xl ${st.orb1} animate-pulse`} style={{ animationDuration: '4s' }} />
                            <div className={`absolute rounded-full blur-3xl ${st.orb2} animate-pulse`} style={{ animationDuration: '6s', animationDelay: '1s' }} />
                            <div className={`absolute rounded-full blur-2xl ${st.orb3} animate-pulse`} style={{ animationDuration: '5s', animationDelay: '2s' }} />
                            <div className={`absolute rounded-full border ${st.ring1} opacity-100`} />
                            <div className={`absolute rounded-full border ${st.ring2} opacity-100`} />
                            <div className="absolute inset-0 opacity-[0.04]"
                                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
                            />
                            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${st.accent} opacity-60`} />
                            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${st.accent} opacity-60`} />
                            <div className="relative z-10 max-w-2xl mx-auto px-8 py-12">
                                <div className="inline-flex items-center gap-2 mb-5">
                                    <div className={`h-px w-8 bg-gradient-to-r ${st.accent} opacity-80`} />
                                    <span className={`text-xs font-bold uppercase tracking-[0.25em] bg-gradient-to-r ${st.accent} bg-clip-text text-transparent`}>
                                        {s.badge1}
                                    </span>
                                    <div className={`h-px w-8 bg-gradient-to-r ${st.accent} opacity-80`} />
                                </div>
                                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight text-white drop-shadow-[0_2px_30px_rgba(255,255,255,0.2)]">
                                    {s.title}
                                </h1>
                                <p className="text-base md:text-lg mb-8 text-white/70 font-light max-w-lg mx-auto">
                                    {s.subtitle}
                                </p>
                                <div className="flex justify-center gap-3 flex-wrap mb-8">
                                    {[s.badge1, s.badge2].map(b => (
                                        <span key={b}
                                            className="bg-white/10 backdrop-blur-md border border-white/20 text-white/90 rounded-full px-4 py-1.5 text-sm font-medium shadow-inner">
                                            {b}
                                        </span>
                                    ))}
                                </div>
                                <Link to={s.href}
                                    className="inline-flex items-center gap-2 bg-white text-gray-900 font-extrabold text-base md:text-lg px-8 md:px-10 py-3.5 md:py-4 rounded-full shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-white/20 group">
                                    {s.btn}
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </Link>
                            </div>
                            <div className="absolute top-8 right-8 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm rotate-12 hidden md:block" />
                            <div className="absolute bottom-12 left-12 w-10 h-10 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm -rotate-12 hidden md:block" />
                            <div className="absolute top-1/3 right-16 w-6 h-6 rounded-full bg-white/15 hidden md:block" />
                            <div className="absolute bottom-1/3 left-20 w-4 h-4 rounded-full bg-white/15 hidden md:block" />
                        </div>
                    )
                })}
            </div>
            <button onClick={() => move(-1)}
                className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 border border-white/20 backdrop-blur-md text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl transition-all duration-200 hover:scale-110 shadow-lg">
                ‹
            </button>
            <button onClick={() => move(1)}
                className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 border border-white/20 backdrop-blur-md text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl transition-all duration-200 hover:scale-110 shadow-lg">
                ›
            </button>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 items-center">
                {CAROUSEL_SLIDES.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)}
                        className={`rounded-full transition-all duration-300 ${i === current ? 'bg-white w-7 h-2.5' : 'bg-white/40 hover:bg-white/60 w-2.5 h-2.5'}`} />
                ))}
            </div>
        </div>
    )
}
