import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CreditCard, Lock, ArrowRight, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Payment() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [form, setForm] = useState({
    method: 'Credit Card',
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  })

  useEffect(() => {
    fetchBooking()
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      const res = await api.get(`/bookings/${bookingId}`)
      if (res.data.data.paymentStatus === 'paid') {
        toast.error('This booking is already paid')
        navigate(`/payment/success/${bookingId}`)
        return
      }
      setBooking(res.data.data)
    } catch (err) {
      toast.error('Booking not found')
      navigate('/my-bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    let value = e.target.value
    
    // Format card number
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
      if (value.length > 19) return
    }
    
    // Format CVV
    if (e.target.name === 'cvv' && value.length > 3) return
    
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    const cardNum = form.cardNumber.replace(/\s/g, '')
    if (cardNum.length !== 16) {
      toast.error('Invalid card number')
      return
    }
    
    if (form.cvv.length !== 3) {
      toast.error('Invalid CVV')
      return
    }

    setProcessing(true)
    try {
      await api.post('/payments', {
        bookingId,
        method: form.method,
        cardNumber: cardNum
      })
      toast.success('Payment successful!')
      navigate(`/payment/success/${bookingId}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed')
    } finally {
      setProcessing(false)
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-8">Secure Payment</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-display font-bold text-gray-900 mb-4">Payment Method</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setForm({ ...form, method })}
                        className={`p-4 rounded-xl border-2 font-medium transition-all ${
                          form.method === method
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Details */}
                {(form.method === 'Credit Card' || form.method === 'Debit Card') && (
                  <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-display font-bold text-gray-900 mb-4">Card Details</h2>
                    
                    {/* Demo Card Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-700">
                      <p className="font-semibold mb-2">🎯 Demo Payment - Use any test card:</p>
                      <p>Card: 4111 1111 1111 1111</p>
                      <p>Expiry: Any future date | CVV: Any 3 digits</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="cardNumber"
                            value={form.cardNumber}
                            onChange={handleChange}
                            placeholder="1234 5678 9012 3456"
                            required
                            className="input-field pl-12"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          name="cardName"
                          value={form.cardName}
                          onChange={handleChange}
                          placeholder="Name on card"
                          required
                          className="input-field"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                          <select
                            name="expiryMonth"
                            value={form.expiryMonth}
                            onChange={handleChange}
                            required
                            className="input-field"
                          >
                            <option value="">MM</option>
                            {[...Array(12)].map((_, i) => (
                              <option key={i} value={String(i + 1).padStart(2, '0')}>
                                {String(i + 1).padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                          <select
                            name="expiryYear"
                            value={form.expiryYear}
                            onChange={handleChange}
                            required
                            className="input-field"
                          >
                            <option value="">YY</option>
                            {[...Array(10)].map((_, i) => {
                              const year = new Date().getFullYear() + i
                              return (
                                <option key={year} value={year.toString().slice(-2)}>
                                  {year}
                                </option>
                              )
                            })}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input
                            type="password"
                            name="cvv"
                            value={form.cvv}
                            onChange={handleChange}
                            placeholder="123"
                            required
                            maxLength="3"
                            className="input-field"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI */}
                {form.method === 'UPI' && (
                  <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-display font-bold text-gray-900 mb-4">UPI Details</h2>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm text-blue-700">
                      <p className="font-semibold mb-2">🎯 Demo UPI Payment</p>
                      <p>Use any UPI ID for testing: success@upi</p>
                    </div>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      required
                      className="input-field"
                    />
                  </div>
                )}

                {/* Security Notice */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-green-700">
                    <p className="font-semibold mb-1">Secure Payment</p>
                    <p>Your payment information is encrypted and secure. We never store your card details.</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
                >
                  {processing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Pay ₹{booking.totalAmount.toLocaleString()} <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-display font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="mb-6">
                  <img
                    src={booking.package?.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'}
                    alt={booking.package?.title}
                    className="w-full h-32 object-cover rounded-xl mb-3"
                  />
                  <h3 className="font-semibold text-gray-900 mb-1">{booking.package?.title}</h3>
                  <p className="text-sm text-gray-500">{booking.package?.destination}</p>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travel Date</span>
                    <span className="font-medium">{new Date(booking.travelDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers</span>
                    <span className="font-medium">{booking.numberOfPassengers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{booking.package?.duration.days}D/{booking.package?.duration.nights}N</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <span className="text-3xl font-bold text-primary-600">₹{booking.totalAmount.toLocaleString()}</span>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Instant booking confirmation
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Free cancellation up to 7 days
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
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
