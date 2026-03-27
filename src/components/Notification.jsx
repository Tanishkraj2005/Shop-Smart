import { createContext, useContext, useState, useCallback } from 'react'
const NotificationContext = createContext()
export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([])
    const notify = useCallback((message, type = 'success') => {
        const id = Date.now()
        setNotifications(prev => [...prev, { id, message, type }])
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3500)
    }, [])
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
    }
    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                {notifications.map(n => (
                    <div key={n.id}
                        className={`${colors[n.type]} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold animate-slide-up max-w-xs pointer-events-auto`}>
                        <span>{icons[n.type]}</span>
                        <span>{n.message}</span>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    )
}
export const useNotification = () => useContext(NotificationContext)
