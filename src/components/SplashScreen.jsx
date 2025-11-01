import { motion } from 'framer-motion'
import { useEffect } from 'react'
import makaraLogo from '../assets/makara.png'

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    // Splash screen her zaman 2.5 saniye görünür
    const timer = setTimeout(() => {
      onFinish()
    }, 2500)

    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.34, 1.56, 0.64, 1], // Spring effect
        }}
        className="mb-8"
      >
        <motion.img
          src={makaraLogo}
          alt="Makara Logo"
          className="w-48 h-48 md:w-64 md:h-64 object-contain"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Animated Text - MAKARA */}
      <div className="relative overflow-hidden">
        <motion.h1
          className="text-6xl md:text-8xl font-display font-bold text-primary-600 tracking-wider"
          style={{
            textShadow: '2px 2px 4px rgba(221, 64, 134, 0.2)',
          }}
        >
          {['M', 'A', 'K', 'A', 'R', 'A'].map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.3 + index * 0.1,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="inline-block"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      {/* Subtitle with fade in - Categories */}
      <motion.div
        className="mt-8 flex flex-col items-center gap-4"
      >
        {['Trdelnik', 'Fransız Pastaları', 'Kruvasan Çeşitleri', 'Waffle Çeşitleri'].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 1.2 + index * 0.12,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className="relative"
          >
            <p className="text-lg md:text-xl font-medium text-gray-700 tracking-wide">
              {item}
            </p>
            <motion.div
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: 1.3 + index * 0.12 
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Loading dots */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-primary-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Decorative circles */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 border-4 border-primary-200 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3, rotate: 360 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-40 h-40 border-4 border-primary-200 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3, rotate: -360 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
      />
      <motion.div
        className="absolute top-1/2 right-10 w-24 h-24 border-4 border-primary-100 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2, rotate: 180 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.4 }}
      />
      <motion.div
        className="absolute top-1/3 left-10 w-28 h-28 border-4 border-primary-100 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2, rotate: -180 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.6 }}
      />
    </motion.div>
  )
}

