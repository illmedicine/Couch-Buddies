import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'

export default function Navbar() {
  const { cart, currentUser, userRole } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl"></span>
            <span className="font-bold text-lg tracking-tight">Couch Buddies</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/shop" className={`text-sm font-medium transition-colors ${location.pathname === '/shop' ? 'text-brand-400' : 'text-gray-300 hover:text-white'}`}>
              Shop All
            </Link>
            <Link to="/shop?category=CBD+Gummies" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Gummies
            </Link>
            <Link to="/shop?category=Tinctures" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Tinctures
            </Link>
            <Link to="/shop?category=Chocolates" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Chocolates
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link to={currentUser ? (userRole === 'owner' ? '/owner' : userRole === 'staff' ? '/staff' : '/orders') : '/auth'}
              className="text-gray-300 hover:text-white transition-colors">
              <FiUser size={20} />
            </Link>
            <Link to="/cart" className="relative text-gray-300 hover:text-white transition-colors">
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-300 hover:text-white">
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 py-4 space-y-1 animate-slide-down">
            <Link to="/shop" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">Shop All</Link>
            <Link to="/shop?category=CBD+Gummies" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">Gummies</Link>
            <Link to="/shop?category=Tinctures" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">Tinctures</Link>
            <Link to="/shop?category=Chocolates" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">Chocolates</Link>
            {currentUser && (
              <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">My Orders</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}