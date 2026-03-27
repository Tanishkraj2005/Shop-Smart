import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import usePageTitle from '../hooks/usePageTitle'
export default function Login() {
    usePageTitle('Login')
    const { login, loading } = useAuth()
    const [form, setForm] = useState({ email: '', password: '' })
    const [err, setErr] = useState('')
    const [showPass, setShowPass] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setErr('')
        const res = await login(form.email, form.password)
        if (res.success) {
            window.location.replace('/')
        } else {
            setErr(res.error || 'Login failed. Please try again.')
        }
    }
    return (
        <div className="min-h-screen flex dark:bg-gray-950">
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-800 to-gray-900 items-center justify-center p-12 text-white">
                <div className="max-w-md text-center">
                    <div className="text-6xl mb-6">👋</div>
                    <h2 className="text-4xl font-extrabold mb-4">Welcome Back!</h2>
                    <p className="text-gray-400 text-lg mb-8">Login to access your orders, wishlist and exclusive deals.</p>
                    <div className="space-y-4 text-left">
                        {['📦 Track all your orders in real-time', '❤️ Access your saved wishlist', '🏷️ Get exclusive member discounts', '🔒 Secure Firebase authentication'].map(f => (
                            <div key={f} className="flex items-center gap-3 text-gray-300"><span>{f}</span></div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link to="/" className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            Shop<span className="text-amber-400">Smart</span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your account</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                        {err && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
                                {err}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                <input type="email" value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    className="input" placeholder="you@email.com" required autoComplete="username" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                                <div className="relative">
                                    <input type={showPass ? 'text' : 'password'} value={form.password}
                                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                        className="input pr-12" placeholder="Your password" required autoComplete="current-password" />
                                    <button type="button" onClick={() => setShowPass(s => !s)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
                                        {showPass ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading}
                                className="btn-primary w-full py-4 rounded-xl text-base disabled:opacity-70 disabled:cursor-not-allowed">
                                {loading ? '⏳ Signing in...' : 'Login to Shop Smart →'}
                            </button>
                        </form>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                            Don't have an account? <Link to="/signup" className="text-amber-500 font-bold hover:underline">Sign up free →</Link>
                        </p>
                        <p className="text-center text-sm text-gray-400 mt-2">
                            <Link to="/" className="hover:text-amber-500 transition-colors">← Back to Home</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
