import { useStore } from '../../store/useStore'
import { FiDollarSign, FiArrowUpRight, FiArrowDownLeft, FiDownload, FiFilter } from 'react-icons/fi'
import { useState } from 'react'
import { format } from 'date-fns'

export default function OwnerLedger() {
  const { treasury, staff, orders, inStoreSales } = useStore()
  const [typeFilter, setTypeFilter] = useState('all')

  // Combine all financial transactions
  const allTransactions = [
    ...treasury.transactions.map(t => ({
      ...t, source: 'Treasury',
    })),
    ...staff.flatMap(s =>
      s.wallet.transactions.map(t => ({
        ...t, source: `Staff: ${s.name}`, direction: 'out',
      }))
    ),
  ].sort((a, b) => new Date(b.time) - new Date(a.time))

  const filtered = typeFilter === 'all'
    ? allTransactions
    : allTransactions.filter(t => {
      if (typeFilter === 'income') return t.type === 'deposit' || t.type === 'sale'
      if (typeFilter === 'payments') return t.type === 'staff-payment' || t.type === 'payment'
      return true
    })

  const totalIncome = allTransactions
    .filter(t => t.type === 'deposit' || t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalPayments = allTransactions
    .filter(t => t.type === 'staff-payment')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalOrders = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Financial Ledger</h1>
          <p className="text-gray-400 mt-1">Complete transaction history and financial overview</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 w-fit text-sm">
          <FiDownload size={16} /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FiDollarSign size={18} />
            </div>
            <span className="text-sm text-gray-400">Treasury</span>
          </div>
          <p className="text-2xl font-bold">${treasury.balance.toLocaleString()}</p>
        </div>
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <FiArrowDownLeft size={18} />
            </div>
            <span className="text-sm text-gray-400">Total Income</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">+${totalIncome.toLocaleString()}</p>
        </div>
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <FiArrowUpRight size={18} />
            </div>
            <span className="text-sm text-gray-400">Staff Payments</span>
          </div>
          <p className="text-2xl font-bold text-red-400">-${totalPayments.toLocaleString()}</p>
        </div>
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <FiArrowDownLeft size={18} />
            </div>
            <span className="text-sm text-gray-400">Order Revenue</span>
          </div>
          <p className="text-2xl font-bold text-brand-400">${totalOrders.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <FiFilter size={18} className="text-gray-400 self-center" />
        {[['all', 'All'], ['income', 'Income'], ['payments', 'Payments']].map(([val, label]) => (
          <button key={val} onClick={() => setTypeFilter(val)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              typeFilter === val ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="glass-card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-xs text-gray-400 font-medium">Date</th>
              <th className="text-left p-4 text-xs text-gray-400 font-medium">Description</th>
              <th className="text-left p-4 text-xs text-gray-400 font-medium hidden sm:table-cell">Source</th>
              <th className="text-left p-4 text-xs text-gray-400 font-medium hidden md:table-cell">Type</th>
              <th className="text-right p-4 text-xs text-gray-400 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">No transactions found</td>
              </tr>
            ) : (
              filtered.map(tx => {
                const isIncome = tx.type === 'deposit' || tx.type === 'sale'
                return (
                  <tr key={tx.id + tx.source} className="table-row">
                    <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
                      {format(new Date(tx.time), 'MMM d, yyyy')}
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium">{tx.note || tx.type}</p>
                      {tx.to && <p className="text-xs text-gray-500">To: {tx.to}</p>}
                      {tx.from && <p className="text-xs text-gray-500">From: {tx.from}</p>}
                    </td>
                    <td className="p-4 text-sm text-gray-400 hidden sm:table-cell">{tx.source}</td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`badge ${isIncome ? 'badge-success' : 'badge-danger'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`p-4 text-right text-sm font-bold ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isIncome ? '+' : '-'}${tx.amount.toLocaleString()}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
