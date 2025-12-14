import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import akis1 from '../assets/akis1.png'
import akis2 from '../assets/akis2.png'
import akis3 from '../assets/akis3.png'
import akis4 from '../assets/akis4.png'

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const heroImages = [
    akis1,
    akis2,
    akis3,
    akis4,
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000) // Her 4 saniyede bir değişir

    return () => clearInterval(interval)
  }, [heroImages.length])

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
      {/* Hero Section - Ultra Modern & Minimal */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false}>
            <motion.img
              key={currentImageIndex}
              src={heroImages[currentImageIndex]}
              alt="Trdelnik - Chimney Cake"
              className="w-full h-full object-cover absolute inset-0 scale-105"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1.05 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </AnimatePresence>
          
          {/* Minimal Sophisticated Overlay - Enhanced for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75 backdrop-blur-[1px]" />
          
          {/* Subtle Glass Effect at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Minimal Slider Indicators */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-[2px] transition-all duration-500 ${
                  index === currentImageIndex
                    ? 'bg-white w-12'
                    : 'bg-white/40 w-8 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Hero Content - Centered & Elegant */}
        <div className="container-custom relative z-20 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-5xl mx-auto"
          >
             {/* Premium Badge - Gradient Text */}
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="inline-block mb-8"
             >
               <span 
                 className="text-sm md:text-base tracking-[0.35em] uppercase font-bold"
                 style={{ 
                   background: 'linear-gradient(135deg, #fb69a7 0%, #f53d88 50%, #dd4086 100%)',
                   WebkitBackgroundClip: 'text',
                   WebkitTextFillColor: 'transparent',
                   backgroundClip: 'text',
                   filter: 'drop-shadow(0 2px 8px rgba(221,64,134,0.6)) drop-shadow(0 0 20px rgba(251,105,167,0.4))',
                 }}
               >
                 Premium Patisserie
               </span>
             </motion.div>

             {/* Main Heading - Ultra Clean */}
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 tracking-tight leading-[1.1]" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.7)' }}>
               <span className="font-extralight block">Trdelnik &</span>
               <span className="font-semibold text-white">Chimney Cake</span>
             </h1>

             {/* Elegant Divider */}
             <motion.div
               initial={{ width: 0 }}
               animate={{ width: '80px' }}
               transition={{ duration: 0.8, delay: 0.4 }}
               className="h-[1px] bg-white mx-auto mb-8"
               style={{ boxShadow: '0 0 10px rgba(255,255,255,0.5)' }}
             />

             {/* Subtitle - Refined */}
             <p className="text-base md:text-lg lg:text-xl text-white font-light max-w-2xl mx-auto mb-12 leading-relaxed tracking-wide" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.9), 0 1px 8px rgba(0,0,0,0.7)' }}>
               Çekya'nın meşhur Prag tatlısından, Belçika waffle'larına. 
               <br className="hidden md:block" />
               Gerçek Belçika çikolatasıyla buluşan zarif lezzetler.
             </p>

            {/* CTA Button - Minimal & Sophisticated */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
               <Link 
                 to="/menu" 
                 className="group relative inline-flex items-center gap-4 px-12 py-5 text-sm md:text-base tracking-[0.2em] uppercase font-bold text-white overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(221,64,134,0.6)]"
                 style={{ 
                   background: 'linear-gradient(135deg, #dd4086 0%, #f53d88 50%, #fb69a7 100%)',
                   boxShadow: '0 10px 40px rgba(221,64,134,0.4), 0 0 20px rgba(221,64,134,0.3)',
                   textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                 }}
               >
                 {/* Shine Effect */}
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                 
                 {/* Glow Effect on Hover */}
                 <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500" />
                 
                 <span className="relative z-10">Menümüzü Keşfedin</span>
                 <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
               </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Minimal Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/60 to-transparent"
          />
        </motion.div>
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

