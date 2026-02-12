import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { FiPlus, FiTrash2, FiCreditCard, FiDollarSign, FiArrowUpRight, FiX, FiShield } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function OwnerTreasury() {
  const { treasury, addTreasuryAccount, removeTreasuryAccount, addTreasuryFunds } = useStore()
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [newAccount, setNewAccount] = useState({ name: '', type: 'bank', last4: '' })
  const [fundAmount, setFundAmount] = useState('')
  const [fundNote, setFundNote] = useState('')

  const handleAddAccount = (e) => {
    e.preventDefault()
    if (!newAccount.name || !newAccount.last4) { toast.error('Fill all fields'); return }
    addTreasuryAccount(newAccount)
    toast.success('Account connected!')
    setShowAddAccount(false)
    setNewAccount({ name: '', type: 'bank', last4: '' })
  }

  const handleAddFunds = (e) => {
    e.preventDefault()
    const amount = parseFloat(fundAmount)
    if (!amount || amount <= 0) { toast.error('Enter valid amount'); return }
    addTreasuryFunds(amount, fundNote || 'Manual deposit')
    toast.success(`$${amount.toFixed(2)} added to treasury`)
    setShowAddFunds(false)
    setFundAmount('')
    setFundNote('')
  }

  const handleRemoveAccount = (id, name) => {
    if (confirm(`Disconnect ${name}?`)) {
      removeTreasuryAccount(id)
      toast.success('Account disconnected')
    }
  }

  const recentTransactions = [...treasury.transactions]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 10)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Treasury Wallet</h1>
        <p className="text-gray-400 mt-1">Manage your business funds and connected accounts</p>
      </div>

      {/* Balance Card */}
      <div className="glass-card glow-brand relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <p className="text-sm text-gray-400 mb-1">Available Balance</p>
          <p className="text-4xl sm:text-5xl font-bold font-display">
            ${treasury.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowAddFunds(true)} className="btn-primary flex items-center gap-2">
              <FiPlus size={16} /> Add Funds
            </button>
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold">Connected Accounts</h2>
          <button onClick={() => setShowAddAccount(true)} className="btn-secondary text-sm py-2 flex items-center gap-1.5">
            <FiPlus size={14} /> Add Account
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {treasury.accounts.map(account => (
            <motion.div key={account.id} layout
              className="glass-card flex items-center gap-4 hover:border-white/20 transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                account.type === 'bank' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                <FiCreditCard size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{account.name}</p>
                <p className="text-sm text-gray-400">
                  {account.type === 'bank' ? 'Bank Account' : 'Debit Card'} •••• {account.last4}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge-success flex items-center gap-1"><FiShield size={10} /> Connected</span>
                <button onClick={() => handleRemoveAccount(account.id, account.name)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
          {treasury.accounts.length === 0 && (
            <div className="glass-card col-span-full text-center py-12">
              <FiCreditCard size={32} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400 text-sm">No accounts connected yet</p>
              <button onClick={() => setShowAddAccount(true)} className="btn-primary text-sm mt-4">
                Connect First Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="font-display text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="glass-card p-0">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <FiDollarSign size={32} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400 text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'deposit' || tx.type === 'sale'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      <FiArrowUpRight size={18} className={tx.type === 'staff-payment' ? 'rotate-180' : ''} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.note || tx.type}</p>
                      <p className="text-xs text-gray-500">
                        {tx.from || tx.to || ''} • {new Date(tx.time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className={`text-sm font-bold ${
                    tx.type === 'deposit' || tx.type === 'sale' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {tx.type === 'deposit' || tx.type === 'sale' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Account Modal */}
      <AnimatePresence>
        {showAddAccount && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddAccount(false)}>
            <motion.div className="modal-content max-w-md" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">Connect Account</h2>
                <button onClick={() => setShowAddAccount(false)} className="p-2 rounded-lg hover:bg-white/10"><FiX /></button>
              </div>
              <form onSubmit={handleAddAccount} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Account Name</label>
                  <input type="text" value={newAccount.name}
                    onChange={e => setNewAccount({ ...newAccount, name: e.target.value })}
                    className="input-field" placeholder="My Business Checking" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Account Type</label>
                  <select value={newAccount.type}
                    onChange={e => setNewAccount({ ...newAccount, type: e.target.value })}
                    className="input-field">
                    <option value="bank" className="bg-surface-800">Bank Account</option>
                    <option value="debit" className="bg-surface-800">Debit Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Last 4 Digits</label>
                  <input type="text" maxLength={4} value={newAccount.last4}
                    onChange={e => setNewAccount({ ...newAccount, last4: e.target.value.replace(/\D/g, '') })}
                    className="input-field font-mono" placeholder="1234" />
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <FiCreditCard size={16} /> Connect Account
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Funds Modal */}
      <AnimatePresence>
        {showAddFunds && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddFunds(false)}>
            <motion.div className="modal-content max-w-md" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">Add Funds</h2>
                <button onClick={() => setShowAddFunds(false)} className="p-2 rounded-lg hover:bg-white/10"><FiX /></button>
              </div>
              <form onSubmit={handleAddFunds} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Amount ($)</label>
                  <input type="number" step="0.01" value={fundAmount}
                    onChange={e => setFundAmount(e.target.value)}
                    className="input-field text-3xl font-bold text-center" placeholder="0.00" autoFocus />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Note</label>
                  <input type="text" value={fundNote}
                    onChange={e => setFundNote(e.target.value)}
                    className="input-field" placeholder="e.g. Bank transfer" />
                </div>
                <button type="submit" className="btn-success w-full py-3 flex items-center justify-center gap-2">
                  <FiDollarSign size={18} /> Add Funds
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
