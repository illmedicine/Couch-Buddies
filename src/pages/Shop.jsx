import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function Shop() {
  const { products } = useStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState('grid')

  const categories = ['All', ...new Set(products.map(p => p.category))]

  const filtered = useMemo(() => {
    let result = [...products]
    if (category !== 'All') result = result.filter(p => p.category === category)
    if (search) result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    )
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break
      case 'price-high': result.sort((a, b) => b.price - a.price); break
      case 'newest': result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break
      case 'featured': result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break
      default: break
    }
    return result
  }, [products, category, search, sortBy])

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Shop</h1>
          <p className="text-gray-400">Browse our full collection of premium merch</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  category === cat
                    ? 'gradient-brand text-white shadow-lg shadow-brand-500/25'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sort & View */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">{filtered.length} products</p>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-auto text-sm py-2"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <div className="hidden sm:flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400'}`}
              >
                <FiGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-400'}`}
              >
                <FiList size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link to={`/product/${product.id}`} className="group block">
                  <div className="glass-card p-0 overflow-hidden hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="aspect-square overflow-hidden bg-surface-800 relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {product.featured && (
                        <span className="absolute top-3 left-3 badge-brand">Featured</span>
                      )}
                      {product.stock < 20 && (
                        <span className="absolute top-3 right-3 badge-danger">Low Stock</span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category}</p>
                      <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-brand-400 font-bold text-lg">${product.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{product.stock} in stock</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link to={`/product/${product.id}`} className="group block">
                  <div className="glass-card p-0 overflow-hidden hover:border-brand-500/30 transition-all flex">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 overflow-hidden bg-surface-800">
                      <img src={product.images[0]} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
                      <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors">{product.name}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mt-1">{product.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-brand-400 font-bold text-lg">${product.price.toFixed(2)}</p>
                        {product.featured && <span className="badge-brand">Featured</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products found</p>
            <button onClick={() => { setSearch(''); setCategory('All') }} className="btn-secondary mt-4">
              Clear Filters
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
