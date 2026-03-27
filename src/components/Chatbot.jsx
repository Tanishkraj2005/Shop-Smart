import { useState, useRef, useEffect } from 'react'
import { products } from '../data/products'
const PRODUCT_CONTEXT = products.map(p =>
    `[${p.id}] ${p.name} | Category: ${p.cat} | Price: ₹${p.price.toLocaleString('en-IN')} | Rating: ${p.rating}/5 | ${p.rev.toLocaleString()} reviews | ${p.badge || ''} | ${p.desc}`
).join('\n')
const SYSTEM_PROMPT = `You are ShopBot, a helpful shopping assistant for Shop Smart — an Indian e-commerce platform.
You ONLY answer questions about the products listed below. Be concise, friendly, and use emojis occasionally.
If asked about something outside the product catalog, politely say you can only help with Shop Smart products.
PRODUCT CATALOG:
${PRODUCT_CONTEXT}
Guidelines:
- Recommend products based on budget, category, or use case
- Compare products when asked
- Mention prices in Indian Rupees (₹)
- Mention ratings and reviews to support recommendations
- Keep responses under 150 words unless comparing multiple products
- If user asks to add to cart, say they can click "Add to Cart" on the product page`
const QUICK_QUESTIONS = [
    '🔥 What are the best sellers?',
    '📱 Best phone under ₹50,000?',
    '💪 Fitness products?',
    '📚 Book recommendations?',
    '👗 Fashion under ₹3,000?',
]
export default function Chatbot() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hi! I'm ShopBot 🤖 Ask me anything about our products — prices, recommendations, comparisons, and more!" }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [apiKey, setApiKey] = useState(localStorage.getItem('geminiKey') || 'AIzaSyAre95drZvKDOcJ8smI-uFlk56dIFc61F4')
    const [showKeyInput, setShowKeyInput] = useState(false)
    const [unread, setUnread] = useState(0)
    const bottomRef = useRef()
    const inputRef = useRef()
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])
    useEffect(() => {
        if (!open && messages.length > 1) setUnread(u => u + 1)
    }, [messages])
    const saveKey = () => {
        localStorage.setItem('geminiKey', apiKey)
        setShowKeyInput(false)
    }
    const sendMessage = async (text) => {
        const q = text || input.trim()
        if (!q) return
        if (!apiKey) {
            setShowKeyInput(true)
            setMessages(prev => [...prev, { role: 'assistant', text: "Please enter your free Gemini API key in the settings (⚙️ Key) above to start chatting with me!" }])
            return 
        }
        setMessages(prev => [...prev, { role: 'user', text: q }])
        setInput('')
        setLoading(true)
        try {
            const history = messages.slice(1).map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.text }]
            }))
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                        contents: [
                            ...history,
                            { role: 'user', parts: [{ text: q }] }
                        ],
                        generationConfig: { maxOutputTokens: 512, temperature: 0.7 }
                    })
                }
            )
            const data = await res.json()
            if (data.error) throw new Error(data.error.message)
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not understand that. Try again!'
            setMessages(prev => [...prev, { role: 'assistant', text: reply }])
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', text: `❌ Error: ${e.message}. Please check your Gemini API key.` }])
        }
        setLoading(false)
    }
    return (
        <>
            <button
                onClick={() => { setOpen(o => !o); setUnread(0) }}
                className="fixed bottom-28 md:bottom-14 right-4 z-[8000] bg-gradient-to-br from-violet-600 to-purple-700 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 hover:shadow-purple-400/40"
                title="ShopBot AI Assistant">
                {open ? '✕' : '🤖'}
                {!open && unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center animate-pulse">{unread}</span>
                )}
            </button>
            {open && (
                <div className="fixed bottom-44 md:bottom-32 right-4 z-[8000] w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-slide-up" style={{ maxHeight: '480px' }}>
                    <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white px-4 py-3 flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
                        <div className="flex-1">
                            <p className="font-extrabold text-sm">ShopBot</p>
                            <p className="text-xs text-purple-200">AI Shopping Assistant</p>
                        </div>
                        <button onClick={() => setShowKeyInput(s => !s)} title="Set API Key" className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg text-xs transition-colors">⚙️ Key</button>
                    </div>
                    {showKeyInput && (
                        <div className="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800 p-3">
                            <p className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-2">🔑 Gemini API Key</p>
                            <div className="flex gap-2">
                                <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
                                    placeholder="AIzaSy..." className="flex-1 px-3 py-1.5 text-xs border border-purple-300 dark:border-purple-600 rounded-lg bg-white dark:bg-gray-800 outline-none focus:border-purple-500" />
                                <button onClick={saveKey} className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-700">Save</button>
                            </div>
                            <p className="text-[10px] text-purple-500 mt-1">Get free key at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="underline">aistudio.google.com</a></p>
                        </div>
                    )}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '200px', maxHeight: '280px' }}>
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                    ? 'bg-violet-600 text-white rounded-br-sm'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                                    }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                                    {[0, 1, 2].map(i => (
                                        <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                    {messages.length <= 1 && (
                        <div className="px-3 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
                            {QUICK_QUESTIONS.map(q => (
                                <button key={q} onClick={() => sendMessage(q)}
                                    className="flex-shrink-0 text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors whitespace-nowrap">
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2">
                        <input
                            ref={inputRef} type="text" value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
                            placeholder={apiKey ? 'Ask about any product...' : 'Set API key first (⚙️ Key)'}
                            className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:border-violet-500 transition-colors"
                        />
                        <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                            className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
                            {loading ? '⏳' : '➤'}
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
