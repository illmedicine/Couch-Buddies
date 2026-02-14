// Firebase Realtime Database ↔ Zustand sync layer
// Keeps shared data (products, staff, orders, etc.) in sync across all browsers
import { useEffect, useRef } from 'react'
import { ref, onValue, set as fbSet, get as fbGet } from 'firebase/database'
import { db } from '../firebase'
import { useStore } from './useStore'
import { seedProducts, seedStaff } from './seedData'

// ─── Keys synced to Firebase (shared across all users/browsers) ───
const SHARED_KEYS = [
  'products',
  'staff',
  'orders',
  'treasury',
  'messages',
  'inStoreSales',
  'customers',
]

// ─── Default shared state used when Firebase is empty (first-time seed) ───
const DEFAULT_SHARED_STATE = {
  products: seedProducts,
  staff: seedStaff,
  orders: [],
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
  messages: [
    { id: 'm1', senderId: 'staff-1', senderName: 'Alex Rivera', text: 'Good morning team! Store is open.', time: '2026-02-12T09:00:00Z', channel: 'general' },
    { id: 'm2', senderId: 'staff-2', senderName: 'Jordan Lee', text: 'On my way for morning deliveries!', time: '2026-02-12T09:05:00Z', channel: 'general' },
  ],
  inStoreSales: [],
  customers: [],
}

// ─── Helpers ───

// Remove undefined values which Firebase RTDB cannot store
function cleanForFirebase(data) {
  if (data === undefined || data === null) return null
  return JSON.parse(JSON.stringify(data))
}

// Firebase stores empty arrays as null — restore proper defaults
function restoreDefaults(key, value) {
  if (value !== null && value !== undefined) return value
  const defaults = {
    products: [],
    staff: [],
    orders: [],
    messages: [],
    inStoreSales: [],
    customers: [],
    treasury: { balance: 0, accounts: [], transactions: [] },
  }
  return defaults[key] ?? null
}

// ─── Global sync flag: prevents write-back loops ───
let _syncingFromFirebase = false
export function isSyncingFromFirebase() {
  return _syncingFromFirebase
}

// ─── React component that manages the sync lifecycle ───
export function FirebaseSync() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const unsubscribers = []

    // 1. Seed Firebase if database is empty (first-ever run)
    const storeRef = ref(db, 'store')
    fbGet(storeRef).then(snapshot => {
      if (!snapshot.exists()) {
        fbSet(storeRef, cleanForFirebase(DEFAULT_SHARED_STATE))
      }
    }).catch(err => {
      console.error('[FirebaseSync] Failed to check/seed database:', err)
    })

    // 2. Subscribe to real-time changes for each shared key
    for (const key of SHARED_KEYS) {
      const keyRef = ref(db, `store/${key}`)
      const unsub = onValue(keyRef, (snapshot) => {
        const val = restoreDefaults(key, snapshot.val())
        _syncingFromFirebase = true
        useStore.setState({ [key]: val })
        _syncingFromFirebase = false
      }, (error) => {
        console.error(`[FirebaseSync] Listener error for "${key}":`, error)
      })
      unsubscribers.push(unsub)
    }

    // 3. Mark Firebase as ready once first data arrives
    //    (the onValue listeners fire immediately with cached/server data)
    const readyUnsub = onValue(ref(db, 'store/products'), () => {
      useStore.setState({ _firebaseReady: true })
      readyUnsub() // only need the first callback
    }, { onlyOnce: true })

    // 4. Watch local Zustand mutations → write changed shared keys to Firebase
    const storeUnsub = useStore.subscribe((state, prevState) => {
      if (_syncingFromFirebase) return

      for (const key of SHARED_KEYS) {
        if (state[key] !== prevState[key]) {
          fbSet(ref(db, `store/${key}`), cleanForFirebase(state[key]))
        }
      }
    })

    return () => {
      unsubscribers.forEach(fn => fn())
      storeUnsub()
    }
  }, [])

  return null // side-effect only, renders nothing
}
