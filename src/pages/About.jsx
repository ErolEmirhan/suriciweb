import { motion } from 'framer-motion'
import { Heart, Award, Users, TrendingUp } from 'lucide-react'

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Taze & Sıcak',
      description: 'Her trdelnik sipariş anında taze olarak hazırlanır',
    },
    {
      icon: Award,
      title: 'Geleneksel Tarif',
      description: 'Orijinal Çek tarifine sadık kalarak üretiyoruz',
    },
    {
      icon: Users,
      title: 'Müşteri Memnuniyeti',
      description: 'Her misafirimize sıcak ve samimi bir hizmet sunuyoruz',
    },
    {
      icon: TrendingUp,
      title: 'Modern Dolgular',
      description: 'Geleneksel tarife modern ve yaratıcı dolgular ekliyoruz',
    },
  ]

  const timeline = [
    {
      year: '2020',
      title: 'Kuruluş',
      description: 'Trdelnik\'i Konya\'ya getirme hayaliyle yola çıktık',
    },
    {
      year: '2021',
      title: 'İlk Şubemiz',
      description: 'Konya\'da ilk Trdelnik konseptli mekanımızı açtık',
    },
    {
      year: '2023',
      title: 'Özel Tarifler',
      description: '15+ farklı dolgu ve sos çeşidimizi geliştirdik',
    },
    {
      year: '2025',
      title: 'Bugün',
      description: '10.000+ mutlu müşteri ve benzersiz Trdelnik deneyimi sunuyoruz',
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
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
          <img
            src="https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=1920&q=80"
            alt="Trdelnik Hazırlığı"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-custom relative z-20 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              Hakkımızda
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Çekya'dan Konya'ya uzanan bir lezzet yolculuğu
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Hikayemiz
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  Makara olarak, Çekya'nın (Çek Cumhuriyeti) sokak lezzetlerinin başında gelen 
                  Trdelnik'i Konya'ya getirme tutkusuyla yola çıktık. Trdelnik, Chimney Cake veya 
                  Prag Tatlısı olarak da bilinen bu eşsiz tatlı, 18. yüzyıldan beri Orta Avrupa'nın 
                  en sevilen geleneksel lezzetlerinden biri.
                </p>
                <p>
                  Silindir şeklindeki bu özel hamur tatlısı, özel çubuklar üzerinde açık ateşte 
                  pişirilir ve sıcakken tarçın-şeker karışımına bulanır. Dışı çıtır çıtır, içi 
                  yumuşacık olan bu muhteşem tatlıyı, çeşitli dolgular ve soslarla zenginleştirerek 
                  modern dokunuşlar katıyoruz.
                </p>
                <p>
                  10.000'den fazla mutlu müşterimize hizmet vermekten ve 15'ten fazla özel trdelnik 
                  çeşidi sunmaktan gurur duyuyoruz. Her misafirimize taze, sıcak ve özenle hazırlanmış 
                  trdelnikler sunarak unutulmaz bir lezzet deneyimi yaşatıyoruz.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80"
                  alt="Trdelnik Hazırlanıyor"
                  className="rounded-2xl shadow-xl"
                />
                <img
                  src="https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=600&q=80"
                  alt="Şef Trdelnik Yapıyor"
                  className="rounded-2xl shadow-xl mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80"
                  alt="Tatlı Sunumu"
                  className="rounded-2xl shadow-xl -mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&q=80"
                  alt="Cafe Atmosferi"
                  className="rounded-2xl shadow-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Değerlerimiz</h2>
            <p className="section-subtitle">
              Bizi biz yapan değerler
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Yolculuğumuz</h2>
            <p className="section-subtitle">
              Başlangıcımızdan bugüne
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 pb-12 border-l-4 border-primary-600 last:pb-0"
              >
                <div className="absolute -left-4 top-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <div className="bg-gray-50 rounded-xl p-6 ml-8">
                  <div className="text-3xl font-bold text-primary-600 mb-2">{item.year}</div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
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
              Bizi Ziyaret Edin
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Taze trdelniklerimizi ve sıcak atmosferimizi deneyimleyin
            </p>
            <a
              href="/iletisim"
              className="inline-block bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              Sipariş Ver
            </a>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
