import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiArrowRight, FiShield, FiTruck, FiStar, FiPackage, FiChevronDown } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useState } from 'react'

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' fill='%23141414'%3E%3Crect width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23333' font-family='sans-serif' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E"

const categories = [
  { name: 'Gummies & Edibles', image: 'https://images.unsplash.com/photo-1625517236224-4dbb5b54e612?w=600&h=700&fit=crop&q=80', query: 'Gummies+%26+Edibles' },
  { name: 'Tinctures', image: 'https://images.unsplash.com/photo-1611070042580-e707a0c6ff26?w=600&h=700&fit=crop&q=80', query: 'Tinctures' },
  { name: 'Vapes', image: 'https://images.unsplash.com/photo-1560913210-81b26e020c1f?w=600&h=700&fit=crop&q=80', query: 'Vapes' },
  { name: 'Pre-Rolls', image: 'https://images.unsplash.com/photo-1586165368502-1bad9cc98341?w=600&h=700&fit=crop&q=80', query: 'Pre-Rolls' },
  { name: 'Chocolates', image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&h=700&fit=crop&q=80', query: 'Chocolates' },
  { name: 'Topicals', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=700&fit=crop&q=80', query: 'Topicals' },
]

const blogPosts = [
  { id: 1, title: 'CBD Gummies vs. THC Gummies: What You Need to Know', date: 'February 15, 2026', excerpt: 'Understanding the key differences between CBD and THC gummies can help you choose the right product for your wellness goals. We break down effects, legality, and dosing.', image: 'https://images.unsplash.com/photo-1625517236224-4dbb5b54e612?w=800&h=500&fit=crop&q=80' },
  { id: 2, title: 'The Science Behind Full-Spectrum CBD Oil', date: 'February 10, 2026', excerpt: 'Full-spectrum CBD contains a range of cannabinoids beyond just CBD. Learn how the entourage effect works and why whole-plant extracts may offer enhanced benefits.', image: 'https://images.unsplash.com/photo-1616091238769-beafeec6d035?w=800&h=500&fit=crop&q=80' },
  { id: 3, title: 'How to Choose the Right CBD Product for You', date: 'February 5, 2026', excerpt: 'From edibles to topicals, tinctures to vapes \u2014 the CBD market is vast. Here is our guide to finding the perfect product based on your lifestyle and needs.', image: 'https://images.unsplash.com/photo-1611070042580-e707a0c6ff26?w=800&h=500&fit=crop&q=80' },
]

const faqs = [
  { q: 'Are your products lab-tested?', a: 'Absolutely. Every product we sell goes through rigorous third-party lab testing for potency, purity, and safety. We share certificates of analysis (COAs) for full transparency.' },
  { q: 'Is CBD legal?', a: 'Yes! CBD derived from hemp (containing less than 0.3% THC) is federally legal in the United States under the 2018 Farm Bill. We ensure all our products meet these requirements.' },
  { q: 'How long does shipping take?', a: 'Most orders ship within 1-2 business days and arrive in 3-5 business days via USPS or UPS. We offer free shipping on orders over $75.' },
  { q: 'Do you offer refunds?', a: 'We stand behind the quality of our products. If you are not satisfied, contact us within 30 days for a full refund or exchange.' },
  { q: 'What makes Couch Buddies different?', a: 'We combine premium ingredients, transparent lab testing, and a fun wellness-first approach. Our products are crafted for taste and efficacy, not just one or the other.' },
]

export default function Landing() {
  const { products } = useStore()
  const featured = products.filter(p => p.featured).slice(0, 8)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen bg-surface-900">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-surface-900 to-surface-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <span className="inline-block text-brand-400 text-sm font-semibold tracking-wider uppercase mb-4">Premium CBD Wellness</span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
              Sweet Treats.<br />
              <span className="text-brand-400">Real Wellness.</span>
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl mt-6 max-w-xl leading-relaxed">
              Lab-tested CBD edibles, tinctures, and more. Shipped discreetly to your door. No med card required.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/shop" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                Shop Now <FiArrowRight />
              </Link>
              <a href="#blog" className="btn-secondary text-base px-8 py-4">Read Our Blog</a>
            </div>
          </motion.div>

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
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23374151" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%239CA3AF" text-anchor="middle" dominant-baseline="middle" font-family="Arial"%3ENo Image%3C/text%3E%3C/svg%3E' }}
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
              { icon: FiTruck, label: 'Discreet Delivery' },
              { icon: FiShield, label: 'Lab-Tested & Verified' },
              { icon: FiStar, label: 'Trusted by Thousands' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <b.icon className="text-brand-400" size={18} />
                </div>
                <span className="text-sm font-medium text-gray-300">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Picks / Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">Curated CBD Picks</h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">Browse by category to find exactly what you need.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to={`/shop?category=${cat.query}`} className="group block rounded-2xl overflow-hidden relative aspect-[3/4]">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section className="border-y border-white/5 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Why Couch Buddies?</h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">Not all CBD is created equal. Here is why we are different.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FiStar, title: 'Premium Ingredients', desc: 'Organic, non-GMO hemp sourced from trusted US farms.' },
              { icon: FiShield, title: 'Lab-Tested Quality', desc: 'Every batch tested by independent labs for potency and purity.' },
              { icon: FiPackage, title: 'Crafted With Care', desc: 'Small-batch production ensures consistency and freshness.' },
              { icon: FiTruck, title: 'Fast, Discreet Delivery', desc: 'Plain packaging, shipped in 1-2 business days nationwide.' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="glass-card text-center hover:border-white/15 transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-brand-400" size={22} />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Personal Favorites */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">Our Personal Favorites</h2>
            <p className="text-gray-400 mt-2">The best of the best, handpicked by our team.</p>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
            Browse all <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
              <Link to={`/product/${product.id}`} className="group block">
                <div className="rounded-2xl overflow-hidden bg-surface-800 border border-white/5 hover:border-white/15 transition-all">
                  <div className="aspect-square overflow-hidden relative">
                    <img src={product.images?.[0] || PLACEHOLDER} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" onError={(e) => { if (!e.target.dataset.f) { e.target.dataset.f='1'; e.target.src=PLACEHOLDER } }} />
                    {product.featured && <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand-500 text-black uppercase tracking-wider">Staff Pick</span>}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{product.category}</p>
                    <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-brand-400 font-bold mt-1.5">${product.price?.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8 sm:hidden">
          <Link to="/shop" className="btn-secondary inline-flex items-center gap-2">Browse All Products <FiArrowRight size={14} /></Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-brand-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">Feel Better, Naturally.</h2>
          <p className="text-black/70 max-w-xl mx-auto mb-8">Whether you are winding down, gearing up, or just vibing, we have something for your moment. Lab-tested, farm-fresh quality.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
            Shop Now <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Blog / News Section */}
      <section id="blog" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">Couch Buddies Blog</h2>
          <p className="text-gray-400 mt-3">Helpful guides, product spotlights, and wellness tips.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="group rounded-2xl overflow-hidden bg-surface-800 border border-white/5 hover:border-white/15 transition-all cursor-pointer">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="p-5">
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">{post.date}</p>
                <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors leading-snug mb-2">{post.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-brand-400 text-sm font-medium mt-4 group-hover:gap-2.5 transition-all">
                  Read More <FiArrowRight size={14} />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">FAQs</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card !p-0 overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-medium text-sm sm:text-base pr-4">{faq.q}</span>
                <FiChevronDown className={`flex-shrink-0 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} size={18} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 -mt-1">
                  <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}