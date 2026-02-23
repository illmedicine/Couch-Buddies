import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import {
  FiGrid, FiBox, FiUsers, FiShoppingCart, FiDollarSign,
  FiFileText, FiLogOut, FiMenu, FiX, FiSettings
} from 'react-icons/fi'
import { useState } from 'react'

const navItems = [
  { to: '/owner', icon: FiGrid, label: 'Dashboard', end: true },
  { to: '/owner/products', icon: FiBox, label: 'Products' },
  { to: '/owner/staff', icon: FiUsers, label: 'Staff' },
  { to: '/owner/orders', icon: FiShoppingCart, label: 'Orders' },
  { to: '/owner/treasury', icon: FiDollarSign, label: 'Treasury' },
  { to: '/owner/ledger', icon: FiFileText, label: 'Ledger' },
  { to: '/owner/profile', icon: FiSettings, label: 'Profile' },
]

export default function OwnerLayout() {
  const { logout, ownerProfile } = useStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-surface-900 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black/40 border-r border-white/5 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-sm text-black overflow-hidden">
              {ownerProfile?.photoURL ? (
                <img src={ownerProfile.photoURL} alt="Owner" className="w-full h-full object-cover" />
              ) : (
                'CB'
              )}
            </div>
            <div>
              <span className="font-semibold text-sm">Couch Buddies</span>
              <p className="text-[11px] text-brand-400 font-medium">Owner Portal</p>
            </div>
          </div>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout}
            className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <FiLogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 h-14 bg-surface-900/80 backdrop-blur-md border-b border-white/5 flex items-center px-4 sm:px-6 gap-4">
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={20} />
          </button>
          <h2 className="font-semibold text-sm text-gray-300">Management Dashboard</h2>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}