import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, Download, Home, Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'

export default function PaymentSuccess() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooking()
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      const res = await api.get(`/bookings/${bookingId}`)
      setBooking(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!booking) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600">
              Your booking has been confirmed. Get ready for an amazing journey!
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                <p className="text-xl font-bold text-gray-900 font-mono">{booking._id.slice(-8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Package Info */}
            <div className="mb-6">
              <div className="flex gap-4 mb-4">
                <img
                  src={booking.package?.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'}
                  alt={booking.package?.title}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-display font-bold text-gray-900 mb-2">
                    {booking.package?.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {booking.package?.destination}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(booking.travelDate).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {booking.numberOfPassengers} Passenger{booking.numberOfPassengers > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Package Price</span>
                <span className="font-medium">₹{(booking.totalAmount / booking.numberOfPassengers).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Number of Passengers</span>
                <span className="font-medium">× {booking.numberOfPassengers}</span>
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Paid</span>
                <span className="text-2xl font-bold text-primary-600">₹{booking.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Passenger Details</h3>
              <div className="space-y-2">
                {booking.passengers.map((passenger, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3">
                    <span className="font-medium">{passenger.name}</span>
                    <span className="text-gray-600">{passenger.age} yrs • {passenger.gender}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-700 mb-2">
                <strong>📧 Confirmation Email Sent</strong>
              </p>
              <p className="text-sm text-blue-600">
                A detailed booking confirmation has been sent to <strong>{booking.contactEmail}</strong>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/my-bookings')}
              className="btn-primary flex items-center justify-center gap-2 py-3"
            >
              View My Bookings <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-outline flex items-center justify-center gap-2 py-3"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>
            <button
              onClick={() => window.print()}
              className="btn-outline flex items-center justify-center gap-2 py-3"
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </button>
          </div>

          {/* What's Next */}
          <div className="mt-8 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6">
            <h3 className="font-display font-bold text-gray-900 mb-4">What's Next?</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <span>You'll receive a detailed itinerary via email within 24 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <span>Our travel coordinator will contact you 3 days before departure</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <span>Pack your bags and get ready for an unforgettable experience!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
