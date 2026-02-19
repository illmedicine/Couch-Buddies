import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiHeart } from 'react-icons/fi'
import { motion } from 'framer-motion'

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' fill='%231a1a2e'%3E%3Crect width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23555' font-family='sans-serif' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E"

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function Landing() {
  const { products } = useStore()
  const featured = products.filter(p => p.featured).slice(0, 4)

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background gradient — candy pink & mint swirls */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent-400/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-candy-lavender/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-candy-lemon/10 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-full bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#120B0F_70%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <motion.div className="text-center max-w-4xl mx-auto" {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8">
              🍬 Sweet Treats & Wellness Goodies
            </div>

            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] mb-6">
              <span className="gradient-text">COUCH</span>
              <br />
              <span className="text-white">BUDDIES</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Your favorite candy shop meets wellness. Premium CBD gummies, sweet treats,
              and herbal goodies — made to help you relax and enjoy the vibe.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/shop" className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group">
                🍭 Shop Treats <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/auth" className="btn-secondary text-lg px-8 py-4">
                Join The Sweet Side
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">🔥 Hot Picks</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Our sweetest sellers. Grab them before they melt away.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/product/${product.id}`} className="group block">
                  <div className="glass-card p-0 overflow-hidden hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="aspect-square overflow-hidden bg-surface-800">
                      <img
                        src={product.images?.[0] || PLACEHOLDER_IMG}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = PLACEHOLDER_IMG } }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-brand-400 font-bold text-lg mt-1">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/shop" className="btn-secondary inline-flex items-center gap-2">
              View All Goodies <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FiTruck, title: 'Fast Delivery', desc: 'Free shipping on orders over $75. Same-day local delivery so your treats arrive fresh.' },
              { icon: FiShield, title: 'Lab Tested & Safe', desc: 'All CBD products are third-party lab tested. Multiple payment options: CashApp, PayPal, Zelle, Crypto.' },
              { icon: FiHeart, title: 'Made With Love', desc: 'Small-batch, hand-crafted goodies. Premium ingredients, natural flavors, real wellness benefits.' },
            ].map((feat, i) => (
              <div key={i} className="glass-card text-center hover:border-brand-500/20 transition-all">
                <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4">
                  <feat.icon size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="glass-card text-center py-16 glow-brand relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-accent-600/10" />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">🍬 Get Your Sugar Fix</h2>
              <p className="text-gray-400 max-w-lg mx-auto mb-8">
                Join the Couch Buddies fam for exclusive flavors, early drops, and sweet rewards. Track your orders and earn points with every treat.
              </p>
              <Link to="/auth" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
                Get Started <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
