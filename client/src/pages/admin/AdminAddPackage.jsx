import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, Plus, X } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function AdminAddPackage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    destination: '',
    price: '',
    durationDays: '',
    durationNights: '',
    groupSizeMin: '1',
    groupSizeMax: '20',
    hotelName: '',
    hotelRating: '3',
    hotelType: 'Standard',
    transportType: 'Mixed',
    transportDetails: '',
    category: 'Cultural',
    availability: true,
    featured: false,
    highlights: [''],
    inclusions: [''],
    exclusions: ['']
  })

  useEffect(() => {
    if (isEdit) fetchPackage()
  }, [id])

  const fetchPackage = async () => {
    try {
      const res = await api.get(`/packages/${id}`)
      const pkg = res.data.data
      setForm({
        title: pkg.title,
        description: pkg.description,
        destination: pkg.destination,
        price: pkg.price,
        durationDays: pkg.duration.days,
        durationNights: pkg.duration.nights,
        groupSizeMin: pkg.groupSize.min,
        groupSizeMax: pkg.groupSize.max,
        hotelName: pkg.hotel.name || '',
        hotelRating: pkg.hotel.rating,
        hotelType: pkg.hotel.type,
        transportType: pkg.transport.type,
        transportDetails: pkg.transport.details || '',
        category: pkg.category,
        availability: pkg.availability,
        featured: pkg.featured,
        highlights: pkg.highlights?.length > 0 ? pkg.highlights : [''],
        inclusions: pkg.inclusions?.length > 0 ? pkg.inclusions : [''],
        exclusions: pkg.exclusions?.length > 0 ? pkg.exclusions : ['']
      })
    } catch (err) {
      toast.error('Failed to load package')
      navigate('/admin/packages')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleArrayChange = (field, index, value) => {
    const updated = [...form[field]]
    updated[index] = value
    setForm({ ...form, [field]: updated })
  }

  const addArrayItem = (field) => {
    setForm({ ...form, [field]: [...form[field], ''] })
  }

  const removeArrayItem = (field, index) => {
    if (form[field].length === 1) return
    const updated = form[field].filter((_, i) => i !== index)
    setForm({ ...form, [field]: updated })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const payload = {
      title: form.title,
      description: form.description,
      destination: form.destination,
      price: Number(form.price),
      duration: {
        days: Number(form.durationDays),
        nights: Number(form.durationNights)
      },
      groupSize: {
        min: Number(form.groupSizeMin),
        max: Number(form.groupSizeMax)
      },
      hotel: {
        name: form.hotelName,
        rating: Number(form.hotelRating),
        type: form.hotelType
      },
      transport: {
        type: form.transportType,
        details: form.transportDetails
      },
      category: form.category,
      availability: form.availability,
      featured: form.featured,
      highlights: form.highlights.filter(h => h.trim()),
      inclusions: form.inclusions.filter(i => i.trim()),
      exclusions: form.exclusions.filter(e => e.trim())
    }

    try {
      if (isEdit) {
        await api.put(`/packages/${id}`, payload)
        toast.success('Package updated successfully')
      } else {
        await api.post('/packages', payload)
        toast.success('Package created successfully')
      }
      navigate('/admin/packages')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/packages')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900">
            {isEdit ? 'Edit Package' : 'Add New Package'}
          </h2>
          <p className="text-gray-600 mt-1">Fill in the package details</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-display font-bold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Package Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange}
                placeholder="e.g., Enchanting Goa Beach Holiday" required className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Detailed package description..." required rows="4" className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
              <input type="text" name="destination" value={form.destination} onChange={handleChange}
                placeholder="e.g., Goa" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange}
                placeholder="15999" required min="0" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required className="input-field">
                {['Beach', 'Adventure', 'Cultural', 'Hill Station', 'Wildlife', 'Pilgrimage', 'Honeymoon', 'Family'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="availability" checked={form.availability} onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500" />
                <span className="text-sm font-medium text-gray-700">Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500" />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
            </div>
          </div>
        </div>

        {/* Duration & Group Size */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-display font-bold text-gray-900 mb-4">Duration & Group Size</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Days *</label>
              <input type="number" name="durationDays" value={form.durationDays} onChange={handleChange}
                required min="1" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nights *</label>
              <input type="number" name="durationNights" value={form.durationNights} onChange={handleChange}
                required min="0" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Group *</label>
              <input type="number" name="groupSizeMin" value={form.groupSizeMin} onChange={handleChange}
                required min="1" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Group *</label>
              <input type="number" name="groupSizeMax" value={form.groupSizeMax} onChange={handleChange}
                required min="1" className="input-field" />
            </div>
          </div>
        </div>

        {/* Hotel & Transport */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-display font-bold text-gray-900 mb-4">Hotel & Transport</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
              <input type="text" name="hotelName" value={form.hotelName} onChange={handleChange}
                placeholder="e.g., The Leela Goa" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Rating</label>
              <select name="hotelRating" value={form.hotelRating} onChange={handleChange} className="input-field">
                {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} Star</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Type</label>
              <select name="hotelType" value={form.hotelType} onChange={handleChange} className="input-field">
                {['Budget', 'Standard', 'Premium', 'Luxury'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transport Type</label>
              <select name="transportType" value={form.transportType} onChange={handleChange} className="input-field">
                {['Flight', 'Train', 'Bus', 'Self-Drive', 'Mixed'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Transport Details</label>
              <input type="text" name="transportDetails" value={form.transportDetails} onChange={handleChange}
                placeholder="e.g., Round trip flights from Delhi/Mumbai included" className="input-field" />
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-bold text-gray-900">Highlights</h3>
            <button type="button" onClick={() => addArrayItem('highlights')}
              className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {form.highlights.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={item} onChange={(e) => handleArrayChange('highlights', i, e.target.value)}
                  placeholder="e.g., Baga Beach" className="input-field flex-1" />
                {form.highlights.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('highlights', i)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Inclusions */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-bold text-gray-900">Inclusions</h3>
            <button type="button" onClick={() => addArrayItem('inclusions')}
              className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {form.inclusions.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={item} onChange={(e) => handleArrayChange('inclusions', i, e.target.value)}
                  placeholder="e.g., Hotel accommodation" className="input-field flex-1" />
                {form.inclusions.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('inclusions', i)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Exclusions */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-bold text-gray-900">Exclusions</h3>
            <button type="button" onClick={() => addArrayItem('exclusions')}
              className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {form.exclusions.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={item} onChange={(e) => handleArrayChange('exclusions', i, e.target.value)}
                  placeholder="e.g., Personal expenses" className="input-field flex-1" />
                {form.exclusions.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('exclusions', i)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEdit ? 'Update Package' : 'Create Package'}
              </>
            )}
          </button>
          <button type="button" onClick={() => navigate('/admin/packages')} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
