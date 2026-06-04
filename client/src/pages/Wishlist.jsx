import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PackageCard from '../components/PackageCard'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'

export default function Wishlist() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/auth/profile')
      const favoriteIds = res.data.data.favorites || []
      
      if (favoriteIds.length === 0) {
        setLoading(false)
        return
      }

      // Fetch all favorite packages
      const promises = favoriteIds.map(id => api.get(`/packages/${id}`).catch(() => null))
      const results = await Promise.all(promises)
      const validPackages = results.filter(r => r !== null).map(r => r.data.data)
      setPackages(validPackages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">Your saved tour packages</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card h-96 animate-pulse bg-gray-200 rounded-2xl" />
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6">Start adding packages you love to your wishlist!</p>
              <button onClick={() => navigate('/packages')} className="btn-primary">
                Browse Packages
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map(pkg => <PackageCard key={pkg._id} pkg={pkg} />)}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
