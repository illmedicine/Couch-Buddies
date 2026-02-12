import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiSearch, FiX, FiSave, FiGrid, FiList } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function OwnerProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [editingProduct, setEditingProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  const categories = ['All', ...new Set(products.map(p => p.category))]
  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter
    return matchesSearch && matchesCat
  })

  const emptyProduct = {
    name: '', description: '', price: '', category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Black'], stock: '',
    featured: false, images: [''],
  }

  const openAdd = () => { setEditingProduct({ ...emptyProduct }); setShowModal(true) }
  const openEdit = (product) => { setEditingProduct({ ...product, price: String(product.price), stock: String(product.stock) }); setShowModal(true) }
  const closeModal = () => { setEditingProduct(null); setShowModal(false) }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...editingProduct,
      price: parseFloat(editingProduct.price) || 0,
      stock: parseInt(editingProduct.stock) || 0,
      images: editingProduct.images.filter(img => img.trim() !== ''),
    }
    if (!data.name || !data.price) { toast.error('Name and price required'); return }

    if (editingProduct.id) {
      updateProduct(editingProduct.id, data)
      toast.success('Product updated!')
    } else {
      addProduct(data)
      toast.success('Product added!')
    }
    closeModal()
  }

  const handleDelete = (id) => {
    if (confirm('Delete this product?')) {
      deleteProduct(id)
      toast.success('Product deleted')
    }
  }

  const handleImageUpload = (index) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const imgs = [...editingProduct.images]
          imgs[index] = ev.target.result
          setEditingProduct({ ...editingProduct, images: imgs })
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Products</h1>
          <p className="text-gray-400 mt-1">{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 w-fit">
          <FiPlus size={18} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-brand-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400'}`}><FiGrid size={18} /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-400'}`}><FiList size={18} /></button>
        </div>
      </div>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(product => (
            <motion.div key={product.id} layout className="glass-card p-0 overflow-hidden group">
              <div className="aspect-square bg-surface-800 relative overflow-hidden">
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/400?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.featured && (
                  <span className="absolute top-3 left-3 badge-brand text-xs">Featured</span>
                )}
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(product)} className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70"><FiEdit2 size={14} /></button>
                  <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg bg-black/50 text-red-400 hover:bg-black/70"><FiTrash2 size={14} /></button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{product.category}</p>
                <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-brand-400 font-bold">${product.price.toFixed(2)}</p>
                  <span className={`text-xs ${product.stock < 20 ? 'text-red-400' : 'text-gray-400'}`}>
                    {product.stock} in stock
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-xs text-gray-400 font-medium">Product</th>
                <th className="text-left p-4 text-xs text-gray-400 font-medium hidden sm:table-cell">Category</th>
                <th className="text-left p-4 text-xs text-gray-400 font-medium">Price</th>
                <th className="text-left p-4 text-xs text-gray-400 font-medium hidden sm:table-cell">Stock</th>
                <th className="text-right p-4 text-xs text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id} className="table-row">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={product.images?.[0] || ''} alt="" className="w-10 h-10 rounded-lg object-cover bg-surface-800" />
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        {product.featured && <span className="badge-brand text-xs mt-0.5">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-400 hidden sm:table-cell">{product.category}</td>
                  <td className="p-4 text-sm font-semibold text-brand-400">${product.price.toFixed(2)}</td>
                  <td className={`p-4 text-sm hidden sm:table-cell ${product.stock < 20 ? 'text-red-400' : 'text-gray-400'}`}>{product.stock}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEdit(product)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"><FiEdit2 size={16} /></button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400"><FiTrash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && editingProduct && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-content max-w-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">
                  {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-white/10"><FiX /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Images */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Product Images</label>
                  <div className="grid grid-cols-3 gap-3">
                    {editingProduct.images.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-xl border-2 border-dashed border-white/10 overflow-hidden relative group cursor-pointer hover:border-brand-500/50 transition-colors"
                        onClick={() => handleImageUpload(idx)}>
                        {img ? (
                          <>
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <FiImage size={20} />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                            <FiImage size={24} />
                            <span className="text-xs mt-1">Upload</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {editingProduct.images.length < 4 && (
                      <button type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, images: [...editingProduct.images, ''] })}
                        className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-colors">
                        <FiPlus size={24} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Click to upload or paste URL below</p>
                  <input
                    type="url"
                    placeholder="Or paste image URL..."
                    value={editingProduct.images[0] || ''}
                    onChange={e => {
                      const imgs = [...editingProduct.images]
                      imgs[0] = e.target.value
                      setEditingProduct({ ...editingProduct, images: imgs })
                    }}
                    className="input-field mt-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Product Name *</label>
                    <input type="text" required value={editingProduct.name}
                      onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="input-field" placeholder="Classic Tee" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                    <select value={editingProduct.category}
                      onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="input-field">
                      {['T-Shirts', 'Hoodies', 'Outerwear', 'Bottoms', 'Accessories', 'Limited Edition'].map(c => (
                        <option key={c} value={c} className="bg-surface-800">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea rows={3} value={editingProduct.description}
                    onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="input-field resize-none" placeholder="Product description..." />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Price ($) *</label>
                    <input type="number" step="0.01" required value={editingProduct.price}
                      onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      className="input-field" placeholder="29.99" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Stock</label>
                    <input type="number" value={editingProduct.stock}
                      onChange={e => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                      className="input-field" placeholder="100" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={editingProduct.featured}
                        onChange={e => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                        className="w-5 h-5 rounded bg-white/5 border-white/20 text-brand-500 focus:ring-brand-500" />
                      <span className="text-sm">Featured</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Sizes (comma separated)</label>
                    <input type="text" value={editingProduct.sizes?.join(', ') || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="input-field" placeholder="S, M, L, XL" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Colors (comma separated)</label>
                    <input type="text" value={editingProduct.colors?.join(', ') || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, colors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="input-field" placeholder="Black, White" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <FiSave size={16} /> {editingProduct.id ? 'Save Changes' : 'Add Product'}
                  </button>
                  <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
