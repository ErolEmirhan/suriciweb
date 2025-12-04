import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, UtensilsCrossed, IceCreamBowl, Coffee, X, ChevronLeft, ChevronRight, ChevronDown, Sparkles } from 'lucide-react'
import makaraLogo from '../assets/makara.png'
import makaraImage from '../assets/makara.png'
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
  const [showMenuSplash, setShowMenuSplash] = useState(true)
  const [selectedMainCategory, setSelectedMainCategory] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [selectedImage, setSelectedImage] = useState({ url: null, name: null })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [subCategoriesDrawerOpen, setSubCategoriesDrawerOpen] = useState(false)
  const [yemekModalOpen, setYemekModalOpen] = useState(false)
  const [milkshakeVarietiesOpen, setMilkshakeVarietiesOpen] = useState(false)
  const [frozenVarietiesOpen, setFrozenVarietiesOpen] = useState(false)
  const milkshakeDropdownRef = useRef(null)
  const frozenDropdownRef = useRef(null)

  // Menu splash screen - 2 saniye
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMenuSplash(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Close milkshake dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (milkshakeDropdownRef.current && !milkshakeDropdownRef.current.contains(event.target)) {
        setMilkshakeVarietiesOpen(false)
      }
      if (frozenDropdownRef.current && !frozenDropdownRef.current.contains(event.target)) {
        setFrozenVarietiesOpen(false)
      }
    }

    if (milkshakeVarietiesOpen || frozenVarietiesOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [milkshakeVarietiesOpen, frozenVarietiesOpen])

  // Browser geri butonu kontrolü
  useEffect(() => {
    const handlePopState = (event) => {
      if (activeCategory) {
        // Alt kategorideyse, sadece alt kategoriyi temizle
        setActiveCategory(null)
      } else if (selectedMainCategory) {
        // Ana kategorideyse, kategori seçimini temizle
        setSelectedMainCategory(null)
      }
      // Eğer hiçbiri yoksa, normal şekilde geri git (ana sayfaya)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [activeCategory, selectedMainCategory])

  // State değişikliklerinde history'ye ekle
  useEffect(() => {
    if (activeCategory || selectedMainCategory) {
      window.history.pushState({ menuState: true }, '', window.location.pathname)
    }
  }, [activeCategory, selectedMainCategory])

  const mainCategories = [
    { id: 'tatlilar', name: 'TATLI', icon: IceCreamBowl },
    { id: 'yemekler', name: 'YEMEK', icon: UtensilsCrossed },
    { id: 'icecekler', name: 'İÇECEK', icon: Coffee },
  ]

  const subCategories = {
    tatlilar: [
      { id: 'kruvasanlar', name: 'Kruvasanlar' },
      { id: 'fransiz', name: 'Fransız Pastalar' },
      { id: 'sutlu', name: 'Sütlü Tatlılar ve Pastalar' },
      { id: 'makara', name: 'Makaralar' },
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
    kruvasanlar: ['1509440159596-0249088772ff', '1562376552-0d160a2f238d', '1486427944299-d1955d23e34d', '1488477181946-6428a0291777', '1497534547324-0ebb3f052e88', '1464349095431-e9a21285b5f3', '1551024506-0bccd828d307', '1511381939415-e44015466834'],
    fransiz: ['1562376552-0d160a2f238d', '1486427944299-d1955d23e34d', '1497534547324-0ebb3f052e88', '1464349095431-e9a21285b5f3', '1511381939415-e44015466834', '1578985545062-69928b1d9587', '1587241321921-91a834d82ffc', '1551024506-0bccd828d307'],
    sutlu: ['1497534547324-0ebb3f052e88', '1464349095431-e9a21285b5f3', '1551024506-0bccd828d307', '1486427944299-d1955d23e34d', '1562376552-0d160a2f238d', '1511381939415-e44015466834', '1578985545062-69928b1d9587', '1587241321921-91a834d82ffc'],
    makara: ['1497534547324-0ebb3f052e88', '1464349095431-e9a21285b5f3', '1551024506-0bccd828d307', '1486427944299-d1955d23e34d', '1562376552-0d160a2f238d', '1511381939415-e44015466834', '1578985545062-69928b1d9587', '1587241321921-91a834d82ffc'],
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
        name: 'Limon',
        price: '₺250',
        vegetarian: true,
      },
      {
        name: 'Badem',
        price: '₺280',
        vegetarian: true,
      },
      {
        name: 'Mango',
        price: '₺250',
        vegetarian: true,
      },
      {
        name: 'Portakal',
        price: '₺250',
        vegetarian: true,
      },
      {
        name: 'Çilek',
        price: '₺270',
        vegetarian: true,
      },
      {
        name: 'Yaban mersini',
        price: '₺270',
        vegetarian: true,
      },
      {
        name: 'Antep fıstığı',
        price: '₺290',
        vegetarian: true,
      },
    ],
    kruvasanlar: [
      {
        name: 'Sade Kuruvasan',
        price: '₺150',
        vegetarian: true,
      },
      {
        name: 'Antep Fıstıklı',
        price: '₺280',
        vegetarian: true,
      },
      {
        name: 'Framboğazlı',
        price: '₺250',
        vegetarian: true,
      },
      {
        name: 'Belçika Çikolatalı',
        price: '₺250',
        vegetarian: true,
      },
      {
        name: 'Sütlü kahveli',
        price: '₺250',
        vegetarian: true,
      },
      {
        name: 'Lotuslu',
        price: '₺250',
        vegetarian: true,
      },
      {
        name: 'Muzlu çilekli',
        price: '₺250',
        vegetarian: true,
      },
    ],
    sutlu: [
      {
        name: 'Çilekli Magnolya',
        price: '₺220',
        vegetarian: true,
      },
      {
        name: 'Dev profiterol',
        price: '₺280',
        vegetarian: true,
      },
      {
        name: 'Tiramisu',
        price: '₺280',
        vegetarian: true,
      },
      {
        name: 'Limonlu Chesecake',
        price: '₺250',
        vegetarian: true,
      },
      {
        name: 'San sebastian',
        price: '₺280',
        vegetarian: true,
      },
      {
        name: 'Antep Fıstıklı keşkül',
        price: '₺280',
        vegetarian: true,
      },
      {
        name: 'İncirli muhallebi',
        price: '₺280',
        vegetarian: true,
      },
      {
        name: 'Red velvet',
        price: '₺240',
        vegetarian: true,
      },
      {
        name: 'Lotuslu Paris Brest',
        price: '₺250',
        vegetarian: true,
      },
      {
        name: 'Antep fıstıklı Çıtırtı',
        price: '₺290',
        vegetarian: true,
      },
    ],
    makara: [
      {
        name: 'Antep Fıstıklı',
        price: '₺290',
        vegetarian: true,
      },
      {
        name: 'Lotuslu',
        price: '₺280',
        vegetarian: true,
      },
      {
        name: 'Oreolu',
        price: '₺280',
        vegetarian: true,
      },
      {
        name: 'Çilekli',
        price: '₺280',
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
        name: 'ESPRESSO',
        price: '₺80',
        vegetarian: true,
      },
      {
        name: 'DOUBLE ESPRESSO',
        price: '₺120',
        vegetarian: true,
      },
      {
        name: 'AMERİCANO',
        price: '₺125',
        vegetarian: true,
      },
      {
        name: 'TÜRK KAHVESİ',
        price: '₺125',
        vegetarian: true,
      },
      {
        name: 'DOUBLE TURK KAHVESİ',
        price: '₺160',
        vegetarian: true,
      },
      {
        name: 'MENENGİÇ KAHVESİ',
        price: '₺125',
        vegetarian: true,
      },
      {
        name: 'DOUBLE MENENGİÇ KAHVESİ',
        price: '₺160',
        vegetarian: true,
      },
      {
        name: 'FİLTRE KAHVE',
        price: '₺125',
        vegetarian: true,
      },
      {
        name: 'LATTE',
        price: '₺150',
        vegetarian: true,
      },
      {
        name: 'CAPPUCİNO',
        price: '₺150',
        vegetarian: true,
      },
      {
        name: 'FLAT WHİTE',
        price: '₺150',
        vegetarian: true,
      },
      {
        name: 'CORTADO',
        price: '₺150',
        vegetarian: true,
      },
      {
        name: 'MOCHA',
        price: '₺170',
        vegetarian: true,
      },
      {
        name: 'WHİTE MOCHA',
        price: '₺170',
        vegetarian: true,
      },
      {
        name: 'CARAMEL MOCHA',
        price: '₺170',
        vegetarian: true,
      },
      {
        name: 'AROMALI LATTELER',
        description: 'Karamel, Fındık, Hindistan Cevizi, Badem, Vanilya, Bal Kabağı, Pikan Cevizi, Toffenut, Cookie',
        price: '₺170',
        vegetarian: true,
      },
      {
        name: 'SALEP',
        price: '₺160',
        vegetarian: true,
      },
      {
        name: 'CHAİ TEA LATTE',
        price: '₺170',
        vegetarian: true,
      },
      {
        name: 'SICAK ÇİKOLATA (CALLEBAUT)',
        price: '₺190',
        vegetarian: true,
      },
      {
        name: 'BİTKİ ÇAYLARI',
        description: 'Papatya, Melisa, Nane Limon, Adaçayı, Kış Çayı, Yeşil Çay, Ihlamur',
        price: '₺180',
        vegetarian: true,
      },
    ],
    soguk: [
      {
        name: 'MİLKSHAKE',
        price: '₺160',
        vegetarian: true,
      },
      {
        name: 'SMOOTHİE',
        price: '₺180',
        vegetarian: true,
      },
      {
        name: 'FROZEN',
        price: '₺160',
        vegetarian: true,
      },
      {
        name: 'FRAPPE',
        price: '₺180',
        vegetarian: true,
      },
      {
        name: 'EV YAPIMI LİMONATA',
        price: '₺150',
        vegetarian: true,
      },
      {
        name: 'ÇİLEKLİ LİMONATA',
        price: '₺170',
        vegetarian: true,
      },
      {
        name: '3. NESİL KAHVELER',
        description: 'Syphon, Chemex, V60, Cold Brew',
        price: '₺250',
        vegetarian: true,
      },
      {
        name: 'COOL LİME',
        price: '₺170',
        vegetarian: true,
      },
      {
        name: 'BERRY HİBİSCUS',
        price: '₺170',
        vegetarian: true,
      },
    ],
  }

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setDrawerOpen(false)
    
    // Tüm kategoriler için ana kategoriyi seç
    setSelectedMainCategory(categoryId)
    
    // Yemek kategorisi için modal aç
    if (categoryId === 'yemekler') {
      setYemekModalOpen(true)
    }
  }

  // Handle içecek subcategory selection
  const handleIcecekSubCategorySelect = (subCategoryId) => {
    setActiveCategory(subCategoryId)
  }

  // Handle tatlı subcategory selection
  const handleTatliSubCategorySelect = (subCategoryId) => {
    setActiveCategory(subCategoryId)
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
    <>
      {/* Menu Splash Screen */}
      <AnimatePresence>
        {showMenuSplash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[200] bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 flex items-center justify-center overflow-hidden"
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/10"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    width: Math.random() * 100 + 50,
                    height: Math.random() * 100 + 50,
                  }}
                  animate={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center">
              {/* Sparkle Icons */}
              <div className="absolute -top-20 -left-20">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-16 h-16 text-white/30" />
                </motion.div>
              </div>
              <div className="absolute -top-20 -right-20">
                <motion.div
                  animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-16 h-16 text-white/30" />
                </motion.div>
              </div>
              <div className="absolute -bottom-20 -left-20">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Sparkles className="w-16 h-16 text-white/30" />
                </motion.div>
              </div>
              <div className="absolute -bottom-20 -right-20">
                <motion.div
                  animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Sparkles className="w-16 h-16 text-white/30" />
                </motion.div>
              </div>

              {/* Main Text */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-8"
              >
                <h1 className="text-7xl md:text-9xl font-display font-bold text-white mb-4 drop-shadow-2xl">
                  Menü
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              >
                <p className="text-3xl md:text-5xl font-semibold text-white/90 drop-shadow-lg tracking-wide">
                  Afiyet Olsun
                </p>
              </motion.div>

              {/* Decorative Line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '200px' }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mx-auto mt-8 h-1 bg-white/50 rounded-full"
              />

              {/* Floating Particles */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/40 rounded-full"
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0,
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 100}%`,
                    y: `${50 + (Math.random() - 0.5) * 100}%`,
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    delay: Math.random() * 1,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: showMenuSplash ? 0 : 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden relative">
       {/* Menu Section */}
       <section className={`${!selectedMainCategory ? '' : 'py-24'} bg-gray-50 min-h-screen`}>
         <div className="container-custom">
           {!selectedMainCategory ? (
             /* Initial View - 3 Category Boxes - Hero Section */
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-col items-center justify-start min-h-screen h-screen py-2 pt-16 md:pt-24"
             >
               <h2 className="text-lg md:text-xl font-display font-bold mb-4 md:mb-6 text-gray-900 text-center">
                 Menüyü Keşfedin
               </h2>
               <div className="flex flex-col gap-3 md:gap-4 w-full max-w-2xl flex-1">
                 {mainCategories.map((category, index) => {
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
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-transparent transition-all duration-300 hover:shadow-2xl h-[180px] md:h-[220px] w-full cursor-pointer"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0 pointer-events-none">
                        <img
                          src={categoryImageMap[category.id]}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Gradient Overlay - Left to Right */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${gradientOverlay} pointer-events-none`} />
                      
                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-3 md:gap-4 px-6 md:px-8 pointer-events-none">
                        <div className="p-3 md:p-3.5 rounded-xl bg-white/20 backdrop-blur-sm">
                          <Icon className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold text-white drop-shadow-lg text-center px-4 py-2 md:px-6 md:py-3 rounded-xl bg-black/50 backdrop-blur-sm">
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
              {/* Main Category Button - Top Left - Sadece activeCategory varken göster */}
              {activeCategory && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => {
                    // Alt kategoriden geri dön
                    setActiveCategory(null)
                  }}
                  className={`fixed top-24 left-0 z-40 flex items-center gap-2 pl-4 pr-6 py-3 rounded-r-full shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 text-white ${colors?.active || 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700'}`}
                >
                  <ChevronLeft size={20} />
                  <span className="font-semibold">
                    {selectedMainCategory === 'tatlilar' && activeCategory
                      ? subCategories.tatlilar.find((cat) => cat.id === activeCategory)?.name || selectedCategory?.name
                      : selectedMainCategory === 'icecekler' && activeCategory
                      ? subCategories.icecekler.find((cat) => cat.id === activeCategory)?.name || selectedCategory?.name
                      : selectedCategory?.name || 'YEMEK'}
                  </span>
                </motion.button>
              )}


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
                    {!activeCategory ? (
                      /* Alt Kategori Seçim Ekranı */
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-start min-h-[70vh] py-2"
                      >
                        <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-gray-900 text-center">
                          {selectedMainCategory === 'tatlilar' ? 'Tatlı Seçenekleri' : 'İçecek Seçenekleri'}
                        </h2>
                        <p className="text-base md:text-lg text-gray-600 mb-8 text-center">Lütfen bir kategori seçin</p>

                        {/* Alt Kategoriler Grid */}
                        <div className={`grid ${selectedMainCategory === 'tatlilar' ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'} gap-4 w-full max-w-4xl`}>
                          {subCategories[selectedMainCategory].map((subCategory, index) => {
                            const subCategoryImageMap = {
                              kruvasanlar: kruvasanImage,
                              fransiz: fransizImage,
                              sutlu: tatliImage,
                              makara: makaraImage,
                              sicak: sicakImage,
                              soguk: icecekImage,
                            }
                            
                            const image = subCategoryImageMap[subCategory.id] || (selectedMainCategory === 'tatlilar' ? tatliImage : icecekImage)
                            const gradientOverlay = selectedMainCategory === 'tatlilar'
                              ? 'from-primary-600/80 via-primary-500/60 to-primary-400/40'
                              : 'from-emerald-600/80 via-emerald-500/60 to-emerald-400/40'
                            
                            return (
                              <motion.button
                                key={subCategory.id}
                                onClick={() => {
                                  if (selectedMainCategory === 'tatlilar') {
                                    handleTatliSubCategorySelect(subCategory.id)
                                  } else {
                                    handleIcecekSubCategorySelect(subCategory.id)
                                  }
                                }}
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200 hover:border-primary-400 transition-all duration-300 group h-40 md:h-48 cursor-pointer"
                              >
                                {/* Background Image */}
                                <div className="absolute inset-0 pointer-events-none">
                                  <img
                                    src={image}
                                    alt={subCategory.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                                
                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${gradientOverlay} group-hover:from-primary-600/90 group-hover:via-primary-500/70 group-hover:to-primary-400/50 transition-all duration-300 pointer-events-none`} />
                                
                                {/* Content */}
                                <div className="relative z-10 h-full flex items-center justify-center p-4 pointer-events-none">
                                  <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg text-center leading-tight">
                                    {subCategory.name}
                                  </h3>
                                </div>
                                
                                {/* Hover Effect Border */}
                                <div className="absolute inset-0 rounded-2xl border-4 border-white/0 group-hover:border-white/30 transition-all duration-300 pointer-events-none" />
                              </motion.button>
                            )
                          })}
                        </div>
                      </motion.div>
                    ) : activeCategory && menuItems[activeCategory] && (
                      <div className="space-y-4 overflow-visible">
                        {menuItems[activeCategory].map((item, index) => (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="relative flex items-center gap-6 p-6 rounded-3xl bg-white border-2 border-gray-200 shadow-xl transition-all duration-500 group overflow-visible"
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
                              onClick={() => {
                                const imageArray = categoryImages[activeCategory] || []
                                const imageId = imageArray[index % imageArray.length] || '1556909172-54557c7e4fb7'
                                setSelectedImage({
                                  url: item.image || `https://images.unsplash.com/photo-${imageId}?w=800&h=800&fit=crop&q=90`,
                                  name: item.name
                                })
                              }}
                            >
                              <div className="w-full h-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                {(() => {
                                  const imageArray = categoryImages[activeCategory] || []
                                  const imageId = imageArray[index % imageArray.length] || '1556909172-54557c7e4fb7'
                                  return (
                                    <img
                                      src={item.image || `https://images.unsplash.com/photo-${imageId}?w=400&h=400&fit=crop&q=80`}
                                      alt={item.name}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                  )
                                })()}
                              </div>
                            </div>

                            {/* Milkshake Çeşitler Butonu - Sağ Üst */}
                            {item.name === 'MİLKSHAKE' && activeCategory === 'soguk' && (
                              <div className="absolute top-4 right-4 z-10" ref={milkshakeDropdownRef}>
                                <motion.button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setMilkshakeVarietiesOpen(!milkshakeVarietiesOpen)
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs md:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                  <span>Çeşitler</span>
                                  <motion.div
                                    animate={{ rotate: milkshakeVarietiesOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <ChevronDown size={14} />
                                  </motion.div>
                                </motion.button>
                                
                                {/* Çeşitler Dropdown */}
                                <AnimatePresence>
                                  {milkshakeVarietiesOpen && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute top-full right-0 mt-2 min-w-fit w-auto bg-white rounded-xl shadow-2xl border-2 border-emerald-200 overflow-hidden z-[100] whitespace-nowrap"
                                      style={{ position: 'absolute' }}
                                    >
                                      {['Çilek', 'Muz', 'Çikolata', 'Karamel', 'Vanilya', 'Oreo'].map((variety, idx) => (
                                        <motion.div
                                          key={variety}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: idx * 0.03 }}
                                          whileHover={{ backgroundColor: '#ecfdf5' }}
                                          className="px-4 py-3 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                                        >
                                          <span className="text-sm font-medium text-gray-800">{variety}</span>
                                        </motion.div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}

                            {/* Frozen Çeşitler Butonu - Sağ Üst */}
                            {item.name === 'FROZEN' && activeCategory === 'soguk' && (
                              <div className="absolute top-4 right-4 z-10" ref={frozenDropdownRef}>
                                <motion.button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setFrozenVarietiesOpen(!frozenVarietiesOpen)
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs md:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                  <span>Çeşitler</span>
                                  <motion.div
                                    animate={{ rotate: frozenVarietiesOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <ChevronDown size={14} />
                                  </motion.div>
                                </motion.button>
                                
                                {/* Çeşitler Dropdown */}
                                <AnimatePresence>
                                  {frozenVarietiesOpen && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute top-full right-0 mt-2 min-w-fit w-auto bg-white rounded-xl shadow-2xl border-2 border-emerald-200 overflow-hidden z-[100] whitespace-nowrap"
                                      style={{ position: 'absolute' }}
                                    >
                                      {['Orman meyveli', 'Böğürtlen', 'Karadut', 'Frambuaz', 'Çilek', 'Mango', 'Ananas', 'Şeftali'].map((variety, idx) => (
                                        <motion.div
                                          key={variety}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: idx * 0.03 }}
                                          whileHover={{ backgroundColor: '#ecfdf5' }}
                                          className="px-4 py-3 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                                        >
                                          <span className="text-sm font-medium text-gray-800">{variety}</span>
                                        </motion.div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}

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
                        className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-transparent transition-all duration-300 h-32 cursor-pointer"
                      >
                        {/* Background Image */}
                        <div className="absolute inset-0 pointer-events-none">
                          <img
                            src={categoryImageMap[category.id]}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Gradient Overlay - Left to Right */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${gradientOverlay} pointer-events-none`} />
                        
                        {/* Content */}
                        <div className="relative z-10 h-full flex items-center gap-4 p-6 pointer-events-none">
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
                        kruvasanlar: kruvasanImage,
                        fransiz: fransizImage,
                        sutlu: tatliImage,
                        makara: makaraImage,
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
                          className="relative w-full rounded-xl overflow-hidden shadow-2xl border-2 border-transparent transition-all duration-300 h-24 cursor-pointer"
                        >
                          {/* Background Image */}
                          <div className="absolute inset-0 pointer-events-none">
                            <img
                              src={subCategoryImage}
                              alt={subCategory.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Gradient Overlay - Left to Right */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${gradientOverlay} pointer-events-none`} />
                          
                          {/* Content */}
                          <div className="relative z-10 h-full flex items-center justify-between px-5 pointer-events-none">
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

      {/* Yemek Modal - Çok Yakında */}
      <AnimatePresence>
        {yemekModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setYemekModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4"
              onClick={() => setYemekModalOpen(false)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-8 md:p-12 max-w-2xl w-full"
              >
                {/* Content */}
                <div className="text-center">
                  <div className="mb-6">
                    <UtensilsCrossed className="w-20 h-20 mx-auto text-orange-500 mb-4" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                    Çok yakında sizlerle...
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Yemek menümüz yakında eklenecek
                  </p>
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setYemekModalOpen(false)}
                    className="px-6 py-3 rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Tamam
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


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
    </>
  )
}
