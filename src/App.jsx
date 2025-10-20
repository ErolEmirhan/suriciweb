import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
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
import SplashScreen from './components/SplashScreen'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/hakkimizda" element={<About />} />
        <Route path="/galeri" element={<Gallery />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/iletisim" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [splashComplete, setSplashComplete] = useState(false)

  useEffect(() => {
    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem('splashShown')
    if (splashShown) {
      setShowSplash(false)
      setSplashComplete(true)
    }
  }, [])

  const handleSplashFinish = () => {
    sessionStorage.setItem('splashShown', 'true')
    setSplashComplete(true)
    setTimeout(() => {
      setShowSplash(false)
    }, 500) // Fade out duration
  }

  return (
    <Router>
      <AnimatePresence mode="wait">
        {showSplash && !splashComplete && (
          <SplashScreen key="splash" onFinish={handleSplashFinish} />
        )}
      </AnimatePresence>

      {(splashComplete || !showSplash) && (
        <>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            <InstagramFloatingButton />
            <ReservationFloatingButton />
          </div>
        </>
      )}
    </Router>
  )
}

export default App

