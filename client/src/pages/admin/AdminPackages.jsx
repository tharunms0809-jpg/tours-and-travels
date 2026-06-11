import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, Search, Camera, X, Link, Upload } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function AdminPackages() {
  const navigate = useNavigate()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Quick image edit modal state
  const [imageModal, setImageModal] = useState(null) // { pkg }
  const [imgUrl, setImgUrl] = useState('')
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState('')
  const [imgMode, setImgMode] = useState('url')
  const [imgSaving, setImgSaving] = useState(false)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const res = await api.get('/packages?limit=100')
      setPackages(res.data.data)
    } catch (err) {
      toast.error('Failed to load packages')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this package?')) return
    
    try {
      await api.delete(`/packages/${id}`)
      toast.success('Package deleted successfully')
      fetchPackages()
    } catch (err) {
      toast.error('Failed to delete package')
    }
  }

  const openImageModal = (pkg) => {
    setImageModal(pkg)
    setImgUrl(pkg.images?.[0] || '')
    setImgPreview(pkg.images?.[0] || '')
    setImgFile(null)
    setImgMode('url')
  }

  const closeImageModal = () => {
    setImageModal(null)
    setImgUrl('')
    setImgPreview('')
    setImgFile(null)
  }

  const handleImgFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB'); return }
    setImgFile(file)
    setImgPreview(URL.createObjectURL(file))
  }

  const handleSaveImage = async () => {
    if (!imageModal) return
    setImgSaving(true)
    try {
      const formData = new FormData()
      // send all required fields to pass validation
      formData.append('title', imageModal.title)
      formData.append('description', imageModal.description)
      formData.append('destination', imageModal.destination)
      formData.append('price', imageModal.price)
      formData.append('duration', JSON.stringify(imageModal.duration))
      formData.append('groupSize', JSON.stringify(imageModal.groupSize))
      formData.append('hotel', JSON.stringify(imageModal.hotel))
      formData.append('transport', JSON.stringify(imageModal.transport))
      formData.append('category', imageModal.category)
      formData.append('highlights', JSON.stringify(imageModal.highlights || []))
      formData.append('inclusions', JSON.stringify(imageModal.inclusions || []))
      formData.append('exclusions', JSON.stringify(imageModal.exclusions || []))

      if (imgFile) {
        formData.append('images', imgFile)
      } else if (imgUrl.trim()) {
        formData.append('imageUrls', JSON.stringify([imgUrl.trim()]))
      }

      await api.put(`/packages/${imageModal._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Image updated successfully!')
      closeImageModal()
      fetchPackages()
    } catch (err) {
      toast.error('Failed to update image')
    } finally {
      setImgSaving(false)
    }
  }

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(search.toLowerCase()) ||
    pkg.destination.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900">Tour Packages</h2>
          <p className="text-gray-600 mt-1">Manage all tour packages</p>
        </div>
        <button
          onClick={() => navigate('/admin/packages/add')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Package
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search packages..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100'}
                          alt={pkg.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{pkg.title}</p>
                          <p className="text-sm text-gray-500">{pkg.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{pkg.destination}</td>
                    <td className="px-6 py-4 font-semibold text-primary-600">₹{pkg.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-700">{pkg.duration.days}D/{pkg.duration.nights}N</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        pkg.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {pkg.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/packages/${pkg._id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openImageModal(pkg)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit Image"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/packages/edit/${pkg._id}`)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

      {/* Quick Image Edit Modal */}
      {imageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-display font-bold text-gray-900">Edit Image</h3>
              </div>
              <button onClick={closeImageModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="px-5 pt-4">
              <p className="text-sm font-medium text-gray-500">Package:</p>
              <p className="font-semibold text-gray-900 mt-0.5 line-clamp-1">{imageModal.title}</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex gap-2">
                <button type="button" onClick={() => { setImgMode('url'); setImgFile(null) }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${imgMode === 'url' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'}`}>
                  <Link className="w-4 h-4" /> Image URL
                </button>
                <button type="button" onClick={() => { setImgMode('upload'); setImgUrl('') }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${imgMode === 'upload' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'}`}>
                  <Upload className="w-4 h-4" /> Upload File
                </button>
              </div>
              {imgMode === 'url' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="text" value={imgUrl}
                    onChange={(e) => { setImgUrl(e.target.value); setImgPreview(e.target.value) }}
                    placeholder="https://images.unsplash.com/... or /assets/image.jpg"
                    className="input-field" />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary-400 rounded-xl p-5 cursor-pointer transition-colors">
                    <Upload className="w-7 h-7 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-500">Click to browse</span>
                    <span className="text-xs text-gray-400">JPG, PNG, WebP — max 5MB</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImgFileChange} className="hidden" />
                  </label>
                  {imgFile && <p className="text-xs text-green-600 mt-1 font-medium">✅ {imgFile.name}</p>}
                </div>
              )}
              {imgPreview && (
                <div className="rounded-xl overflow-hidden h-44 bg-gray-100 border border-gray-200">
                  <img src={imgPreview} alt="Preview" className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' }} />
                </div>
              )}
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={handleSaveImage}
                disabled={imgSaving || (!imgUrl.trim() && !imgFile)}
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {imgSaving
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Camera className="w-4 h-4" />}
                {imgSaving ? 'Saving...' : 'Save Image'}
              </button>
              <button onClick={closeImageModal} className="btn-outline">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
