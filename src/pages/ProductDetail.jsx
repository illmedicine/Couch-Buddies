import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiShoppingCart, FiArrowLeft, FiMinus, FiPlus, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, addToCart } = useStore()
  const product = products.find(p => p.id === id)

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen bg-surface-950">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/shop" className="btn-primary">Back to Shop</Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (product.sizes?.length > 1 && !selectedSize) {
      toast.error('Please select a size')
      return
    }
    if (product.colors?.length > 1 && !selectedColor) {
      toast.error('Please select a color')
      return
    }
    addToCart(product, quantity, selectedSize || product.sizes?.[0] || '', selectedColor || product.colors?.[0] || '')
    setAdded(true)
    toast.success('Added to cart!')
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <FiArrowLeft /> Back
        </button>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Image */}
          <div className="glass-card p-0 overflow-hidden">
            <div className="aspect-square bg-surface-800">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{product.category}</p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold">{product.name}</h1>
              <p className="text-3xl font-bold text-brand-400 mt-3">${product.price.toFixed(2)}</p>
            </div>

            <p className="text-gray-400 leading-relaxed">{product.description}</p>

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'gradient-brand text-white shadow-lg'
                          : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        selectedColor === color
                          ? 'gradient-brand text-white shadow-lg'
                          : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                  <FiMinus size={16} />
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock > 20 ? (
                <span className="badge-success">In Stock ({product.stock})</span>
              ) : product.stock > 0 ? (
                <span className="badge-warning">Low Stock ({product.stock} left)</span>
              ) : (
                <span className="badge-danger">Out of Stock</span>
              )}
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : 'btn-primary'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {added ? <><FiCheck size={20} /> Added!</> : <><FiShoppingCart size={20} /> Add to Cart</>}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
