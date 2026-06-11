import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, Plus, X, Image, Upload, Link, Trash2 } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function AdminAddPackage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  // Image state
  const [imageMode, setImageMode] = useState('url') // 'url' | 'upload'
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [existingImages, setExistingImages] = useState([])

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
      // Load existing images
      if (pkg.images?.length > 0) {
        setExistingImages(pkg.images)
        setImagePreview(pkg.images[0])
        setImageUrl(pkg.images[0])
      }
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

  // Image handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setImageUrl('')
  }

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value)
    setImagePreview(e.target.value)
    setImageFile(null)
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    setImageUrl('')
    setExistingImages([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Build payload as FormData to support file upload
      const formData = new FormData()

      // All basic fields
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('destination', form.destination)
      formData.append('price', Number(form.price))
      formData.append('duration', JSON.stringify({ days: Number(form.durationDays), nights: Number(form.durationNights) }))
      formData.append('groupSize', JSON.stringify({ min: Number(form.groupSizeMin), max: Number(form.groupSizeMax) }))
      formData.append('hotel', JSON.stringify({ name: form.hotelName, rating: Number(form.hotelRating), type: form.hotelType }))
      formData.append('transport', JSON.stringify({ type: form.transportType, details: form.transportDetails }))
      formData.append('category', form.category)
      formData.append('availability', form.availability)
      formData.append('featured', form.featured)
      formData.append('highlights', JSON.stringify(form.highlights.filter(h => h.trim())))
      formData.append('inclusions', JSON.stringify(form.inclusions.filter(i => i.trim())))
      formData.append('exclusions', JSON.stringify(form.exclusions.filter(e => e.trim())))

      // Image handling
      if (imageFile) {
        // File upload — sent as multipart
        formData.append('images', imageFile)
      } else if (imageUrl.trim()) {
        // URL image — send as JSON array via images field
        formData.append('imageUrls', JSON.stringify([imageUrl.trim()]))
      } else if (existingImages.length > 0) {
        // Keep existing images
        formData.append('imageUrls', JSON.stringify(existingImages))
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } }

      if (isEdit) {
        await api.put(`/packages/${id}`, formData, config)
        toast.success('Package updated successfully')
      } else {
        await api.post('/packages', formData, config)
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

        {/* Package Image */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-display font-bold text-gray-900">Package Image</h3>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => { setImageMode('url'); setImageFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                imageMode === 'url'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
              }`}
            >
              <Link className="w-4 h-4" />
              Image URL
            </button>
            <button
              type="button"
              onClick={() => { setImageMode('upload'); setImageUrl('') }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                imageMode === 'upload'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload File
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Side */}
            <div className="space-y-3">
              {imageMode === 'url' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={handleUrlChange}
                    placeholder="https://images.unsplash.com/... or /assets/image.jpg"
                    className="input-field"
                  />
                  <p className="text-xs text-gray-400 mt-1">Paste a full URL or a local /assets/ path</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-primary-400 rounded-xl p-6 text-center cursor-pointer transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click to browse or drag & drop</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 5MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {imageFile && (
                    <p className="text-xs text-green-600 mt-2 font-medium">✅ {imageFile.name}</p>
                  )}
                </div>
              )}

              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Image
                </button>
              )}
            </div>

            {/* Preview Side */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden h-48 bg-gray-100 border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                    Preview
                  </div>
                </div>
              ) : (
                <div className="rounded-xl h-48 bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                  <Image className="w-10 h-10 mb-2 opacity-40" />
                  <p className="text-sm">No image selected</p>
                </div>
              )}
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
