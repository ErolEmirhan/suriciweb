import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import { ChevronDown, ChevronUp, Sparkles, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import OrderModal from '../components/OrderModal'

// Assets'ten görselleri import et
import makara25 from '../assets/1 (25).webp'
import makara29 from '../assets/1 (29).webp'
import makara24 from '../assets/1 (24).webp'
import makara27 from '../assets/1 (27).webp'
import frambuaz20 from '../assets/1 (20).webp'
import kahveCekirdegi21 from '../assets/1 (21).webp'
import yerFistigi15 from '../assets/1 (15).webp'
import limon19 from '../assets/1 (19).webp'
import mango17 from '../assets/1 (17).webp'
import mangoJpeg from '../assets/mango.jpeg'
import tiramisuJpeg from '../assets/tiramisu.jpeg'
import antepJpeg from '../assets/antep.jpeg'
import fistikcupJpeg from '../assets/fistikcup.jpeg'
import keskulJpeg from '../assets/keskul.jpeg'
import franJpeg from '../assets/fran.jpeg'
import incirJpeg from '../assets/incir.jpeg'
import lotusJpeg from '../assets/lotus.jpeg'
import magnoJpg from '../assets/magno.jpg'
import brestJpeg from '../assets/brest.jpeg'
import cupprofitJpeg from '../assets/cupprofit.jpeg'
import cilek18 from '../assets/1 (18).webp'
import yabanMersini22 from '../assets/1 (22).webp'
import kruvasan26 from '../assets/1 (26).webp'
import cilekliMagnolya6 from '../assets/1 (6).webp'
import frambuazliCup7 from '../assets/1 (7).webp'
import snickers11 from '../assets/1 (11).webp'
import alacatiMuhallebisi4 from '../assets/1 (4).webp'
import limonluCheesecake16 from '../assets/1 (16).webp'
import fransizProfiterol9 from '../assets/1 (9).webp'
import sanSebastian13 from '../assets/1 (13).webp'
import incirliMuhallebi3 from '../assets/1 (3).webp'
import incirliMuhallebi2 from '../assets/1 (2).webp'
import makaraWebp from '../assets/makara.webp'
import bolJpg from '../assets/bol.jpg'
import bogurtJpeg from '../assets/bogurt.jpeg'
import findikJpeg from '../assets/fındık.jpeg'
import seftaJpg from '../assets/sefta.jpg'
import carkJpg from '../assets/cark.jpg'
import yerJpg from '../assets/yer.jpg'
import portaJpg from '../assets/porta.jpg'
import bardakJpg from '../assets/bardak.jpg'
import klasikJpg from '../assets/klasik.jpg'
import kovaJpg from '../assets/kova.jpg'
import ekstraJpeg from '../assets/ekstra.jpeg'
import frozenJpg from '../assets/frozen.jpg'
import cupbarPng from '../assets/cupbar.png'
import fracupPng from '../assets/fracup.png'
import vanilyaPng from '../assets/vanilya.png'
import baklavaJpg from '../assets/baklava.jpg'
import malagaframbuazJpg from '../assets/malagaframbuaz.jpg'
import mixprofiterolJpg from '../assets/mixprofiterol.jpg'
import spangleJpg from '../assets/spangle.jpg'
import kadayifJpg from '../assets/kadayif.jpg'
import armutJpg from '../assets/armut.jpg'
import elmaJpg from '../assets/elma.jpg'

export default function MenuNew() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState({})
  const [productImages, setProductImages] = useState({}) // Ürün görselleri ayrı state'te
  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [showSplash, setShowSplash] = useState(true) // Splash screen state
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedProductCategory, setSelectedProductCategory] = useState(null)
  const [imagesCache, setImagesCache] = useState(null) // Tüm görselleri cache'le
  const [expandingCategories, setExpandingCategories] = useState(new Set()) // Kategori genişletme splash screen state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false) // Online sipariş modal state
  const [showComingSoonModal, setShowComingSoonModal] = useState(false) // Yakında hizmetinizdeyiz modal
  const navigate = useNavigate()

  // Kategorileri Firebase'den çek veya LocalStorage'dan oku
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Önce LocalStorage'dan kontrol et
        const cachedCategories = localStorage.getItem('makara_categories')
        const cacheTimestamp = localStorage.getItem('makara_categories_timestamp')
        const cacheExpiry = 24 * 60 * 60 * 1000 // 24 saat (Firebase reads limitini aşmamak için)
        
        if (cachedCategories && cacheTimestamp) {
          const now = Date.now()
          const cacheTime = parseInt(cacheTimestamp)
          
          // Cache hala geçerliyse sadece cache'den göster, Firebase'den çekme
          if (now - cacheTime < cacheExpiry) {
            const categoriesData = JSON.parse(cachedCategories)
            setCategories(categoriesData)
            setLoading(false)
            return // Firebase'den çekme, cache yeterli
          }
        }
        
        // Cache yoksa veya süresi dolmuşsa Firebase'den çek
        const categoriesRef = collection(db, 'categories')
        let categoriesSnapshot
        
        // Tüm kategorileri çek (orderBy olmadan)
        categoriesSnapshot = await getDocs(categoriesRef)
        
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        // Özel sıralama: Kullanıcının belirttiği sıraya göre
        const categoryOrder = [
          'MAKARALAR',
          'FRANSIZ PASTALARI',
          'KRUVASANLAR',
          'SÜTLÜ TATLILAR VE PASTALAR',
          'WAFFLE',
          'SICAK İÇECEKLER',
          'SOĞUK İÇECEKLER',
          'FROZENLER',
          'MİLKSHAKELER'
        ]
        
        categoriesData.sort((a, b) => {
          const aName = (a.name || '').toUpperCase().trim()
          const bName = (b.name || '').toUpperCase().trim()
          
          const aIndex = categoryOrder.findIndex(order => 
            aName.includes(order) || order.includes(aName)
          )
          const bIndex = categoryOrder.findIndex(order => 
            bName.includes(order) || order.includes(bName)
          )
          
          // Eğer her ikisi de listede varsa, sıraya göre sırala
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex
          }
          
          // Eğer sadece biri listede varsa, o önce gelsin
          if (aIndex !== -1) return -1
          if (bIndex !== -1) return 1
          
          // İkisi de listede yoksa, order_index veya order'a göre sırala
          const aOrder = a.order_index ?? a.order ?? 999
          const bOrder = b.order_index ?? b.order ?? 999
          if (aOrder !== bOrder) return aOrder - bOrder
          
          // Son olarak alfabetik sırala
          return (a.name || '').localeCompare(b.name || '', 'tr')
        })
        
        // LocalStorage'a kaydet
        localStorage.setItem('makara_categories', JSON.stringify(categoriesData))
        localStorage.setItem('makara_categories_timestamp', Date.now().toString())
        
        setCategories(categoriesData)
        setLoading(false)
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error)
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Tüm görselleri tek seferde çek veya LocalStorage'dan oku (Firebase maliyet optimizasyonu)
  useEffect(() => {
    const fetchAllImages = async () => {
      if (imagesCache) return // Zaten cache'lenmiş
      
      try {
        // Önce LocalStorage'dan kontrol et
        const cachedImages = localStorage.getItem('makara_images')
        const cacheTimestamp = localStorage.getItem('makara_images_timestamp')
        const cacheExpiry = 24 * 60 * 60 * 1000 // 24 saat (Firebase reads limitini aşmamak için)
        
        if (cachedImages && cacheTimestamp) {
          const now = Date.now()
          const cacheTime = parseInt(cacheTimestamp)
          
          // Cache hala geçerliyse sadece cache'den göster, Firebase'den çekme
          if (now - cacheTime < cacheExpiry) {
            const imagesMap = JSON.parse(cachedImages)
            setImagesCache(imagesMap)
            return // Firebase'den çekme, cache yeterli
          }
        }
        
        // Cache yoksa veya süresi dolmuşsa Firebase'den çek
        const imagesRef = collection(db, 'images')
        const imagesSnapshot = await getDocs(imagesRef)
        const imagesMap = {}
        
        imagesSnapshot.docs.forEach(doc => {
          const imgData = doc.data()
          let imageUrl = imgData.url || imgData.image || imgData.imageUrl
          if (!imageUrl) return
          
          // Unsplash URL'lerini filtrele - makaraWebp ile değiştir
          if (typeof imageUrl === 'string' && imageUrl.includes('unsplash.com')) {
            imageUrl = makaraWebp
          }
          
          // product_id ile indexle (string ve sayısal)
          const productId = imgData.product_id
          if (productId !== undefined && productId !== null) {
            const productIdStr = String(productId)
            const productIdNum = Number(productId)
            if (!imagesMap[productIdStr]) imagesMap[productIdStr] = imageUrl
            if (!isNaN(productIdNum) && !imagesMap[productIdNum]) imagesMap[productIdNum] = imageUrl
          }
          
          // product_name ile indexle (fallback)
          const productName = (imgData.product_name || imgData.name || '').toLowerCase().trim()
          if (productName) {
            if (!imagesMap[productName]) imagesMap[productName] = imageUrl
          }
        })
        
        // LocalStorage'a kaydet
        localStorage.setItem('makara_images', JSON.stringify(imagesMap))
        localStorage.setItem('makara_images_timestamp', Date.now().toString())
        
        setImagesCache(imagesMap)
      } catch (error) {
        console.error('Görseller yüklenirken hata:', error)
      }
    }
    
    fetchAllImages()
  }, [])

  // Her kategori için ürünleri çek veya LocalStorage'dan oku (görseller olmadan - hızlı yükleme)
  useEffect(() => {
    const fetchProducts = async () => {
      if (categories.length === 0) return

      try {
        // Önce LocalStorage'dan kontrol et
        const cachedProducts = localStorage.getItem('makara_products')
        const cacheTimestamp = localStorage.getItem('makara_products_timestamp')
        const cacheExpiry = 24 * 60 * 60 * 1000 // 24 saat (Firebase reads limitini aşmamak için)
        
        // Cache geçerliyse sadece cache'den göster
        if (cachedProducts && cacheTimestamp) {
          const now = Date.now()
          const cacheTime = parseInt(cacheTimestamp)
          
          // Cache hala geçerliyse sadece cache'den göster, Firebase'den çekme
          if (now - cacheTime < cacheExpiry) {
            const productsData = JSON.parse(cachedProducts)
            setProducts(productsData)
            return // Firebase'den çekme, cache yeterli
          }
        }
        
        // Cache yoksa veya süresi dolmuşsa Firebase'den çek
        // TÜM ÜRÜNLERİ TEK SEFERDE ÇEK (daha verimli)
        const productsRef = collection(db, 'products')
        const allProductsSnapshot = await getDocs(productsRef)
        const allProducts = allProductsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        console.log('📦 Firebase\'den çekilen toplam ürün sayısı:', allProducts.length)
        
        // Ürünleri kategori ID'lerine göre grupla
        const productsData = {}
        
        for (const category of categories) {
          const categoryId = category.id
          const categoryIdStr = String(categoryId)
          const categoryIdNum = Number(categoryId)
          
          // Tüm ürünlerden bu kategoriye ait olanları filtrele
          const categoryProducts = allProducts.filter(product => {
            const productCategoryId = product.category_id
            const productCategoryIdStr = String(productCategoryId)
            const productCategoryIdNum = Number(productCategoryId)
            
            // String veya sayısal eşleşme kontrolü
            return productCategoryIdStr === categoryIdStr || 
                   productCategoryIdNum === categoryIdNum ||
                   productCategoryId === categoryId
          })
          
          // order_index veya order alanına göre sırala
          categoryProducts.sort((a, b) => {
            const aOrder = a.order_index ?? a.order ?? 999
            const bOrder = b.order_index ?? b.order ?? 999
            if (aOrder !== bOrder) return aOrder - bOrder
            return (a.name || '').localeCompare(b.name || '', 'tr')
          })
          
          console.log(`📁 ${category.name} kategorisinde ${categoryProducts.length} ürün bulundu`)
          productsData[categoryId] = categoryProducts
        }

        // LocalStorage'a kaydet
        localStorage.setItem('makara_products', JSON.stringify(productsData))
        localStorage.setItem('makara_products_timestamp', Date.now().toString())

        setProducts(productsData)
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error)
      }
    }

    fetchProducts()
  }, [categories])

  // Görselleri arka planda eşleştir (ürünler yüklendikten sonra)
  useEffect(() => {
    if (!imagesCache || Object.keys(products).length === 0) return

    const matchedImages = {}
    
    Object.entries(products).forEach(([categoryId, categoryProducts]) => {
      categoryProducts.forEach(product => {
        const productId = product.id
        const productIdStr = String(productId)
        const productIdNum = Number(productId)
        const productName = (product.name || '').toLowerCase().trim()
        
        // product_id ile eşleştir (string)
        let imageUrl = imagesCache[productIdStr]
        
        // product_id ile eşleştir (sayısal)
        if (!imageUrl && !isNaN(productIdNum)) {
          imageUrl = imagesCache[productIdNum]
        }
        
        // product_name ile eşleştir (fallback)
        if (!imageUrl && productName) {
          imageUrl = imagesCache[productName]
        }
        
        if (imageUrl) {
          // Unsplash URL'lerini filtrele
          if (typeof imageUrl === 'string' && imageUrl.includes('unsplash.com')) {
            matchedImages[productId] = makaraWebp
          } else {
            matchedImages[productId] = imageUrl
          }
        }
      })
    })
    
    setProductImages(matchedImages)
  }, [imagesCache, products])

  // Kategoriyi aç/kapa
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
        // Kategori kapatıldığında splash screen'i kaldır
        setExpandingCategories(prevExpanding => {
          const newExpanding = new Set(prevExpanding)
          newExpanding.delete(categoryId)
          return newExpanding
        })
      } else {
        newSet.add(categoryId)
        // Kategori açıldığında splash screen'i göster
        setExpandingCategories(prevExpanding => {
          const newExpanding = new Set(prevExpanding)
          newExpanding.add(categoryId)
          return newExpanding
        })
        // 800ms sonra splash screen'i kaldır
        setTimeout(() => {
          setExpandingCategories(prevExpanding => {
            const newExpanding = new Set(prevExpanding)
            newExpanding.delete(categoryId)
            return newExpanding
          })
        }, 800)
      }
      return newSet
    })
  }

  // Ürün görseli URL'sini al
  const getProductImage = (product, categoryName) => {
    // Türkçe karakterleri normalize et (İ -> i, ı -> i, ş -> s, ç -> c, ğ -> g, ü -> u, ö -> o)
    const normalizeTurkish = (str) => {
      if (!str) return ''
      // Türkçe locale ile küçük harfe çevir (İ -> i doğru çalışır)
      let normalized = str.toLocaleLowerCase('tr-TR')
      // Sonra diğer Türkçe karakterleri normalize et
      return normalized
        .replace(/ı/g, 'i')
        .replace(/ş/g, 's')
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ö/g, 'o')
        .trim()
    }
    
    const productName = normalizeTurkish(product.name || '')
    const categoryNameLower = normalizeTurkish(categoryName || '')
    
    // Debug: Makaralar kategorisindeki ürünler için
    if (categoryNameLower.includes('makara')) {
      if (productName.includes('antep') || productName.includes('cilek') || productName.includes('tarcin')) {
        console.log('🔍 Makara Debug:', {
          originalName: product.name,
          normalizedName: productName,
          categoryName: categoryName,
          categoryNameLower: categoryNameLower,
          productId: product.id
        })
      }
    }
    
    // Assets'ten görselleri kontrol et (öncelikli)
    // MAKARALAR KATEGORİSİ
    if (categoryNameLower.includes('makara')) {
      // Sade Tarçınlı
      if (productName.includes('sade tarcinli') || productName.includes('sade tarcin') || 
          productName.includes('sade tarçınlı') || productName.includes('sade tarçın')) {
        return makara25
      }
      // Tarçınlı Çikolatalı
      if (productName.includes('tarcinli cikolatali') || productName.includes('tarcin cikolata') || 
          productName.includes('tarcinli cikolata') || productName.includes('tarçınlı çikolatalı') || 
          productName.includes('tarçın çikolata') || productName.includes('tarçınlı çikolata')) {
        return makara25
      }
      // Antep Fıstıklı
      if (productName.includes('antep fistikli') || productName.includes('antep fistik') || 
          productName.includes('antep fıstıklı') || productName.includes('antep fıstık')) {
        return makara29
      }
      // Lotuslu
      if (productName.includes('lotuslu') || productName.includes('lotus')) {
        return makara25
      }
      // Oreolu
      if (productName.includes('oreolu') || productName.includes('oreo')) {
        return makara24
      }
      // Çilekli
      if (productName.includes('cilekli') || productName.includes('cilek') || 
          productName.includes('çilekli') || productName.includes('çilek')) {
        return makara27
      }
      // Makara Cup Bol çikolatalı
      if (productName.includes('cup') && (productName.includes('bol cikolatali') || 
          productName.includes('bol çikolatalı') || productName.includes('bol cikolata') ||
          productName.includes('bol çikolata'))) {
        return bolJpg
      }
      // Makara Cup Bardak
      if (productName.includes('cup') && productName.includes('bardak')) {
        return cupbarPng
      }
    }
    
    // FRANSIZ PASTALARI KATEGORİSİ
    if (categoryNameLower.includes('fransız') || categoryNameLower.includes('fransiz')) {
      // Armut fransız pasta
      if (productName.includes('armut')) {
        return armutJpg
      }
      // Elma fransız pasta (fransiz veya fırasız yazımı)
      if (productName.includes('elma')) {
        return elmaJpg
      }
      if (productName.includes('frambuaz')) {
        return frambuaz20
      }
      if (productName.includes('kahve çekirdeği') || productName.includes('kahve cekirdegi')) {
        return kahveCekirdegi21
      }
      if (productName.includes('limon')) {
        return limon19
      }
      if (productName.includes('mango')) {
        return mangoJpeg
      }
      if (productName.includes('cilek') || productName.includes('çilek')) {
        return cilek18
      }
      if (productName.includes('yaban mersini') || productName.includes('yabanmersini')) {
        return yabanMersini22
      }
      if (productName.includes('antep fıstığı') || productName.includes('antep fistigi') || productName.includes('antep fıstık') || productName.includes('antep fistik')) {
        return antepJpeg
      }
      if (productName.includes('badem')) {
        return yerFistigi15
      }
      if (productName.includes('bogurtlen') || productName.includes('böğürtlen')) {
        return bogurtJpeg
      }
      if (productName.includes('findik') || productName.includes('fındık')) {
        return findikJpeg
      }
      if (productName.includes('seftali') || productName.includes('şeftali')) {
        return seftaJpg
      }
      if (productName.includes('carkifelek') || productName.includes('çarkıfelek')) {
        return carkJpg
      }
      if (productName.includes('yer fistigi') || productName.includes('yer fıstığı') || 
          productName.includes('yer fistik') || productName.includes('yer fıstık')) {
        return yerJpg
      }
      if (productName.includes('portakal')) {
        return portaJpg
      }
      // Vanilya Çubuğu Fransız Pasta
      if (productName.includes('vanilya') || productName.includes('vanilya cubugu') || productName.includes('vanilya çubuğu')) {
        return vanilyaPng
      }
    }
    
    // KRUVASANLAR KATEGORİSİ
    if (categoryNameLower.includes('kruvasan') || categoryNameLower.includes('kruvasan')) {
      // Çikolatalı Roll Kruvasan ve Frambuazlı Roll Kruvasan için görsel kaldırıldı
      if (productName.includes('cikolatali roll kruvasan') || productName.includes('çikolatalı roll kruvasan') ||
          productName.includes('frambuazli roll kruvasan') || productName.includes('frambuazlı roll kruvasan')) {
        // Bu ürünler için görsel döndürme, varsayılan görsel kullanılacak
      } else {
        return kruvasan26
      }
    }
    
    // SÜTLÜ TATLILAR VE PASTALAR KATEGORİSİ
    if (categoryNameLower.includes('sütlü') || categoryNameLower.includes('sutlu') || categoryNameLower.includes('tatlı') || categoryNameLower.includes('tatli')) {
      if (productName.includes('çilekli magnolya') || productName.includes('cilekli magnolya')) {
        return cilekliMagnolya6
      }
      if (productName.includes('snickers')) {
        return snickers11
      }
      if (productName.includes('alaçatı') || productName.includes('alacati')) {
        return alacatiMuhallebisi4
      }
      if (productName.includes('limonlu cheesecake') || productName.includes('limon cheesecake')) {
        return limonluCheesecake16
      }
      if (productName.includes('mix profiterol')) {
        return mixprofiterolJpg
      }
      if (productName.includes('fransız profiterol') || productName.includes('fransiz profiterol')) {
        return franJpeg
      }
      if (productName.includes('san sebastian') || productName.includes('san sebastian')) {
        return sanSebastian13
      }
      if (productName.includes('incir')) {
        return incirJpeg
      }
      if (productName.includes('tiramisu')) {
        return tiramisuJpeg
      }
      if (productName.includes('antep fıstıklı cup') || productName.includes('antep fistikli cup') || (productName.includes('cup') && productName.includes('antep'))) {
        return fistikcupJpeg
      }
      if (productName.includes('keşkül') || productName.includes('keskul')) {
        return keskulJpeg
      }
      if (productName.includes('lotus') && productName.includes('chesecake')) {
        return lotusJpeg
      }
      if (productName.includes('lotus') && productName.includes('magnolia')) {
        return magnoJpg
      }
      if (productName.includes('paris') && productName.includes('brest')) {
        return brestJpeg
      }
      if (productName.includes('profiterol') && productName.includes('cup')) {
        return cupprofitJpeg
      }
      if (productName.includes('frambuaz') && productName.includes('cup')) {
        return fracupPng
      }
      if ((productName.includes('frambuazli malaga') || productName.includes('frambuazlı malaga') || productName.includes('frambuaz malaga')) && !productName.includes('cup')) {
        return malagaframbuazJpg
      }
      if (productName.includes('malaga')) {
        return fransizProfiterol9
      }
      if (productName.includes('baklava aski') || productName.includes('baklava aşkı') || productName.includes('baklava ask')) {
        return baklavaJpg
      }
      if (productName.includes('supangle') || productName.includes('supangle')) {
        return spangleJpg
      }
      if (productName.includes('sutlu antep kadayif') || productName.includes('sütlü antep kadayıf') || 
          (productName.includes('antep') && productName.includes('kadayif')) || 
          (productName.includes('antep') && productName.includes('kadayıf'))) {
        return kadayifJpg
      }
    }
    
    // WAFFLE KATEGORİSİ
    if (categoryNameLower.includes('waffle')) {
      // Bardak Waffle ürünleri - tüm bardak waffle'lar için
      if (productName.includes('bardak') && productName.includes('waffle')) {
        return bardakJpg
      }
      // Klasik Waffle ürünleri - tüm klasik waffle'lar için
      if (productName.includes('klasik') && productName.includes('waffle')) {
        return klasikJpg
      }
      // Kova Waffle ürünleri - tüm kova waffle'lar için
      if (productName.includes('kova') && productName.includes('waffle')) {
        return kovaJpg
      }
    }
    
    // EKSTRA ÇİKOLATA KATEGORİSİ
    if (categoryNameLower.includes('ekstra') && categoryNameLower.includes('cikolata')) {
      return ekstraJpeg
    }
    
    // FROZENLAR KATEGORİSİ
    if (categoryNameLower.includes('frozen')) {
      return frozenJpg
    }
    
    // Firebase'den cache'lenmiş görseli kontrol et
    if (productImages[product.id]) {
      const cachedImage = productImages[product.id]
      // Unsplash URL'lerini filtrele
      if (typeof cachedImage === 'string' && cachedImage.includes('unsplash.com')) {
        return makaraWebp
      }
      return cachedImage
    }
    
    // Ürünün kendi image alanını kontrol et
    if (product.image) {
      // Unsplash URL'lerini filtrele
      if (typeof product.image === 'string' && product.image.includes('unsplash.com')) {
        return makaraWebp
      }
      return product.image
    }
    if (product.imageUrl) {
      // Unsplash URL'lerini filtrele
      if (typeof product.imageUrl === 'string' && product.imageUrl.includes('unsplash.com')) {
        return makaraWebp
      }
      return product.imageUrl
    }
    
    // Fallback görsel - makara.webp
    return makaraWebp
  }

  // Kategori görseli URL'sini al - Kategori içindeki ürünlerden birinin görseli
  const getCategoryImage = (category) => {
    // Önce kategori içindeki ürünlerden birinin görselini al
    const categoryProducts = products[category.id] || []
    if (categoryProducts.length > 0) {
      // İlk ürünün görselini al
      const firstProduct = categoryProducts[0]
      const productImage = getProductImage(firstProduct, category.name)
      // Ürün görseli varsa ve makaraWebp değilse kullan
      if (productImage && productImage !== makaraWebp && typeof productImage === 'string' && productImage.trim() !== '') {
        return productImage
      }
    }
    
    // Eğer ürün görseli yoksa kategori görselini kontrol et
    if (category.image && typeof category.image === 'string' && category.image.trim() !== '') {
      return category.image
    }
    if (category.imageUrl && typeof category.imageUrl === 'string' && category.imageUrl.trim() !== '') {
      return category.imageUrl
    }
    
    // Fallback görsel - makara.webp (kategori görseli boşsa)
    return makaraWebp
  }

  // Splash screen - 2 saniye göster
  useEffect(() => {
    // Splash screen gösterilirken body scroll'unu engelle
    if (loading || showSplash) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.maxWidth = '100vw'
      document.documentElement.style.overflowX = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.maxWidth = ''
    }

    if (!loading) {
      const timer = setTimeout(() => {
        setShowSplash(false)
        // Cleanup: scroll'u geri aç
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.width = ''
        document.body.style.maxWidth = ''
      }, 2000)
      return () => {
        clearTimeout(timer)
        // Cleanup: scroll'u geri aç
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.width = ''
        document.body.style.maxWidth = ''
      }
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.maxWidth = ''
    }
  }, [loading, showSplash])

  if (loading || showSplash) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 z-50 overflow-hidden w-screen max-w-full" style={{ left: 0, right: 0, top: 0, bottom: 0 }}>
        {/* Animated gradient orbs - Futuristik arka plan efektleri */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-400/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.6, 0.4],
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        {/* Subtle grid pattern - Modern dokusal arka plan */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(236, 72, 153, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(236, 72, 153, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Ana içerik */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center relative z-10"
        >
          {/* Logo/Mark alanı - Minimal ve şık */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <div className="relative inline-block">
              {/* Glow efekti */}
              <div className="absolute inset-0 bg-rose-400/40 blur-2xl rounded-full scale-150" />
              
              {/* Ana başlık - Modern tipografi */}
              <motion.h1
                initial={{ opacity: 0, letterSpacing: '0.2em' }}
                animate={{ opacity: 1, letterSpacing: '0.1em' }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-rose-700 tracking-[0.15em] uppercase"
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: 300,
                  letterSpacing: '0.15em',
                  textShadow: '0 4px 20px rgba(236, 72, 153, 0.3), 0 0 40px rgba(236, 72, 153, 0.2)'
                }}
              >
                MENÜ
              </motion.h1>
              
              {/* Alt çizgi - Minimal dekoratif element */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                className="h-px bg-gradient-to-r from-transparent via-rose-500/70 to-transparent mt-4 mx-auto"
                style={{ maxWidth: '200px' }}
              />
            </div>
          </motion.div>
          
          {/* Loading indicator - Profesyonel ve minimal */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col items-center justify-center gap-4 mt-8"
            >
              {/* Modern loading spinner */}
              <div className="relative w-12 h-12">
                <motion.div
                  className="absolute inset-0 border-2 border-rose-300/40 rounded-full"
                />
                <motion.div
                  className="absolute inset-0 border-2 border-transparent border-t-rose-500 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div
                  className="absolute inset-2 border-2 border-transparent border-r-pink-500 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
              
              {/* Loading text - Minimal ve şık */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-sm font-light text-rose-600/80 tracking-wider uppercase"
                style={{ letterSpacing: '0.2em' }}
              >
                Yükleniyor
              </motion.p>
            </motion.div>
          )}
        </motion.div>

        {/* Subtle particles - Minimal parçacık efekti */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
              y: [0, -100],
              x: [0, (Math.random() - 0.5) * 200]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
            className="absolute w-1 h-1 bg-rose-500/70 rounded-full blur-sm"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${30 + Math.random() * 40}%`
            }}
          />
        ))}
      </div>
    )
  }

  // Kategoriler yoksa mesaj göster
  if (!loading && categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kategori bulunamadı</h2>
          <p className="text-gray-600">Firebase'den kategori verileri yüklenemedi.</p>
          <p className="text-sm text-gray-500 mt-2">Lütfen konsolu kontrol edin.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-3 px-2 sm:py-4 sm:px-3 lg:py-6 lg:px-4 overflow-x-hidden w-full max-w-full relative">
      {/* Sabit Online Sipariş Butonu - Mobil: Alt Ortada, Desktop: Sağ Üstte */}
      {!isOrderModalOpen && (
        <button
          onClick={() => navigate('/menu/order')}
          className="fixed z-[9999] bg-gradient-to-r from-green-600 via-emerald-600 to-green-500 text-white rounded-full shadow-2xl hover:shadow-green-500/60 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 font-semibold touch-manipulation
            /* Mobil: Alt ortada, büyük floating button */
            bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-sm py-4 px-6 text-base
            /* Desktop: Sağ üstte, kompakt */
            sm:bottom-auto sm:top-16 sm:right-4 sm:left-auto sm:translate-x-0 sm:w-auto sm:max-w-none sm:py-3 sm:px-4 sm:text-sm
            /* Pulse animasyon efekti */
            animate-pulse sm:animate-none"
          style={{ 
            boxShadow: '0 10px 30px rgba(22, 163, 74, 0.5), 0 0 20px rgba(16, 185, 129, 0.3)',
            position: 'fixed',
            zIndex: 9999,
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          {/* İkon container - daha belirgin */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-sm" />
            <ShoppingBag className="w-6 h-6 sm:w-5 sm:h-5 relative z-10" strokeWidth={2.5} />
          </div>
          <span className="hidden sm:inline">Online Sipariş Ver</span>
          <span className="sm:hidden font-bold tracking-wide">Online Sipariş Ver</span>
          
          {/* Mobil için ekstra vurgu - küçük badge */}
          <span className="sm:hidden absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white animate-ping" />
        </button>
      )}

      <div className="max-w-7xl mx-auto w-full px-2 sm:px-3">
        {/* Başlık - Kompakt */}
        <div className="text-center mb-3 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
            Menümüz
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
          </h1>
        </div>

        {/* Kategori Kartları - Kompakt Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 -mt-2 sm:-mt-3 w-full max-w-full overflow-x-hidden">
          {categories.length === 0 && !loading && (
            <div className="col-span-full text-center py-4">
              <p className="text-gray-600 text-sm">Henüz kategori bulunmamaktadır.</p>
            </div>
          )}
          {categories.map((category, index) => {
            const isExpanded = expandedCategories.has(category.id)
            const categoryProducts = products[category.id] || []
            const categoryNameUpper = (category.name || '').toUpperCase().trim()
            const isHotDrinks = categoryNameUpper.includes('SICAK İÇECEKLER') || categoryNameUpper.includes('SICAK ICEECEKLER')
            const isMakara = categoryNameUpper.includes('MAKARALAR') || categoryNameUpper.includes('MAKARA')

            return (
              <>
                {/* TATLILAR Bölüm Ayracı - MAKARALAR'dan önce */}
                {isMakara && (
                  <div className="col-span-full mt-4 sm:mt-6 mb-2 sm:mb-3 w-full max-w-full overflow-x-hidden">
                    <div className="relative flex items-center justify-center gap-6 sm:gap-8">
                      {/* Sol Çizgi - Kalın ve Gradient */}
                      <div className="flex-1 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-pink-400/80 to-pink-500 shadow-lg"></div>
                      
                      {/* Orta Yazı - Çok Belirgin ve Modern */}
                      <div className="relative flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4">
                        {/* Arka Plan Glow Efekti */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/50 via-rose-100/60 to-pink-100/50 rounded-full blur-xl"></div>
                        
                        {/* Yazı Container - Backdrop Blur */}
                        <div className="relative bg-white/40 backdrop-blur-md rounded-full px-6 sm:px-8 py-2 sm:py-3 border-2 border-pink-300/60 shadow-2xl ring-2 ring-pink-200/40">
                          <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-pink-600 tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(236,72,153,0.4)]">
                            TATLILAR
                          </span>
                        </div>
                      </div>
                      
                      {/* Sağ Çizgi - Kalın ve Gradient */}
                      <div className="flex-1 h-0.5 sm:h-1 bg-gradient-to-l from-transparent via-pink-400/80 to-pink-500 shadow-lg"></div>
                    </div>
                  </div>
                )}
                
                {/* İÇECEKLER Bölüm Ayracı - Modern ve Profesyonel */}
                {isHotDrinks && (
                  <div className="col-span-full mb-6 sm:mb-8 w-full max-w-full overflow-x-hidden">
                    <div className="relative flex items-center justify-center gap-6 sm:gap-8">
                      {/* Sol Çizgi - Kalın ve Gradient */}
                      <div className="flex-1 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-pink-400/80 to-pink-500 shadow-lg"></div>
                      
                      {/* Orta Yazı - Çok Belirgin ve Modern */}
                      <div className="relative flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4">
                        {/* Arka Plan Glow Efekti */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/50 via-rose-100/60 to-pink-100/50 rounded-full blur-xl"></div>
                        
                        {/* Yazı Container - Backdrop Blur */}
                        <div className="relative bg-white/40 backdrop-blur-md rounded-full px-6 sm:px-8 py-2 sm:py-3 border-2 border-pink-300/60 shadow-2xl ring-2 ring-pink-200/40">
                          <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-pink-600 tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(236,72,153,0.4)]">
                            İÇECEKLER
                          </span>
                        </div>
                      </div>
                      
                      {/* Sağ Çizgi - Kalın ve Gradient */}
                      <div className="flex-1 h-0.5 sm:h-1 bg-gradient-to-l from-transparent via-pink-400/80 to-pink-500 shadow-lg"></div>
                    </div>
                  </div>
                )}
              <div
                key={category.id}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden active:scale-[0.98] transition-all duration-500 border-2 border-gray-100/80 hover:border-pink-200/60 group/card backdrop-blur-sm w-full max-w-full"
              >
                {/* Kategori Başlığı - Kompakt */}
                <div
                  onClick={() => toggleCategory(category.id)}
                  className="relative cursor-pointer group touch-manipulation"
                >
                  {/* Kategori Arka Plan Görseli - Ultra Profesyonel */}
                  <div className="relative h-36 sm:h-40 md:h-44 overflow-hidden rounded-t-3xl">
                    {/* Görsel */}
                    <img
                      src={getCategoryImage(category)}
                      alt={category.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-115 group-active:scale-105"
                    />
                    {/* Düz Pembe Overlay - Navbar'daki Pembe Tonu */}
                    <div className="absolute inset-0 bg-pink-600/70" />
                    
                    {/* Shine Efekti */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover/card:translate-x-[200%] transition-transform duration-1000" />
                    
                    {/* Kategori İçeriği - Ultra Modern ve Profesyonel */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-5 sm:p-6">
                      {/* Kategori İsmi - Radiuslu Siyah Overlay ile */}
                      <div className="text-center mb-4 relative z-10">
                        <div className="relative inline-block">
                          {/* Radiuslu Siyah Overlay Arka Plan - Daha Az Yer Kaplayan ve Daha Az Opak */}
                          <div className="absolute inset-0 -inset-x-2 -inset-y-1 bg-black/25 backdrop-blur-sm rounded-full"></div>
                          
                          {/* Kategori İsmi */}
                          <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight px-3 py-1.5">
                            <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                              {category.name}
                            </span>
                          </h2>
                        </div>
                      </div>
                      
                      {/* Ürün Sayısı Badge - Daha Az Belirgin */}
                      {categoryProducts.length > 0 && (
                        <div className="flex items-center justify-center relative z-10">
                          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
                            <span className="text-xs sm:text-sm font-semibold text-white/90 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
                              {categoryProducts.length} {categoryProducts.length === 1 ? 'ürün' : 'ürün'}
                            </span>
                          </span>
                        </div>
                      )}
                      
                      {/* Aç/Kapa İkonu - Premium Buton */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="absolute top-4 right-4 bg-white/35 backdrop-blur-lg rounded-full p-2.5 sm:p-3 hover:bg-white/50 active:bg-white/60 transition-all duration-300 flex-shrink-0 touch-manipulation shadow-2xl ring-3 ring-white/30 hover:ring-white/40 hover:scale-110"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-lg" />
                        ) : (
                          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-lg" />
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Ürünler Listesi - Kompakt Grid */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden relative"
                    >
                      {/* Kategori Genişletme Splash Screen */}
                      {expandingCategories.has(category.id) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-white via-rose-50/40 to-pink-50/40 backdrop-blur-md"
                        >
                          {/* Modern Loading Animation */}
                          <div className="flex flex-col items-center justify-center gap-5 px-4">
                            {/* Animated Gradient Orb - Premium Design */}
                            <motion.div
                              className="relative w-20 h-20"
                              animate={{
                                scale: [1, 1.15, 1],
                                rotate: [0, 180, 360]
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              {/* Outer Glow */}
                              <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-500 to-rose-500 rounded-full blur-2xl opacity-50" />
                              {/* Middle Ring */}
                              <div className="absolute inset-1 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full" />
                              {/* Inner Core */}
                              <motion.div
                                className="absolute inset-3 bg-gradient-to-br from-white to-rose-50 rounded-full shadow-inner"
                                animate={{
                                  scale: [1, 0.85, 1],
                                  opacity: [0.4, 0.7, 0.4]
                                }}
                                transition={{
                                  duration: 1.8,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                              {/* Center Pulse */}
                              <motion.div
                                className="absolute inset-5 bg-rose-500 rounded-full"
                                animate={{
                                  scale: [0.5, 1, 0.5],
                                  opacity: [0.6, 0.9, 0.6]
                                }}
                                transition={{
                                  duration: 1.2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            </motion.div>
                            
                            {/* Category Name - Elegant Typography */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.15, duration: 0.4 }}
                              className="text-center"
                            >
                              <motion.h3
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.25, duration: 0.4 }}
                                className="text-sm sm:text-base font-light text-rose-700/90 tracking-widest uppercase mb-2"
                                style={{ letterSpacing: '0.2em' }}
                              >
                                {category.name}
                              </motion.h3>
                              <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: '100%', opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                                className="h-px bg-gradient-to-r from-transparent via-rose-400/50 to-transparent mx-auto"
                                style={{ maxWidth: '100px' }}
                              />
                            </motion.div>
                            
                            {/* Elegant Loading Indicator */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="flex items-center gap-2"
                            >
                              {/* Animated Dots */}
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  className="w-1.5 h-1.5 bg-rose-500/70 rounded-full"
                                  animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.5, 1, 0.5]
                                  }}
                                  transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                  }}
                                />
                              ))}
                            </motion.div>
                            
                            {/* Subtle Progress Bar - Refined */}
                            <motion.div
                              initial={{ width: 0, opacity: 0 }}
                              animate={{ width: '100%', opacity: 1 }}
                              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                              className="relative h-0.5 bg-rose-100/50 rounded-full overflow-hidden"
                              style={{ maxWidth: '140px' }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 rounded-full"
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                      
                      {categoryProducts.length > 0 && (
                      <div className="p-2 sm:p-3">
                        {/* 6'dan fazla ürün varsa horizontal scroll, yoksa grid */}
                        {categoryProducts.length > 6 ? (
                          <div className="overflow-x-auto scrollbar-hide -mx-2 sm:-mx-3 px-2 sm:px-3 snap-x snap-mandatory w-full" style={{ maxWidth: '100%' }}>
                            <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
                              {categoryProducts.map((product, productIndex) => (
                                <div
                                  key={product.id}
                                  onClick={() => {
                                    setSelectedProduct(product)
                                    setSelectedProductCategory(category.name)
                                  }}
                                  className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-300 cursor-pointer group border border-gray-100/80 hover:border-pink-200/60 active:border-pink-300/80 touch-manipulation backdrop-blur-sm flex-shrink-0 snap-start w-36 sm:w-40 md:w-44"
                                >
                              {/* Ürün Görseli - Dairesel Profesyonel */}
                              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden mb-2.5 bg-gradient-to-br from-gray-50 to-gray-100/50 shadow-inner ring-1 ring-gray-200/60 group-hover:ring-pink-200/50 transition-all duration-300">
                                <img
                                  key={`product-img-${product.id}-${getProductImage(product, category.name)}`}
                                  src={getProductImage(product, category.name)}
                                  alt={product.name}
                                  loading="lazy"
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-active:scale-100"
                                  onError={(e) => {
                                    if (e.target.src !== makaraWebp) {
                                      e.target.src = makaraWebp
                                    }
                                  }}
                                />
                              </div>

                              {/* Ürün Bilgileri - Profesyonel */}
                              <div className="text-center space-y-2">
                                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-rose-600 transition-colors duration-300 line-clamp-2 leading-tight tracking-tight">
                                  {product.name}
                                </h3>
                                
                                {/* Fiyat - Radiuslu Arka Plan */}
                                <div className="mt-auto">
                                  {product.price ? (
                                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/60 group-hover:border-rose-300/80 group-hover:from-rose-100 group-hover:to-pink-100 transition-all duration-300">
                                      <span className="text-xs sm:text-sm font-bold text-rose-600 group-hover:text-rose-700">
                                        {typeof product.price === 'number' 
                                          ? `${product.price.toFixed(2)} ₺`
                                          : product.price
                                        }
                                      </span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200/60">
                                      <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Fiyat yok</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {categoryProducts.map((product, productIndex) => (
                              <div
                                key={product.id}
                                onClick={() => {
                                  setSelectedProduct(product)
                                  setSelectedProductCategory(category.name)
                                }}
                                className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-300 cursor-pointer group border border-gray-100/80 hover:border-pink-200/60 active:border-pink-300/80 touch-manipulation backdrop-blur-sm"
                              >
                                {/* Ürün Görseli - Dairesel Profesyonel */}
                                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden mb-2.5 bg-gradient-to-br from-gray-50 to-gray-100/50 shadow-inner ring-1 ring-gray-200/60 group-hover:ring-pink-200/50 transition-all duration-300">
                                  <img
                                    key={`product-img-grid-${product.id}-${getProductImage(product, category.name)}`}
                                    src={getProductImage(product, category.name)}
                                    alt={product.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-active:scale-100"
                                    onError={(e) => {
                                      if (e.target.src !== makaraWebp) {
                                        e.target.src = makaraWebp
                                      }
                                    }}
                                  />
                                </div>

                                {/* Ürün Bilgileri - Profesyonel */}
                                <div className="text-center space-y-2">
                                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-rose-600 transition-colors duration-300 line-clamp-2 leading-tight tracking-tight">
                                    {product.name}
                                  </h3>
                                  
                                  {/* Fiyat - Radiuslu Arka Plan */}
                                  <div className="mt-auto">
                                    {product.price ? (
                                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/60 group-hover:border-rose-300/80 group-hover:from-rose-100 group-hover:to-pink-100 transition-all duration-300">
                                        <span className="text-xs sm:text-sm font-bold text-rose-600 group-hover:text-rose-700">
                                          {typeof product.price === 'number' 
                                            ? `${product.price.toFixed(2)} ₺`
                                            : product.price
                                          }
                                        </span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200/60">
                                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Fiyat yok</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Ürün Yoksa Mesaj - Kompakt */}
                {isExpanded && categoryProducts.length === 0 && (
                  <div className="p-3 text-center">
                    <p className="text-gray-500 text-xs sm:text-sm">Bu kategoride henüz ürün bulunmamaktadır.</p>
                  </div>
                )}
              </div>
              </>
            )
          })}
        </div>
      </div>

      {/* Ürün Detay Modal - Kompakt */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-2"
            onClick={() => {
              setSelectedProduct(null)
              setSelectedProductCategory(null)
            }}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl touch-manipulation"
            >
              {/* Mobil: Üstten swipe için handle */}
              <div className="sticky top-0 bg-white z-10 pt-2 pb-1">
                <div className="flex justify-center sm:hidden mb-1">
                  <div className="w-10 h-0.5 bg-gray-300 rounded-full"></div>
                </div>
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-full overflow-hidden mb-2">
                  <img
                    key={`modal-img-${selectedProduct.id}-${getProductImage(selectedProduct, selectedProductCategory)}`}
                    src={getProductImage(selectedProduct, selectedProductCategory)}
                    alt={selectedProduct.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      if (e.target.src !== makaraWebp) {
                        e.target.src = makaraWebp
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      setSelectedProduct(null)
                      setSelectedProductCategory(null)
                    }}
                    className="absolute top-1 right-1 bg-white/95 backdrop-blur-sm rounded-full p-1.5 active:bg-white transition-colors shadow-lg touch-manipulation"
                  >
                    <ChevronUp className="w-3 h-3 text-gray-700 rotate-45" />
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2.5 tracking-tight leading-tight">
                  {selectedProduct.name}
                </h2>
                {selectedProduct.description && (
                  <p className="text-gray-600 text-sm sm:text-base mb-4 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                )}
                {selectedProduct.price && (
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                    <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/60">
                      <span className="text-lg sm:text-xl font-bold text-rose-600">
                        {typeof selectedProduct.price === 'number' 
                          ? `${selectedProduct.price.toFixed(2)} ₺`
                          : selectedProduct.price
                        }
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online Sipariş Modal - ŞİMDİLİK DEVRE DIŞI */}
      {/* <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      /> */}

      {/* Yakında Hizmetinizdeyiz Modal - ŞİMDİLİK AKTİF */}
      <AnimatePresence>
        {showComingSoonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowComingSoonModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
            >
              {/* İçerik */}
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="mb-6 flex justify-center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-2xl" />
                    <ShoppingBag className="w-16 h-16 text-rose-600 relative z-10" strokeWidth={1.5} />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-gray-900 mb-3"
                >
                  Yakında Hizmetinizdeyiz
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 mb-6 leading-relaxed"
                >
                  Online sipariş özelliği yakında aktif olacaktır. 
                  Şimdilik restoranımıza gelerek siparişinizi verebilirsiniz.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setShowComingSoonModal(false)}
                  className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-rose-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-rose-500/50 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Tamam
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}



