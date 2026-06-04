import { Link } from 'react-router-dom'
import { MapPin, Clock, Users, Star, Heart } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function PackageCard({ pkg }) {
  const { user } = useAuth()
  const [wishlisted, setWishlisted] = useState(user?.favorites?.includes(pkg._id))
  const [loading, setLoading] = useState(false)

  const image = pkg.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600'

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to add to wishlist'); return }
    setLoading(true)
    try {
      await api.put(`/auth/favorites/${pkg._id}`)
      setWishlisted(!wishlisted)
      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const categoryColors = {
    Beach: 'bg-blue-100 text-blue-700',
    Adventure: 'bg-orange-100 text-orange-700',
    Cultural: 'bg-purple-100 text-purple-700',
    'Hill Station': 'bg-green-100 text-green-700',
    Wildlife: 'bg-yellow-100 text-yellow-700',
    Pilgrimage: 'bg-red-100 text-red-700',
    Honeymoon: 'bg-pink-100 text-pink-700',
    Family: 'bg-teal-100 text-teal-700',
  }

  return (
    <Link to={`/packages/${pkg._id}`} className="card group block overflow-hidden">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Category Badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[pkg.category] || 'bg-gray-100 text-gray-700'}`}>
          {pkg.category}
        </span>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          disabled={loading}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </button>

        {/* Featured */}
        {pkg.featured && (
          <span className="absolute bottom-3 left-3 bg-gradient-to-r from-warm-500 to-warm-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            ⭐ Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-gray-900 text-base leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
            {pkg.title}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 text-primary-500" />
          <span>{pkg.destination}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {pkg.duration.days}D/{pkg.duration.nights}N
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            Max {pkg.groupSize.max}
          </span>
          {pkg.rating > 0 && (
            <span className="flex items-center gap-1 text-warm-500">
              <Star className="w-3.5 h-3.5 fill-warm-400" />
              {pkg.rating} ({pkg.reviewCount})
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">Starting from</span>
            <p className="text-xl font-bold text-primary-600">₹{pkg.price.toLocaleString()}</p>
            <span className="text-xs text-gray-400">per person</span>
          </div>
          <span className="bg-primary-50 text-primary-600 text-sm font-semibold px-4 py-2 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-colors">
            View Details
          </span>
        </div>
      </div>
    </Link>
  )
}
