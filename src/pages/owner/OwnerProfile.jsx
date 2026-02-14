import { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { FiSave, FiUser, FiMail, FiPhone, FiLock, FiHome, FiMapPin, FiEdit2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function OwnerProfile() {
  const { ownerProfile, updateOwnerProfile } = useStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...ownerProfile })
  const [showPin, setShowPin] = useState(false)

  // Keep form in sync if profile updates from another browser
  useEffect(() => {
    if (!editing) {
      setForm({ ...ownerProfile })
    }
  }, [ownerProfile, editing])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name?.trim()) { toast.error('Name is required'); return }
    if (!form.email?.trim()) { toast.error('Email is required'); return }
    if (!form.pin || form.pin.length < 4) { toast.error('PIN must be at least 4 characters'); return }

    updateOwnerProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone?.trim() || '',
      businessName: form.businessName?.trim() || '',
      businessAddress: form.businessAddress?.trim() || '',
      pin: form.pin,
    })
    toast.success('Profile updated successfully!')
    setEditing(false)
  }

  const handleCancel = () => {
    setForm({ ...ownerProfile })
    setEditing(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Owner Profile</h1>
          <p className="text-gray-400 mt-1">Manage your account settings and business info</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-accent flex items-center gap-2">
            <FiEdit2 size={16} /> Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        {/* Avatar & Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-600 to-accent-800 flex items-center justify-center text-xl font-bold">
            {ownerProfile.avatar || 'CB'}
          </div>
          <div>
            <h2 className="text-xl font-bold">{ownerProfile.name}</h2>
            <p className="text-sm text-accent-400">{ownerProfile.businessName || 'Couch Buddies'}</p>
            <p className="text-xs text-gray-500 mt-0.5">Profile synced across all devices</p>
          </div>
        </div>

        {editing ? (
          /* Edit Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Info Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                    <FiUser size={14} /> Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name || ''}
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
                      value={form.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="input-field"
                      placeholder="owner@example.com"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                      <FiPhone size={14} /> Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="input-field"
                      placeholder="555-0100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Info Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Business Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                    <FiHome size={14} /> Business Name
                  </label>
                  <input
                    type="text"
                    value={form.businessName || ''}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    className="input-field"
                    placeholder="Couch Buddies"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                    <FiMapPin size={14} /> Business Address
                  </label>
                  <input
                    type="text"
                    value={form.businessAddress || ''}
                    onChange={(e) => handleChange('businessAddress', e.target.value)}
                    className="input-field"
                    placeholder="123 Main St, City, State"
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Security</h3>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                  <FiLock size={14} /> Login PIN
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={form.pin || ''}
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
                <p className="text-xs text-gray-600 mt-1">This PIN is used to log in to the Owner Portal</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button type="submit" className="btn-accent flex items-center gap-2">
                <FiSave size={16} /> Save Changes
              </button>
              <button type="button" onClick={handleCancel} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={FiUser} label="Name" value={ownerProfile.name} />
                <InfoRow icon={FiMail} label="Email" value={ownerProfile.email} />
                <InfoRow icon={FiPhone} label="Phone" value={ownerProfile.phone || '—'} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Business Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={FiHome} label="Business Name" value={ownerProfile.businessName || '—'} />
                <InfoRow icon={FiMapPin} label="Address" value={ownerProfile.businessAddress || '—'} />
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
