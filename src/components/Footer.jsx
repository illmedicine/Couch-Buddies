import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl"></span>
              <span className="font-bold text-xl">Couch Buddies</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium CBD gummies, tinctures & sweet treats. Crafted for wellness, delivered to your door.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-3">
              <li><Link to="/shop?category=CBD+Gummies" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">CBD Gummies</Link></li>
              <li><Link to="/shop?category=Tinctures" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Tinctures</Link></li>
              <li><Link to="/shop?category=Chocolates" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Chocolates</Link></li>
              <li><Link to="/shop?category=Hard+Candy" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Hard Candy</Link></li>
              <li><Link to="/shop?category=Beverages" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Beverages</Link></li>
              <li><Link to="/shop" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Useful Links</h4>
            <ul className="space-y-3">
              <li><Link to="/auth" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">My Account</Link></li>
              <li><Link to="/orders" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Track Order</Link></li>
              <li><Link to="/cart" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Cart</Link></li>
              <li><Link to="/shop" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Shop</Link></li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Stay Connected</h4>
            <p className="text-sm text-gray-400 mb-4">Get exclusive drops and sweet deals delivered to your inbox.</p>
            <Link to="/auth" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              Join Now <FiArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Couch Buddies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-500">Privacy Policy</span>
            <span className="text-xs text-gray-500">Terms of Service</span>
            <span className="text-xs text-gray-500">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}