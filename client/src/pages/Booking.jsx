import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Clock, Users, Calendar, Plus, Trash2, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Booking() {
  const { packageId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    travelDate: '',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
    specialRequests: '',
    passengers: [{ name: user?.name || '', age: '', gender: 'Male', idType: 'Aadhaar', idNumber: '' }]
  })

  useEffect(() => {
    fetchPackage()
  }, [packageId])

  const fetchPackage = async () => {
    try {
      const res = await api.get(`/packages/${packageId}`)
      setPkg(res.data.data)
    } catch (err) {
      toast.error('Package not found')
      navigate('/packages')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePassengerChange = (index, field, value) => {
    const updated = [...form.passengers]
    updated[index][field] = value
    setForm({ ...form, passengers: updated })
  }

  const addPassenger = () => {
    if (form.passengers.length >= pkg.groupSize.max) {
      toast.error(`Maximum ${pkg.groupSize.max} passengers allowed`)
      return
    }
    setForm({
      ...form,
      passengers: [...form.passengers, { name: '', age: '', gender: 'Male', idType: 'Aadhaar', idNumber: '' }]
    })
  }

  const removePassenger = (index) => {
    if (form.passengers.length === 1) {
      toast.error('At least one passenger required')
      return
    }
    const updated = form.passengers.filter((_, i) => i !== index)
    setForm({ ...form, passengers: updated })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!form.travelDate) {
      toast.error('Please select travel date')
      return
    }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(form.travelDate)
    if (selectedDate < today) {
      toast.error('Travel date cannot be in the past')
      return
    }

    for (let p of form.passengers) {
      if (!p.name || !p.age || !p.gender) {
        toast.error('Please fill all passenger details')
        return
      }
    }

    setSubmitting(true)
    try {
      const res = await api.post('/bookings', {
        packageId,
        travelDate: form.travelDate,
        passengers: form.passengers,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        specialRequests: form.specialRequests
      })
      toast.success('Booking created successfully!')
      navigate(`/payment/${res.data.data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!pkg) return null

  const totalAmount = pkg.price * form.passengers.length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-8">Complete Your Booking</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Package Summary */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-display font-bold text-gray-900 mb-4">Package Details</h2>
                  <div className="flex gap-4">
                    <img
                      src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'}
                      alt={pkg.title}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{pkg.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {pkg.destination}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {pkg.duration.days}D/{pkg.duration.nights}N
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Max {pkg.groupSize.max}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Travel Date */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-display font-bold text-gray-900 mb-4">Travel Date</h2>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="travelDate"
                      value={form.travelDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="input-field pl-12"
                    />
                  </div>
                </div>

                {/* Passenger Details */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-display font-bold text-gray-900">Passenger Details</h2>
                    <button
                      type="button"
                      onClick={addPassenger}
                      className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Passenger
                    </button>
                  </div>

                  <div className="space-y-6">
                    {form.passengers.map((passenger, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">Passenger {index + 1}</h3>
                          {form.passengers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePassenger(index)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input
                              type="text"
                              value={passenger.name}
                              onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                              placeholder="Enter full name"
                              required
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                            <input
                              type="number"
                              value={passenger.age}
                              onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                              placeholder="Age"
                              required
                              min="1"
                              max="120"
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                            <select
                              value={passenger.gender}
                              onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                              required
                              className="input-field"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                            <select
                              value={passenger.idType}
                              onChange={(e) => handlePassengerChange(index, 'idType', e.target.value)}
                              className="input-field"
                            >
                              <option value="Aadhaar">Aadhaar</option>
                              <option value="Passport">Passport</option>
                              <option value="PAN">PAN Card</option>
                              <option value="Driving License">Driving License</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                            <input
                              type="text"
                              value={passenger.idNumber}
                              onChange={(e) => handlePassengerChange(index, 'idNumber', e.target.value)}
                              placeholder="Enter ID number"
                              className="input-field"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Details */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-display font-bold text-gray-900 mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={form.contactPhone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={form.contactEmail}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-display font-bold text-gray-900 mb-4">Special Requests (Optional)</h2>
                  <textarea
                    name="specialRequests"
                    value={form.specialRequests}
                    onChange={handleChange}
                    placeholder="Any special requirements or requests..."
                    rows="4"
                    className="input-field resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Proceed to Payment <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-display font-bold text-gray-900 mb-6">Price Summary</h2>
                
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Package Price</span>
                    <span>₹{pkg.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Number of Passengers</span>
                    <span>× {form.passengers.length}</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <span className="text-3xl font-bold text-primary-600">₹{totalAmount.toLocaleString()}</span>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                  <p className="font-semibold mb-2">✓ What's Included:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• {pkg.hotel.type} hotel accommodation</li>
                    <li>• {pkg.transport.type} transportation</li>
                    <li>• All sightseeing as per itinerary</li>
                    <li>• Professional tour guide</li>
                  </ul>
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
