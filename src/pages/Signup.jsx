import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import usePageTitle from '../hooks/usePageTitle'
export default function Signup() {
    usePageTitle('Create Account')
    const { signup, loading } = useAuth()
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
    const [err, setErr] = useState('')
    const [success, setSuccess] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault(); setErr('')
        if (form.password !== form.confirm) { setErr('Passwords do not match.'); return }
        if (form.password.length < 6) { setErr('Password must be at least 6 characters.'); return }
        const res = await signup(form.name, form.email, form.password)
        if (res.success) {
            setSuccess(true)
            setTimeout(() => window.location.replace('/'), 1200)
        } else {
            setErr(res.error || 'Signup failed. Please try again.')
        }
    }
    return (
        <div className="min-h-screen flex dark:bg-gray-950">
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-700 to-violet-900 items-center justify-center p-12 text-white">
                <div className="max-w-md text-center">
                    <div className="text-6xl mb-6">🎉</div>
                    <h2 className="text-4xl font-extrabold mb-4">Join Shop Smart</h2>
                    <p className="text-purple-200 text-lg mb-8">Create your account and start shopping smarter today.</p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                        <p className="font-bold mb-4 text-lg">🎁 New member benefits:</p>
                        <ul className="space-y-3 text-purple-100 text-left">
                            {['10% OFF your first order with code NEW10', 'Free shipping on all orders over ₹999', 'Access to exclusive member deals', 'Easy order tracking & returns'].map(b => <li key={b}>✓ {b}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link to="/" className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            Shop<span className="text-amber-400">Smart</span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Create your free account</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                        {success ? (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">🎊</div>
                                <h3 className="text-2xl font-extrabold text-green-600 mb-2">Account Created!</h3>
                                <p className="text-gray-500">Welcome to Shop Smart, {form.name}!</p>
                                <p className="text-sm text-gray-400 mt-2">Redirecting to homepage...</p>
                            </div>
                        ) : (
                            <>
                                {err && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 mb-5 text-sm font-medium">{err}</div>}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {[
                                        ['Full Name', 'text', 'name', 'Your full name', 'name'],
                                        ['Email', 'email', 'email', 'you@email.com', 'email'],
                                        ['Password', 'password', 'password', 'Min 6 characters', 'new-password'],
                                        ['Confirm Password', 'password', 'confirm', 'Repeat password', 'new-password'],
                                    ].map(([label, type, key, ph, auto]) => (
                                        <div key={key}>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                                            <input type={type} value={form[key]}
                                                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                                className="input" placeholder={ph} required autoComplete={auto} />
                                        </div>
                                    ))}
                                    <button type="submit" disabled={loading} className="btn-primary w-full py-4 rounded-xl text-base disabled:opacity-70">
                                        {loading ? '⏳ Creating account...' : 'Create My Account →'}
                                    </button>
                                </form>
                            </>
                        )}
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                            Already have an account? <Link to="/login" className="text-amber-500 font-bold hover:underline">Login →</Link>
                        </p>
                        <p className="text-center text-sm text-gray-400 mt-1">
                            <Link to="/" className="hover:text-amber-500">← Back to Home</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
