import { useStore } from '../../store/useStore'
import { FiDollarSign, FiArrowDownLeft, FiClock } from 'react-icons/fi'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

export default function StaffWallet() {
  const { currentUser, staff } = useStore()
  const me = staff.find(s => s.id === currentUser?.id) || currentUser

  const transactions = [...(me?.wallet?.transactions || [])]
    .sort((a, b) => new Date(b.time) - new Date(a.time))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">My Wallet</h1>
        <p className="text-gray-400 mt-1">View your earnings and payment history</p>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card glow-brand relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <p className="text-sm text-gray-400 mb-1">Available Balance</p>
          <p className="text-4xl sm:text-5xl font-bold font-display text-emerald-400">
            ${me?.wallet?.balance?.toFixed(2) || '0.00'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Payments are made by the owner through the treasury system
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card">
          <p className="text-xs text-gray-400 mb-1">Total Earned</p>
          <p className="text-xl font-bold text-emerald-400">
            ${transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
          </p>
        </div>
        <div className="glass-card">
          <p className="text-xs text-gray-400 mb-1">Payments Received</p>
          <p className="text-xl font-bold">{transactions.length}</p>
        </div>
        <div className="glass-card">
          <p className="text-xs text-gray-400 mb-1">Last Payment</p>
          <p className="text-xl font-bold">
            {transactions.length > 0
              ? format(new Date(transactions[0].time), 'MMM d')
              : 'None'}
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass-card">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FiClock size={18} className="text-brand-400" /> Payment History
        </h3>

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <FiDollarSign size={32} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">No payments received yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <FiArrowDownLeft size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.note || 'Payment'}</p>
                    <p className="text-xs text-gray-500">
                      From: {tx.from || 'Owner'} • {format(new Date(tx.time), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold text-emerald-400">+${tx.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
