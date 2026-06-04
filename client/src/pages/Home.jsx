import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, MapPin, Star, ArrowRight, Shield, Clock, Users, Award, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PackageCard from '../components/PackageCard'
import api from '../utils/api'

const HERO_IMAGES = [
  '/assets/goa_hero_banner_1780120545332.png',
  '/assets/kerala_hero_banner_1780120560602.png',
  '/assets/ladakh_hero_banner_1780120732036.png',
  '/assets/manali_hero_banner_1780120753614.png',
]

const DESTINATIONS = [
  { name: 'Goa', image: '/assets/goa_hero_banner_1780120545332.png', tag: 'Beach Paradise' },
  { name: 'Manali', image: '/assets/manali_hero_banner_1780120753614.png', tag: 'Snow Adventure' },
  { name: 'Kerala', image: '/assets/kerala_hero_banner_1780120560602.png', tag: "God's Own Country" },
  { name: 'Rajasthan', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400', tag: 'Royal Heritage' },
  { name: 'Ladakh', image: '/assets/ladakh_hero_banner_1780120732036.png', tag: 'High Altitude' },
  { name: 'Andaman', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', tag: 'Island Escape' },
]

const KARNATAKA_DESTINATIONS = [
  { name: 'Coorg (Kodagu)', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400', tag: 'Scotland of India' },
  { name: 'Mysore', image: '/assets/mysore_hero_banner_1780120587644.png', tag: 'City of Palaces' },
  { name: 'Chikmagalur', image: 'https://images.unsplash.com/photo-1625736125070-5b128522e8ec?w=400', tag: 'Coffee Land' },
  { name: 'Hampi', image: '/assets/hampi_hero_banner_1780120688169.png', tag: 'UNESCO Heritage' },
  { name: 'Gokarna', image: 'https://images.unsplash.com/photo-1596811442144-cb8452dc82ea?w=400', tag: 'Beach Retreat' },
  { name: 'Jog Falls', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?w=400', tag: "Nature's Fury" },
  { name: 'Udupi', image: 'https://images.unsplash.com/photo-1620766165457-a8025baa82e0?w=400', tag: 'Spiritual Coast' },
  { name: 'Murudeshwar', image: 'https://images.unsplash.com/photo-1590050752112-92147171e544?w=400', tag: 'Divine Shores' },
  { name: 'Bandipur National Park', image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400', tag: 'Wildlife Safari' },
  { name: 'Nagarhole National Park', image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=400', tag: 'Tiger Reserve' },
  { name: 'Shivanasamudra Falls', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?w=400', tag: 'Twin Falls' },
  { name: 'Sakleshpur', image: 'https://images.unsplash.com/photo-1625736125070-5b128522e8ec?w=400', tag: 'Green Route' },
  { name: 'Kemmanagundi', image: 'https://images.unsplash.com/photo-1621508654686-809f23efdabc?w=400', tag: 'Royal Retreat' },
  { name: 'Nandi Hills', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400', tag: 'Sunrise Peak' },
  { name: 'Badami', image: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=400', tag: 'Cave Temples' },
  { name: 'Pattadakal', image: 'https://images.unsplash.com/photo-1620766165457-a8025baa82e0?w=400', tag: 'Ancient Marvel' },
  { name: 'Aihole', image: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=400', tag: 'Cradle of Architecture' },
  { name: 'Belur', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?w=400', tag: 'Hoysala Legacy' },
  { name: 'Halebidu', image: 'https://images.unsplash.com/photo-1600100397608-f010f4199f61?w=400', tag: 'Ruined City' },
  { name: 'Dandeli', image: 'https://images.unsplash.com/photo-1621508654686-809f23efdabc?w=400', tag: 'Adventure Hub' },
]

const REVIEWS = [
  { name: 'Priya Sharma', location: 'Mumbai', rating: 5, text: 'Absolutely amazing experience! The Kerala backwater tour was beyond our expectations. Every detail was perfectly planned.', avatar: 'P' },
  { name: 'Rahul Verma', location: 'Delhi', rating: 5, text: 'The Ladakh trip was a dream come true. TravelVista made everything seamless — from booking to the last day.', avatar: 'R' },
  { name: 'Anita Patel', location: 'Ahmedabad', rating: 4, text: 'Goa trip was fantastic! Great hotels, wonderful guides, and the water sports were thrilling. Highly recommend!', avatar: 'A' },
]

export default function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [featuredPackages, setFeaturedPackages] = useState([])
  const [heroIndex, setHeroIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const sectionId = location.state.scrollTo
      window.history.replaceState({}, document.title)
      
      const timer = setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [location.state])

  useEffect(() => {
    api.get('/packages?featured=true&limit=6').then(r => {
      setFeaturedPackages(r.data.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setHeroIndex(i => (i + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/packages?search=${search}`)
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {HERO_IMAGES.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === heroIndex ? 1 : 0 }}
          >
            <img src={img} alt="hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
          </div>
        ))}

        {/* Hero Controls */}
        <button onClick={() => setHeroIndex(i => (i - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => setHeroIndex(i => (i + 1) % HERO_IMAGES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-6">
            <MapPin className="w-4 h-4 text-warm-300" />
            Explore 50+ Destinations Across India
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            Discover Your
            <span className="block bg-gradient-to-r from-warm-300 to-accent-300 bg-clip-text text-transparent">
              Dream Journey
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Handcrafted tour packages for every traveler. From Himalayan peaks to tropical beaches — your adventure starts here.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search destinations, packages..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-lg"
              />
            </div>
            <button type="submit" className="btn-primary py-4 px-8 text-base whitespace-nowrap">
              Search Tours
            </button>
          </form>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 mt-10 text-sm text-white/70">
            <span>🏖️ 50+ Destinations</span>
            <span>⭐ 4.8 Rating</span>
            <span>👥 10,000+ Happy Travelers</span>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setHeroIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === heroIndex ? 'bg-white w-6' : 'bg-white/50'}`} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
          {[['10,000+', 'Happy Travelers'], ['50+', 'Destinations'], ['200+', 'Tour Packages'], ['4.8★', 'Average Rating']].map(([num, label]) => (
            <div key={label}>
              <div className="text-3xl md:text-4xl font-display font-bold">{num}</div>
              <div className="text-white/80 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Karnataka Tourism Banner */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/assets/mysore_hero_banner_1780120587644.png" alt="Mysore Palace" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:w-2/3">
          <span className="text-warm-400 font-bold tracking-widest uppercase text-sm mb-2">One State. Many Worlds.</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
            Discover the Magic of <span className="text-warm-400">Karnataka</span>
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl leading-relaxed">
            From the majestic Mysore Palace to the misty hills of Coorg and ancient ruins of Hampi, 
            explore the diverse landscapes, vibrant culture, and rich heritage of Karnataka.
          </p>
          <div>
            <button onClick={() => navigate('/packages?state=Karnataka')} className="bg-warm-500 hover:bg-warm-600 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-warm-500/30 flex items-center gap-2">
              Explore Karnataka Packages <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Karnataka Destinations Grid */}
      <section id="karnataka-destinations" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-warm-500 font-semibold text-sm uppercase tracking-wider">Karnataka Tourism</span>
            <h2 className="section-title mt-2">Incredible Karnataka</h2>
            <p className="section-subtitle">20 enchanting destinations waiting to be explored</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {KARNATAKA_DESTINATIONS.map((dest) => (
              <div
                key={dest.name}
                onClick={() => navigate(`/packages?destination=${encodeURIComponent(dest.name)}`)}
                className="relative rounded-2xl overflow-hidden cursor-pointer group h-64"
              >
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-semibold text-warm-300 mb-1">{dest.tag}</p>
                  <h3 className="text-lg font-display font-bold">{dest.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Top Picks</span>
            <h2 className="section-title mt-2">Featured Tour Packages</h2>
            <p className="section-subtitle">Handpicked experiences for every kind of traveler</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card h-80 animate-pulse bg-gray-200 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPackages.map(pkg => <PackageCard key={pkg._id} pkg={pkg} />)}
            </div>
          )}

          <div className="text-center mt-10">
            <button onClick={() => navigate('/packages')} className="btn-primary inline-flex items-center gap-2">
              View All Packages <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section id="destinations" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Explore India</span>
            <h2 className="section-title mt-2">Popular Destinations</h2>
            <p className="section-subtitle">From snow-capped mountains to sun-kissed beaches</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DESTINATIONS.map((dest) => (
              <div
                key={dest.name}
                onClick={() => navigate(`/packages?destination=${dest.name}`)}
                className="relative rounded-2xl overflow-hidden cursor-pointer group h-48 md:h-64"
              >
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs text-white/70 mb-1">{dest.tag}</p>
                  <h3 className="text-xl font-display font-bold">{dest.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Why TravelVista</span>
            <h2 className="section-title mt-2">Travel With Confidence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Safe & Secure', desc: 'Your safety is our top priority. All packages are verified and insured.', color: 'text-blue-500 bg-blue-50' },
              { icon: Award, title: 'Best Price', desc: 'Competitive pricing with no hidden charges. Best value guaranteed.', color: 'text-green-500 bg-green-50' },
              { icon: Clock, title: '24/7 Support', desc: 'Round-the-clock customer support for a worry-free travel experience.', color: 'text-purple-500 bg-purple-50' },
              { icon: Users, title: 'Expert Guides', desc: 'Experienced local guides who know every corner of the destination.', color: 'text-orange-500 bg-orange-50' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card p-6 text-center hover:-translate-y-1 transition-transform">
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="section-title mt-2">What Our Travelers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <div key={r.name} className="card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-warm-400 text-warm-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                    <p className="text-gray-400 text-xs">{r.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center px-4 text-white">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-white/80 text-lg mb-8">Join thousands of happy travelers. Book your dream tour today!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/packages')} className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-lg">
              Explore Packages
            </button>
            <button onClick={() => navigate('/register')} className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              Sign Up Free
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
