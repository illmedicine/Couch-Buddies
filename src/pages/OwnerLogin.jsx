import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { FiLock, FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function OwnerLogin() {
  const [pin, setPin] = useState('')
  const { loginAsOwner, currentUser, userRole } = useStore()
  const navigate = useNavigate()

  if (currentUser && userRole === 'owner') {
    navigate('/owner')
    return null
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginAsOwner(pin)) {
      toast.success('Welcome, Owner!')
      navigate('/owner')
    } else {
      toast.error('Invalid PIN. Default: 1234')
    }
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <FiArrowLeft /> Back to Store
        </Link>

        <div className="glass-card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-600 to-accent-800 flex items-center justify-center mx-auto mb-4">
              <FiLock size={28} />
            </div>
            <h1 className="font-display text-2xl font-bold">Owner Portal</h1>
            <p className="text-gray-400 text-sm mt-1">Enter your PIN to access the management dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Owner PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="input-field text-center text-2xl tracking-[0.5em] font-mono"
                placeholder="••••"
                maxLength={8}
                autoFocus
              />
            </div>
            <button type="submit" className="btn-accent w-full py-4 text-lg">
              Access Dashboard
            </button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-6">
            Demo PIN: 1234
          </p>
        </div>
      </motion.div>
    </div>
  )
}
