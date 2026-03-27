import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyB7e9SxqEUpOzltBLJa2dXhTHIYEADRJ4M",
    authDomain: "shop-smart-86cc3.firebaseapp.com",
    projectId: "shop-smart-86cc3",
    storageBucket: "shop-smart-86cc3.firebasestorage.app",
    messagingSenderId: "356549861476",
    appId: "1:356549861476:web:56de14f49abe25bb74ff71"
}
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
export const auth = getAuth(app)
export const db = getFirestore(app)
export const FIREBASE_CONFIGURED = true
console.log('✅ Firebase connected to shop-smart-86cc3')
