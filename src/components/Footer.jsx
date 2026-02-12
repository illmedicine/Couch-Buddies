import { Link } from 'react-router-dom'
import { FiGithub, FiHeart } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg gradient-brand flex items-center justify-center font-bold text-sm">CB</div>
              <span className="font-display font-bold text-lg">Couch Buddies</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Premium lifestyle merch for the cozy crew. We believe in comfort, community, and looking good while doing absolutely nothing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-gray-400 hover:text-brand-400 text-sm transition-colors">Shop All</Link></li>
              <li><Link to="/auth" className="text-gray-400 hover:text-brand-400 text-sm transition-colors">Sign In</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-brand-400 text-sm transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="font-semibold text-white mb-4">Portals</h4>
            <ul className="space-y-2">
              <li><Link to="/owner/login" className="text-gray-400 hover:text-accent-400 text-sm transition-colors">Owner Portal</Link></li>
              <li><Link to="/staff/login" className="text-gray-400 hover:text-accent-400 text-sm transition-colors">Staff Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Couch Buddies. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs flex items-center gap-1">
            Made with <FiHeart size={12} className="text-red-400" /> for the cozy crew
          </p>
        </div>
      </div>
    </footer>
  )
}
