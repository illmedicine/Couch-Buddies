import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiCheck, FiCreditCard, FiDollarSign, FiSmartphone } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: FiCreditCard, color: 'text-blue-400' },
  { id: 'cashapp', name: 'CashApp', icon: FiDollarSign, color: 'text-green-400' },
  { id: 'paypal', name: 'PayPal', icon: FiDollarSign, color: 'text-blue-300' },
  { id: 'zelle', name: 'Zelle', icon: FiSmartphone, color: 'text-purple-400' },
  { id: 'chime', name: 'Chime', icon: FiDollarSign, color: 'text-emerald-400' },
  { id: 'crypto', name: 'Crypto (BTC/ETH)', icon: FiDollarSign, color: 'text-amber-400' },
]

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, currentUser, createOrder } = useStore()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [delivery, setDelivery] = useState('delivery')
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  })

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = delivery === 'pickup' ? 0 : (subtotal >= 75 ? 0 : 7.99)
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-surface-950">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-24 text-center">
          <h2 className="text-2xl font-bold mb-4">Nothing to checkout</h2>
          <Link to="/shop" className="btn-primary">Go to Shop</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = () => {
    if (step === 1) {
      if (!form.name || !form.email) {
        toast.error('Name and email are required')
        return
      }
      if (delivery === 'delivery' && (!form.address || !form.city || !form.zip)) {
        toast.error('Please fill in your delivery address')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!paymentMethod) {
        toast.error('Please select a payment method')
        return
      }
      setStep(3)
    } else {
      // Place order
      const order = createOrder({
        customerId: currentUser?.id || 'guest',
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
        })),
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod,
        deliveryMethod: delivery,
        deliveryAddress: delivery === 'delivery' ? {
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
        } : null,
      })
      toast.success('Order placed successfully!')
      navigate(`/track/${order.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-10">
          {['Details', 'Payment', 'Confirm'].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > i + 1 ? 'bg-emerald-500 text-white' :
                step === i + 1 ? 'gradient-brand text-white' : 'bg-white/10 text-gray-500'
              }`}>
                {step > i + 1 ? <FiCheck size={16} /> : i + 1}
              </div>
              <span className={`text-sm font-medium ${step >= i + 1 ? 'text-white' : 'text-gray-500'}`}>{label}</span>
              {i < 2 && <div className={`flex-1 h-px ${step > i + 1 ? 'bg-emerald-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Area */}
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div className="glass-card space-y-6">
                  <h2 className="text-xl font-semibold">Delivery Details</h2>

                  {/* Delivery Type */}
                  <div className="flex gap-3">
                    {['delivery', 'pickup'].map(type => (
                      <button key={type} onClick={() => setDelivery(type)}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                          delivery === type ? 'gradient-brand text-white shadow-lg' : 'bg-white/5 border border-white/10 text-gray-400'
                        }`}>
                        {type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
                      <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                        className="input-field" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email *</label>
                      <input value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                        className="input-field" placeholder="john@example.com" type="email" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">Phone</label>
                      <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                        className="input-field" placeholder="555-0123" />
                    </div>
                  </div>

                  {delivery === 'delivery' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Address *</label>
                        <input value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                          className="input-field" placeholder="123 Main St" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">City *</label>
                          <input value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                            className="input-field" placeholder="City" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">State</label>
                          <input value={form.state} onChange={e => setForm({...form, state: e.target.value})}
                            className="input-field" placeholder="CA" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">ZIP *</label>
                          <input value={form.zip} onChange={e => setForm({...form, zip: e.target.value})}
                            className="input-field" placeholder="90210" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="glass-card space-y-6">
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {paymentMethods.map(method => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl transition-all text-left ${
                          paymentMethod === method.id
                            ? 'gradient-brand text-white shadow-lg shadow-brand-500/25'
                            : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <method.icon size={24} className={paymentMethod === method.id ? 'text-white' : method.color} />
                        <span className="font-medium">{method.name}</span>
                      </button>
                    ))}
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Card Number</label>
                        <input className="input-field" placeholder="4242 4242 4242 4242" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Expiry</label>
                          <input className="input-field" placeholder="MM/YY" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">CVV</label>
                          <input className="input-field" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}
                  {paymentMethod && paymentMethod !== 'card' && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-gray-400 text-sm">
                        {paymentMethod === 'cashapp' && 'You will be redirected to CashApp to complete payment.'}
                        {paymentMethod === 'paypal' && 'You will be redirected to PayPal to complete payment.'}
                        {paymentMethod === 'zelle' && 'Payment details will be sent to your email for Zelle transfer.'}
                        {paymentMethod === 'chime' && 'You will receive a Chime pay request to complete the transaction.'}
                        {paymentMethod === 'crypto' && 'A wallet address will be provided for BTC or ETH payment.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="glass-card space-y-6">
                  <h2 className="text-xl font-semibold">Order Confirmation</h2>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="font-medium text-sm text-gray-400 mb-2">Delivery</h3>
                      <p className="text-white">{form.name}</p>
                      <p className="text-gray-400 text-sm">{form.email}</p>
                      {delivery === 'delivery' && (
                        <p className="text-gray-400 text-sm mt-1">{form.address}, {form.city}, {form.state} {form.zip}</p>
                      )}
                      {delivery === 'pickup' && (
                        <p className="text-gray-400 text-sm mt-1">In-Store Pickup</p>
                      )}
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="font-medium text-sm text-gray-400 mb-2">Payment</h3>
                      <p className="text-white capitalize">{paymentMethods.find(m => m.id === paymentMethod)?.name}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="font-medium text-sm text-gray-400 mb-2">Items ({cart.length})</h3>
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between py-1">
                          <span className="text-gray-300 text-sm">{item.name} x{item.quantity}</span>
                          <span className="text-white text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="btn-secondary">Back</button>
              )}
              <button onClick={handleSubmit} className="btn-primary flex-1">
                {step === 3 ? `Place Order — $${total.toFixed(2)}` : 'Continue'}
              </button>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="hidden lg:block">
            <div className="glass-card sticky top-24 space-y-4">
              <h3 className="font-semibold">Summary</h3>
              {cart.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-800 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=?' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span><span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-2">
                  <span>Total</span><span className="text-brand-400">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
