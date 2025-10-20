import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
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
  return (
    <Router>
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
    </Router>
  )
}

export default App

