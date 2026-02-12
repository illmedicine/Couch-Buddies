import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { FiShoppingBag, FiPlus, FiMinus, FiTrash2, FiCheck } from 'react-icons/fi'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function InStoreMode() {
  const { currentUser, staff, products, createInStoreSale, completeInStoreSale, inStoreSales } = useStore()
  const me = staff.find(s => s.id === currentUser?.id) || currentUser
  const [cart, setCart] = useState([])
  const [showQR, setShowQR] = useState(null)
  const [search, setSearch] = useState('')

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const addItem = (product) => {
    const existing = cart.find(c => c.productId === product.id)
    if (existing) {
      setCart(cart.map(c => c.productId === product.id ? { ...c, quantity: c.quantity + 1 } : c))
    } else {
      setCart([...cart, { productId: product.id, name: product.name, price: product.price, quantity: 1, image: product.images?.[0] }])
    }
  }

  const updateQty = (productId, delta) => {
    setCart(cart.map(c => {
      if (c.productId === productId) {
        const newQty = c.quantity + delta
        return newQty <= 0 ? null : { ...c, quantity: newQty }
      }
      return c
    }).filter(Boolean))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCreateSale = () => {
    if (cart.length === 0) { toast.error('Add items to the cart first'); return }
    const sale = createInStoreSale({
      items: cart,
      total,
      staffId: me.id,
      staffName: me.name,
      paymentMethod: 'qr-code',
    })
    setShowQR(sale)
  }

  const handleCompleteSale = (saleId) => {
    completeInStoreSale(saleId)
    toast.success('Sale completed! 💰')
    setShowQR(null)
    setCart([])
  }

  const recentSales = [...inStoreSales]
    .filter(s => s.staffId === me?.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  if (!me?.clockedIn) {
    return (
      <div className="text-center py-20">
        <FiShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Not Clocked In</h2>
        <p className="text-gray-400">Clock in from the Dashboard to use In-Store POS</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <FiShoppingBag className="text-accent-400" /> In-Store POS
        </h1>
        <p className="text-gray-400 mt-1">Ring up in-store purchases with QR code payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..." className="input-field" />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto pr-1">
            {filteredProducts.map(product => (
              <button key={product.id} onClick={() => addItem(product)}
                className="glass-card p-0 overflow-hidden text-left group hover:border-brand-500/30 transition-all">
                <div className="aspect-square bg-surface-800 overflow-hidden">
                  <img src={product.images?.[0] || ''} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium line-clamp-1">{product.name}</p>
                  <p className="text-xs text-brand-400 font-bold">${product.price.toFixed(2)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart / Receipt */}
        <div className="glass-card flex flex-col">
          <h3 className="font-semibold mb-4">Current Sale</h3>

          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center py-8">
              <div>
                <FiShoppingBag size={32} className="mx-auto text-gray-600 mb-3" />
                <p className="text-sm text-gray-400">Tap products to add</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 space-y-2 mb-4">
              {cart.map(item => (
                <div key={item.productId} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">${item.price.toFixed(2)} ea</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item.productId, -1)}
                      className="p-1 rounded bg-white/10 hover:bg-white/20"><FiMinus size={12} /></button>
                    <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.productId, 1)}
                      className="p-1 rounded bg-white/10 hover:bg-white/20"><FiPlus size={12} /></button>
                  </div>
                  <p className="text-sm font-semibold w-16 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-white/5 pt-4">
            <div className="flex justify-between mb-4">
              <span className="text-gray-400">Total</span>
              <span className="text-2xl font-bold text-brand-400">${total.toFixed(2)}</span>
            </div>
            <button onClick={handleCreateSale} disabled={cart.length === 0}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              Generate QR Code
            </button>
            {cart.length > 0 && (
              <button onClick={() => setCart([])}
                className="w-full text-center text-sm text-red-400 hover:text-red-300 mt-2 py-1">
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content max-w-sm text-center"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <div className="p-8">
                <h2 className="font-display text-xl font-bold mb-2">Scan to Pay</h2>
                <p className="text-sm text-gray-400 mb-6">
                  Customer scans this QR code to complete their ${showQR.total?.toFixed(2)} purchase
                </p>

                <div className="bg-white p-6 rounded-2xl inline-block mb-6">
                  <QRCodeSVG
                    value={JSON.stringify({
                      type: 'couch-buddies-payment',
                      saleId: showQR.id,
                      total: showQR.total,
                      items: showQR.items?.length || 0,
                      staff: me?.name,
                    })}
                    size={200}
                    level="H"
                    includeMargin={true}
                    fgColor="#0A0E17"
                  />
                </div>

                <div className="text-sm text-gray-400 mb-6">
                  <p>Sale ID: {showQR.id}</p>
                  <p>Amount: ${showQR.total?.toFixed(2)}</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => handleCompleteSale(showQR.id)}
                    className="flex-1 btn-success py-3 flex items-center justify-center gap-2">
                    <FiCheck size={18} /> Payment Received
                  </button>
                  <button onClick={() => setShowQR(null)}
                    className="btn-secondary py-3 px-4">Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Sales */}
      {recentSales.length > 0 && (
        <div className="glass-card">
          <h3 className="font-semibold mb-4">My Recent Sales</h3>
          <div className="space-y-2">
            {recentSales.map(sale => (
              <div key={sale.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div>
                  <p className="text-sm font-medium">{sale.id}</p>
                  <p className="text-xs text-gray-400">{sale.items?.length || 0} items</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-400">${sale.total?.toFixed(2)}</p>
                  <span className={sale.status === 'completed' ? 'badge-success' : 'badge-warning'}>
                    {sale.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
