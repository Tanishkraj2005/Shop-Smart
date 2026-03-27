import { createContext, useContext, useState, useEffect } from 'react'
import { auth, db, FIREBASE_CONFIGURED } from '../firebase/config'
import {
    signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signOut, updateProfile, sendPasswordResetEmail, onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
const AuthContext = createContext()
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('currentUser')) } catch { return null }
    })
    const [loading, setLoading] = useState(false)
    const [googleRedirectDone, setGoogleRedirectDone] = useState(false)
    useEffect(() => {
        if (!FIREBASE_CONFIGURED || !auth) return
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const u = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                    photo: firebaseUser.photoURL
                }
                setUser(u)
                localStorage.setItem('currentUser', JSON.stringify(u))
                const path = window.location.pathname
                if (path === '/login' || path === '/signup') {
                    window.location.replace('/')
                }
            } else {
                setUser(null)
                localStorage.removeItem('currentUser')
            }
        })
        return unsub
    }, [])
    const login = async (email, password) => {
        setLoading(true)
        try {
            if (FIREBASE_CONFIGURED && auth) {
                const cred = await signInWithEmailAndPassword(auth, email, password)
                const u = { uid: cred.user.uid, email: cred.user.email, name: cred.user.displayName || email.split('@')[0] }
                setUser(u); localStorage.setItem('currentUser', JSON.stringify(u))
                return { success: true, user: u }
            }
            const users = JSON.parse(localStorage.getItem('users')) || []
            const found = users.find(u => (u.email === email || u.name === email) && u.password === password)
            if (found) {
                const u = { name: found.name, email: found.email }
                setUser(u); localStorage.setItem('currentUser', JSON.stringify(u))
                return { success: true, user: u }
            }
            return { success: false, error: 'Invalid email or password.' }
        } catch (e) {
            console.error('Login error code:', e.code, 'message:', e.message)
            return { success: false, error: getFirebaseError(e.code) }
        } finally { setLoading(false) }
    }
    const signup = async (name, email, password) => {
        setLoading(true)
        try {
            if (FIREBASE_CONFIGURED && auth) {
                const cred = await createUserWithEmailAndPassword(auth, email, password)
                await updateProfile(cred.user, { displayName: name })
                if (db) await setDoc(doc(db, 'users', cred.user.uid), { name, email, createdAt: serverTimestamp() })
                const u = { uid: cred.user.uid, email, name }
                setUser(u); localStorage.setItem('currentUser', JSON.stringify(u))
                return { success: true }
            }
            const users = JSON.parse(localStorage.getItem('users')) || []
            if (users.find(u => u.email === email)) return { success: false, error: 'Email already registered.' }
            users.push({ name, email, password })
            localStorage.setItem('users', JSON.stringify(users))
            const u = { name, email }
            setUser(u); localStorage.setItem('currentUser', JSON.stringify(u))
            return { success: true }
        } catch (e) {
            return { success: false, error: getFirebaseError(e.code) }
        } finally { setLoading(false) }
    }
    const logout = () => {
        if (FIREBASE_CONFIGURED && auth) signOut(auth)
        setUser(null); localStorage.removeItem('currentUser')
    }
    const resetPassword = async (email) => {
        if (!FIREBASE_CONFIGURED || !auth) return { success: false, error: 'Firebase not configured.' }
        try { await sendPasswordResetEmail(auth, email); return { success: true } }
        catch (e) { return { success: false, error: getFirebaseError(e.code) } }
    }
    const googleLogin = async () => ({ success: false, error: 'Google Sign-In removed.' })
    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword, googleLogin, isLoggedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext)
function getFirebaseError(code) {
    const m = {
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-credential': 'Incorrect email or password.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/email-already-in-use': 'Email already registered. Try logging in.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
        'auth/network-request-failed': 'Network error. Check your connection.',
        'auth/popup-closed-by-user': '',
        'auth/account-exists-with-different-credential': 'Account exists with different sign-in method.',
    }
    console.log('Firebase error code received:', code)
    return m[code] || `Error: ${code || 'Something went wrong.'}`
}
