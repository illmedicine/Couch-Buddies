import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi'

export default function Navbar() {
  const { cart } = useStore()
  const [open, setOpen] = useState(false)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const categories = [
    { label: 'Shop All', to: '/shop' },
    { label: 'Flower', to: '/shop?category=Flower' },
    { label: 'Gummies', to: '/shop?category=Gummies+%26+Edibles' },
    { label: 'Tinctures', to: '/shop?category=Tinctures' },
    { label: 'Vapes', to: '/shop?category=Vapes' },
    { label: 'Pre-Rolls', to: '/shop?category=Pre-Rolls' },
    { label: 'Topicals', to: '/shop?category=Topicals' },
  ]

  return (
    <>
      {/* Promo banner */}
      <div className="bg-brand-500 text-black text-center py-2 text-xs sm:text-sm font-semibold tracking-wide">
        Free Shipping on Orders $75+ &nbsp;|&nbsp; Lab-Tested &amp; Trusted
      </div>

      <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Couch Buddies" className="w-9 h-9 rounded-lg object-cover" />
            <span className="text-lg font-bold tracking-tight hidden sm:block">Couch Buddies</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {categories.map(cat => (
              <Link key={cat.label} to={cat.to}
                className="px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                {cat.label}
              </Link>
            ))}
            <Link to="/shop?category=Chocolates"
              className="px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              Chocolates
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link to="/auth" className="p-2 text-gray-400 hover:text-white transition-colors hidden sm:block">
              <FiUser size={20} />
            </Link>
            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-gray-400 hover:text-white">
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden bg-black/95 border-t border-white/5 pb-4">
            <div className="max-w-7xl mx-auto px-4 space-y-1 pt-3">
              {categories.map(cat => (
                <Link key={cat.label} to={cat.to} onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  {cat.label}
                </Link>
              ))}
              <Link to="/shop?category=Chocolates" onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                Chocolates
              </Link>
              <div className="border-t border-white/10 pt-3 mt-3 space-y-1">
                <Link to="/auth" onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  Account
                </Link>
                <Link to="/owner/login" onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  Owner Portal
                </Link>
                <Link to="/staff/login" onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  Staff Portal
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}