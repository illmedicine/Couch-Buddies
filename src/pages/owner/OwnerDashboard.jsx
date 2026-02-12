import { useStore } from '../../store/useStore'
import { FiDollarSign, FiShoppingCart, FiUsers, FiBox, FiTrendingUp, FiClock } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function OwnerDashboard() {
  const { products, orders, staff, treasury, inStoreSales } = useStore()

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0) +
    inStoreSales.filter(s => s.status === 'completed').reduce((sum, s) => sum + (s.total || 0), 0)
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'assigned').length
  const clockedInStaff = staff.filter(s => s.clockedIn).length
  const totalProducts = products.length
  const lowStock = products.filter(p => p.stock < 20).length

  const stats = [
    { label: 'Treasury Balance', value: `$${treasury.balance.toLocaleString()}`, icon: FiDollarSign, color: 'from-emerald-500 to-emerald-700', change: '+12%' },
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: FiTrendingUp, color: 'from-brand-500 to-brand-700', change: '+8%' },
    { label: 'Active Orders', value: pendingOrders, icon: FiShoppingCart, color: 'from-blue-500 to-blue-700', change: `${orders.length} total` },
    { label: 'Staff On Duty', value: `${clockedInStaff}/${staff.length}`, icon: FiUsers, color: 'from-accent-500 to-accent-700', change: `${staff.length} total` },
    { label: 'Products', value: totalProducts, icon: FiBox, color: 'from-amber-500 to-amber-700', change: `${lowStock} low stock` },
  ]

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
  const recentTransactions = [...treasury.transactions].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={18} />
              </div>
              <span className="text-xs text-gray-500">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="glass-card">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FiShoppingCart size={18} className="text-brand-400" /> Recent Orders
          </h3>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="text-xs text-gray-400">{order.customerName || 'Guest'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-brand-400">${(order.total || 0).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'delivered' ? 'badge-success' :
                      order.status === 'pending' ? 'badge-warning' :
                      order.status === 'assigned' ? 'badge-info' : 'badge-brand'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="glass-card">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FiDollarSign size={18} className="text-emerald-400" /> Treasury Activity
          </h3>
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{tx.note || tx.type}</p>
                    <p className="text-xs text-gray-400">{new Date(tx.time).toLocaleDateString()}</p>
                  </div>
                  <p className={`text-sm font-semibold ${tx.type === 'deposit' || tx.type === 'sale' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.type === 'deposit' || tx.type === 'sale' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Staff Status */}
      <div className="glass-card">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FiClock size={18} className="text-accent-400" /> Staff Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {staff.map(member => (
            <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                member.clockedIn ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30' : 'bg-gray-500/20 text-gray-400'
              }`}>
                {member.avatar || member.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{member.name}</p>
                <p className="text-xs text-gray-400">
                  {member.clockedIn ? (
                    <span className="text-emerald-400">● {member.clockType || member.role}</span>
                  ) : (
                    <span className="text-gray-500">○ Off duty</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
