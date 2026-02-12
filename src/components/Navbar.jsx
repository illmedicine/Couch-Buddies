import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { FiShoppingCart, FiUser, FiMenu, FiX, FiPackage, FiLogOut, FiLogIn } from 'react-icons/fi'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { cart, currentUser, userRole, logout } = useStore()
  const navigate = useNavigate()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg gradient-brand flex items-center justify-center font-bold text-sm">
              CB
            </div>
            <span className="font-display font-bold text-lg hidden sm:block group-hover:text-brand-400 transition-colors">
              Couch Buddies
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/shop" className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
              Shop
            </Link>
            {currentUser && userRole === 'customer' && !currentUser.isGuest && (
              <Link to="/orders" className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium flex items-center gap-1.5">
                <FiPackage size={15} /> Orders
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-white/10 transition-all group">
              <FiShoppingCart size={20} className="text-gray-300 group-hover:text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {currentUser && userRole === 'customer' ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-sm text-gray-400">
                  {currentUser.isGuest ? 'Guest' : currentUser.name}
                </span>
                <button onClick={handleLogout} className="p-2.5 rounded-xl hover:bg-white/10 transition-all" title="Sign out">
                  <FiLogOut size={18} className="text-gray-400 hover:text-white" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                <FiLogIn size={16} /> Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-surface-900/95 backdrop-blur-xl animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            <Link to="/shop" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-medium">
              Shop
            </Link>
            {currentUser && userRole === 'customer' && !currentUser.isGuest && (
              <Link to="/orders" onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-medium">
                My Orders
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
