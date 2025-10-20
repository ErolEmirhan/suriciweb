import { useState } from 'react'
import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('trdelnik')

  const categories = [
    { id: 'trdelnik', name: 'Trdelnik / Chimney' },
    { id: 'dolgular', name: 'Dolgular & Soslar' },
    { id: 'ozel', name: 'Özel Kombinasyonlar' },
    { id: 'icecek', name: 'İçecekler' },
  ]

  const menuItems = {
    trdelnik: [
      {
        name: 'Klasik Trdelnik',
        description: 'Geleneksel tarif, tarçın ve şeker kaplamalı',
        price: '₺120',
        vegetarian: true,
      },
      {
        name: 'Nutella Trdelnik',
        description: 'Sıcak trdelnik içi Nutella dolgulu',
        price: '₺145',
        vegetarian: true,
      },
      {
        name: 'Beyaz Çikolatalı Trdelnik',
        description: 'Premium beyaz çikolata dolgulu',
        price: '₺145',
        vegetarian: true,
      },
      {
        name: 'Karamelli Trdelnik',
        description: 'Ev yapımı tuzlu karamel dolgulu',
        price: '₺150',
        vegetarian: true,
      },
      {
        name: 'Çilekli Trdelnik',
        description: 'Taze çilek sosu ve krema dolgulu',
        price: '₺155',
        vegetarian: true,
      },
      {
        name: 'Fıstık Ezmeli Trdelnik',
        description: 'Antep fıstığı ezmesi ve dondurmalı',
        price: '₺165',
        vegetarian: true,
      },
      {
        name: 'Lotus Trdelnik',
        description: 'Lotus bisküvi sosu dolgulu',
        price: '₺150',
        vegetarian: true,
      },
      {
        name: 'Çikolata Soslu Trdelnik',
        description: 'Bitter çikolata sosu ve badem parçaları',
        price: '₺145',
        vegetarian: true,
      },
    ],
    dolgular: [
      {
        name: 'Nutella Dolgu',
        description: 'Premium Nutella dolgulu trdelnik',
        price: '+₺25',
        vegetarian: true,
      },
      {
        name: 'Beyaz Çikolata Dolgu',
        description: 'Beyaz çikolata dolgulu',
        price: '+₺25',
        vegetarian: true,
      },
      {
        name: 'Karamel Dolgu',
        description: 'Ev yapımı tuzlu karamel',
        price: '+₺30',
        vegetarian: true,
      },
      {
        name: 'Çilek Sosu Dolgu',
        description: 'Taze çilek sosu',
        price: '+₺30',
        vegetarian: true,
      },
      {
        name: 'Fıstık Ezmesi Dolgu',
        description: 'Antep fıstığı ezmesi',
        price: '+₺45',
        vegetarian: true,
      },
      {
        name: 'Lotus Sosu',
        description: 'Lotus bisküvi sosu',
        price: '+₺30',
        vegetarian: true,
      },
      {
        name: 'Dondurma Ekstra',
        description: 'Vanilya, çikolata veya çilekli dondurma topu',
        price: '+₺20',
        vegetarian: true,
      },
      {
        name: 'Meyve Ekstra',
        description: 'Taze mevsim meyveleri',
        price: '+₺25',
        vegetarian: true,
      },
    ],
    ozel: [
      {
        name: 'Trdelnik Duo',
        description: '2 farklı dolgulu trdelnik (Nutella + Karamel)',
        price: '₺270',
        vegetarian: true,
      },
      {
        name: 'Family Box',
        description: '4 adet çeşitli dolgulu trdelnik paketi',
        price: '₺520',
        vegetarian: true,
      },
      {
        name: 'Trdelnik Sundae',
        description: 'Trdelnik + 3 top dondurma + soslar',
        price: '₺195',
        vegetarian: true,
      },
      {
        name: 'Mega Trdelnik',
        description: 'XXL boy, çifte dolgu, extra garnitürler',
        price: '₺225',
        vegetarian: true,
      },
      {
        name: 'Trdelnik Fondue',
        description: 'Trdelnik parçaları + çikolata fondü',
        price: '₺185',
        vegetarian: true,
      },
      {
        name: 'Trdelnik Plate',
        description: 'Mini trdelnikler + meyveler + soslar (2 kişilik)',
        price: '₺295',
        vegetarian: true,
      },
    ],
    icecek: [
      {
        name: 'Türk Kahvesi',
        description: 'Geleneksel Türk kahvesi',
        price: '₺45',
        vegetarian: true,
      },
      {
        name: 'Espresso / Cappuccino',
        description: 'İtalyan kahve',
        price: '₺55',
        vegetarian: true,
      },
      {
        name: 'Latte / Mocha',
        description: 'Özel kahve',
        price: '₺65',
        vegetarian: true,
      },
      {
        name: 'Filtre Kahve',
        description: 'Özel çekirdek filtre kahve',
        price: '₺50',
        vegetarian: true,
      },
      {
        name: 'Çay Çeşitleri',
        description: 'Türk çayı, yeşil çay, bitki çayları',
        price: '₺35',
        vegetarian: true,
      },
      {
        name: 'Milkshake',
        description: 'Çikolata, Vanilya, Çilek, Karamel',
        price: '₺85',
        vegetarian: true,
      },
      {
        name: 'Smoothie',
        description: 'Mevsim meyvelerinden smoothie',
        price: '₺75',
        vegetarian: true,
      },
      {
        name: 'Taze Sıkılmış Meyve Suyu',
        description: 'Portakal, Nar, Havuç, Karışık',
        price: '₺65',
        vegetarian: true,
      },
    ],
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
          <img
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80"
            alt="Trdelnik Menü"
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
              Menümüz
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Trdelnik çeşitlerimizi ve özel kombinasyonlarımızı keşfedin
            </p>
          </motion.div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* Menu Items */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <h2 className="text-4xl font-display font-bold text-center mb-12 text-gray-900">
                {categories.find((cat) => cat.id === activeCategory)?.name}
              </h2>
              <div className="space-y-8">
                {menuItems[activeCategory].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {item.name}
                        </h3>
                        {item.vegetarian && (
                          <span className="inline-flex items-center text-green-600">
                            <Leaf className="w-5 h-5" />
                          </span>
                        )}
                      </div>
                      <span className="text-2xl font-bold text-primary-600 ml-4">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Special Menu Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-primary-900 mb-4">
                Trdelnik Deneme Menüsü
              </h3>
              <p className="text-gray-700 mb-4">
                Farklı dolgularla hazırlanan özel trdelnik menümüzü deneyimleyin. 
                4 adet mini trdelnik, 2 top dondurma ve çeşitli soslar.
              </p>
              <p className="text-3xl font-bold text-primary-600">₺295 / Kişi</p>
              <p className="text-sm text-gray-600 mt-2">
                * En az 2 kişilik sipariş
              </p>
            </div>
          </motion.div>
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
              Trdelnik Deneyimi Yaşamaya Hazır mısınız?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Sipariş verin ve Çekya'nın meşhur tatlısının tadını çıkarın
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
