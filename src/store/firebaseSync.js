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
  'ownerProfile',
]

// Keys that are expected to be arrays — Firebase RTDB can convert these to objects
const ARRAY_KEYS = ['products', 'staff', 'orders', 'messages', 'inStoreSales', 'customers']

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
}

// ─── Helpers ───

// Remove undefined values which Firebase RTDB cannot store
function cleanForFirebase(data) {
  if (data === undefined || data === null) return null
  return JSON.parse(JSON.stringify(data))
}

// Firebase RTDB converts arrays to objects with numeric keys (e.g. {0: {...}, 1: {...}})
// This normalizes them back to proper arrays and recursively fixes nested structures
function normalizeFirebaseValue(key, value) {
  if (value === null || value === undefined) return value

  // If this key should be an array but Firebase returned an object, convert it
  if (ARRAY_KEYS.includes(key) && !Array.isArray(value) && typeof value === 'object') {
    // Convert object with numeric keys to array, filtering out nulls
    const arr = Object.values(value).filter(item => item !== null && item !== undefined)
    return arr
  }

  // For array-type keys, ensure all elements are valid (no nulls from sparse arrays)
  if (ARRAY_KEYS.includes(key) && Array.isArray(value)) {
    return value.filter(item => item !== null && item !== undefined)
  }

  // For objects like 'treasury', recursively normalize nested arrays
  if (typeof value === 'object' && !Array.isArray(value)) {
    const normalized = { ...value }
    for (const prop of Object.keys(normalized)) {
      const v = normalized[prop]
      // Detect object-masquerading-as-array: all keys are integers
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        const keys = Object.keys(v)
        const allNumeric = keys.length > 0 && keys.every(k => /^\d+$/.test(k))
        if (allNumeric) {
          normalized[prop] = Object.values(v).filter(item => item !== null && item !== undefined)
        }
      }
    }
    return normalized
  }

  return value
}

// Firebase stores empty arrays as null — restore proper defaults
// Also normalizes arrays that Firebase returned as objects
function restoreDefaults(key, value) {
  // First normalize the Firebase data type
  const normalized = normalizeFirebaseValue(key, value)

  // If null/undefined after normalization, return defaults
  if (normalized === null || normalized === undefined) {
    const defaults = {
      products: [],
      staff: [],
      orders: [],
      messages: [],
      inStoreSales: [],
      customers: [],
      treasury: { balance: 0, accounts: [], transactions: [] },
      ownerProfile: { id: 'owner-1', name: 'Owner', email: 'owner@couchbuddies.com', phone: '', businessName: 'Couch Buddies', businessAddress: '', pin: '1234', avatar: 'CB', createdAt: '2026-01-01T00:00:00Z' },
    }
    return defaults[key] ?? null
  }

  return normalized
}

// Write to Firebase with error handling and retry
const MAX_RETRIES = 2
async function safeFirebaseWrite(path, data, retryCount = 0) {
  try {
    await fbSet(ref(db, path), cleanForFirebase(data))
  } catch (err) {
    console.error(`[FirebaseSync] Write failed for "${path}":`, err.message)
    if (retryCount < MAX_RETRIES) {
      const delay = (retryCount + 1) * 1000
      console.log(`[FirebaseSync] Retrying write for "${path}" in ${delay}ms (attempt ${retryCount + 2}/${MAX_RETRIES + 1})`)
      await new Promise(resolve => setTimeout(resolve, delay))
      return safeFirebaseWrite(path, data, retryCount + 1)
    } else {
      console.error(`[FirebaseSync] Write permanently failed for "${path}" after ${MAX_RETRIES + 1} attempts`)
    }
  }
}

// ─── Recover old localStorage data from before the Firebase migration ───
// The previous store version (v1) persisted ALL state under 'couch-buddies-store'.
// This reads that data so we can seed Firebase with the owner's real configurations
// instead of the hardcoded defaults.
function recoverLocalStorageData() {
  try {
    // Try multiple sources:
    // 1. The v1 backup created by the Zustand migrate function
    // 2. The original 'couch-buddies-store' key (old format with full state)
    let state = null

    // Source 1: Explicit backup from migration
    const backupRaw = localStorage.getItem('couch-buddies-v1-backup')
    if (backupRaw) {
      state = JSON.parse(backupRaw)
      console.log('[FirebaseSync] Found v1 backup in localStorage')
    }

    // Source 2: Original Zustand persist key (may still have old full data)
    if (!state) {
      const raw = localStorage.getItem('couch-buddies-store')
      if (raw) {
        const parsed = JSON.parse(raw)
        state = parsed?.state
      }
    }

    if (!state) return null

    // Check if this data has shared keys with actual content
    const hasSharedData = SHARED_KEYS.some(key => {
      const val = state[key]
      if (!val) return false
      if (Array.isArray(val) && val.length > 0) return true
      if (typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length > 0) return true
      return false
    })

    if (!hasSharedData) return null

    // Build the shared state, falling back to defaults for missing keys
    const recovered = {}
    for (const key of SHARED_KEYS) {
      recovered[key] = state[key] !== undefined && state[key] !== null
        ? state[key]
        : DEFAULT_SHARED_STATE[key]
    }

    console.log('[FirebaseSync] Recovered existing configurations from localStorage')
    return recovered
  } catch (err) {
    console.warn('[FirebaseSync] Could not parse localStorage data:', err)
    return null
  }
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

    // 1. Seed Firebase — prefer recovering owner's existing localStorage data,
    //    fall back to hardcoded defaults only if no local data exists.
    const storeRef = ref(db, 'store')
    fbGet(storeRef).then(snapshot => {
      if (!snapshot.exists()) {
        const recovered = recoverLocalStorageData()
        const seedData = recovered || DEFAULT_SHARED_STATE
        console.log(`[FirebaseSync] Seeding Firebase with ${recovered ? 'recovered localStorage data' : 'default seed data'}`)
        fbSet(storeRef, cleanForFirebase(seedData))
      } else {
        // Firebase already has data. Still check if localStorage has NEWER/richer
        // data that should be merged (e.g., owner made changes before migration).
        const recovered = recoverLocalStorageData()
        if (recovered) {
          const existing = snapshot.val()
          let shouldUpdate = false

          // If recovered data has more products or staff than Firebase, prefer it
          const rProducts = Array.isArray(recovered.products) ? recovered.products.length : 0
          const fProducts = Array.isArray(existing.products) ? existing.products.length : 0
          const rStaff = Array.isArray(recovered.staff) ? recovered.staff.length : 0
          const fStaff = Array.isArray(existing.staff) ? existing.staff.length : 0
          const rOrders = Array.isArray(recovered.orders) ? recovered.orders.length : 0
          const fOrders = Array.isArray(existing.orders) ? existing.orders.length : 0

          if (rProducts > fProducts || rStaff > fStaff || rOrders > fOrders) {
            shouldUpdate = true
          }

          if (shouldUpdate) {
            console.log('[FirebaseSync] localStorage has richer data — merging into Firebase')
            // Merge: take the larger/richer dataset per key
            const merged = {}
            for (const key of SHARED_KEYS) {
              const rVal = recovered[key]
              const fVal = existing[key]
              if (Array.isArray(rVal) && Array.isArray(fVal)) {
                // Merge arrays by id, preferring recovered entries for conflicts
                const map = new Map()
                for (const item of fVal) { if (item?.id) map.set(item.id, item) }
                for (const item of rVal) { if (item?.id) map.set(item.id, item) }
                merged[key] = [...map.values()]
              } else if (key === 'treasury') {
                // For treasury, keep the one with a higher balance or more transactions
                const rTx = rVal?.transactions?.length || 0
                const fTx = fVal?.transactions?.length || 0
                merged[key] = rTx > fTx ? rVal : fVal
              } else {
                merged[key] = fVal ?? rVal
              }
            }
            fbSet(storeRef, cleanForFirebase(merged))
          }
        }
      }
    }).catch(err => {
      console.error('[FirebaseSync] Failed to check/seed database:', err)
    })

    // 2. Subscribe to real-time changes for each shared key
    let keysLoaded = 0
    for (const key of SHARED_KEYS) {
      const keyRef = ref(db, `store/${key}`)
      const unsub = onValue(keyRef, (snapshot) => {
        const val = restoreDefaults(key, snapshot.val())
        _syncingFromFirebase = true
        useStore.setState({ [key]: val })
        _syncingFromFirebase = false

        // Track how many keys have loaded from Firebase
        keysLoaded++
        if (keysLoaded >= SHARED_KEYS.length && !useStore.getState()._firebaseReady) {
          useStore.setState({ _firebaseReady: true })
          console.log('[FirebaseSync] All shared keys loaded — Firebase is ready')
        }
      }, (error) => {
        console.error(`[FirebaseSync] Listener error for "${key}":`, error)
        // Still count as loaded to not block forever
        keysLoaded++
        if (keysLoaded >= SHARED_KEYS.length && !useStore.getState()._firebaseReady) {
          useStore.setState({ _firebaseReady: true })
        }
      })
      unsubscribers.push(unsub)
    }

    // 3. Fallback: mark as ready after timeout in case Firebase is slow
    const readyTimeout = setTimeout(() => {
      if (!useStore.getState()._firebaseReady) {
        console.warn('[FirebaseSync] Firebase ready timeout — proceeding with available data')
        useStore.setState({ _firebaseReady: true })
      }
    }, 8000)

    // 4. Watch local Zustand mutations → write changed shared keys to Firebase
    //    GATED: only writes AFTER Firebase data has loaded to prevent overwriting real data with seed defaults
    const storeUnsub = useStore.subscribe((state, prevState) => {
      if (_syncingFromFirebase) return
      if (!state._firebaseReady) return // Don't write until Firebase data is loaded

      for (const key of SHARED_KEYS) {
        if (state[key] !== prevState[key]) {
          safeFirebaseWrite(`store/${key}`, state[key])
        }
      }
    })

    return () => {
      clearTimeout(readyTimeout)
      unsubscribers.forEach(fn => fn())
      storeUnsub()
    }
  }, [])

  return null // side-effect only, renders nothing
}
