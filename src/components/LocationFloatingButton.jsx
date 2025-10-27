import { MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LocationFloatingButton() {
  const openGoogleMaps = () => {
    const lat = 37.862186747238425
    const lng = 32.47132545977872
    const url = `https://www.google.com/maps?q=${lat},${lng}`
    window.open(url, '_blank')
  }

  return (
    <motion.button
      onClick={openGoogleMaps}
      className="flex items-center gap-3 bg-white text-gray-800 px-5 py-4 rounded-full shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300 group"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <MapPin className="w-6 h-6 text-blue-600 group-hover:text-blue-700 group-hover:rotate-12 transition-all duration-300" />
      <span className="font-semibold text-base whitespace-nowrap">
        Konum
      </span>
    </motion.button>
  )
}
