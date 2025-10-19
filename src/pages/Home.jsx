import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChefHat, Users, Award, Heart, ArrowRight, Star } from 'lucide-react'

export default function Home() {
  const stats = [
    { icon: ChefHat, label: 'Pastane Şefi', value: '8' },
    { icon: Users, label: 'Mutlu Müşteri', value: '15K+' },
    { icon: Award, label: 'Özel Tarifler', value: '120+' },
    { icon: Heart, label: 'Tatlı Çeşitleri', value: '85+' },
  ]

  const concepts = [
    {
      title: 'Belçika Waffles',
      description: 'Orijinal Belçika tarifi ile hazırlanan çıtır waffle\'lar',
      image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&q=80',
    },
    {
      title: 'Prag Tatlısı',
      description: 'Çekoslovakya\'nın meşhur çikolatalı pastası',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    },
    {
      title: 'Belçika Çikolatası',
      description: 'El yapımı premium Belçika çikolataları',
      image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=80',
    },
  ]

  const testimonials = [
    {
      name: 'Ayşe Yılmaz',
      text: 'Waffle\'ları muhteşem! Belçika\'da yediğim waffle\'lardan bile lezzetliydi. Çikolata sosları ve taze meyveler harika bir kombinasyon oluşturmuş.',
      rating: 5,
    },
    {
      name: 'Mehmet Demir',
      text: 'Prag tatlısını ilk kez denedim ve bayıldım! Çikolata severlerin mutlaka denemesi gereken bir lezzet. Sunumu da çok şık ve özenli.',
      rating: 5,
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10" />
          <img
            src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1920&q=80"
            alt="Desserts"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="container-custom relative z-20 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6">
              Tatlı Dünyasına
              <br />
              <span className="text-primary-500">Hoş Geldiniz</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              Dünyanın en özel tatlılarını, en taze malzemelerle sizler için hazırlıyoruz
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/menu" className="btn-primary">
                Tatlılarımızı Keşfedin
              </Link>
              <Link to="/iletisim" className="btn-secondary">
                Sipariş Ver
              </Link>
            </div>
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
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
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
            <h2 className="section-title">Özel Tatlılarımız</h2>
            <p className="section-subtitle">
              Dünya mutfaklarından seçkin tatlılar, özenle hazırlanıyor
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
              Tatlı Bir Deneyim İçin Sipariş Verin
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Dünyanın en lezzetli tatlılarını keşfedin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/iletisim"
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Sipariş Ver
              </Link>
              <a
                href="tel:+905060404200"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-10 rounded-full transition-all duration-300"
              >
                Hemen Ara
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

