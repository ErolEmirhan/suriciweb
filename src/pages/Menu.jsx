import { useState } from 'react'
import { motion } from 'framer-motion'
import { Leaf, UtensilsCrossed, IceCreamBowl, X } from 'lucide-react'
import makaraLogo from '../assets/makara.png'
import trdelnikImage from '../assets/trdelnik.png'

export default function Menu() {
  const [mainCategory, setMainCategory] = useState('tatlilar')
  const [activeCategory, setActiveCategory] = useState('trdelnik')
  const [selectedImage, setSelectedImage] = useState({ url: null, name: null })

  const mainCategories = [
    { id: 'tatlilar', name: 'Tatlılar', icon: IceCreamBowl },
    { id: 'yemekler', name: 'Yemekler', icon: UtensilsCrossed },
  ]

  const subCategories = {
    tatlilar: [
      { id: 'trdelnik', name: 'Trdelnik / Chimney' },
      { id: 'dolgular', name: 'Dolgular & Soslar' },
      { id: 'ozel', name: 'Özel Kombinasyonlar' },
      { id: 'icecek', name: 'İçecekler' },
    ],
    yemekler: []
  }

  const categoryImages = {
    trdelnik: ['1587241321921-91a834d82ffc', '1509440159596-0249088772ff', '1562376552-0d160a2f238d', '1486427944299-d1955d23e34d', '1488477181946-6428a0291777', '1497534547324-0ebb3f052e88', '1464349095431-e9a21285b5f3', '1551024506-0bccd828d307'],
    dolgular: ['1587241321921-91a834d82ffc', '1511381939415-e44015466834', '1578985545062-69928b1d9587', '1562376552-0d160a2f238d', '1551024506-0bccd828d307', '1486427944299-d1955d23e34d', '1497534547324-0ebb3f052e88'],
    ozel: ['1563805042-7684c019e1cb', '1495147466023-ac5c588e2e94', '1570197788417-0e82375c9371', '1551024506-0bccd828d307', '1486427944299-d1955d23e34d', '1464349095431-e9a21285b5f3'],
    icecek: ['1556909172-54557c7e4fb7', '1497534547324-0ebb3f052e88', '1453614512-6d9ce88648b8', '1461020133040-9e4c0a5c6c98', '1511381939415-e44015466834', '1486427944299-d1955d23e34d', '1551024506-0bccd828d307', '1578985545062-69928b1d9587'],
  }

  const menuItems = {
    trdelnik: [
      {
        name: 'Klasik Trdelnik',
        description: 'Geleneksel tarif, tarçın ve şeker kaplamalı',
        price: '₺120',
        vegetarian: true,
        image: trdelnikImage,
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
        oldPrice: '₺180',
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
      {/* Menu Section */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          {/* Main Category Tabs */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-4 mb-0"
            >
              {mainCategories.map((category) => {
                const Icon = category.icon
                const isActive = mainCategory === category.id
                const isYemekler = category.id === 'yemekler'
                
                // Yemekler için farklı renkler
                const activeClass = isYemekler 
                  ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-2xl'
                  : 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white shadow-2xl'
                
                const inactiveClass = isYemekler
                  ? 'bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg'
                  : 'bg-white text-primary-600 hover:bg-primary-50 shadow-lg'
                
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => {
                      setMainCategory(category.id)
                      if (category.id === 'tatlilar') {
                        setActiveCategory('trdelnik')
                      }
                    }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 border-2 ${
                      isActive 
                        ? `${activeClass} border-transparent` 
                        : `${inactiveClass} border-gray-200 hover:border-gray-300`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={24} />
                      <span>{category.name}</span>
                    </div>
                  </motion.button>
                )
              })}
            </motion.div>
          </div>

          {/* Menu Items */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {mainCategory === 'tatlilar' ? (
              /* Tatlılar - Sidebar + Content Layout */
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Sidebar - Sub Categories */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full lg:w-64 flex-shrink-0"
                >
                  <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 px-2">Kategoriler</h3>
                    <div className="space-y-1.5">
                      {subCategories.tatlilar.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(category.id)}
                          className={`w-full px-3 py-2 rounded-lg text-left font-medium text-sm transition-all duration-300 ${
                            activeCategory === category.id
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-gray-50 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="text-3xl font-display font-bold mb-8 text-gray-900">
                    {subCategories.tatlilar.find((cat) => cat.id === activeCategory)?.name}
                  </h2>
                  <div className="space-y-4">
                    {menuItems[activeCategory].map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="relative flex items-center gap-6 p-6 rounded-3xl bg-white border-2 border-gray-200 shadow-xl transition-all duration-500 group overflow-hidden"
                      >
                        {/* Makara Logo - Bottom Right */}
                        <img
                          src={makaraLogo}
                          alt="Makara"
                          className="absolute bottom-3 right-3 w-10 h-10 opacity-5"
                        />
                        {/* Product Image - 1x1 Square */}
                        <div 
                          className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 cursor-pointer"
                          onClick={() => setSelectedImage({
                            url: item.image || `https://images.unsplash.com/photo-${categoryImages[activeCategory][index % categoryImages[activeCategory].length]}?w=800&h=800&fit=crop&q=90`,
                            name: item.name
                          })}
                        >
                          <div className="w-full h-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                            <img
                              src={item.image || `https://images.unsplash.com/photo-${categoryImages[activeCategory][index % categoryImages[activeCategory].length]}?w=400&h=400&fit=crop&q=80`}
                              alt={item.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>

                        {/* Product Info - Name on top, Price below */}
                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 whitespace-nowrap">
                              {item.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="inline-block px-5 py-2.5 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white text-xl md:text-2xl font-bold whitespace-nowrap shadow-lg">
                              {item.price}
                            </span>
                            {item.oldPrice && (
                              <span className="text-red-500 line-through text-lg md:text-xl font-bold opacity-70">
                                {item.oldPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
            /* Yemekler - Coming Soon Message */
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl p-12 md:p-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-display font-bold mb-4 text-gray-900">
                    Yemekler
                  </h2>
                  <p className="text-2xl font-semibold text-primary-600 mb-2">
                    Çok Yakında Sizlerle
                  </p>
                  <p className="text-gray-600 text-lg">
                    Lezzet dolu yemek menümüz yakında hazır olacak
                  </p>
                </div>
              </div>
            </div>
            )}
          </motion.div>

          {/* Special Menu Note - Only show for Tatlılar */}
          {mainCategory === 'tatlilar' && (
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
          )}
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

      {/* Image Lightbox Modal */}
      {selectedImage.url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage({ url: null, name: null })}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="max-w-4xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedImage.url}
                alt="Büyük Görünüm"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              
              {/* Product Name - Top Left */}
              {selectedImage.name && (
                <div className="absolute top-4 left-4 px-6 py-3 rounded-full bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 backdrop-blur-sm bg-white/90">
                  <h3 className="text-white text-lg font-bold shadow-lg">
                    {selectedImage.name}
                  </h3>
                </div>
              )}
              
              {/* Close Button - Top Right */}
              <button
                onClick={() => setSelectedImage({ url: null, name: null })}
                className="absolute top-4 right-4 bg-white rounded-full p-3 hover:bg-gray-100 transition-colors shadow-lg"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
