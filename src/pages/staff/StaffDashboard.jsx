import { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { Link } from 'react-router-dom'
import { FiClock, FiMapPin, FiTruck, FiShoppingBag, FiDollarSign, FiMessageSquare, FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function StaffDashboard() {
  const { currentUser, staff, clockIn, clockOut, updateStaffLocation, orders, updateStaff } = useStore()
  const me = staff.find(s => s.id === currentUser?.id) || currentUser
  const [clockMode, setClockMode] = useState(me?.role || 'onsite')
  const [locationGranted, setLocationGranted] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)

  const myOrders = orders.filter(o => o.driverId === me?.id && o.status !== 'delivered' && o.status !== 'cancelled')

  // Watch GPS when clocked in
  useEffect(() => {
    if (!me?.clockedIn) return
    let watchId
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          updateStaffLocation(me.id, { lat: pos.coords.latitude, lng: pos.coords.longitude })
          setLocationGranted(true)
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 10000 }
      )
    }
    return () => { if (watchId !== undefined) navigator.geolocation.clearWatch(watchId) }
  }, [me?.clockedIn])

  const handleClockIn = () => {
    setGettingLocation(true)
    if (!navigator.geolocation) {
      toast.error('GPS not available on this device')
      setGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        clockIn(me.id, clockMode, location)
        // Also update the currentUser in the store so sidebar updates
        updateStaff(me.id, { clockedIn: true, clockType: clockMode, location })
        setLocationGranted(true)
        setGettingLocation(false)
        toast.success(`Clocked in as ${clockMode === 'delivery' ? 'Delivery' : 'In-Store'}!`)
      },
      (err) => {
        setGettingLocation(false)
        toast.error('Please enable GPS/Location to clock in')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleClockOut = () => {
    clockOut(me.id)
    updateStaff(me.id, { clockedIn: false, clockType: null, location: null })
    toast.success('Clocked out successfully')
  }

  // Calculate today's hours
  const todayClockEvents = (me?.clockHistory || []).filter(e => {
    const eventDate = new Date(e.time).toDateString()
    const today = new Date().toDateString()
    return eventDate === today
  })

  let todayHours = 0
  for (let i = 0; i < todayClockEvents.length; i += 2) {
    const clockInEvent = todayClockEvents[i]
    const clockOutEvent = todayClockEvents[i + 1]
    if (clockInEvent?.type === 'clock-in') {
      const end = clockOutEvent ? new Date(clockOutEvent.time) : new Date()
      todayHours += (end - new Date(clockInEvent.time)) / 3600000
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">
          Hey, {me?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-400 mt-1">
          {me?.clockedIn
            ? `You're clocked in as ${me?.clockType || me?.role}`
            : 'Clock in to start your shift'}
        </p>
      </div>

      {/* Clock In/Out Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-card ${me?.clockedIn ? 'border-emerald-500/30 glow-brand' : ''}`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FiClock size={20} className={me?.clockedIn ? 'text-emerald-400' : 'text-gray-400'} />
              <h2 className="font-semibold text-lg">Time Clock</h2>
            </div>
            <p className="text-sm text-gray-400">
              Today: {todayHours.toFixed(1)}h worked
            </p>
            {me?.clockedIn && me?.location && (
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <FiMapPin size={12} className="text-emerald-400" />
                GPS: {me.location.lat?.toFixed(4)}, {me.location.lng?.toFixed(4)}
              </p>
            )}
          </div>

          {!me?.clockedIn ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              {/* Clock mode selector */}
              <div className="flex gap-2">
                <button
                  onClick={() => setClockMode('onsite')}
                  className={`flex-1 sm:flex-auto px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                    clockMode === 'onsite'
                      ? 'bg-brand-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <FiShoppingBag size={16} /> In-Store
                </button>
                <button
                  onClick={() => setClockMode('delivery')}
                  className={`flex-1 sm:flex-auto px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                    clockMode === 'delivery'
                      ? 'bg-brand-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <FiTruck size={16} /> Delivery
                </button>
              </div>

              <button
                onClick={handleClockIn}
                disabled={gettingLocation}
                className="btn-success py-3 px-6 flex items-center justify-center gap-2"
              >
                {gettingLocation ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Getting GPS...
                  </>
                ) : (
                  <>
                    <FiClock size={18} /> Clock In
                  </>
                )}
              </button>
            </div>
          ) : (
            <button onClick={handleClockOut} className="btn-danger py-3 px-6 flex items-center gap-2">
              <FiClock size={18} /> Clock Out
            </button>
          )}
        </div>

        {!me?.clockedIn && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
            <FiAlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300">
              GPS location is required for clock-in. Your browser will ask for permission.
            </p>
          </div>
        )}
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/staff/wallet" className="glass-card hover:border-white/20 transition-all group">
          <FiDollarSign size={20} className="text-emerald-400 mb-2" />
          <p className="text-xl font-bold">${me?.wallet?.balance?.toFixed(2) || '0.00'}</p>
          <p className="text-xs text-gray-400 mt-1 group-hover:text-white transition-colors">My Wallet</p>
        </Link>
        <Link to="/staff/chat" className="glass-card hover:border-white/20 transition-all group">
          <FiMessageSquare size={20} className="text-blue-400 mb-2" />
          <p className="text-xl font-bold">Chat</p>
          <p className="text-xs text-gray-400 mt-1 group-hover:text-white transition-colors">Team Messages</p>
        </Link>
        {(me?.role === 'delivery' || me?.clockType === 'delivery') && (
          <Link to="/staff/delivery" className="glass-card hover:border-white/20 transition-all group">
            <FiTruck size={20} className="text-brand-400 mb-2" />
            <p className="text-xl font-bold">{myOrders.length}</p>
            <p className="text-xs text-gray-400 mt-1 group-hover:text-white transition-colors">Active Orders</p>
          </Link>
        )}
        {(me?.role === 'onsite' || me?.clockType === 'onsite') && (
          <Link to="/staff/instore" className="glass-card hover:border-white/20 transition-all group">
            <FiShoppingBag size={20} className="text-accent-400 mb-2" />
            <p className="text-xl font-bold">POS</p>
            <p className="text-xs text-gray-400 mt-1 group-hover:text-white transition-colors">In-Store Sales</p>
          </Link>
        )}
      </div>

      {/* Recent Clock History */}
      <div className="glass-card">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FiClock size={18} className="text-brand-400" /> Recent Clock History
        </h3>
        {(me?.clockHistory || []).length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No clock history yet</p>
        ) : (
          <div className="space-y-2">
            {[...(me?.clockHistory || [])].reverse().slice(0, 10).map((event, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${event.type === 'clock-in' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <div>
                    <p className="text-sm font-medium">
                      {event.type === 'clock-in' ? 'Clocked In' : 'Clocked Out'}
                      {event.staffType && <span className="text-gray-400"> ({event.staffType})</span>}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(event.time).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
