import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('currentUser')) || null } catch { return null }
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            api.me()
               .then(u => {
                   setUser(u)
                   localStorage.setItem('currentUser', JSON.stringify(u))
               })
               .catch(() => {
                   setUser(null)
                   localStorage.removeItem('token')
                   localStorage.removeItem('currentUser')
               })
               .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (email, password) => {
        setLoading(true)
        try {
            const res = await api.login(email, password)
            localStorage.setItem('token', res.token)
            localStorage.setItem('currentUser', JSON.stringify(res.user))
            setUser(res.user)
            return { success: true, user: res.user }
        } catch (e) {
            return { success: false, error: e.message }
        } finally { setLoading(false) }
    }

    const signup = async (name, email, password) => {
        setLoading(true)
        try {
            const res = await api.signup(name, email, password)
            localStorage.setItem('token', res.token)
            localStorage.setItem('currentUser', JSON.stringify(res.user))
            setUser(res.user)
            return { success: true }
        } catch (e) {
            return { success: false, error: e.message }
        } finally { setLoading(false) }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('currentUser')
    }

    const resetPassword = async (email) => {
        return { success: false, error: 'Password reset not configured yet.' }
    }

    const googleLogin = async () => ({ success: false, error: 'Google Sign-In removed.' })

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword, googleLogin, isLoggedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
