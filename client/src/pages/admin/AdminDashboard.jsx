import { useState, useEffect } from 'react'
import { Users, Package, BookOpen, DollarSign, TrendingUp, MapPin } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import api from '../../utils/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard')
      setStats(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-500', change: '+12%' },
    { label: 'Total Packages', value: stats?.totalPackages || 0, icon: Package, color: 'bg-green-500', change: '+5%' },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: BookOpen, color: 'bg-purple-500', change: '+18%' },
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-orange-500', change: '+24%' }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                {change}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-display font-bold text-gray-900 mb-6">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats?.monthlyRevenue || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="_id" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
              />
              <Line type="monotone" dataKey="revenue" stroke="#1b86f5" strokeWidth={3} dot={{ fill: '#1b86f5', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-display font-bold text-gray-900 mb-6">Bookings by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.bookingsByStatus || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="_id" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => [value, 'Bookings']}
              />
              <Bar dataKey="count" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Popular Destinations & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Destinations */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-display font-bold text-gray-900 mb-4">Popular Destinations</h3>
          <div className="space-y-3">
            {(stats?.popularDestinations || []).map((dest, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{dest._id}</p>
                    <p className="text-sm text-gray-500">{dest.bookings} bookings</p>
                  </div>
                </div>
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-display font-bold text-gray-900 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {(stats?.recentBookings || []).slice(0, 5).map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{booking.user?.name}</p>
                  <p className="text-sm text-gray-500 truncate">{booking.package?.title}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-primary-600">₹{booking.totalAmount?.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
