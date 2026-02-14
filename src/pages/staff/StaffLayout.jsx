import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import {
  FiGrid, FiMessageSquare, FiDollarSign, FiLogOut, FiMenu, FiX,
  FiTruck, FiShoppingBag, FiUser
} from 'react-icons/fi'
import { useState } from 'react'

export default function StaffLayout() {
  const { currentUser, logout } = useStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isDelivery = currentUser?.role === 'delivery' || currentUser?.clockType === 'delivery'
  const isOnsite = currentUser?.role === 'onsite' || currentUser?.clockType === 'onsite'

  const navItems = [
    { to: '/staff', icon: FiGrid, label: 'Dashboard', end: true },
    ...(isDelivery || currentUser?.role === 'delivery'
      ? [{ to: '/staff/delivery', icon: FiTruck, label: 'Deliveries' }]
      : []),
    ...(isOnsite || currentUser?.role === 'onsite'
      ? [{ to: '/staff/instore', icon: FiShoppingBag, label: 'In-Store POS' }]
      : []),
    { to: '/staff/chat', icon: FiMessageSquare, label: 'Team Chat' },
    { to: '/staff/wallet', icon: FiDollarSign, label: 'My Wallet' },
    { to: '/staff/profile', icon: FiUser, label: 'My Profile' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface-900 border-r border-white/5 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-bold text-sm">
              CB
            </div>
            <div>
              <span className="font-display font-bold text-sm">Couch Buddies</span>
              <p className="text-xs text-brand-400">Staff Portal</p>
            </div>
          </div>
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        {/* Staff Info */}
        <div className="px-4 mb-4">
          <div className="p-3 rounded-xl bg-white/5">
            <p className="font-medium text-sm">{currentUser?.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {currentUser?.clockedIn ? (
                <span className="text-emerald-400">● Clocked In — {currentUser?.clockType || currentUser?.role}</span>
              ) : (
                <span className="text-gray-500">○ Not clocked in</span>
              )}
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
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
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 h-16 glass border-b border-white/5 flex items-center px-4 sm:px-6 gap-4">
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={20} />
          </button>
          <h2 className="font-display font-semibold text-lg">Staff Dashboard</h2>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
