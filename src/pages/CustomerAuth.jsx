import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiUser, FiArrowRight } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function CustomerAuth() {
  const navigate = useNavigate()
  const { loginAsCustomer, loginAsGuest, currentUser, userRole } = useStore()
  const [mode, setMode] = useState('signin') // signin | signup
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  // If already logged in as customer, redirect
  if (currentUser && userRole === 'customer') {
    return (
      <div className="min-h-screen bg-surface-950">
        <Navbar />
        <div className="max-w-md mx-auto px-4 pt-24 text-center">
          <div className="glass-card py-12">
            <div className="w-16 h-16 rounded-full gradient-brand flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              {currentUser.name?.charAt(0) || 'G'}
            </div>
            <h2 className="text-xl font-bold mb-1">Welcome, {currentUser.name || 'Guest'}!</h2>
            <p className="text-gray-400 text-sm mb-6">{currentUser.email || 'Guest account'}</p>
            <div className="flex flex-col gap-3">
              <Link to="/shop" className="btn-primary">Continue Shopping</Link>
              {!currentUser.isGuest && <Link to="/orders" className="btn-secondary">View Orders</Link>}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleGoogleSignIn = () => {
    // Simulated Google Sign In - in production, use Firebase Auth
    const user = {
      id: 'google-' + Date.now(),
      name: 'Google User',
      email: 'user@gmail.com',
      isGuest: false,
      provider: 'google',
      avatar: 'GU',
    }
    loginAsCustomer(user)
    toast.success('Signed in with Google!')
    navigate('/shop')
  }

  const handleEmailSignIn = () => {
    if (!form.email) {
      toast.error('Email is required')
      return
    }
    const user = {
      id: 'email-' + Date.now(),
      name: form.name || form.email.split('@')[0],
      email: form.email,
      isGuest: false,
      provider: 'email',
    }
    loginAsCustomer(user)
    toast.success(`Welcome, ${user.name}!`)
    navigate('/shop')
  }

  const handleGuest = () => {
    loginAsGuest()
    toast.success('Continuing as guest')
    navigate('/shop')
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="max-w-md mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4 font-bold">CB</div>
            <h1 className="font-display text-2xl font-bold">Welcome to Couch Buddies</h1>
            <p className="text-gray-400 mt-1">Sign in to track orders & earn rewards</p>
          </div>

          <div className="glass-card space-y-5">
            {/* Google Sign In */}
            <button onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all shadow-lg">
              <FcGoogle size={22} />
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Email */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="input-field" placeholder="Your name" />
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="input-field" placeholder="you@example.com" type="email" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="input-field" placeholder="••••••••" type="password" />
            </div>

            <button onClick={handleEmailSignIn} className="btn-primary w-full">
              {mode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>

            <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="w-full text-center text-sm text-gray-400 hover:text-brand-400 transition-colors">
              {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>

            <div className="border-t border-white/10 pt-4">
              <button onClick={handleGuest}
                className="btn-secondary w-full flex items-center justify-center gap-2">
                <FiUser size={16} /> Continue as Guest
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Guest accounts cannot track orders or earn rewards
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
