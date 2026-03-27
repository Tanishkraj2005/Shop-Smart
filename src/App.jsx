import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileBottomNav from './components/MobileBottomNav'
import Chatbot from './components/Chatbot'
import ScrollToTop from './components/ScrollToTop'
import FloatingScrollToTop from './components/FloatingScrollToTop'
import { NotificationProvider } from './components/Notification'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { CurrencyProvider } from './context/CurrencyContext'
import Home from './pages/Home'
import Category from './pages/Category'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Compare from './pages/Compare'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Search from './pages/Search'
import Admin from './pages/Admin'

const AUTH_ROUTES = ['/login', '/signup']

function AppLayout() {
  const { pathname } = useLocation()
  const isAuthPage = AUTH_ROUTES.includes(pathname)

  return (
    <div className="flex flex-col min-h-screen font-inter">
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<Search />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/:category" element={<Category />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <MobileBottomNav />}
      {!isAuthPage && <Chatbot />}
      {!isAuthPage && <FloatingScrollToTop />}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <NotificationProvider>
                <AppLayout />
              </NotificationProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 dark:bg-gray-950 p-8 text-center">
      <div className="text-8xl">🔍</div>
      <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white">404</h1>
      <p className="text-xl text-gray-500 dark:text-gray-400">Page not found</p>
      <a href="/" className="btn-primary px-8 py-3 rounded-xl inline-block">← Go Home</a>
    </div>
  )
}

export default App
