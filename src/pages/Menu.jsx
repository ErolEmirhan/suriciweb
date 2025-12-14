import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, UtensilsCrossed, IceCreamBowl, Coffee, X, ChevronLeft, ChevronRight, ChevronDown, Sparkles } from 'lucide-react'
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore'
import { ref, listAll, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../config/firebase'
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
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [selectedImage, setSelectedImage] = useState({ url: null, name: null })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [yemekModalOpen, setYemekModalOpen] = useState(false)
  const [milkshakeVarietiesOpen, setMilkshakeVarietiesOpen] = useState(false)
  const [frozenVarietiesOpen, setFrozenVarietiesOpen] = useState(false)
  const milkshakeDropdownRef = useRef(null)
  const frozenDropdownRef = useRef(null)

  // Icon mapping for categories
  const iconMap = {
    tatlilar: IceCreamBowl,
    yemekler: UtensilsCrossed,
    icecekler: Coffee,
  }

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = collection(db, 'categories')
        const categoriesSnapshot = await getDocs(categoriesRef)
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Sort by order if exists, otherwise by name
        categoriesData.sort((a, b) => (a.order || 0) - (b.order || 0))
        setCategories(categoriesData)
        setLoading(false)
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error)
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Fetch products when category is selected
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) {
        setProducts([])
        return
      }

      try {
        setLoadingProducts(true)
        const productsRef = collection(db, 'products')
        // Kategori ID'sini al - doküman ID'si sayısal string olabilir
        const categoryId = selectedCategory.id || selectedCategory
        console.log('Kategori ID:', categoryId, 'Type:', typeof categoryId)
        console.log('Seçili kategori:', selectedCategory)
        
        // category_id ile sorgula (Firebase'deki alan adı)
        // ID'yi string'e çevir çünkü Firebase'de sayısal olabilir
        const categoryIdStr = String(categoryId)
        const categoryIdNum = Number(categoryId)
        
        console.log('Aranan category_id değerleri:', categoryIdStr, 'veya', categoryIdNum)
        
        // Önce category_id ile sorgula (string olarak)
        let q = query(productsRef, where('category_id', '==', categoryIdStr))
        let productsSnapshot = await getDocs(q)
        
        // Eğer bulunamazsa sayısal olarak dene
        if (productsSnapshot.empty && !isNaN(categoryIdNum)) {
          console.log('String ile bulunamadı, sayısal olarak deneniyor...')
          q = query(productsRef, where('category_id', '==', categoryIdNum))
          productsSnapshot = await getDocs(q)
        }
        
        // Hala bulunamazsa tüm ürünleri çek ve filtrele
        if (productsSnapshot.empty) {
          console.log('category_id ile ürün bulunamadı, tüm ürünler çekiliyor ve filtreleniyor...')
          productsSnapshot = await getDocs(productsRef)
        }
        
        const productsData = productsSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(product => {
            // category_id ile eşleşenleri filtrele (hem string hem sayısal kontrol)
            const productCategoryId = product.category_id || product.categoryId || product.category || ''
            
            // Hem string hem sayısal karşılaştırma yap
            const productCategoryIdStr = String(productCategoryId)
            const productCategoryIdNum = Number(productCategoryId)
            const categoryIdNum = Number(categoryIdStr)
            
            // String veya sayısal olarak eşleşiyorsa true döndür
            const stringMatch = productCategoryIdStr === categoryIdStr
            const numberMatch = !isNaN(productCategoryIdNum) && !isNaN(categoryIdNum) && productCategoryIdNum === categoryIdNum
            
            if (stringMatch || numberMatch) {
              console.log('Eşleşen ürün bulundu:', product.name, 'category_id:', productCategoryId, 'kategori ID:', categoryIdStr)
            }
            
            return stringMatch || numberMatch
          })
        
        console.log('Bulunan ürünler:', productsData.length, productsData)
        
        // Sort by order if exists, otherwise by name
        productsData.sort((a, b) => (a.order || 0) - (b.order || 0))
        
        // Firebase Storage'dan görselleri çek ve ürünlere ata
        const productsWithImages = await Promise.all(
          productsData.map(async (product) => {
            // Eğer üründe zaten image varsa onu kullan
            if (product.image) {
              return product
            }
            
            // Ürün ID'sine göre Storage'dan görsel ara
            const productId = String(product.id || '')
            const imageExtensions = ['jpg', 'jpeg', 'png', 'webp']
            
            for (const ext of imageExtensions) {
              try {
                // Farklı isim formatlarını dene
                const possiblePaths = [
                  `products/${productId}.${ext}`,
                  `products/${productId}_${ext}`,
                  `products/product_${productId}.${ext}`,
                  `products/${productId}-${ext}`,
                  `products/${productId}_image.${ext}`,
                ]
                
                for (const imagePath of possiblePaths) {
                  try {
                    const imageRef = ref(storage, imagePath)
                    const url = await getDownloadURL(imageRef)
                    console.log('Görsel bulundu:', imagePath, 'Ürün:', product.name)
                    return { ...product, image: url }
                  } catch (err) {
                    // Bu path'te görsel yok, devam et
                    continue
                  }
                }
              } catch (error) {
                // Görsel bulunamadı, devam et
                continue
              }
            }
            
            // Görsel bulunamadıysa orijinal ürünü döndür
            return product
          })
        )
        
        setProducts(productsWithImages)
        setLoadingProducts(false)
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error)
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [selectedCategory])

  // Firebase Storage'dan görselleri periyodik olarak kontrol et ve güncelle
  useEffect(() => {
    if (!selectedCategory) return

    const checkStorageImages = async () => {
      try {
        // Storage'daki products klasöründeki tüm görselleri listele
        const productsRef = ref(storage, 'products')
        const imageList = await listAll(productsRef)
        
        // Tüm görsellerin URL'lerini al
        const imageUrls = await Promise.all(
          imageList.items.map(async (item) => {
            try {
              const url = await getDownloadURL(item)
              // Dosya adından ürün ID'sini çıkar (örneğin: "16.jpg" -> "16")
              const fileName = item.name.replace(/\.[^/.]+$/, '') // uzantıyı kaldır
              // Farklı formatları dene: "16", "product_16", "16_image" vb.
              let productId = fileName
              if (fileName.startsWith('product_')) {
                productId = fileName.replace('product_', '')
              } else if (fileName.endsWith('_image')) {
                productId = fileName.replace('_image', '')
              }
              return { productId, url, fileName: item.name }
            } catch (error) {
              return null
            }
          })
        )

        // Geçerli URL'leri filtrele
        const validImages = imageUrls.filter(img => img !== null)
        console.log('Storage\'dan bulunan görseller:', validImages)

        // Ürünleri güncelle - eşleşen görselleri ata
        setProducts(prevProducts => {
          if (prevProducts.length === 0) return prevProducts
          
          return prevProducts.map(product => {
            // Eğer zaten görsel varsa ve geçerliyse, değiştirme
            if (product.image && product.image.startsWith('http')) {
              return product
            }

            // Ürün ID'sine göre görsel ara
            const productIdStr = String(product.id || '')
            const matchedImage = validImages.find(img => {
              const imgProductId = String(img.productId || '')
              return imgProductId === productIdStr || 
                     img.fileName.startsWith(productIdStr + '.') ||
                     img.fileName.startsWith(productIdStr + '_') ||
                     img.fileName.includes('_' + productIdStr + '_') ||
                     img.fileName === productIdStr
            })

            if (matchedImage) {
              console.log('Ürün görseli güncellendi:', product.name, matchedImage.url)
              return { ...product, image: matchedImage.url }
            }

            return product
          })
        })
      } catch (error) {
        console.error('Storage görselleri kontrol edilirken hata:', error)
      }
    }

    // İlk kontrol
    checkStorageImages()

    // Her 5 saniyede bir kontrol et (real-time güncelleme için)
    const interval = setInterval(checkStorageImages, 5000)

    return () => clearInterval(interval)
  }, [selectedCategory, storage])

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
      if (selectedCategory) {
        setSelectedCategory(null)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [selectedCategory])

  // State değişikliklerinde history'ye ekle
  useEffect(() => {
    if (selectedCategory) {
      window.history.pushState({ menuState: true }, '', window.location.pathname)
    }
  }, [selectedCategory])

  // Category image mapping (fallback)
  const categoryImageMap = {
    tatlilar: tatliImage,
    yemekler: yemekImage,
    icecekler: icecekImage
  }

  // Handle category selection
  const handleCategorySelect = (category) => {
    setDrawerOpen(false)
    setSelectedCategory(category)
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

  const colors = selectedCategory ? getCategoryColors(selectedCategory.id) : null

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
       <section className={`${!selectedCategory ? '' : 'py-24'} bg-gray-50 min-h-screen`}>
         <div className="container-custom">
           {loading && !selectedCategory ? (
             /* Loading State */
             <div className="flex items-center justify-center min-h-screen">
               <div className="text-center">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                 <p className="text-gray-600">Yükleniyor...</p>
               </div>
             </div>
           ) : !selectedCategory ? (
             /* Initial View - All Categories from Firebase */
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-col items-center justify-start min-h-screen py-2 pt-16 md:pt-24"
             >
               <h2 className="text-lg md:text-xl font-display font-bold mb-6 md:mb-8 text-gray-900 text-center">
                 Menüyü Keşfedin
               </h2>
               {/* Kaydırılabilir kategori grid container */}
               <div 
                 className="w-full overflow-y-auto pb-4 scrollbar-hide flex-1" 
                 style={{ 
                   scrollbarWidth: 'none',
                   msOverflowStyle: 'none',
                   WebkitOverflowScrolling: 'touch'
                 }}
               >
                 <div className="grid grid-cols-2 gap-3 md:gap-4 px-4 md:px-6 max-w-2xl mx-auto">
                   {categories && categories.length > 0 ? categories.map((category, index) => {
                     const Icon = iconMap[category.id] || IceCreamBowl
                     const categoryImage = category.image || categoryImageMap[category.id] || tatliImage
                     
                     // Gradient overlay renkleri
                     const categoryIdStr = String(category.id || '')
                     const gradientOverlay = categoryIdStr === 'tatlilar' || categoryIdStr.includes('tatli')
                       ? 'from-primary-600/80 via-primary-500/40 to-transparent'
                       : categoryIdStr === 'yemekler' || categoryIdStr.includes('yemek')
                       ? 'from-orange-600/80 via-orange-500/40 to-transparent'
                       : 'from-emerald-600/80 via-emerald-500/40 to-transparent'
                     
                     return (
                      <motion.button
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative rounded-xl overflow-hidden shadow-lg border-2 border-transparent transition-all duration-300 hover:shadow-xl aspect-square w-full cursor-pointer"
                      >
                        {/* Background Image */}
                        <div className="absolute inset-0 pointer-events-none">
                          <img
                            src={categoryImage}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradientOverlay} pointer-events-none`} />
                        
                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col items-center justify-center gap-2 px-4 pointer-events-none">
                          <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                            <Icon className="w-6 h-6 md:w-7 md:h-7 text-white drop-shadow-lg" />
                          </div>
                          <span className="text-sm md:text-base font-bold text-white drop-shadow-lg text-center px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm">
                            {category.name}
                          </span>
                        </div>
                      </motion.button>
                     )
                   }) : (
                     <div className="text-center py-12 col-span-2">
                       <p className="text-gray-600">Henüz kategori bulunmamaktadır</p>
                     </div>
                   )}
                 </div>
               </div>
            </motion.div>
          ) : (
            /* Category Selected View */
            <>
              {/* Back Button - Top Left */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedCategory(null)}
                  className={`fixed top-24 left-0 z-40 flex items-center gap-2 pl-4 pr-6 py-3 rounded-r-full shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 text-white ${colors?.active || 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700'}`}
                >
                  <ChevronLeft size={20} />
                  <span className="font-semibold">
                  {selectedCategory?.name || 'Geri'}
                  </span>
                </motion.button>

              {/* Menu Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="pt-16 md:pt-28"
              >
                {loadingProducts ? (
                  /* Loading Products */
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Ürünler yükleniyor...</p>
                    </div>
                  </div>
                ) : products.length === 0 && !loadingProducts ? (
                  /* No Products Message */
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
                        Bu kategoride henüz ürün bulunmamaktadır
                      </p>
                    </div>
                  </motion.div>
                ) : products.length > 0 ? (
                  /* Products List */
                      <div className="space-y-4 overflow-visible">
                    {products.map((item, index) => (
                          <motion.div
                        key={item.id || item.name}
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
                                setSelectedImage({
                              url: item.image || `https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&h=800&fit=crop&q=90`,
                                  name: item.name
                                })
                              }}
                            >
                              <div className="w-full h-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                    <img
                              src={item.image || `https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&h=400&fit=crop&q=80`}
                                      alt={item.name}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                              </div>
                            </div>

                            {/* Milkshake Çeşitler Butonu - Sağ Üst */}
                        {item.name === 'MİLKSHAKE' && selectedCategory?.id === 'icecekler' && (
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
                        {item.name === 'FROZEN' && selectedCategory?.id === 'icecekler' && (
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
                            <h3 className="text-base md:text-lg font-semibold text-gray-900">
                                  {item.name}
                                </h3>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            )}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`inline-block px-5 py-2.5 rounded-2xl ${colors?.price} text-white text-xl md:text-2xl font-bold whitespace-nowrap shadow-lg`}>
                                  {typeof item.price === 'number' ? `₺${item.price}` : item.price || '₺0'}
                                </span>
                                {item.oldPrice && (
                                  <span className="text-red-500 line-through text-lg md:text-xl font-bold opacity-70">
                                    {typeof item.oldPrice === 'number' ? `₺${item.oldPrice}` : item.oldPrice}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                ) : null}
              </motion.div>

              {/* Special Menu Note - Only show for Tatlılar */}
              {selectedCategory?.id === 'tatlilar' && (
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
                  {categories && categories.length > 0 ? categories.map((category) => {
                    const Icon = iconMap[category.id] || IceCreamBowl
                    const categoryImage = category.image || categoryImageMap[category.id] || tatliImage
                    const isSelected = selectedCategory?.id === category.id
                    
                    // Gradient overlay renkleri
                    const categoryIdStr = String(category.id || '')
                    const gradientOverlay = categoryIdStr === 'tatlilar' || categoryIdStr.includes('tatli')
                      ? 'from-primary-600/80 via-primary-500/40 to-transparent'
                      : categoryIdStr === 'yemekler' || categoryIdStr.includes('yemek')
                      ? 'from-orange-600/80 via-orange-500/40 to-transparent'
                      : 'from-emerald-600/80 via-emerald-500/40 to-transparent'
                    
                    return (
                      <motion.button
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-transparent transition-all duration-300 h-32 cursor-pointer"
                      >
                        {/* Background Image */}
                        <div className="absolute inset-0 pointer-events-none">
                          <img
                            src={categoryImage}
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
                            {category.description && (
                            <p className="text-sm mt-1 text-white/90 drop-shadow-md">
                                {category.description}
                              </p>
                            )}
                            </div>
                          </div>
                        </motion.button>
                      )
                  }) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600">Henüz kategori bulunmamaktadır</p>
                  </div>
                )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      {selectedCategory?.id === 'tatlilar' && (
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
