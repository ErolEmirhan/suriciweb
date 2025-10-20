import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import makaraLogo from '../assets/makara.png'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Anasayfa', path: '/' },
    { name: 'Hakkımızda', path: '/hakkimizda' },
    { name: 'Galeri', path: '/galeri' },
    { name: 'Menü', path: '/menu' },
    { name: 'İletişim', path: '/iletisim' },
  ]

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-lg py-4'
          : 'bg-gradient-to-b from-black/60 to-transparent py-4'
      }`}
    >
      <div className="container-custom">
        {/* Logo - Always Centered on Mobile */}
        <div className="flex justify-center lg:justify-start mb-4 lg:mb-0">
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl md:text-3xl font-display font-bold"
            >
              <span className={`${scrolled ? 'text-primary-600' : 'text-white'}`}>
                MAKARA
              </span>
            </motion.div>
            <motion.img
              src={makaraLogo}
              alt="Makara Logo"
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-white shadow-lg"
            />
          </Link>
        </div>

         {/* Navigation Cards - Always Visible */}
         <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
           {navLinks.map((link, index) => (
             <Link
               key={link.path}
               to={link.path}
             >
               <motion.div
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.05 }}
                 whileHover={{ scale: 1.05, y: -2 }}
                 className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                   location.pathname === link.path
                     ? scrolled
                       ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                       : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-xl'
                     : scrolled
                     ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-400 hover:text-primary-600 shadow-sm'
                     : 'bg-white/20 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/30'
                 }`}
               >
                 <span className="text-sm lg:text-base whitespace-nowrap">{link.name}</span>
               </motion.div>
             </Link>
           ))}
         </div>
      </div>
    </nav>
  )
}

