import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiStar } from 'react-icons/fi'
import { motion } from 'framer-motion'

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
        {/* Background gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600/20 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-full bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#0A0E17_70%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <motion.div className="text-center max-w-4xl mx-auto" {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8">
              <FiStar size={14} /> Now Shipping Worldwide
            </div>

            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.9] mb-6">
              <span className="gradient-text">COUCH</span>
              <br />
              <span className="text-white">BUDDIES</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Premium merch for the cozy crew. Designed for comfort, built for style.
              Rep the brand that gets you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/shop" className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group">
                Shop Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/auth" className="btn-secondary text-lg px-8 py-4">
                Join The Crew
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Featured Drops</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Our latest and greatest. Limited stock, unlimited vibes.</p>
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
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
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
              View All Products <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FiTruck, title: 'Free Delivery', desc: 'Free shipping on orders over $75. Same-day local delivery available.' },
              { icon: FiShield, title: 'Secure Payments', desc: 'Multiple payment options including CashApp, PayPal, Zelle, and Crypto.' },
              { icon: FiShoppingBag, title: 'Premium Quality', desc: 'Ethically sourced, sustainably made. Quality you can feel.' },
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
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Join the Couch Buddies Crew</h2>
              <p className="text-gray-400 max-w-lg mx-auto mb-8">
                Sign up for exclusive drops, early access, and loyalty rewards. Plus, track your orders and earn points.
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
