import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiArrowRight, FiTruck, FiShield, FiHeart, FiChevronDown } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useState } from 'react'

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' fill='%23141414'%3E%3Crect width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23333' font-family='sans-serif' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E"

const categories = [
  { name: 'CBD Gummies', image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=500&h=600&fit=crop', query: 'CBD+Gummies' },
  { name: 'Tinctures', image: 'https://images.unsplash.com/photo-1611070042580-e707a0c6ff26?w=500&h=600&fit=crop', query: 'Tinctures' },
  { name: 'Chocolates', image: 'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=500&h=600&fit=crop', query: 'Chocolates' },
  { name: 'Hard Candy', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=600&fit=crop', query: 'Hard+Candy' },
  { name: 'Beverages', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=600&fit=crop', query: 'Beverages' },
  { name: 'All Products', image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500&h=600&fit=crop', query: '' },
]

const faqs = [
  { q: 'What is CBD and how does it work?', a: 'CBD (cannabidiol) is a naturally occurring compound found in hemp plants. It interacts with your body\'s endocannabinoid system to support balance, calm, and overall wellness without the psychoactive effects of THC.' },
  { q: 'Are your products lab-tested?', a: 'Yes! All Couch Buddies products are third-party lab tested for purity, potency, and safety. We only work with trusted suppliers who provide certificates of analysis (COAs).' },
  { q: 'How fast is shipping?', a: 'We offer free shipping on orders over $75. Most orders ship within 1-2 business days, with same-day local delivery available in select areas.' },
  { q: 'Is it safe to order online?', a: 'Absolutely. All hemp-derived CBD products with less than 0.3% THC are federally legal under the 2018 Farm Bill. We use secure, encrypted checkout for all transactions.' },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/5">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left">
        <span className="text-sm sm:text-base font-medium">{q}</span>
        <FiChevronDown className={`flex-shrink-0 ml-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-5 text-sm text-gray-400 leading-relaxed">{a}</p>}
    </div>
  )
}

export default function Landing() {
  const { products } = useStore()
  const featured = products.filter(p => p.featured).slice(0, 8)

  return (
    <div className="min-h-screen bg-surface-900">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-400/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20">
          <motion.div className="text-center max-w-3xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-brand-400 text-sm font-semibold tracking-widest uppercase mb-6">Premium CBD & Sweet Treats</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
              Sweet Treats.<br />
              <span className="text-brand-400">Real Wellness.</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Lab-tested CBD gummies, tinctures & edibles crafted to help you relax, unwind, and feel your best. Delivered right to your door.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/shop" className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2 group">
                Shop Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/auth" className="btn-secondary text-base px-8 py-4">
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">Browse By Category</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Curated Picks</h2>
            <p className="text-gray-400 mt-3 max-w-lg mx-auto">Explore our premium collection of CBD-infused treats and wellness products.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.5 }}>
                <Link to={`/shop${cat.query ? '?category=' + cat.query : ''}`} className="group block">
                  <div className="aspect-[5/6] rounded-xl overflow-hidden bg-surface-800 relative">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" referrerPolicy="no-referrer" onError={(e) => { if (!e.target.dataset.f) { e.target.dataset.f='1'; e.target.src=PLACEHOLDER } }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-sm font-semibold">{cat.name}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">Staff Picks</p>
              <h2 className="text-3xl sm:text-4xl font-bold">Our Personal Favorites</h2>
              <p className="text-gray-400 mt-2">The best-selling treats hand-picked by our team.</p>
            </div>
            <Link to="/shop" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.5 }}>
                <Link to={`/product/${product.id}`} className="group block">
                  <div className="rounded-xl overflow-hidden bg-surface-800 border border-white/5 hover:border-white/10 transition-all">
                    <div className="aspect-square overflow-hidden">
                      <img src={product.images?.[0] || PLACEHOLDER} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" onError={(e) => { if (!e.target.dataset.f) { e.target.dataset.f='1'; e.target.src=PLACEHOLDER } }} />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-1">{product.name}</h3>
                      <p className="text-brand-400 font-semibold mt-1">${product.price?.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/shop" className="btn-secondary inline-flex items-center gap-2 text-sm">View All Products <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-16 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Feel Better, Naturally</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Whether you are winding down or gearing up, Couch Buddies has something crafted for your moment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: FiTruck, title: 'Fast Delivery', desc: 'Free shipping on orders over $75. Same-day local delivery available.' },
              { icon: FiShield, title: 'Lab Tested & Safe', desc: 'All products are third-party lab tested. COAs available for every batch.' },
              { icon: FiHeart, title: 'Crafted With Care', desc: 'Small-batch, premium ingredients. Natural flavors, real wellness benefits.' },
            ].map((feat, i) => (
              <div key={i} className="text-center p-8 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="w-12 h-12 rounded-lg bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                  <feat.icon size={22} className="text-brand-400" />
                </div>
                <h3 className="font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-400">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center py-16 px-6 rounded-2xl border border-white/5 bg-white/[0.02] relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px]" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">It's Cool To Be Kind</h2>
              <p className="text-gray-400 max-w-lg mx-auto mb-8">
                Join the Couch Buddies fam for exclusive drops, sweet rewards, and first access to new products.
              </p>
              <Link to="/auth" className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2">
                Get Started <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">FAQs</h2>
          </div>
          <div>
            {faqs.map((item, i) => <FAQItem key={i} {...item} />)}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}