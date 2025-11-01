import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Menu from './pages/Menu'
import Contact from './pages/Contact'
import ScrollToTop from './components/ScrollToTop'
import InstagramFloatingButton from './components/InstagramFloatingButton'
import ReservationFloatingButton from './components/ReservationFloatingButton'
import LocationFloatingButton from './components/LocationFloatingButton'
import SplashScreen from './components/SplashScreen'

function AppContent() {
  const [buttonsCollapsed, setButtonsCollapsed] = useState(false)
  const [showButtons, setShowButtons] = useState(true)
  const location = useLocation()
  const isMenuPage = location.pathname === '/menu'

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      
      // Footer görünür olduğunda butonları gizle (sayfanın en sonundaki %10'luk kısımda)
      const footerThreshold = documentHeight * 0.9
      setShowButtons(scrollTop + windowHeight < footerThreshold)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location]) // Re-check when route changes

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/hakkimizda" element={<About />} />
              <Route path="/galeri" element={<Gallery />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/iletisim" element={<Contact />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
      
      {/* Floating Buttons Container - Only show toggle on Menu page */}
      <div className={`fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end transition-opacity duration-300 ${showButtons ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <motion.div
          animate={{
            x: (isMenuPage && buttonsCollapsed) ? 'calc(100% - 20px)' : 0,
            opacity: (isMenuPage && buttonsCollapsed) ? 0 : 1
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-col gap-3 items-end"
        >
          <LocationFloatingButton />
          <ReservationFloatingButton />
          <InstagramFloatingButton />
        </motion.div>
        
        {/* Toggle Button - Only on Menu page */}
        {isMenuPage && (
          <motion.button
            onClick={() => setButtonsCollapsed(!buttonsCollapsed)}
            whileTap={{ scale: 0.95 }}
            className={`${buttonsCollapsed ? 'bg-primary-600' : 'bg-gray-700'} text-white p-3 rounded-full shadow-2xl transition-all duration-300`}
          >
            {buttonsCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </motion.button>
        )}
      </div>
    </>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashFinish = () => {
    setTimeout(() => {
      setShowSplash(false)
    }, 500) // Fade out duration
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen key="splash" onFinish={handleSplashFinish} />
        )}
      </AnimatePresence>

      {!showSplash && (
        <AppContent />
      )}
    </>
  )
}

export default App

