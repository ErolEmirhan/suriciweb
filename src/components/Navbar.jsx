import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Home, Info, Images, UtensilsCrossed, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import makaraLogo from '../assets/makara.png'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Anasayfa', path: '/', icon: Home },
    { name: 'Menü', path: '/menu', icon: UtensilsCrossed },
    { name: 'Hakkımızda', path: '/hakkimizda', icon: Info },
    { name: 'Galeri', path: '/galeri', icon: Images },
    { name: 'İletişim', path: '/iletisim', icon: Phone },
  ]

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  // Get current page name and icon
  const currentPageData = navLinks.find(link => link.path === location.pathname) || navLinks[0]
  const currentPage = currentPageData.name
  const CurrentIcon = currentPageData.icon

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-md py-3'
          : 'bg-white/95 backdrop-blur-sm shadow-sm py-3'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ scale: 1.05 }}>
              <img
                src={makaraLogo}
                alt="Makara Logo"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-gray-200 group-hover:border-primary-400 transition-colors"
              />
            </motion.div>
            <span className="text-2xl md:text-3xl font-display font-black tracking-wider text-pink-600 group-hover:text-rose-600 transition-colors">
              MAKARA
            </span>
          </Link>

          {/* Animated Divider */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-8 w-px bg-gradient-to-b from-transparent via-primary-400 to-transparent relative overflow-hidden"
            >
              <motion.div
                initial={{ y: '-100%' }}
                animate={{ y: '100%' }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute inset-0 bg-gradient-to-b from-primary-500 via-white to-primary-500 opacity-60 blur-sm"
              />
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                  }`}
                >
                  {link.name}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button with Current Page */}
          <div className="lg:hidden relative">
            <motion.div 
              onClick={toggleMobileMenu}
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Current Page Icon - Outside the pink background */}
              <motion.div
                className="p-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-pink-200/50 shadow-sm"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <CurrentIcon size={20} className="text-primary-600" />
              </motion.div>
              
              {/* Page Name + Dropdown - Inside pink background */}
              <motion.div 
                className="flex items-center gap-1 bg-pink-50/80 backdrop-blur-sm px-3 py-2 rounded-full border border-pink-200/50 shadow-sm cursor-pointer"
              >
                <span className="text-sm font-semibold text-gray-800">
                  {currentPage}
                </span>
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl py-2 min-w-[160px] z-50"
                >
                  {navLinks.map((link, index) => {
                    const Icon = link.icon
                    const isLast = index === navLinks.length - 1
                    return (
                      <div key={link.path} className={!isLast ? 'border-b border-gray-100' : ''}>
                        <Link
                          to={link.path}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-4 py-2.5 flex items-center gap-3 text-sm font-medium transition-all duration-200 ${
                              location.pathname === link.path
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                            }`}
                          >
                            <Icon size={18} />
                            <span>{link.name}</span>
                          </motion.div>
                        </Link>
                      </div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  )
}

