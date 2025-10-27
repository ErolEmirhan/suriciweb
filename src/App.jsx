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
  const location = useLocation()
  const isMenuPage = location.pathname === '/menu'

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
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
        <motion.div
          animate={{
            x: (isMenuPage && buttonsCollapsed) ? 'calc(100% - 20px)' : 0,
            opacity: (isMenuPage && buttonsCollapsed) ? 0 : 1
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-col gap-3 items-end"
        >
          <ReservationFloatingButton />
          <LocationFloatingButton />
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

