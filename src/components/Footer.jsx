import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5">
      {/* Marquee banner */}
      <div className="overflow-hidden py-4 border-b border-white/5">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="mx-8 text-sm font-semibold text-brand-400 tracking-wider uppercase">
              Sweet Treats & Real Wellness &nbsp;&#x2022;&nbsp; Lab-Tested CBD &nbsp;&#x2022;&nbsp; Fast Delivery &nbsp;&#x2022;&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Couch Buddies" className="w-9 h-9 rounded-lg object-cover" />
              <span className="text-lg font-bold">Couch Buddies</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Sweet treats & real wellness. Premium CBD edibles, tinctures, and more  lab-tested and shipped to your door.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-4">Categories</h4>
            <ul className="space-y-2.5">
              <li><Link to="/shop" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=Flower" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Flower</Link></li>
              <li><Link to="/shop?category=Gummies+%26+Edibles" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Gummies & Edibles</Link></li>
              <li><Link to="/shop?category=Tinctures" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Tinctures</Link></li>
              <li><Link to="/shop?category=Vapes" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Vapes</Link></li>
              <li><Link to="/shop?category=Pre-Rolls" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Pre-Rolls</Link></li>
              <li><Link to="/shop?category=Chocolates" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Chocolates</Link></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-4">Useful Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/shop" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Shop</Link></li>
              <li><Link to="/orders" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Track Order</Link></li>
              <li><Link to="/auth" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">My Account</Link></li>
              <li><Link to="/cart" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Cart</Link></li>
              <li><Link to="/owner/login" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Owner Portal</Link></li>
              <li><Link to="/staff/login" className="text-sm text-gray-400 hover:text-brand-400 transition-colors">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-4">Get In Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMail className="text-brand-400 mt-0.5 flex-shrink-0" size={14} />
                <span className="text-sm text-gray-400">orders@couchbuddies.com</span>
              </li>
              <li className="flex items-start gap-3">
                <FiPhone className="text-brand-400 mt-0.5 flex-shrink-0" size={14} />
                <span className="text-sm text-gray-400">(555) 420-BUDS</span>
              </li>
              <li className="flex items-start gap-3">
                <FiMapPin className="text-brand-400 mt-0.5 flex-shrink-0" size={14} />
                <span className="text-sm text-gray-400">Online Only  Ships Nationwide</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Couch Buddies. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-xs text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-xs text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="text-xs text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}