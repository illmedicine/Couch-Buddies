import { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { FiSave, FiUser, FiMail, FiPhone, FiLock, FiEdit2, FiBriefcase } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function StaffProfile() {
  const { currentUser, staff, updateStaff } = useStore()

  // Resolve full staff record from the synced staff array
  const me = staff.find(s => s.id === currentUser?.id) || currentUser
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: me?.name || '',
    email: me?.email || '',
    phone: me?.phone || '',
    pin: me?.pin || '',
  })
  const [showPin, setShowPin] = useState(false)

  // Keep form in sync if staff data updates from another browser (while not editing)
  useEffect(() => {
    if (!editing && me) {
      setForm({
        name: me.name || '',
        email: me.email || '',
        phone: me.phone || '',
        pin: me.pin || '',
      })
    }
  }, [me, editing])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name?.trim()) { toast.error('Name is required'); return }
    if (!form.email?.trim()) { toast.error('Email is required'); return }
    if (!form.pin || form.pin.length < 4) { toast.error('PIN must be at least 4 characters'); return }

    const updates = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone?.trim() || '',
      pin: form.pin,
      avatar: form.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??',
    }

    // Update the staff record (syncs to Firebase → visible to owner & all browsers)
    updateStaff(me.id, updates)

    // Also update currentUser so the session reflects changes immediately
    useStore.setState(state => ({
      currentUser: { ...state.currentUser, ...updates },
    }))

    toast.success('Profile updated successfully!')
    setEditing(false)
  }

  const handleCancel = () => {
    setForm({
      name: me?.name || '',
      email: me?.email || '',
      phone: me?.phone || '',
      pin: me?.pin || '',
    })
    setEditing(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">My Profile</h1>
          <p className="text-gray-400 mt-1">Update your personal info and login PIN</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-primary flex items-center gap-2">
            <FiEdit2 size={16} /> Edit Profile
          </button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        {/* Avatar & Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold ${
            me?.clockedIn
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 ring-2 ring-emerald-500/30'
              : 'bg-gradient-to-br from-brand-500 to-brand-700'
          }`}>
            {me?.avatar || me?.name?.charAt(0) || '?'}
          </div>
          <div>
            <h2 className="text-xl font-bold">{me?.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                me?.role === 'delivery' ? 'bg-blue-500/20 text-blue-400' : 'bg-accent-500/20 text-accent-400'
              }`}>
                {me?.role === 'delivery' ? 'Delivery' : 'In-Store'}
              </span>
              {me?.clockedIn && (
                <span className="text-xs text-emerald-400">● On Duty</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Changes sync across all devices</p>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                    <FiUser size={14} /> Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="input-field"
                    placeholder="Your name"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                      <FiMail size={14} /> Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="input-field"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                      <FiPhone size={14} /> Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="input-field"
                      placeholder="555-0100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Security</h3>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                  <FiLock size={14} /> Login PIN
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={form.pin}
                    onChange={(e) => handleChange('pin', e.target.value)}
                    className="input-field font-mono tracking-widest pr-20"
                    placeholder="••••"
                    maxLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPin ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1">Used to log in to the Staff Portal</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <FiSave size={16} /> Save Changes
              </button>
              <button type="button" onClick={handleCancel} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={FiUser} label="Name" value={me?.name || '—'} />
                <InfoRow icon={FiMail} label="Email" value={me?.email || '—'} />
                <InfoRow icon={FiPhone} label="Phone" value={me?.phone || '—'} />
                <InfoRow icon={FiBriefcase} label="Role" value={me?.role === 'delivery' ? 'Delivery Driver' : 'In-Store Staff'} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Security</h3>
              <InfoRow icon={FiLock} label="Login PIN" value="••••••" />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
      <Icon size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium mt-0.5">{value}</p>
      </div>
    </div>
  )
}
