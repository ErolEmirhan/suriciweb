import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChefHat, Users, Award, Heart, ArrowRight, Star } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const AnimatedCounter = ({ value, duration = 1.5 }) => {
  const [count, setCount] = useState(0)
  const nodeRef = useRef(null)
  const isInView = useInView(nodeRef, { once: true })

  useEffect(() => {
    if (!isInView) return

    const numericValue = parseInt(value.replace(/\D/g, ''))
    const suffix = value.replace(/[0-9]/g, '')
    
    let startTime
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * numericValue)
      
      setCount(currentCount + suffix)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }
    
    requestAnimationFrame(animate)
  }, [isInView, value, duration])

  return <span ref={nodeRef}>{count || '0'}</span>
}

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const heroImages = [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80',
    'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1920&q=80',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1920&q=80',
    'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1920&q=80',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000) // Her 4 saniyede bir değişir

    return () => clearInterval(interval)
  }, [heroImages.length])

  const stats = [
    { icon: ChefHat, label: 'Uzman Şef', value: '5' },
    { icon: Users, label: 'Mutlu Müşteri', value: '10K+' },
    { icon: Award, label: 'Özel Tarifler', value: '25+' },
    { icon: Heart, label: 'Chimney Çeşidi', value: '15+' },
  ]

  const concepts = [
    {
      title: 'Trdelnik / Chimney Cake',
      description: 'Çekya\'nın meşhur silindir hamur tatlısı, çeşitli soslar ve dolgularla',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    },
    {
      title: 'Prag Tatlısı',
      description: 'Orijinal Çek tarifli trdelnik, özel soslar ve taçlandırmalarla',
      image: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=800&q=80',
    },
    {
      title: 'Özel Dolgular',
      description: 'Nutella, beyaz çikolata, meyve sosları ve daha fazlası',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
    },
  ]

  const testimonials = [
    {
      name: 'Ayşe Yılmaz',
      text: 'Trdelnik\'i ilk kez tatıyordum, muhteşem bir deneyimdi! Sıcak hamuru, çıtır kaplaması ve içindeki Nutella\'nın uyumu harika. Prag\'a gitmeden Prag tatlısını tatmanın tadı bambaşka.',
      rating: 5,
    },
    {
      name: 'Mehmet Demir',
      text: 'Chimney Cake gerçekten efsane! Dışı çıtır çıtır, içi yumuşacık. Karamelli versiyonunu denedim, tarçın kokusunu çok sevdim. Konya\'da böyle özgün bir tatlı mekanı olması harika.',
      rating: 5,
    },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-start pt-20 md:pt-24 overflow-hidden">
        {/* Background Image Slider with Overlay */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false}>
            <motion.img
              key={currentImageIndex}
              src={heroImages[currentImageIndex]}
              alt="Trdelnik - Chimney Cake"
              className="w-full h-full object-cover absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </AnimatePresence>
          {/* Modern Professional Overlay */}
          <div className="absolute inset-0 z-10">
            {/* Base Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/70" />
            
            {/* Radial Gradient from corners */}
            <div className="absolute inset-0 bg-gradient-radial from-primary-600/20 via-transparent to-transparent opacity-50" 
                 style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(221, 64, 134, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(221, 64, 134, 0.1) 0%, transparent 50%)' }} />
            
            {/* Subtle mesh pattern overlay */}
            <div className="absolute inset-0 opacity-10"
                 style={{ 
                   backgroundImage: `
                     linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                   `,
                   backgroundSize: '50px 50px'
                 }} />
            
            {/* Backdrop blur for depth */}
            <div className="absolute inset-0 backdrop-blur-[2px]" />
          </div>
          
          {/* Slider Indicators */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="container-custom relative z-20 text-center text-white pt-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link to="/menu" className="btn-primary shadow-2xl">
                Tatlılarımızı Keşfedin
              </Link>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 drop-shadow-2xl" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)' }}>
              Trdelnik & Chimney
              <br />
              <span className="text-primary-400 drop-shadow-2xl" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)' }}>Prag Tatlısı</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white font-medium max-w-4xl mx-auto drop-shadow-xl" style={{ textShadow: '0 3px 15px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.7)' }}>
              Çekya'nın meşhur silindir tatlısı Trdelnik, Belçika'nın nefes kesen waffle'ları, Fransız pastahanelerinin zarif pastaları ve Paris'in özel kruvasanları... Hepsi gerçek Belçika çikolatasıyla buluşuyor
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4" />
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <AnimatedCounter value={stat.value} duration={1.5} />
                </div>
                <div className="text-lg text-primary-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Trdelnik Çeşitlerimiz</h2>
            <p className="section-subtitle">
              Çekya'dan gelen geleneksel tarif, modern dokunuşlarla
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {concepts.map((concept, index) => (
              <motion.div
                key={concept.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={concept.image}
                    alt={concept.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-6 text-2xl font-display font-bold text-white">
                    {concept.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{concept.description}</p>
                  <Link
                    to="/menu"
                    className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                  >
                    Tatlıları İncele
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Misafir Yorumları</h2>
            <p className="section-subtitle">
              Misafirlerimizin deneyimlerini keşfedin
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary-500 text-primary-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Trdelnik Deneyimini Yaşayın
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Çekya'nın meşhur Prag tatlısını Konya'da keşfedin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+905015431010"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-10 rounded-full transition-all duration-300"
              >
                Hemen Ara
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

