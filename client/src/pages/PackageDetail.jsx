import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Clock, Users, Star, Calendar, Hotel, Bus, Check, X, Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StarRating from '../components/StarRating'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function PackageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [pkg, setPkg] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [imageIndex, setImageIndex] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    fetchPackage()
    fetchReviews()
  }, [id])

  const fetchPackage = async () => {
    try {
      const res = await api.get(`/packages/${id}`)
      setPkg(res.data.data)
      setWishlisted(user?.favorites?.includes(res.data.data._id))
    } catch (err) {
      toast.error('Package not found')
      navigate('/packages')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/package/${id}`)
      setReviews(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist')
      return
    }
    try {
      await api.put(`/auth/favorites/${id}`)
      setWishlisted(!wishlisted)
      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist')
    } catch {
      toast.error('Something went wrong')
    }
  }

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please login to book')
      navigate('/login')
      return
    }
    navigate(`/booking/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!pkg) return null

  const images = pkg.images?.length > 0 ? pkg.images : ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200']

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20">
        {/* Image Gallery */}
        <div className="relative h-[500px] bg-gray-900">
          <img
            src={images[imageIndex]}
            alt={pkg.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {images.length > 1 && (
            <>
              <button
                onClick={() => setImageIndex((imageIndex - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setImageIndex((imageIndex + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === imageIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
          >
            <Heart className={`w-6 h-6 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                      {pkg.category}
                    </span>
                    <h1 className="text-3xl font-display font-bold text-gray-900">{pkg.title}</h1>
                  </div>
                  {pkg.featured && (
                    <span className="bg-gradient-to-r from-warm-500 to-warm-600 text-white text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-500" />
                    {pkg.destination}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-500" />
                    {pkg.duration.days} Days / {pkg.duration.nights} Nights
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-500" />
                    Max {pkg.groupSize.max} People
                  </span>
                  {pkg.rating > 0 && (
                    <span className="flex items-center gap-2">
                      <StarRating rating={pkg.rating} size="sm" />
                      <span className="font-medium">{pkg.rating}</span>
                      <span className="text-gray-400">({pkg.reviewCount} reviews)</span>
                    </span>
                  )}
                </div>

                <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
              </div>

              {/* Highlights */}
              {pkg.highlights?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Tour Highlights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pkg.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-accent-600" />
                        </div>
                        <span className="text-gray-700">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {pkg.itinerary?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Day-wise Itinerary</h2>
                  <div className="space-y-6">
                    {pkg.itinerary.map((day, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold shrink-0">
                            {day.day}
                          </div>
                          {i < pkg.itinerary.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-2" />}
                        </div>
                        <div className="flex-1 pb-6">
                          <h3 className="font-semibold text-gray-900 mb-1">{day.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{day.description}</p>
                          {day.activities?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {day.activities.map((act, j) => (
                                <span key={j} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                                  {act}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pkg.inclusions?.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-4">Inclusions</h3>
                    <ul className="space-y-2">
                      {pkg.inclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                          <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pkg.exclusions?.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-4">Exclusions</h3>
                    <ul className="space-y-2">
                      {pkg.exclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                          <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                  Customer Reviews ({reviews.length})
                </h2>
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold">
                              {review.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{review.user?.name}</p>
                              <StarRating rating={review.rating} size="sm" />
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {review.title && <p className="font-medium text-gray-900 mb-1">{review.title}</p>}
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <div className="mb-6">
                  <span className="text-gray-500 text-sm">Starting from</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary-600">₹{pkg.price.toLocaleString()}</span>
                    <span className="text-gray-500">/ person</span>
                  </div>
                </div>

                {/* Hotel & Transport */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Hotel className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium">{pkg.hotel.name || 'Hotel Included'}</p>
                      <p className="text-xs text-gray-500">{pkg.hotel.type} • {pkg.hotel.rating}★</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Bus className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium">{pkg.transport.type}</p>
                      <p className="text-xs text-gray-500">{pkg.transport.details}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  disabled={!pkg.availability}
                  className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
                >
                  {pkg.availability ? (
                    <>Book Now <ArrowRight className="w-4 h-4" /></>
                  ) : (
                    'Not Available'
                  )}
                </button>

                <button
                  onClick={handleWishlist}
                  className="btn-outline w-full flex items-center justify-center gap-2"
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  {wishlisted ? 'Saved' : 'Save for Later'}
                </button>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Free cancellation up to 7 days
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Instant confirmation
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    24/7 customer support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
