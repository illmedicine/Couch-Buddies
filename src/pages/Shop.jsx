import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiSearch, FiGrid, FiList } from 'react-icons/fi'
import { motion } from 'framer-motion'

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' fill='%23141414'%3E%3Crect width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23333' font-family='sans-serif' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E"

export default function Shop() {
  const { products } = useStore()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const initialCat = searchParams.get('category') || 'All'
  const [category, setCategory] = useState(initialCat)
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState('grid')

  // Sync category from URL on param change
  const urlCat = searchParams.get('category') || 'All'
  if (urlCat !== category && urlCat !== initialCat) setCategory(urlCat)

  const categories = ['All', ...new Set(products.map(p => p.category))]

  const filtered = useMemo(() => {
    let result = [...products]
    if (category !== 'All') result = result.filter(p => p.category === category)
    if (search) result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
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
    <div className="min-h-screen bg-surface-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{category === 'All' ? 'Shop All' : category}</h1>
          <p className="text-gray-400 text-sm">Browse our full collection of premium CBD & wellness products</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-11 text-sm" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-brand-500 text-black'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">{filtered.length} products</p>
          <div className="flex items-center gap-3">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field w-auto text-sm py-2 pr-8">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <div className="hidden sm:flex gap-1 bg-white/5 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500'}`}><FiGrid size={16} /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500'}`}><FiList size={16} /></button>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.03 }}>
                <Link to={`/product/${product.id}`} className="group block">
                  <div className="rounded-2xl overflow-hidden bg-surface-800 border border-white/5 hover:border-white/15 transition-all">
                    <div className="aspect-square overflow-hidden relative">
                      <img src={product.images?.[0] || PLACEHOLDER} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" onError={(e) => { if (!e.target.dataset.f) { e.target.dataset.f='1'; e.target.src=PLACEHOLDER } }} />
                      {product.featured && <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand-500 text-black uppercase tracking-wider">Staff Pick</span>}
                      {product.stock < 20 && <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-600/90 text-white">Low Stock</span>}
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-1">{product.name}</h3>
                      <p className="text-brand-400 font-bold mt-1.5">${product.price?.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.03 }}>
                <Link to={`/product/${product.id}`} className="group block">
                  <div className="flex rounded-2xl overflow-hidden bg-surface-800 border border-white/5 hover:border-white/15 transition-all">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 overflow-hidden">
                      <img src={product.images?.[0] || PLACEHOLDER} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" onError={(e) => { if (!e.target.dataset.f) { e.target.dataset.f='1'; e.target.src=PLACEHOLDER } }} />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-center">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{product.category}</p>
                      <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{product.name}</h3>
                      <p className="text-gray-400 text-xs line-clamp-2 mt-1">{product.description}</p>
                      <p className="text-brand-400 font-bold mt-2">${product.price?.toFixed(2)}</p>
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
            <button onClick={() => { setSearch(''); setCategory('All') }} className="btn-secondary mt-4 text-sm">Clear Filters</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}