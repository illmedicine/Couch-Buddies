import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'

const PLACEHOLDER_SM = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%231a1a2e'%3E%3Crect width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23555' font-family='sans-serif' font-size='12'%3E?%3C/text%3E%3C/svg%3E"

export default function Cart() {
  const { cart, updateCartItem, removeFromCart, clearCart } = useStore()

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 75 ? 0 : 7.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-surface-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-16 text-center">
          <div className="glass-card max-w-md mx-auto py-16">
            <FiShoppingBag size={48} className="mx-auto text-gray-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Looks like you haven't picked any treats yet!</p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              Browse Treats <FiArrowRight />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-400 transition-colors">
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-0 overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-800 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = PLACEHOLDER_SM } }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{item.name}</h3>
                    <div className="flex gap-2 mt-1">
                      {item.size && <span className="text-xs text-gray-500">{item.size}</span>}
                      {item.color && <span className="text-xs text-gray-500">{item.color}</span>}
                    </div>
                    <p className="text-brand-400 font-bold mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-400 transition-colors p-1">
                      <FiTrash2 size={16} />
                    </button>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateCartItem(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10">
                        <FiMinus size={14} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10">
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="glass-card sticky top-24 space-y-4">
              <h3 className="font-semibold text-lg">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-emerald-400">Free</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-brand-400">${total.toFixed(2)}</span>
                </div>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-500">
                  Add ${(75 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
              <Link to="/checkout" className="btn-primary w-full text-center block py-4">
                Proceed to Checkout
              </Link>
              <Link to="/shop" className="btn-secondary w-full text-center block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
