import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, UtensilsCrossed, IceCreamBowl, Coffee, X, ChevronLeft, ChevronRight } from 'lucide-react'
import makaraLogo from '../assets/makara.png'
import trdelnikImage from '../assets/trdelnik.png'
import tatliImage from '../assets/tatli.png'
import yemekImage from '../assets/yemek.png'
import icecekImage from '../assets/icecek.png'
import fransizImage from '../assets/fransiz.png'
import kruvasanImage from '../assets/kruvasan.png'
import waffleImage from '../assets/waffle.png'
import kahvaltiImage from '../assets/kahvalti.png'
import sicakImage from '../assets/sicak.png'

export default function Menu() {
  const [selectedMainCategory, setSelectedMainCategory] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [selectedImage, setSelectedImage] = useState({ url: null, name: null })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [subCategoriesDrawerOpen, setSubCategoriesDrawerOpen] = useState(false)

  const mainCategories = [
    { id: 'tatlilar', name: 'TATLI', icon: IceCreamBowl },
    { id: 'yemekler', name: 'YEMEK', icon: UtensilsCrossed },
    { id: 'icecekler', name: 'İÇECEK', icon: Coffee },
  ]

  const subCategories = {
    tatlilar: [
      { id: 'trdelnik', name: 'Prag Tatlısı (Trdelnik)' },
      { id: 'fransiz', name: 'Fransız Pastaları' },
      { id: 'kruvasan', name: 'Kruvasan Çeşitleri' },
      { id: 'waffle', name: 'Waffle Çeşitleri' },
    ],
    yemekler: [
      { id: 'kahvalti', name: 'Kahvaltı' },
      { id: 'alacarte', name: 'A la Carte Yemek' },
    ],
    icecekler: [
      { id: 'sicak', name: 'Sıcak İçecekler' },
      { id: 'soguk', name: 'Soğuk İçecekler' },
    ]
  }

  const categoryImages = {
    trdelnik: ['1587241321921-91a834d82ffc', '1509440159596-0249088772ff', '1562376552-0d160a2f238d', '1486427944299-d1955d23e34d', '1488477181946-6428a0291777', '1497534547324-0ebb3f052e88', '1464349095431-e9a21285b5f3', '1551024506-0bccd828d307'],
    fransiz: ['1562376552-0d160a2f238d', '1486427944299-d1955d23e34d', '1497534547324-0ebb3f052e88', '1464349095431-e9a21285b5f3', '1511381939415-e44015466834', '1578985545062-69928b1d9587', '1587241321921-91a834d82ffc', '1551024506-0bccd828d307'],
    kruvasan: ['1509440159596-0249088772ff', '1562376552-0d160a2f238d', '1486427944299-d1955d23e34d', '1488477181946-6428a0291777', '1497534547324-0ebb3f052e88', '1464349095431-e9a21285b5f3', '1551024506-0bccd828d307', '1511381939415-e44015466834'],
    waffle: ['1497534547324-0ebb3f052e88', '1464349095431-e9a21285b5f3', '1551024506-0bccd828d307', '1486427944299-d1955d23e34d', '1562376552-0d160a2f238d', '1511381939415-e44015466834', '1578985545062-69928b1d9587', '1587241321921-91a834d82ffc'],
    kahvalti: ['1497534547324-0ebb3f052e88', '1464349095431-e9a21285b5f3', '1551024506-0bccd828d307', '1486427944299-d1955d23e34d', '1562376552-0d160a2f238d', '1511381939415-e44015466834', '1578985545062-69928b1d9587', '1587241321921-91a834d82ffc'],
    alacarte: ['1562376552-0d160a2f238d', '1486427944299-d1955d23e34d', '1497534547324-0ebb3f052e88', '1464349095431-e9a21285b5f3', '1511381939415-e44015466834', '1578985545062-69928b1d9587', '1587241321921-91a834d82ffc', '1551024506-0bccd828d307'],
    sicak: ['1556909172-54557c7e4fb7', '1497534547324-0ebb3f052e88', '1453614512-6d9ce88648b8', '1461020133040-9e4c0a5c6c98', '1511381939415-e44015466834', '1486427944299-d1955d23e34d', '1551024506-0bccd828d307', '1578985545062-69928b1d9587'],
    soguk: ['1556909172-54557c7e4fb7', '1497534547324-0ebb3f052e88', '1453614512-6d9ce88648b8', '1461020133040-9e4c0a5c6c98', '1511381939415-e44015466834', '1486427944299-d1955d23e34d', '1551024506-0bccd828d307', '1578985545062-69928b1d9587'],
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
    fransiz: [
      {
        name: 'Eclair',
        description: 'Klasik Fransız ekleri, sütlü çikolatalı glaze',
        price: '₺75',
        vegetarian: true,
      },
      {
        name: 'Macaron (6 adet)',
        description: 'Çilek, Vanilya, Limon, Çikolata, Badem, Lavanta',
        price: '₺125',
        vegetarian: true,
      },
      {
        name: 'Profiterol',
        description: 'Krema dolu profiterol, çikolata soslu',
        price: '₺85',
        vegetarian: true,
      },
      {
        name: 'Millefeuille',
        description: 'Kat kat Fransız pastası, vanilya kreması',
        price: '₺90',
        vegetarian: true,
      },
      {
        name: 'Opera Pasta',
        description: 'Kahveli kat kat pasta, bitter çikolata',
        price: '₺95',
        vegetarian: true,
      },
      {
        name: 'Tarte Tatin',
        description: 'Ters elmalı tart, vanilyalı dondurma',
        price: '₺80',
        vegetarian: true,
      },
      {
        name: 'Paris Brest',
        description: 'Halka pasta, pralin kreması',
        price: '₺85',
        vegetarian: true,
      },
      {
        name: 'Madeleine',
        description: 'Klasik Fransız madeleine (4 adet)',
        price: '₺65',
        vegetarian: true,
      },
    ],
    kruvasan: [
      {
        name: 'Klasik Kruvasan',
        description: 'Geleneksel tuzlu kruvasan, tereyağlı',
        price: '₺45',
        vegetarian: true,
      },
      {
        name: 'Bademli Kruvasan',
        description: 'Badem ezmesi dolu kruvasan',
        price: '₺65',
        vegetarian: true,
      },
      {
        name: 'Çikolatalı Kruvasan',
        description: 'Dark çikolata dolu kruvasan',
        price: '₺60',
        vegetarian: true,
      },
      {
        name: 'Fındıklı Kruvasan',
        description: 'Fındık ezmesi ve çikolata',
        price: '₺70',
        vegetarian: true,
      },
      {
        name: 'Çilekli ve Kremalı Kruvasan',
        description: 'Vanilya kreması ve taze çilek',
        price: '₺75',
        vegetarian: true,
      },
      {
        name: 'Muzlu Kruvasan',
        description: 'Muz, fıstık ezmesi ve çikolata',
        price: '₺70',
        vegetarian: true,
      },
      {
        name: 'Peynirli Kruvasan',
        description: 'Hafif tuzlu peynir ve otlar',
        price: '₺55',
        vegetarian: true,
      },
      {
        name: 'Mini Kruvasan (4 adet)',
        description: 'Karışık mini kruvasan çeşitleri',
        price: '₺95',
        vegetarian: true,
      },
    ],
    waffle: [
      {
        name: 'Klasik Waffle',
        description: 'Geleneksel waffle, maple syrup',
        price: '₺85',
        vegetarian: true,
      },
      {
        name: 'Çikolatalı Waffle',
        description: 'Nutella, bitter çikolata, çilek',
        price: '₺115',
        vegetarian: true,
      },
      {
        name: 'Krema ve Meyveli Waffle',
        description: 'Vanilya kreması, mevsim meyveleri',
        price: '₺125',
        vegetarian: true,
      },
      {
        name: 'Fındıklı Waffle',
        description: 'Fındık ezmesi, fındık parçaları, bal',
        price: '₺110',
        vegetarian: true,
      },
      {
        name: 'Antep Fıstıklı Waffle',
        description: 'Antep fıstığı, beyaz çikolata, dondurma',
        price: '₺135',
        vegetarian: true,
      },
      {
        name: 'Belçika Waffle',
        description: 'Liege waffle, pearl sugar, karamel',
        price: '₺95',
        vegetarian: true,
      },
      {
        name: 'Dondurmalı Waffle',
        description: '3 top dondurma, çikolata sosu',
        price: '₺130',
        vegetarian: true,
      },
      {
        name: 'Karışık Waffle',
        description: 'Çeşitli meyveler, kremalar, soslar',
        price: '₺145',
        vegetarian: true,
      },
    ],
    kahvalti: [
      {
        name: 'Serpme Kahvaltı (2 Kişilik)',
        description: 'Yumurta, peynir çeşitleri, zeytin, bal-tereyağı, reçeller, gözleme',
        price: '₺450',
        vegetarian: false,
      },
      {
        name: 'Köy Kahvaltısı',
        description: 'Tost, patates, domates, salatalık, mevsim yeşillikleri',
        price: '₺180',
        vegetarian: false,
      },
      {
        name: 'Omlet Çeşitleri',
        description: 'Klasik, sebzeli, karışık, mantarlı',
        price: '₺120',
        vegetarian: false,
      },
      {
        name: 'Menemen',
        description: 'Taze yumurta, domates, biber, soğan',
        price: '₺130',
        vegetarian: false,
      },
      {
        name: 'Kahvaltı Tabağı',
        description: 'Peynir, zeytin, bal, tereyağı, reçel, yumurta',
        price: '₺150',
        vegetarian: true,
      },
      {
        name: 'Kruvasan Kahvaltı',
        description: '2 kruvasan, reçel, tereyağı, yumurta, peynir',
        price: '₺165',
        vegetarian: true,
      },
    ],
    alacarte: [
      {
        name: 'Izgara Tavuk',
        description: 'Baharatlı tavuk göğsü, pirinç, mevsim salatası',
        price: '₺220',
        vegetarian: false,
      },
      {
        name: 'Tavuk Şiş',
        description: 'Marine edilmiş tavuk şiş, patates, salata',
        price: '₺200',
        vegetarian: false,
      },
      {
        name: 'Köfte Tabağı',
        description: '5 adet köfte, patates, pilav, salata',
        price: '₺190',
        vegetarian: false,
      },
      {
        name: 'Balık Tabağı',
        description: 'Levrek/Çipura, patates, salata, limon',
        price: '₺250',
        vegetarian: false,
      },
      {
        name: 'Köri Soslu Tavuk',
        description: 'Hindistan usulü köri, pirinç, naan ekmek',
        price: '₺210',
        vegetarian: false,
      },
      {
        name: 'Mantarlı Spagetti',
        description: 'Kremalı mantar sosu, parmesan',
        price: '₺170',
        vegetarian: true,
      },
      {
        name: 'Boloniz Spagetti',
        description: 'Kıymalı domates sosu, parmesan',
        price: '₺180',
        vegetarian: false,
      },
      {
        name: 'Şiş Kebap',
        description: 'Kuzu eti, domates, biber, pilav',
        price: '₺230',
        vegetarian: false,
      },
    ],
    sicak: [
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
    ],
    soguk: [
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
      {
        name: 'Ice Latte / Ice Americano',
        description: 'Buzlu kahve seçenekleri',
        price: '₺60',
        vegetarian: true,
      },
      {
        name: 'Frappé',
        description: 'Vanilyalı, çikolatalı, karamelli frappé',
        price: '₺80',
        vegetarian: true,
      },
    ],
  }

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedMainCategory(categoryId)
    setDrawerOpen(false)
    
    // Set default active subcategory
    if (categoryId === 'tatlilar') {
      setActiveCategory('trdelnik')
    } else if (categoryId === 'yemekler') {
      setActiveCategory('kahvalti')
    } else if (categoryId === 'icecekler') {
      setActiveCategory('sicak')
    }
  }

  // Get color classes for categories
  const getCategoryColors = (categoryId) => {
    const isIcecekler = categoryId === 'icecekler'
    const isYemekler = categoryId === 'yemekler'
    
    if (isIcecekler) {
      return {
        active: 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white',
        inactive: 'bg-white text-emerald-600 hover:bg-emerald-50',
        subActive: 'bg-emerald-600 text-white',
        subInactive: 'bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600',
        price: 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700'
      }
    } else if (isYemekler) {
      return {
        active: 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white',
        inactive: 'bg-white text-orange-600 hover:bg-orange-50',
        subActive: 'bg-orange-600 text-white',
        subInactive: 'bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600',
        price: 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700'
      }
    } else {
      return {
        active: 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white',
        inactive: 'bg-white text-primary-600 hover:bg-primary-50',
        subActive: 'bg-primary-600 text-white',
        subInactive: 'bg-gray-50 text-gray-700 hover:bg-primary-50 hover:text-primary-600',
        price: 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700'
      }
    }
  }

  const selectedCategory = mainCategories.find(cat => cat.id === selectedMainCategory)
  const colors = selectedMainCategory ? getCategoryColors(selectedMainCategory) : null

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden relative">
      {/* Menu Section */}
      <section className={`${!selectedMainCategory ? 'py-8 md:py-12' : 'py-24'} bg-gray-50 min-h-screen`}>
        <div className="container-custom">
          {!selectedMainCategory ? (
            /* Initial View - 3 Category Boxes */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] py-2"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 md:mb-8 text-gray-900 text-center">
                Menüyü Keşfedin
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl h-full">
                {mainCategories.map((category) => {
                  const Icon = category.icon
                  const categoryColors = getCategoryColors(category.id)
                  
                  // Her kategori için uygun görseller
                  const categoryImageMap = {
                    tatlilar: tatliImage,
                    yemekler: yemekImage,
                    icecekler: icecekImage
                  }
                  
                  // Gradient overlay renkleri
                  const gradientOverlay = category.id === 'tatlilar'
                    ? 'from-primary-600/80 via-primary-500/40 to-transparent'
                    : category.id === 'yemekler'
                    ? 'from-orange-600/80 via-orange-500/40 to-transparent'
                    : 'from-emerald-600/80 via-emerald-500/40 to-transparent'
                  
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      whileHover={{ scale: 1.05, y: -8 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-transparent transition-all duration-300 hover:shadow-3xl h-full min-h-[200px] md:min-h-[280px]"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img
                          src={categoryImageMap[category.id]}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Gradient Overlay - Left to Right */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${gradientOverlay}`} />
                      
                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-2 md:gap-4 p-4 md:p-6">
                        <Icon className="w-9 h-9 md:w-12 md:h-12 text-white drop-shadow-lg" />
                        <span className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg px-6 py-3 md:px-8 md:py-4 rounded-full bg-black/50 backdrop-blur-sm">
                          {category.name}
                        </span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            /* Category Selected View */
            <>
              {/* Main Category Button - Top Left */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setDrawerOpen(true)}
                className={`fixed top-24 left-0 z-40 flex items-center gap-2 pl-4 pr-6 py-3 rounded-r-full shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 text-white ${colors?.active || 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700'}`}
              >
                <span className="font-semibold">{selectedCategory?.name}</span>
                <ChevronRight size={20} />
              </motion.button>

              {/* Sub Categories Button - Top Right */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSubCategoriesDrawerOpen(true)}
                className={`fixed top-24 right-0 z-40 flex items-center gap-2 pl-6 pr-4 py-3 rounded-l-full shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 text-white ${colors?.active || 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700'}`}
              >
                <ChevronLeft size={20} />
                <span className="font-semibold">
                  {activeCategory && subCategories[selectedMainCategory]
                    ? subCategories[selectedMainCategory].find((cat) => cat.id === activeCategory)?.name || 'Alt Kategoriler'
                    : 'Alt Kategoriler'}
                </span>
              </motion.button>

              {/* Menu Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="pt-16 md:pt-28"
              >
                {selectedMainCategory === 'yemekler' ? (
                  /* Yemek kategorisi için "Çok yakında" mesajı */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20"
                  >
                    <div className="text-center max-w-md">
                      <h3 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
                        Çok yakında sizlerle...
                      </h3>
                      <p className="text-lg text-gray-600">
                        Yemek menümüz yakında eklenecek
                      </p>
                    </div>
                  </motion.div>
                ) : selectedMainCategory === 'tatlilar' || selectedMainCategory === 'icecekler' ? (
                  <>
                    {activeCategory && menuItems[activeCategory] && (
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
                                <span className={`inline-block px-5 py-2.5 rounded-2xl ${colors?.price} text-white text-xl md:text-2xl font-bold whitespace-nowrap shadow-lg`}>
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
                    )}
                  </>
                ) : null}
              </motion.div>

              {/* Special Menu Note - Only show for Tatlılar */}
              {selectedMainCategory === 'tatlilar' && (
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
            </>
          )}
        </div>
      </section>

      {/* Category Drawer - Modern Side Drawer (Left Side) */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-full md:w-[50%] lg:w-[40%] xl:w-[35%] bg-white shadow-2xl z-50 overflow-hidden"
              style={{ touchAction: 'none', overscrollBehavior: 'none' }}
            >
              <div className="p-8 overflow-hidden">
                {/* Drawer Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-display font-bold text-gray-900">
                    Menü Kategorileri
                  </h2>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={24} className="text-gray-600" />
                  </button>
                </div>

                {/* Category Cards */}
                <div className="space-y-4">
                  {mainCategories.map((category) => {
                    const Icon = category.icon
                    const categoryColors = getCategoryColors(category.id)
                    const isSelected = selectedMainCategory === category.id
                    
                    // Her kategori için uygun görseller
                    const categoryImageMap = {
                      tatlilar: tatliImage,
                      yemekler: yemekImage,
                      icecekler: icecekImage
                    }
                    
                    // Gradient overlay renkleri
                    const gradientOverlay = category.id === 'tatlilar'
                      ? 'from-primary-600/80 via-primary-500/40 to-transparent'
                      : category.id === 'yemekler'
                      ? 'from-orange-600/80 via-orange-500/40 to-transparent'
                      : 'from-emerald-600/80 via-emerald-500/40 to-transparent'
                    
                    return (
                      <motion.button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-transparent transition-all duration-300 h-32"
                      >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                          <img
                            src={categoryImageMap[category.id]}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Gradient Overlay - Left to Right */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${gradientOverlay}`} />
                        
                        {/* Content */}
                        <div className="relative z-10 h-full flex items-center gap-4 p-6">
                          <div className={`p-3 rounded-xl ${isSelected ? 'bg-white/20 backdrop-blur-sm' : 'bg-black/20 backdrop-blur-sm'}`}>
                            <Icon 
                              size={32} 
                              className="text-white drop-shadow-lg"
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="text-xl font-bold text-white drop-shadow-lg">
                              {category.name}
                            </h3>
                            <p className="text-sm mt-1 text-white/90 drop-shadow-md">
                              {category.id === 'tatlilar' && 'Çeşitli tatlı seçenekleri'}
                              {category.id === 'yemekler' && 'Lezzetli yemek seçenekleri'}
                              {category.id === 'icecekler' && 'Taze içecek seçenekleri'}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sub Categories Drawer - Right Side Drawer */}
      <AnimatePresence>
        {subCategoriesDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSubCategoriesDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full md:w-[50%] lg:w-[40%] xl:w-[35%] bg-white shadow-2xl z-50 overflow-hidden"
              style={{ touchAction: 'none', overscrollBehavior: 'none' }}
            >
              <div className="p-8 overflow-hidden">
                {/* Drawer Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-display font-bold text-gray-900">
                    Alt Kategoriler
                  </h2>
                  <button
                    onClick={() => setSubCategoriesDrawerOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={24} className="text-gray-600" />
                  </button>
                </div>

                {/* Sub Category Cards */}
                {selectedMainCategory && subCategories[selectedMainCategory] && (
                  <div className="space-y-3">
                    {subCategories[selectedMainCategory].map((subCategory) => {
                      const isActive = activeCategory === subCategory.id
                      
                      // Alt kategori görselleri
                      const subCategoryImageMap = {
                        trdelnik: trdelnikImage,
                        fransiz: fransizImage,
                        kruvasan: kruvasanImage,
                        waffle: waffleImage,
                        kahvalti: kahvaltiImage,
                        sicak: sicakImage,
                        // Yemek ve içecek kategorileri için ana kategori görseli kullan
                        alacarte: yemekImage,
                        soguk: icecekImage
                      }
                      
                      // Ana kategori görseli (fallback için)
                      const categoryImageMap = {
                        tatlilar: tatliImage,
                        yemekler: yemekImage,
                        icecekler: icecekImage
                      }
                      
                      // Alt kategori görseli varsa onu kullan, yoksa ana kategori görselini kullan
                      const subCategoryImage = subCategoryImageMap[subCategory.id] || categoryImageMap[selectedMainCategory]
                      
                      // Gradient overlay renkleri
                      const gradientOverlay = selectedMainCategory === 'tatlilar'
                        ? 'from-primary-600/80 via-primary-500/40 to-transparent'
                        : selectedMainCategory === 'yemekler'
                        ? 'from-orange-600/80 via-orange-500/40 to-transparent'
                        : 'from-emerald-600/80 via-emerald-500/40 to-transparent'
                      
                      return (
                        <motion.button
                          key={subCategory.id}
                          onClick={() => {
                            setActiveCategory(subCategory.id)
                            setSubCategoriesDrawerOpen(false)
                          }}
                          whileHover={{ scale: 1.02, y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative w-full rounded-xl overflow-hidden shadow-2xl border-2 border-transparent transition-all duration-300 h-24"
                        >
                          {/* Background Image */}
                          <div className="absolute inset-0">
                            <img
                              src={subCategoryImage}
                              alt={subCategory.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Gradient Overlay - Left to Right */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${gradientOverlay}`} />
                          
                          {/* Content */}
                          <div className="relative z-10 h-full flex items-center justify-between px-5">
                            <div className="flex-1 min-w-0">
                              <div className="inline-block px-4 py-2 rounded-xl bg-black/10 backdrop-blur-sm">
                                <h3 className="text-lg font-bold text-white drop-shadow-lg whitespace-nowrap overflow-hidden text-ellipsis">
                                  {subCategory.name}
                                </h3>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              {(subCategory.id === 'kahvalti' || subCategory.id === 'alacarte') && (
                                <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold shadow-lg whitespace-nowrap">
                                  Çok yakında...
                                </span>
                              )}
                              {isActive && (
                                <div className="w-2 h-2 rounded-full bg-white shadow-lg"></div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      {selectedMainCategory === 'tatlilar' && (
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
                Çekya'nın meşhur tatlısının tadını çıkarın
              </p>
            </motion.div>
          </div>
        </section>
      )}

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
