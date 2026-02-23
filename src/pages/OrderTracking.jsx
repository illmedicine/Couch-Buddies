import { useParams, Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiPackage, FiCheck, FiTruck, FiMapPin, FiClock, FiArrowLeft } from 'react-icons/fi'
import { format } from 'date-fns'

const statusSteps = ['pending', 'confirmed', 'assigned', 'picked-up', 'in-transit', 'delivered']

export default function OrderTracking() {
  const { orderId } = useParams()
  const { orders, staff } = useStore()
  const order = orders.find(o => o.id === orderId)

  if (!order) {
    return (
      <div className="min-h-screen bg-surface-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-24 text-center">
          <FiPackage size={48} className="mx-auto text-gray-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-400 mb-6">The order ID "{orderId}" was not found.</p>
          <Link to="/shop" className="btn-primary">Go to Shop</Link>
        </div>
      </div>
    )
  }

  const currentStepIndex = statusSteps.indexOf(order.status)
  const driver = order.driverId ? staff.find(s => s.id === order.driverId) : null

  return (
    <div className="min-h-screen bg-surface-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <Link to="/orders" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <FiArrowLeft /> Back to Orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Order {order.id}</h1>
            <p className="text-gray-400 text-sm mt-1">
              Placed {format(new Date(order.createdAt), 'MMMM dd, yyyy · h:mm a')}
            </p>
          </div>
          <span className={`badge text-sm py-1.5 px-4 ${
            order.status === 'delivered' || order.status === 'completed' ? 'badge-success' :
            order.status === 'cancelled' ? 'badge-danger' : 'badge-brand'
          }`}>
            {order.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            {order.deliveryMethod === 'delivery' && (
              <div className="glass-card">
                <h3 className="font-semibold mb-6">Delivery Progress</h3>
                <div className="flex items-center justify-between mb-2">
                  {statusSteps.map((step, i) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        i <= currentStepIndex ? 'gradient-brand text-white' : 'bg-white/10 text-gray-500'
                      }`}>
                        {i <= currentStepIndex ? <FiCheck size={14} /> : i + 1}
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 ${
                          i < currentStepIndex ? 'bg-brand-500' : 'bg-white/10'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  {statusSteps.map(step => (
                    <span key={step} className="text-center capitalize">{step.replace('-', ' ')}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Driver Info */}
            {driver && (
              <div className="glass-card">
                <h3 className="font-semibold mb-4">Your Delivery Driver</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center font-bold overflow-hidden">
                    {driver.photoURL ? (
                      <img src={driver.photoURL} alt={driver.name} className="w-full h-full object-cover" />
                    ) : (
                      driver.avatar || driver.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{driver.name}</p>
                    <p className="text-sm text-gray-400">{driver.phone}</p>
                  </div>
                  {driver.location && (
                    <div className="ml-auto flex items-center gap-1 text-sm text-emerald-400">
                      <FiMapPin size={14} /> Live tracking
                    </div>
                  )}
                </div>
                {driver.location && (
                  <div className="mt-4 p-4 rounded-xl bg-surface-900 border border-white/5">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <FiMapPin size={14} className="text-brand-400" />
                      <span>Driver Location: {driver.location.lat?.toFixed(4)}, {driver.location.lng?.toFixed(4)}</span>
                    </div>
                    <div className="mt-3 h-48 rounded-xl bg-surface-800 flex items-center justify-center text-gray-500 text-sm border border-white/5">
                      <div className="text-center">
                        <FiMapPin size={32} className="mx-auto mb-2 text-brand-400" />
                        Map View<br /><span className="text-xs">(Connect Google Maps API for live view)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Timeline */}
            <div className="glass-card">
              <h3 className="font-semibold mb-4">Order Timeline</h3>
              <div className="space-y-4">
                {order.timeline.slice().reverse().map((event, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-brand-500' : 'bg-white/20'}`} />
                      {i < order.timeline.length - 1 && <div className="w-0.5 flex-1 bg-white/10 mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="font-medium text-sm capitalize">{event.status.replace('-', ' ')}</p>
                      {event.note && <p className="text-xs text-gray-400 mt-0.5">{event.note}</p>}
                      <p className="text-xs text-gray-500 mt-0.5">
                        {format(new Date(event.time), 'MMM dd · h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div className="space-y-6">
            <div className="glass-card">
              <h3 className="font-semibold mb-4">Order Details</h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-800 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity} · {item.size}</p>
                    </div>
                    <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 mt-4 pt-3 space-y-1 text-sm">
                <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-400"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between text-gray-400"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-2">
                  <span>Total</span><span className="text-brand-400">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="glass-card text-sm">
              <h3 className="font-semibold mb-3">Payment</h3>
              <p className="text-gray-400 capitalize">{order.paymentMethod}</p>
              <h3 className="font-semibold mb-3 mt-4">Delivery Method</h3>
              <p className="text-gray-400 capitalize">{order.deliveryMethod}</p>
              {order.deliveryAddress && (
                <p className="text-gray-500 text-xs mt-1">
                  {order.deliveryAddress.address}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zip}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
