import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { FiUsers, FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function StaffLogin() {
  const { staff, loginAsStaff, currentUser, userRole } = useStore()
  const [selectedStaff, setSelectedStaff] = useState('')
  const [pin, setPin] = useState('')
  const navigate = useNavigate()

  if (currentUser && userRole === 'staff') {
    navigate('/staff')
    return null
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (!selectedStaff) { toast.error('Select your name'); return }
    if (loginAsStaff(selectedStaff, pin)) {
      toast.success('Welcome! You are logged in.')
      navigate('/staff')
    } else {
      toast.error('Invalid PIN')
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-4">
              <FiUsers size={28} />
            </div>
            <h1 className="font-display text-2xl font-bold">Staff Portal</h1>
            <p className="text-gray-400 text-sm mt-1">Select your name and enter your PIN</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Staff Member</label>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="input-field"
              >
                <option value="" className="bg-surface-800">Select your name...</option>
                {staff.map(s => (
                  <option key={s.id} value={s.id} className="bg-surface-800">
                    {s.name} ({s.role === 'delivery' ? '🚗 Delivery' : '🏪 In-Store'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="input-field text-center text-2xl tracking-[0.5em] font-mono"
                placeholder="••••"
                maxLength={4}
              />
            </div>

            <button type="submit" className="btn-primary w-full py-4 text-lg">
              Sign In
            </button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-6">
            Demo: Select any staff member, PIN matches their role (1111, 2222, etc.)
          </p>
        </div>
      </motion.div>
    </div>
  )
}
