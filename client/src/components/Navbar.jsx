import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Globe, User, Heart, BookOpen, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropdownOpen(false)
  }

  const handleNavClick = (e, sectionId) => {
    e.preventDefault()
    if (isHome) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate('/', { state: { scrollTo: sectionId } })
    }
  }

  const navBg = isHome
    ? scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
    : 'bg-white shadow-md'

  const textColor = isHome && !scrolled ? 'text-white' : 'text-gray-800'
  const logoColor = isHome && !scrolled ? 'text-white' : 'text-primary-600'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-display font-bold ${logoColor}`}>TravelVista</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`font-medium hover:text-primary-500 transition-colors ${textColor}`}>Home</Link>
            <Link to="/packages" className={`font-medium hover:text-primary-500 transition-colors ${textColor}`}>Packages</Link>
            <button
              onClick={(e) => handleNavClick(e, 'destinations')}
              className={`font-medium hover:text-primary-500 transition-colors ${textColor} border-none bg-transparent cursor-pointer font-sans`}
            >
              Destinations
            </button>
            <button
              onClick={(e) => handleNavClick(e, 'about')}
              className={`font-medium hover:text-primary-500 transition-colors ${textColor} border-none bg-transparent cursor-pointer font-sans`}
            >
              About
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 font-medium hover:text-primary-500 transition-colors ${textColor}`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-slide-down">
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <Link to="/my-bookings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <BookOpen className="w-4 h-4" /> My Bookings
                    </Link>
                    <Link to="/wishlist" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <Heart className="w-4 h-4" /> Wishlist
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors w-full text-left">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className={`font-medium hover:text-primary-500 transition-colors ${textColor}`}>Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2.5 px-5">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden ${textColor}`}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-slide-down">
          <div className="px-4 py-4 space-y-3">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">Home</Link>
            <Link to="/packages" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">Packages</Link>
            <button
              onClick={(e) => { setMobileOpen(false); handleNavClick(e, 'destinations'); }}
              className="block py-2 text-gray-700 font-medium border-none bg-transparent text-left w-full cursor-pointer font-sans"
            >
              Destinations
            </button>
            <button
              onClick={(e) => { setMobileOpen(false); handleNavClick(e, 'about'); }}
              className="block py-2 text-gray-700 font-medium border-none bg-transparent text-left w-full cursor-pointer font-sans"
            >
              About
            </button>
            {user ? (
              <>
                {user.role === 'admin' && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">Admin Dashboard</Link>}
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">Profile</Link>
                <Link to="/my-bookings" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">My Bookings</Link>
                <button onClick={handleLogout} className="block py-2 text-red-500 font-medium w-full text-left">Logout</button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline text-sm py-2 flex-1 text-center">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm py-2 flex-1 text-center">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
