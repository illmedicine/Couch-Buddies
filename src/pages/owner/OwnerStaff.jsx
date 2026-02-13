import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiDollarSign, FiMapPin, FiClock, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function OwnerStaff() {
  const { staff, addStaff, updateStaff, deleteStaff, payStaff, treasury } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [payTarget, setPayTarget] = useState(null)
  const [payAmount, setPayAmount] = useState('')
  const [payNote, setPayNote] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filtered = staff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || s.role === roleFilter
    return matchSearch && matchRole
  })

  const emptyStaff = { name: '', email: '', phone: '', role: 'onsite', pin: '0000' }

  const openAdd = () => { setEditingStaff({ ...emptyStaff }); setShowModal(true) }
  const openEdit = (s) => { setEditingStaff({ ...s }); setShowModal(true) }
  const closeModal = () => { setEditingStaff(null); setShowModal(false) }

  const openPay = (s) => { setPayTarget(s); setPayAmount(''); setPayNote(''); setShowPayModal(true) }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!editingStaff.name || !editingStaff.email) { toast.error('Name and email required'); return }
    if (editingStaff.id) {
      // Auto-update avatar initials when name changes
      const updatedData = { ...editingStaff }
      if (updatedData.name) {
        updatedData.avatar = updatedData.name.split(' ').map(n => n[0]).join('').toUpperCase()
      }
      updateStaff(editingStaff.id, updatedData)
      toast.success('Staff updated!')
    } else {
      addStaff(editingStaff)
      toast.success('Staff member added!')
    }
    closeModal()
  }

  const handlePay = (e) => {
    e.preventDefault()
    const amount = parseFloat(payAmount)
    if (!amount || amount <= 0) { toast.error('Enter a valid amount'); return }
    if (amount > treasury.balance) { toast.error('Insufficient treasury funds'); return }
    payStaff(payTarget.id, amount, payNote || `Payment to ${payTarget.name}`)
    toast.success(`$${amount.toFixed(2)} paid to ${payTarget.name}`)
    setShowPayModal(false)
  }

  const handleDelete = (id, name) => {
    if (confirm(`Remove ${name} from staff?`)) {
      deleteStaff(id)
      toast.success('Staff member removed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Staff Management</h1>
          <p className="text-gray-400 mt-1">{staff.length} team members • {staff.filter(s => s.clockedIn).length} on duty</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 w-fit">
          <FiPlus size={18} /> Add Staff
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search staff..." value={search}
            onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <div className="flex gap-2">
          {[['all', 'All'], ['onsite', 'In-Store'], ['delivery', 'Delivery']].map(([val, label]) => (
            <button key={val} onClick={() => setRoleFilter(val)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                roleFilter === val ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(member => (
          <motion.div key={member.id} layout className="glass-card hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                  member.clockedIn
                    ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30'
                    : 'bg-surface-700 text-gray-400'
                }`}>
                  {member.avatar || member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-xs text-gray-400">{member.email}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                member.role === 'delivery' ? 'badge-info' : 'badge-brand'
              }`}>
                {member.role === 'delivery' ? '🚗 Delivery' : '🏪 In-Store'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-gray-400 flex items-center gap-1"><FiClock size={12} /> Status</p>
                <p className={`text-sm font-medium mt-1 ${member.clockedIn ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {member.clockedIn ? `Clocked In (${member.clockType || member.role})` : 'Off Duty'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-gray-400 flex items-center gap-1"><FiDollarSign size={12} /> Wallet</p>
                <p className="text-sm font-semibold mt-1 text-emerald-400">${member.wallet.balance.toFixed(2)}</p>
              </div>
            </div>

            {member.clockedIn && member.location && (
              <div className="p-3 rounded-xl bg-white/5 mb-4 flex items-center gap-2">
                <FiMapPin size={14} className="text-brand-400 shrink-0" />
                <p className="text-xs text-gray-400 truncate">
                  {member.location.lat?.toFixed(4)}, {member.location.lng?.toFixed(4)}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => openPay(member)}
                className="flex-1 btn-success py-2 text-sm flex items-center justify-center gap-1">
                <FiDollarSign size={14} /> Pay
              </button>
              <button onClick={() => openEdit(member)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <FiEdit2 size={16} />
              </button>
              <button onClick={() => handleDelete(member.id, member.name)}
                className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                <FiTrash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Staff Modal */}
      <AnimatePresence>
        {showModal && editingStaff && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
            <motion.div className="modal-content" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">{editingStaff.id ? 'Edit Staff' : 'Add Staff Member'}</h2>
                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-white/10"><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
                  <input type="text" required value={editingStaff.name}
                    onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    className="input-field" placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email *</label>
                    <input type="email" required value={editingStaff.email}
                      onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })}
                      className="input-field" placeholder="john@couchbuddies.com" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone</label>
                    <input type="tel" value={editingStaff.phone}
                      onChange={e => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                      className="input-field" placeholder="555-0100" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Role</label>
                    <select value={editingStaff.role}
                      onChange={e => setEditingStaff({ ...editingStaff, role: e.target.value })}
                      className="input-field">
                      <option value="onsite" className="bg-surface-800">In-Store</option>
                      <option value="delivery" className="bg-surface-800">Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Login PIN</label>
                    <input type="text" maxLength={4} value={editingStaff.pin}
                      onChange={e => setEditingStaff({ ...editingStaff, pin: e.target.value })}
                      className="input-field font-mono" placeholder="0000" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <FiSave size={16} /> {editingStaff.id ? 'Save Changes' : 'Add Staff'}
                  </button>
                  <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pay Staff Modal */}
      <AnimatePresence>
        {showPayModal && payTarget && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPayModal(false)}>
            <motion.div className="modal-content max-w-md" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">Pay Staff</h2>
                <button onClick={() => setShowPayModal(false)} className="p-2 rounded-lg hover:bg-white/10"><FiX /></button>
              </div>
              <form onSubmit={handlePay} className="p-6 space-y-4">
                <div className="p-4 rounded-xl bg-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center font-bold text-sm">
                    {payTarget.avatar || payTarget.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{payTarget.name}</p>
                    <p className="text-xs text-gray-400">Current balance: ${payTarget.wallet.balance.toFixed(2)}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-emerald-400">Treasury Balance: ${treasury.balance.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Amount ($)</label>
                  <input type="number" step="0.01" value={payAmount}
                    onChange={e => setPayAmount(e.target.value)} className="input-field text-2xl font-bold"
                    placeholder="0.00" autoFocus />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Note</label>
                  <input type="text" value={payNote}
                    onChange={e => setPayNote(e.target.value)} className="input-field"
                    placeholder="Weekly pay, bonus, etc." />
                </div>
                <button type="submit" className="btn-success w-full py-3 flex items-center justify-center gap-2">
                  <FiDollarSign size={18} /> Send Payment
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
