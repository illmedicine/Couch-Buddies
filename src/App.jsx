import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'

// Public / Customer
import Landing from './pages/Landing'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import CustomerAuth from './pages/CustomerAuth'
import CustomerOrders from './pages/CustomerOrders'
import OrderTracking from './pages/OrderTracking'

// Owner
import OwnerLogin from './pages/OwnerLogin'
import OwnerLayout from './pages/owner/OwnerLayout'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import OwnerProducts from './pages/owner/OwnerProducts'
import OwnerStaff from './pages/owner/OwnerStaff'
import OwnerOrders from './pages/owner/OwnerOrders'
import OwnerTreasury from './pages/owner/OwnerTreasury'
import OwnerLedger from './pages/owner/OwnerLedger'
import OwnerProfile from './pages/owner/OwnerProfile'

// Staff
import StaffLogin from './pages/StaffLogin'
import StaffLayout from './pages/staff/StaffLayout'
import StaffDashboard from './pages/staff/StaffDashboard'
import StaffChat from './pages/staff/StaffChat'
import StaffWallet from './pages/staff/StaffWallet'
import DeliveryMode from './pages/staff/DeliveryMode'
import InStoreMode from './pages/staff/InStoreMode'

function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, userRole } = useStore()
  if (!currentUser || userRole !== requiredRole) {
    const loginPath = requiredRole === 'owner' ? '/owner/login' : requiredRole === 'staff' ? '/staff/login' : '/auth'
    return <Navigate to={loginPath} replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public / Customer Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/auth" element={<CustomerAuth />} />
      <Route path="/orders" element={<CustomerOrders />} />
      <Route path="/track/:orderId" element={<OrderTracking />} />

      {/* Owner Routes */}
      <Route path="/owner/login" element={<OwnerLogin />} />
      <Route path="/owner" element={
        <ProtectedRoute requiredRole="owner">
          <OwnerLayout />
        </ProtectedRoute>
      }>
        <Route index element={<OwnerDashboard />} />
        <Route path="products" element={<OwnerProducts />} />
        <Route path="staff" element={<OwnerStaff />} />
        <Route path="orders" element={<OwnerOrders />} />
        <Route path="treasury" element={<OwnerTreasury />} />
        <Route path="ledger" element={<OwnerLedger />} />
        <Route path="profile" element={<OwnerProfile />} />
      </Route>

      {/* Staff Routes */}
      <Route path="/staff/login" element={<StaffLogin />} />
      <Route path="/staff" element={
        <ProtectedRoute requiredRole="staff">
          <StaffLayout />
        </ProtectedRoute>
      }>
        <Route index element={<StaffDashboard />} />
        <Route path="chat" element={<StaffChat />} />
        <Route path="wallet" element={<StaffWallet />} />
        <Route path="delivery" element={<DeliveryMode />} />
        <Route path="instore" element={<InStoreMode />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
