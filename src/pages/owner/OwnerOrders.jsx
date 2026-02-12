import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { FiTruck, FiPackage, FiClock, FiUser, FiCheck, FiSearch, FiMapPin } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

const statusOptions = ['pending', 'assigned', 'picked-up', 'in-transit', 'delivered', 'cancelled']
const statusColors = {
  pending: 'badge-warning',
  assigned: 'badge-info',
  'picked-up': 'badge-brand',
  'in-transit': 'badge-info',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
}

export default function OwnerOrders() {
  const { orders, staff, updateOrderStatus, assignDriver } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const deliveryDrivers = staff.filter(s => s.role === 'delivery')

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.customerName || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus, `Status changed to ${newStatus}`)
    toast.success(`Order ${orderId} → ${newStatus}`)
  }

  const handleAssign = (orderId, driverId) => {
    assignDriver(orderId, driverId)
    toast.success('Driver assigned!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Orders</h1>
        <p className="text-gray-400 mt-1">{orders.length} total orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pending', count: orders.filter(o => o.status === 'pending').length, color: 'text-amber-400' },
          { label: 'In Transit', count: orders.filter(o => o.status === 'in-transit' || o.status === 'assigned').length, color: 'text-blue-400' },
          { label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length, color: 'text-emerald-400' },
          { label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length, color: 'text-red-400' },
        ].map(stat => (
          <div key={stat.label} className="glass-card text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search by order ID or customer..." value={search}
            onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', ...statusOptions].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === s ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="glass-card text-center py-16">
          <FiPackage size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <motion.div key={order.id} layout className="glass-card hover:border-white/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg">{order.id}</h3>
                    <span className={statusColors[order.status] || 'badge-info'}>{order.status}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><FiUser size={12} /> {order.customerName || 'Guest'}</span>
                    <span className="flex items-center gap-1"><FiClock size={12} /> {format(new Date(order.createdAt), 'MMM d, h:mm a')}</span>
                    {order.delivery === 'delivery' && <span className="flex items-center gap-1"><FiTruck size={12} /> Delivery</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-brand-400">${(order.total || 0).toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{order.items?.length || 0} items</p>
                </div>
              </div>

              {/* Items preview */}
              {order.items && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                  {order.items.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 shrink-0">
                      {item.image && <img src={item.image} alt="" className="w-8 h-8 rounded object-cover" />}
                      <div>
                        <p className="text-xs font-medium line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {(order.items?.length || 0) > 4 && (
                    <span className="text-xs text-gray-400 self-center px-2">+{order.items.length - 4} more</span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400">Status:</label>
                  <select value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                    className="input-field py-1.5 px-3 text-sm w-auto">
                    {statusOptions.map(s => (
                      <option key={s} value={s} className="bg-surface-800">{s}</option>
                    ))}
                  </select>
                </div>

                {order.delivery === 'delivery' && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400">Driver:</label>
                    <select value={order.driverId || ''}
                      onChange={e => handleAssign(order.id, e.target.value)}
                      className="input-field py-1.5 px-3 text-sm w-auto">
                      <option value="" className="bg-surface-800">Assign driver...</option>
                      {deliveryDrivers.map(d => (
                        <option key={d.id} value={d.id} className="bg-surface-800">
                          {d.name} {d.clockedIn ? '(on duty)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {order.shippingAddress && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 ml-auto">
                    <FiMapPin size={12} />
                    <span className="truncate max-w-[200px]">{order.shippingAddress}</span>
                  </div>
                )}
              </div>

              {/* Timeline */}
              {selectedOrder === order.id && order.timeline && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <h4 className="text-sm font-medium mb-3">Order Timeline</h4>
                  <div className="space-y-2">
                    {order.timeline.map((event, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-sm">{event.note || event.status}</p>
                          <p className="text-xs text-gray-500">{format(new Date(event.time), 'MMM d, h:mm a')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                className="text-xs text-brand-400 hover:text-brand-300 mt-3 transition-colors">
                {selectedOrder === order.id ? 'Hide Timeline' : 'View Timeline'}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
