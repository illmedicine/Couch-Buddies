import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiPackage, FiTruck, FiCheck, FiClock, FiEye } from 'react-icons/fi'
import { format } from 'date-fns'

const statusColors = {
  pending: 'badge-warning',
  confirmed: 'badge-info',
  assigned: 'badge-info',
  'in-transit': 'badge-brand',
  'picked-up': 'badge-brand',
  delivered: 'badge-success',
  completed: 'badge-success',
  cancelled: 'badge-danger',
}

const statusIcons = {
  pending: FiClock,
  confirmed: FiCheck,
  assigned: FiTruck,
  'in-transit': FiTruck,
  delivered: FiCheck,
  completed: FiCheck,
}

export default function CustomerOrders() {
  const { orders, currentUser } = useStore()
  const myOrders = orders
    .filter(o => o.customerId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="min-h-screen bg-surface-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <h1 className="font-display text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-400 mb-8">Track and manage your purchases</p>

        {myOrders.length === 0 ? (
          <div className="glass-card text-center py-16">
            <FiPackage size={48} className="mx-auto text-gray-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">No orders yet</h2>
            <p className="text-gray-400 mb-6">Your orders will appear here after you make a purchase.</p>
            <Link to="/shop" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map(order => {
              const StatusIcon = statusIcons[order.status] || FiPackage
              return (
                <div key={order.id} className="glass-card hover:border-brand-500/20 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                        <StatusIcon size={20} className="text-brand-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{order.id}</h3>
                          <span className={statusColors[order.status] || 'badge-info'}>
                            {order.status.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-0.5">
                          {format(new Date(order.createdAt), 'MMM dd, yyyy · h:mm a')}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''} · ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Link to={`/track/${order.id}`} className="btn-secondary text-sm py-2 flex items-center gap-1.5">
                      <FiEye size={14} /> Track Order
                    </Link>
                  </div>

                  {/* Item thumbnails */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/5 overflow-x-auto">
                    {order.items.map((item, i) => (
                      <div key={i} className="w-14 h-14 rounded-lg overflow-hidden bg-surface-800 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
