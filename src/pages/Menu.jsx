import { useState } from 'react'
import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('waffle')

  const categories = [
    { id: 'waffle', name: 'Waffle & Pancake' },
    { id: 'cikolata', name: 'Çikolata' },
    { id: 'pasta', name: 'Pasta & Kek' },
    { id: 'dondurma', name: 'Dondurma' },
    { id: 'ozel', name: 'Özel Tatlılar' },
    { id: 'icecek', name: 'İçecekler' },
  ]

  const menuItems = {
    waffle: [
      {
        name: 'Belçika Waffle',
        description: 'Orijinal Belçika tarifi, taze meyveler ve akçaağaç şurubu',
        price: '₺185',
        vegetarian: true,
      },
      {
        name: 'Çikolatalı Waffle',
        description: 'Belçika çikolatası, çikolata sosu ve fındık',
        price: '₺195',
        vegetarian: true,
      },
      {
        name: 'Frambuazlı Waffle',
        description: 'Taze frambuaz, krema şanti ve pudra şekeri',
        price: '₺205',
        vegetarian: true,
      },
      {
        name: 'Karamelli Waffle',
        description: 'Ev yapımı karamel sos, badem ve vanilyalı dondurma',
        price: '₺215',
        vegetarian: true,
      },
      {
        name: 'Nutella Pancake',
        description: 'Yumuşacık pancake, Nutella ve muz dilimleri',
        price: '₺175',
        vegetarian: true,
      },
      {
        name: 'Çilekli Pancake',
        description: 'Taze çilek, krema şanti ve çikolata parçaları',
        price: '₺185',
        vegetarian: true,
      },
    ],
    cikolata: [
      {
        name: 'Belçika Çikolata Kutusu',
        description: 'El yapımı premium Belçika çikolataları (12 adet)',
        price: '₺295',
        vegetarian: true,
      },
      {
        name: 'Trüf Çikolata',
        description: 'Özel trüf çikolatalar (6 adet)',
        price: '₺165',
        vegetarian: true,
      },
      {
        name: 'Çikolata Fondü',
        description: 'Eritilmiş Belçika çikolatası, meyveler ve marshmallow',
        price: '₺225',
        vegetarian: true,
      },
      {
        name: 'Hot Chocolate Deluxe',
        description: 'Premium sıcak çikolata, krema şanti ve marshmallow',
        price: '₺95',
        vegetarian: true,
      },
      {
        name: 'Brownie Supreme',
        description: 'Sıcak brownie, vanilyalı dondurma ve çikolata sosu',
        price: '₺145',
        vegetarian: true,
      },
    ],
    pasta: [
      {
        name: 'Prag Tatlısı',
        description: 'Çekoslovakya\'nın meşhur çikolatalı pastası',
        price: '₺165',
        vegetarian: true,
      },
      {
        name: 'Tiramisu',
        description: 'İtalyan klasiği, mascarpone peyniri ve espresso',
        price: '₺155',
        vegetarian: true,
      },
      {
        name: 'Cheesecake',
        description: 'New York usulü cheesecake, meyveli sos',
        price: '₺145',
        vegetarian: true,
      },
      {
        name: 'Red Velvet',
        description: 'Kırmızı kadife pasta, kremalı peynir frosting',
        price: '₺135',
        vegetarian: true,
      },
      {
        name: 'Opera Pastası',
        description: 'Fransız klasiği, kahve ve çikolata katmanları',
        price: '₺175',
        vegetarian: true,
      },
      {
        name: 'Frambuazlı Tart',
        description: 'Taze frambuaz, krema patisserie ve badem',
        price: '₺155',
        vegetarian: true,
      },
      {
        name: 'Çikolatalı Sufle',
        description: 'Sıcak çikolata sufle, vanilyalı dondurma',
        price: '₺165',
        vegetarian: true,
      },
    ],
    dondurma: [
      {
        name: 'Gelato Italiano',
        description: 'İtalyan dondurması (3 top) - Vanilya, Çikolata, Çilek',
        price: '₺125',
        vegetarian: true,
      },
      {
        name: 'Affogato',
        description: 'Vanilyalı gelato üzerine sıcak espresso',
        price: '₺95',
        vegetarian: true,
      },
      {
        name: 'Banana Split',
        description: 'Muz, 3 top dondurma, çikolata sosu ve fıstık',
        price: '₺145',
        vegetarian: true,
      },
      {
        name: 'Dondurmalı Waffle',
        description: 'Waffle, 2 top dondurma, meyveler ve sos',
        price: '₺175',
        vegetarian: true,
      },
      {
        name: 'Sorbet',
        description: 'Mevsim meyvelerinden sorbet (3 top)',
        price: '₺115',
        vegetarian: true,
      },
    ],
    ozel: [
      {
        name: 'Crème Brûlée',
        description: 'Fransız klasiği, karamelize şeker kabuğu',
        price: '₺135',
        vegetarian: true,
      },
      {
        name: 'Profiterol',
        description: 'Çikolata soslu profiterol, vanilyalı krema',
        price: '₺145',
        vegetarian: true,
      },
      {
        name: 'Künefe',
        description: 'Özel peynirli künefe, antep fıstığı',
        price: '₺155',
        vegetarian: true,
      },
      {
        name: 'Baklava',
        description: 'Antep fıstıklı özel baklava',
        price: '₺125',
        vegetarian: true,
      },
      {
        name: 'Sütlaç',
        description: 'Fırın sütlaç, tarçın',
        price: '₺85',
        vegetarian: true,
      },
      {
        name: 'Magnolia',
        description: 'Muzlu magnolia, beyaz çikolata',
        price: '₺135',
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
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
          <img
            src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1920&q=80"
            alt="Desserts Menu"
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
              Tatlılarımız
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Dünyanın en lezzetli tatlılarını keşfedin
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
                Tatlı Şöleni Menüsü
              </h3>
              <p className="text-gray-700 mb-4">
                En popüler tatlılarımızdan oluşan özel menümüzü deneyimleyin. 
                Waffle, çikolata, pasta ve dondurma çeşitlerinden seçkin lezzetler.
              </p>
              <p className="text-3xl font-bold text-primary-600">₺395 / Kişi</p>
              <p className="text-sm text-gray-600 mt-2">
                * Minimum 2 kişilik sipariş
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
              Tatlı Bir Deneyim Yaşamaya Hazır mısınız?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Sipariş verin ve lezzetli tatlılarımızın tadını çıkarın
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
    </div>
  )
}
