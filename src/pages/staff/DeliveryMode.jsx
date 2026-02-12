import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { FiTruck, FiCheck, FiX, FiMapPin, FiPackage, FiPhone, FiUser, FiNavigation } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

export default function DeliveryMode() {
  const { currentUser, staff, orders, updateOrderStatus } = useStore()
  const me = staff.find(s => s.id === currentUser?.id) || currentUser
  const [selectedOrder, setSelectedOrder] = useState(null)

  const myOrders = orders.filter(o => o.driverId === me?.id)
  const activeOrders = myOrders.filter(o => !['delivered', 'cancelled'].includes(o.status))
  const availableOrders = orders.filter(o => o.status === 'pending' && o.delivery === 'delivery' && !o.driverId)
  const completedOrders = myOrders.filter(o => o.status === 'delivered')

  const handleAccept = (orderId) => {
    updateOrderStatus(orderId, 'assigned', `Accepted by ${me.name}`)
    toast.success('Order accepted!')
  }

  const handlePickup = (orderId) => {
    updateOrderStatus(orderId, 'picked-up', `Picked up by ${me.name}`)
    toast.success('Marked as picked up!')
  }

  const handleInTransit = (orderId) => {
    updateOrderStatus(orderId, 'in-transit', `${me.name} is on the way`)
    toast.success('On the way!')
  }

  const handleDeliver = (orderId) => {
    updateOrderStatus(orderId, 'delivered', `Delivered by ${me.name}`)
    toast.success('Order delivered! 🎉')
  }

  const handleDeny = (orderId) => {
    updateOrderStatus(orderId, 'pending', `Declined by ${me.name}`)
    toast('Order returned to queue')
  }

  if (!me?.clockedIn) {
    return (
      <div className="text-center py-20">
        <FiTruck size={48} className="mx-auto text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Not Clocked In</h2>
        <p className="text-gray-400">Clock in from the Dashboard to access delivery mode</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <FiTruck className="text-brand-400" /> Delivery Mode
        </h1>
        <p className="text-gray-400 mt-1">
          {activeOrders.length} active • {completedOrders.length} completed today
        </p>
      </div>

      {/* GPS Status */}
      {me?.location && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
          <FiNavigation size={16} className="text-emerald-400" />
          <span className="text-sm text-emerald-300">GPS Active</span>
          <span className="text-xs text-gray-400 ml-auto">
            {me.location.lat?.toFixed(4)}, {me.location.lng?.toFixed(4)}
          </span>
        </div>
      )}

      {/* Available Orders (to accept) */}
      {availableOrders.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <FiPackage size={18} className="text-amber-400" /> Available Orders
          </h2>
          <div className="space-y-3">
            {availableOrders.map(order => (
              <motion.div key={order.id} layout className="glass-card border-amber-500/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold">{order.id}</h3>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                      <FiUser size={12} /> {order.customerName || 'Guest'}
                    </p>
                    {order.shippingAddress && (
                      <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                        <FiMapPin size={12} /> {order.shippingAddress}
                      </p>
                    )}
                  </div>
                  <p className="text-lg font-bold text-brand-400">${(order.total || 0).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <span>{order.items?.length || 0} items</span>
                  <span>•</span>
                  <span>{format(new Date(order.createdAt), 'h:mm a')}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAccept(order.id)}
                    className="flex-1 btn-success py-2.5 text-sm flex items-center justify-center gap-1.5">
                    <FiCheck size={16} /> Accept
                  </button>
                  <button onClick={() => handleDeny(order.id)}
                    className="btn-danger py-2.5 px-4 text-sm flex items-center gap-1.5">
                    <FiX size={16} /> Deny
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Active Orders */}
      <div>
        <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <FiTruck size={18} className="text-brand-400" /> My Active Orders
        </h2>
        {activeOrders.length === 0 ? (
          <div className="glass-card text-center py-12">
            <FiPackage size={32} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">No active deliveries</p>
            <p className="text-xs text-gray-500 mt-1">Accept orders from the queue above</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeOrders.map(order => (
              <motion.div key={order.id} layout className="glass-card border-brand-500/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{order.id}</h3>
                      <span className={`badge ${
                        order.status === 'assigned' ? 'badge-warning' :
                        order.status === 'picked-up' ? 'badge-info' :
                        order.status === 'in-transit' ? 'badge-brand' : 'badge-success'
                      }`}>{order.status}</span>
                    </div>
                    {order.customerPhone && (
                      <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                        <FiPhone size={12} /> {order.customerPhone}
                      </p>
                    )}
                    {order.shippingAddress && (
                      <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                        <FiMapPin size={12} /> {order.shippingAddress}
                      </p>
                    )}
                  </div>
                  <p className="text-lg font-bold text-brand-400">${(order.total || 0).toFixed(2)}</p>
                </div>

                {/* Items */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 shrink-0">
                      <span className="text-xs font-medium">{item.name} x{item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons based on status */}
                <div className="flex gap-2">
                  {order.status === 'assigned' && (
                    <button onClick={() => handlePickup(order.id)}
                      className="flex-1 btn-primary py-2.5 text-sm">
                      📦 Mark Picked Up
                    </button>
                  )}
                  {order.status === 'picked-up' && (
                    <button onClick={() => handleInTransit(order.id)}
                      className="flex-1 btn-primary py-2.5 text-sm">
                      🚗 Start Delivery
                    </button>
                  )}
                  {order.status === 'in-transit' && (
                    <button onClick={() => handleDeliver(order.id)}
                      className="flex-1 btn-success py-2.5 text-sm">
                      ✅ Mark Delivered
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Completed */}
      {completedOrders.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-3 text-gray-400">Completed Today</h2>
          <div className="space-y-2">
            {completedOrders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div>
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-gray-400">{order.customerName || 'Guest'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-400">${(order.total || 0).toFixed(2)}</p>
                  <span className="badge-success">Delivered</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
