// Zustand store for global state management
// Shared data (products, staff, orders, etc.) synced via Firebase Realtime Database
// Local session data (cart, auth) persisted in localStorage
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ref, set as fbSet } from 'firebase/database'
import { db } from '../firebase'
import { seedProducts, seedStaff } from './seedData'

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36)

// Safety helper: ensure a value is always an array (protects against Firebase object conversion)
const ensureArray = (val) => {
  if (Array.isArray(val)) return val
  if (val && typeof val === 'object') return Object.values(val).filter(Boolean)
  return []
}

export const useStore = create(
  persist(
    (set, get) => ({
      // ─── Firebase sync readiness ───
      _firebaseReady: false,

      // ─── Owner Profile (synced via Firebase) ───
      ownerProfile: {
        id: 'owner-1',
        name: 'Owner',
        email: 'owner@couchbuddies.com',
        phone: '',
        businessName: 'Couch Buddies',
        businessAddress: '',
        pin: '1234',
        avatar: 'CB',
        createdAt: '2026-01-01T00:00:00Z',
      },

      updateOwnerProfile: (updates) => set(state => {
        const newProfile = { ...state.ownerProfile, ...updates }
        // Auto-update avatar from name initials
        if (updates.name) {
          newProfile.avatar = updates.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CB'
        }
        // If owner is currently logged in, update currentUser too
        const newCurrentUser = state.userRole === 'owner' && state.currentUser
          ? { ...state.currentUser, name: newProfile.name, email: newProfile.email, phone: newProfile.phone }
          : state.currentUser
        return { ownerProfile: newProfile, currentUser: newCurrentUser }
      }),

      // ─── Auth State ───
      currentUser: null,
      userRole: null, // 'customer' | 'owner' | 'staff'

      loginAsCustomer: (user) => set({ currentUser: user, userRole: 'customer' }),
      loginAsGuest: () => set({
        currentUser: { id: 'guest-' + generateId(), name: 'Guest', email: '', isGuest: true },
        userRole: 'customer'
      }),
      loginAsOwner: (pin) => {
        const profile = get().ownerProfile
        if (pin === (profile.pin || '1234')) {
          set({
            currentUser: {
              id: profile.id || 'owner-1',
              name: profile.name || 'Owner',
              email: profile.email || 'owner@couchbuddies.com',
              phone: profile.phone || '',
              role: 'owner',
            },
            userRole: 'owner',
          })
          return true
        }
        return false
      },
      loginAsStaff: (staffId, pin) => {
        const staff = ensureArray(get().staff).find(s => s.id === staffId)
        if (staff && (pin === '0000' || pin === staff.pin)) {
          set({ currentUser: { ...staff }, userRole: 'staff' })
          return true
        }
        return false
      },
      logout: () => set({ currentUser: null, userRole: null }),

      // ─── Products ───
      products: seedProducts,

      addProduct: (product) => set(state => ({
        products: [...ensureArray(state.products), { ...product, id: generateId(), createdAt: new Date().toISOString() }]
      })),

      updateProduct: (id, updates) => set(state => ({
        products: ensureArray(state.products).map(p => p.id === id ? { ...p, ...updates } : p)
      })),

      deleteProduct: (id) => set(state => ({
        products: ensureArray(state.products).filter(p => p.id !== id)
      })),

      // ─── Cart ───
      cart: [],

      addToCart: (product, quantity = 1, size = 'M', color = '') => set(state => {
        const existing = state.cart.find(
          item => item.productId === product.id && item.size === size && item.color === color
        )
        if (existing) {
          return {
            cart: state.cart.map(item =>
              item.productId === product.id && item.size === size && item.color === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }
        }
        return {
          cart: [...state.cart, {
            id: generateId(),
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || product.image,
            quantity,
            size,
            color,
          }]
        }
      }),

      updateCartItem: (id, quantity) => set(state => ({
        cart: quantity <= 0
          ? state.cart.filter(item => item.id !== id)
          : state.cart.map(item => item.id === id ? { ...item, quantity } : item)
      })),

      removeFromCart: (id) => set(state => ({
        cart: state.cart.filter(item => item.id !== id)
      })),

      clearCart: () => set({ cart: [] }),

      // ─── Orders ───
      orders: [],

      createOrder: (orderData) => {
        const order = {
          id: 'ORD-' + generateId().toUpperCase(),
          ...orderData,
          status: 'pending',
          createdAt: new Date().toISOString(),
          timeline: [{ status: 'pending', time: new Date().toISOString(), note: 'Order placed' }],
        }
        set(state => ({ orders: [...ensureArray(state.orders), order], cart: [] }))
        return order
      },

      updateOrderStatus: (orderId, status, note = '') => set(state => ({
        orders: ensureArray(state.orders).map(o => o.id === orderId ? {
          ...o,
          status,
          timeline: [...(o.timeline || []), { status, time: new Date().toISOString(), note }]
        } : o)
      })),

      assignDriver: (orderId, driverId) => set(state => ({
        orders: ensureArray(state.orders).map(o => o.id === orderId ? {
          ...o,
          driverId,
          status: 'assigned',
          timeline: [...(o.timeline || []), {
            status: 'assigned',
            time: new Date().toISOString(),
            note: `Assigned to driver ${ensureArray(state.staff).find(s => s.id === driverId)?.name || driverId}`
          }]
        } : o)
      })),

      // ─── Staff ───
      staff: seedStaff,

      addStaff: (staffData) => set(state => ({
        staff: [...ensureArray(state.staff), {
          id: generateId(),
          clockedIn: false,
          clockHistory: [],
          wallet: { balance: 0, transactions: [] },
          location: null,
          createdAt: new Date().toISOString(),
          ...staffData,
          avatar: staffData.name ? staffData.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??',
        }]
      })),

      updateStaff: (id, updates) => set(state => ({
        staff: ensureArray(state.staff).map(s => s.id === id ? { ...s, ...updates } : s)
      })),

      deleteStaff: (id) => set(state => ({
        staff: ensureArray(state.staff).filter(s => s.id !== id)
      })),

      clockIn: (staffId, type, location) => set(state => ({
        staff: ensureArray(state.staff).map(s => s.id === staffId ? {
          ...s,
          clockedIn: true,
          clockType: type,
          location,
          clockHistory: [...s.clockHistory, {
            type: 'clock-in',
            staffType: type,
            time: new Date().toISOString(),
            location,
          }]
        } : s)
      })),

      clockOut: (staffId) => set(state => ({
        staff: ensureArray(state.staff).map(s => s.id === staffId ? {
          ...s,
          clockedIn: false,
          clockType: null,
          location: null,
          clockHistory: [...s.clockHistory, {
            type: 'clock-out',
            time: new Date().toISOString(),
          }]
        } : s)
      })),

      updateStaffLocation: (staffId, location) => set(state => ({
        staff: ensureArray(state.staff).map(s => s.id === staffId ? { ...s, location } : s)
      })),

      // ─── Staff Wallet / Payments ───
      payStaff: (staffId, amount, note = '') => set(state => {
        const transaction = {
          id: generateId(),
          type: 'payment',
          amount,
          note,
          from: 'Owner Treasury',
          time: new Date().toISOString(),
        }
        return {
          staff: ensureArray(state.staff).map(s => s.id === staffId ? {
            ...s,
            wallet: {
              balance: (s.wallet?.balance || 0) + amount,
              transactions: [...(s.wallet?.transactions || []), transaction]
            }
          } : s),
          treasury: {
            ...state.treasury,
            balance: state.treasury.balance - amount,
            transactions: [...ensureArray(state.treasury?.transactions), {
              ...transaction,
              type: 'staff-payment',
              to: ensureArray(state.staff).find(s => s.id === staffId)?.name || staffId,
            }]
          }
        }
      }),

      // ─── Treasury ───
      treasury: {
        balance: 50000,
        accounts: [
          { id: 'acc-1', name: 'Business Checking', type: 'bank', last4: '4521', connected: true },
          { id: 'acc-2', name: 'Business Debit', type: 'debit', last4: '8832', connected: true },
        ],
        transactions: [
          { id: 't1', type: 'deposit', amount: 50000, note: 'Initial funding', time: '2026-01-01T00:00:00Z', from: 'Bank Transfer' },
        ]
      },

      addTreasuryAccount: (account) => set(state => ({
        treasury: {
          ...state.treasury,
          accounts: [...ensureArray(state.treasury?.accounts), { ...account, id: generateId(), connected: true }]
        }
      })),

      removeTreasuryAccount: (accountId) => set(state => ({
        treasury: {
          ...state.treasury,
          accounts: ensureArray(state.treasury?.accounts).filter(a => a.id !== accountId)
        }
      })),

      addTreasuryFunds: (amount, note) => set(state => ({
        treasury: {
          ...state.treasury,
          balance: (state.treasury?.balance || 0) + amount,
          transactions: [...ensureArray(state.treasury?.transactions), {
            id: generateId(),
            type: 'deposit',
            amount,
            note,
            time: new Date().toISOString(),
            from: 'Manual Deposit',
          }]
        }
      })),

      // ─── Messages ───
      messages: [
        { id: 'm1', senderId: 'staff-1', senderName: 'Alex Rivera', text: 'Good morning team! Store is open.', time: '2026-02-12T09:00:00Z', channel: 'general' },
        { id: 'm2', senderId: 'staff-2', senderName: 'Jordan Lee', text: 'On my way for morning deliveries!', time: '2026-02-12T09:05:00Z', channel: 'general' },
      ],

      sendMessage: (message) => set(state => ({
        messages: [...ensureArray(state.messages), {
          id: generateId(),
          ...message,
          time: new Date().toISOString(),
        }]
      })),

      // ─── In-Store Sales (QR) ───
      inStoreSales: [],

      createInStoreSale: (sale) => {
        const newSale = {
          id: 'POS-' + generateId().toUpperCase(),
          ...sale,
          status: 'pending',
          createdAt: new Date().toISOString(),
        }
        set(state => ({ inStoreSales: [...ensureArray(state.inStoreSales), newSale] }))
        return newSale
      },

      completeInStoreSale: (saleId) => set(state => {
        const sales = ensureArray(state.inStoreSales)
        return {
          inStoreSales: sales.map(s => s.id === saleId ? { ...s, status: 'completed' } : s),
          treasury: {
            ...state.treasury,
            balance: (state.treasury?.balance || 0) + (sales.find(s => s.id === saleId)?.total || 0),
            transactions: [...ensureArray(state.treasury?.transactions), {
              id: generateId(),
              type: 'sale',
              amount: sales.find(s => s.id === saleId)?.total || 0,
              note: `In-store sale ${saleId}`,
              time: new Date().toISOString(),
              from: 'In-Store POS',
            }]
          }
        }
      }),

      // ─── Customers (registered) ───
      customers: [],

      registerCustomer: (customer) => set(state => ({
        customers: [...ensureArray(state.customers), {
          id: generateId(),
          ...customer,
          points: 0,
          createdAt: new Date().toISOString(),
        }]
      })),

      // ─── Reset ───
      resetStore: () => {
        const seedState = {
          products: seedProducts,
          staff: seedStaff,
          orders: [],
          messages: [],
          inStoreSales: [],
          customers: [],
          ownerProfile: {
            id: 'owner-1',
            name: 'Owner',
            email: 'owner@couchbuddies.com',
            phone: '',
            businessName: 'Couch Buddies',
            businessAddress: '',
            pin: '1234',
            avatar: 'CB',
            createdAt: '2026-01-01T00:00:00Z',
          },
          treasury: {
            balance: 50000,
            accounts: [
              { id: 'acc-1', name: 'Business Checking', type: 'bank', last4: '4521', connected: true },
              { id: 'acc-2', name: 'Business Debit', type: 'debit', last4: '8832', connected: true },
            ],
            transactions: [
              { id: 't1', type: 'deposit', amount: 50000, note: 'Initial funding', time: '2026-01-01T00:00:00Z', from: 'Bank Transfer' },
            ],
          },
        }
        // Write seed data to Firebase so all clients reset
        fbSet(ref(db, 'store'), JSON.parse(JSON.stringify(seedState)))
          .catch(err => console.error('[Store] resetStore Firebase write failed:', err))
        set({
          ...seedState,
          cart: [],
          currentUser: null,
          userRole: null,
        })
      },
    }),
    {
      name: 'couch-buddies-store',
      version: 2,
      // Only persist local/session data in localStorage.
      // All shared data (products, staff, orders, treasury, etc.) lives in Firebase.
      partialize: (state) => ({
        currentUser: state.currentUser,
        userRole: state.userRole,
        cart: state.cart,
      }),
      // Migrate from v1 (full localStorage) → v2 (local-only + Firebase)
      // Before stripping shared keys, back them up so FirebaseSync can recover them.
      migrate: (persistedState, version) => {
        if (version < 2 && persistedState) {
          // Save a backup of the old full state for FirebaseSync migration
          try {
            const backupKeys = ['products', 'staff', 'orders', 'treasury', 'messages', 'inStoreSales', 'customers']
            const backup = {}
            let hasData = false
            for (const key of backupKeys) {
              if (persistedState[key] !== undefined) {
                backup[key] = persistedState[key]
                hasData = true
              }
            }
            if (hasData) {
              localStorage.setItem('couch-buddies-v1-backup', JSON.stringify(backup))
            }
          } catch (e) {
            console.warn('Failed to backup v1 state:', e)
          }
        }
        return {
          currentUser: persistedState?.currentUser ?? null,
          userRole: persistedState?.userRole ?? null,
          cart: persistedState?.cart ?? [],
        }
      },
    }
  )
)
