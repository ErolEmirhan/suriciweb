import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Lock, Plus, Minus } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import makaraWebp from '../assets/makara.webp'
// MenuNew'deki görselleri import et
import makara25 from '../assets/1 (25).webp'
import makara29 from '../assets/1 (29).webp'
import makara24 from '../assets/1 (24).webp'
import makara27 from '../assets/1 (27).webp'
import frambuaz20 from '../assets/1 (20).webp'
import kahveCekirdegi21 from '../assets/1 (21).webp'
import yerFistigi15 from '../assets/1 (15).webp'
import limon19 from '../assets/1 (19).webp'
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
import iceceksJpg from '../assets/iceceks.jpg'
import rollframJpg from '../assets/rollfram.jpg'
import rollfistikJpg from '../assets/rollfıstık.jpg'
import rollbeyazJpg from '../assets/rollbeyaz.jpg'
import rollklasJpg from '../assets/rollklas.jpg'
import lotuscupJpg from '../assets/lotuscup.jpg'
import oreocupJpg from '../assets/oreocup.jpg'
import framwaffleJpg from '../assets/framwaffle.jpg'
import antepkruJpg from '../assets/antepkru.jpg'
import framkruJpg from '../assets/framkru.jpg'

export default function ProductSelector({ onClose, onAddToCart, onDecreaseQuantity, cartItems, isOnlineOrder = false, onlineProducts = {} }) {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState({})
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [productImages, setProductImages] = useState({})
  const [imagesCache, setImagesCache] = useState(null)
  const [selectedProductId, setSelectedProductId] = useState(null) // Seçili ürün ID'si
  const prevCartItemsRef = useRef([]) // Önceki cartItems'ı takip et - başlangıçta boş

  // Kategorileri ve ürünleri yükle
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Önce LocalStorage'dan kontrol et
        const cachedCategories = localStorage.getItem('makara_categories')
        const cachedProducts = localStorage.getItem('makara_products')
        const cacheTimestamp = localStorage.getItem('makara_categories_timestamp')
        const cacheExpiry = 24 * 60 * 60 * 1000 // 24 saat (Firebase reads limitini aşmamak için)
        
        if (cachedCategories && cachedProducts && cacheTimestamp) {
          const now = Date.now()
          const cacheTime = parseInt(cacheTimestamp)
          
          // Cache geçerliyse sadece cache'den göster
          if (now - cacheTime < cacheExpiry) {
            const categoriesData = JSON.parse(cachedCategories)
            const productsData = JSON.parse(cachedProducts)
            
            // Ürünleri kategoriye göre grupla (productsData zaten kategori ID'lerine göre gruplanmış)
            const productsByCategory = {}
            categoriesData.forEach(category => {
              productsByCategory[category.id] = productsData[category.id] || []
            })
            
            setCategories(categoriesData)
            setProducts(productsByCategory)
            
            if (categoriesData.length > 0) {
              setSelectedCategory(categoriesData[0].id)
            }
            
            setLoading(false)
            return // Firebase'den çekme, cache yeterli
          }
        }
        
        // Cache yoksa veya süresi dolmuşsa Firebase'den çek
        // Kategorileri çek
        const categoriesRef = collection(db, 'categories')
        const categoriesSnapshot = await getDocs(categoriesRef)
        let categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        // Kategorileri sırala (MenuNew'deki sıralama mantığı)
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
          
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex
          }
          
          if (aIndex !== -1) return -1
          if (bIndex !== -1) return 1
          
          const aOrder = a.order_index ?? a.order ?? 999
          const bOrder = b.order_index ?? b.order ?? 999
          if (aOrder !== bOrder) return aOrder - bOrder
          
          return (a.name || '').localeCompare(b.name || '', 'tr')
        })

        // Ürünleri çek
        const productsRef = collection(db, 'products')
        const productsSnapshot = await getDocs(productsRef)
        const allProducts = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        // Ürünleri kategoriye göre grupla ve sırala
        const productsByCategory = {}
        categoriesData.forEach(category => {
          const categoryProducts = allProducts.filter(
            product => String(product.category_id) === String(category.id)
          )
          // order_index'e göre sırala
          categoryProducts.sort((a, b) => {
            const aOrder = a.order_index ?? a.order ?? 999
            const bOrder = b.order_index ?? b.order ?? 999
            if (aOrder !== bOrder) return aOrder - bOrder
            return (a.name || '').localeCompare(b.name || '', 'tr')
          })
          productsByCategory[category.id] = categoryProducts
        })

        setCategories(categoriesData)
        setProducts(productsByCategory)
        
        // İlk kategoriyi seç
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].id)
        }

        setLoading(false)
      } catch (error) {
        console.error('Veri yüklenirken hata:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Görselleri yükle
  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Önce LocalStorage'dan kontrol et
        const cachedImages = localStorage.getItem('makara_images')
        const cacheTimestamp = localStorage.getItem('makara_images_timestamp')
        const cacheExpiry = 24 * 60 * 60 * 1000 // 24 saat
        
        if (cachedImages && cacheTimestamp) {
          const now = Date.now()
          const cacheTime = parseInt(cacheTimestamp)
          
          // Cache geçerliyse sadece cache'den göster
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

          // Unsplash URL'lerini filtrele
          if (typeof imageUrl === 'string' && imageUrl.includes('unsplash.com')) {
            imageUrl = makaraWebp
          }

          const productId = imgData.product_id
          if (productId !== undefined && productId !== null) {
            const productIdStr = String(productId)
            const productIdNum = Number(productId)
            if (!imagesMap[productIdStr]) imagesMap[productIdStr] = imageUrl
            if (!isNaN(productIdNum) && !imagesMap[productIdNum]) imagesMap[productIdNum] = imageUrl
          }

          const productName = (imgData.product_name || imgData.name || '').toLowerCase().trim()
          if (productName) {
            imagesMap[productName] = imageUrl
          }
        })

        setImagesCache(imagesMap)
      } catch (error) {
        console.error('Görseller yüklenirken hata:', error)
      }
    }

    fetchImages()
  }, [])

  // Görselleri ürünlere eşleştir
  useEffect(() => {
    if (!imagesCache || Object.keys(products).length === 0 || categories.length === 0) return

    const normalizeTurkish = (str) => {
      if (!str) return ''
      let normalized = str.toLocaleLowerCase('tr-TR')
      return normalized
        .replace(/ı/g, 'i')
        .replace(/ş/g, 's')
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ö/g, 'o')
        .trim()
    }

    const matchedImages = {}
    
    Object.entries(products).forEach(([categoryId, categoryProducts]) => {
      // Kategoriyi bul
      const category = categories.find(c => String(c.id) === String(categoryId))
      const categoryName = category ? normalizeTurkish(category.name || '') : ''
      const isIcecekCategory = categoryName.includes('icecek') && 
        (categoryName.includes('sicak') || categoryName.includes('soguk'))
      
      categoryProducts.forEach(product => {
        // İÇECEK KATEGORİLERİ İÇİN FIREBASE GÖRSELLERİNİ HİÇ KAYDETME
        if (isIcecekCategory) {
          return // Bu ürün için Firebase görselini kaydetme
        }
        
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
    
    // İÇECEK KATEGORİLERİNDEKİ ÜRÜNLERİ MEVCUT STATE'DEN DE TEMİZLE
    const cleanedImages = {}
    Object.keys(matchedImages).forEach(productId => {
      const product = Object.values(products).flat().find(p => String(p.id) === String(productId))
      if (product && product.category_id && categories.length > 0) {
        const productCategory = categories.find(c => 
          String(c.id) === String(product.category_id) || 
          Number(c.id) === Number(product.category_id)
        )
        if (productCategory) {
          const foundCategoryName = normalizeTurkish(productCategory.name || '')
          if (foundCategoryName.includes('icecek') && 
              (foundCategoryName.includes('sicak') || foundCategoryName.includes('soguk'))) {
            // İçecek kategorisindeki ürünü atla
            return
          }
        }
      }
      cleanedImages[productId] = matchedImages[productId]
    })
    
    setProductImages(cleanedImages)
  }, [imagesCache, products, categories])

  // Ürün görselini al (MenuNew'deki mantık)
  const getProductImage = (product, categoryName = '') => {
    // Türkçe karakterleri normalize et
    const normalizeTurkish = (str) => {
      if (!str) return ''
      let normalized = str.toLocaleLowerCase('tr-TR')
      return normalized
        .replace(/ı/g, 'i')
        .replace(/ş/g, 's')
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ö/g, 'o')
        .trim()
    }
    
    // İÇECEK KATEGORİLERİ İÇİN EN ÖNCELİKLİ KONTROL - HİÇBİR ŞEY KONTROL ETMEDEN ÖNCE
    // Basitleştirilmiş kontrol: Sadece "icecek" kelimesini kontrol et
    const checkIfIcecek = (catName) => {
      if (!catName) return false
      const normalized = normalizeTurkish(catName)
      // "icecek" kelimesi varsa ve "sicak" veya "soguk" varsa
      return normalized.includes('icecek') && 
             (normalized.includes('sicak') || normalized.includes('soguk'))
    }
    
    // Önce kategori adı ile kontrol et
    const categoryNameLower = normalizeTurkish(categoryName || '')
    if (checkIfIcecek(categoryName)) {
      return iceceksJpg // Direkt döndür, hiçbir şey kontrol etme
    }
    
    // Ürünün category_id'sini kullanarak kategoriyi bul
    if (product.category_id && categories.length > 0) {
      const productCategory = categories.find(c => 
        String(c.id) === String(product.category_id) || 
        Number(c.id) === Number(product.category_id)
      )
      if (productCategory && checkIfIcecek(productCategory.name)) {
        return iceceksJpg // Direkt döndür, hiçbir şey kontrol etme
      }
    }
    
    const productName = normalizeTurkish(product.name || '')
    
    // Assets'ten görselleri kontrol et (öncelikli)
    // MAKARALAR KATEGORİSİ
    if (categoryNameLower.includes('makara')) {
      if (productName.includes('antep fistikli') || productName.includes('antep fistik') || 
          productName.includes('antep fıstıklı') || productName.includes('antep fıstık')) {
        return makara29
      }
      if (productName.includes('oreolu') || productName.includes('oreo')) {
        return makara24
      }
      if (productName.includes('cilekli') || productName.includes('cilek') || 
          productName.includes('çilekli') || productName.includes('çilek')) {
        return makara27
      }
      if (productName.includes('cup') && (productName.includes('bol cikolatali') || 
          productName.includes('bol çikolatalı'))) {
        return bolJpg
      }
      if (productName.includes('cup') && productName.includes('bardak')) {
        return cupbarPng
      }
      return makara25
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
      if (productName.includes('kahve cekirdegi')) {
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
      if (productName.includes('yaban mersini')) {
        return yabanMersini22
      }
      if (productName.includes('antep fistigi') || productName.includes('antep fıstığı')) {
        return antepJpeg
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
      if (productName.includes('yer fistigi') || productName.includes('yer fıstığı')) {
        return yerJpg
      }
      if (productName.includes('portakal')) {
        return portaJpg
      }
      if (productName.includes('vanilya')) {
        return vanilyaPng
      }
    }
    
    // KRUVASANLAR KATEGORİSİ
    if (categoryNameLower.includes('kruvasan')) {
      // Antep Fıstıklı Roll Kruvasan
      if ((productName.includes('antep') || productName.includes('antep')) && 
          (productName.includes('fistikli') || productName.includes('fıstıklı') || 
           productName.includes('fistik') || productName.includes('fıstık')) && 
          productName.includes('roll')) {
        return rollfistikJpg
      }
      // Frambuazlı-Çilekli Roll Kruvasan
      if ((productName.includes('frambuazli') || productName.includes('frambuazlı')) && 
          (productName.includes('cilekli') || productName.includes('çilekli')) && 
          productName.includes('roll')) {
        return rollframJpg
      }
      // Oreo Roll Kruvasan
      if ((productName.includes('oreo') || productName.includes('oreolu')) && 
          productName.includes('roll')) {
        return rollbeyazJpg
      }
      // Sade Roll Kruvasan
      if ((productName.includes('sade') || productName.includes('sade')) && 
          productName.includes('roll')) {
        return rollklasJpg
      }
      // Antep Fıstıklı Kruvasan (roll olmayan)
      if ((productName.includes('antep') || productName.includes('antep')) && 
          (productName.includes('fistikli') || productName.includes('fıstıklı') || 
           productName.includes('fistik') || productName.includes('fıstık')) && 
          !productName.includes('roll')) {
        return antepkruJpg
      }
      // Frambuazlı-Çilekli Kruvasan (roll olmayan)
      if ((productName.includes('frambuazli') || productName.includes('frambuazlı')) && 
          (productName.includes('cilekli') || productName.includes('çilekli')) && 
          !productName.includes('roll')) {
        return framkruJpg
      }
      return kruvasan26
    }
    
    // SÜTLÜ TATLILAR VE PASTALAR KATEGORİSİ
    if (categoryNameLower.includes('sütlü') || categoryNameLower.includes('sutlu') || categoryNameLower.includes('tatlı') || categoryNameLower.includes('tatli')) {
      if (productName.includes('cilekli magnolya') || productName.includes('çilekli magnolya')) {
        return cilekliMagnolya6
      }
      if (productName.includes('snickers')) {
        return snickers11
      }
      if (productName.includes('alacati') || productName.includes('alaçatı')) {
        return alacatiMuhallebisi4
      }
      if (productName.includes('limonlu cheesecake')) {
        return limonluCheesecake16
      }
      if (productName.includes('mix profiterol')) {
        return mixprofiterolJpg
      }
      if (productName.includes('fransiz profiterol') || productName.includes('fransız profiterol')) {
        return franJpeg
      }
      if (productName.includes('san sebastian')) {
        return sanSebastian13
      }
      if (productName.includes('incir')) {
        return incirJpeg
      }
      if (productName.includes('tiramisu')) {
        return tiramisuJpeg
      }
      // Lotus Cup
      if (productName.includes('lotus') && productName.includes('cup')) {
        return lotuscupJpg
      }
      // Oreo Cup
      if ((productName.includes('oreo') || productName.includes('oreolu')) && productName.includes('cup')) {
        return oreocupJpg
      }
      if (productName.includes('antep fistikli cup') || (productName.includes('cup') && productName.includes('antep'))) {
        return fistikcupJpeg
      }
      if (productName.includes('keskul') || productName.includes('keşkül')) {
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
      if (productName.includes('frambuazli malaga') || productName.includes('frambuazlı malaga')) {
        return malagaframbuazJpg
      }
      if (productName.includes('malaga')) {
        return fransizProfiterol9
      }
      if (productName.includes('baklava aski') || productName.includes('baklava aşkı')) {
        return baklavaJpg
      }
      if (productName.includes('supangle')) {
        return spangleJpg
      }
      if (productName.includes('antep') && productName.includes('kadayif')) {
        return kadayifJpg
      }
    }
    
    // WAFFLE KATEGORİSİ
    if (categoryNameLower.includes('waffle')) {
      // Frambuaz-Çilek Klasik Waffle
      if ((productName.includes('frambuaz') || productName.includes('frambuaz')) && 
          (productName.includes('cilek') || productName.includes('çilek')) && 
          productName.includes('klasik')) {
        return framwaffleJpg
      }
      if (productName.includes('bardak') && productName.includes('waffle')) {
        return bardakJpg
      }
      if (productName.includes('klasik') && productName.includes('waffle')) {
        return klasikJpg
      }
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
    
    // İÇECEK KATEGORİLERİ İÇİN TEKRAR KONTROL - Firebase görsellerini kesinlikle atla
    // Bu kontrol her Firebase görseli kontrolünden ÖNCE yapılmalı
    const checkIcecekCategory = () => {
      const checkIfIcecek = (catName) => {
        if (!catName) return false
        const normalized = normalizeTurkish(catName)
        return normalized.includes('icecek') && 
               (normalized.includes('sicak') || normalized.includes('soguk'))
      }
      
      if (checkIfIcecek(categoryName)) {
        return true
      }
      
      if (product.category_id && categories.length > 0) {
        const productCategory = categories.find(c => 
          String(c.id) === String(product.category_id) || 
          Number(c.id) === Number(product.category_id)
        )
        if (productCategory && checkIfIcecek(productCategory.name)) {
          return true
        }
      }
      return false
    }
    
    // İçecek kategorisindeyse, Firebase görsellerini TAMAMEN ATLA
    if (checkIcecekCategory()) {
      return iceceksJpg
    }
    
    // Firebase'den cache'lenmiş görseli kontrol et (içecek kategorileri zaten en başta return edildi)
    if (productImages[product.id]) {
      // Tekrar kontrol et - içecek kategorisindeyse atla
      if (checkIcecekCategory()) {
        return iceceksJpg
      }
      const cachedImage = productImages[product.id]
      if (typeof cachedImage === 'string' && cachedImage.includes('unsplash.com')) {
        return makaraWebp
      }
      return cachedImage
    }
    
    // Ürünün kendi image alanını kontrol et
    if (product.image) {
      // Tekrar kontrol et - içecek kategorisindeyse atla
      if (checkIcecekCategory()) {
        return iceceksJpg
      }
      if (typeof product.image === 'string' && product.image.includes('unsplash.com')) {
        return makaraWebp
      }
      return product.image
    }
    if (product.imageUrl) {
      // Tekrar kontrol et - içecek kategorisindeyse atla
      if (checkIcecekCategory()) {
        return iceceksJpg
      }
      if (typeof product.imageUrl === 'string' && product.imageUrl.includes('unsplash.com')) {
        return makaraWebp
      }
      return product.imageUrl
    }
    
    // Fallback görsel
    return makaraWebp
  }

  // Sepetteki ürün miktarını al
  const getCartQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  // Sepet değiştiğinde seçili ürünün miktarını kontrol et
  // Miktar 0'a düşerse seçimi kaldır
  useEffect(() => {
    if (!selectedProductId) {
      // Seçim yoksa sadece prevCartItemsRef'i güncelle
      prevCartItemsRef.current = cartItems
      return
    }
    
    const currentItem = cartItems.find(item => item.id === selectedProductId)
    
    // Miktar 0'a düşerse (ürün sepette yoksa veya miktarı 0 ise) seçimi kaldır
    if (!currentItem || currentItem.quantity === 0) {
      setSelectedProductId(null)
    }
    
    // Her zaman prevCartItemsRef'i güncelle
    prevCartItemsRef.current = cartItems
  }, [cartItems, selectedProductId])

  // Ürünü sepete ekle
  const handleAddToCart = (product) => {
    onAddToCart(product)
  }

  // Ürün miktarını artır
  const handleIncreaseQuantity = (product) => {
    // Seçimi koru - useEffect seçimi kaldırmasın diye
    onAddToCart(product)
    // Seçimi korumak için selectedProductId'yi tekrar set et
    // Ama bu gerekli değil çünkü useEffect sadece ürün yoksa null yapıyor
  }

  // Ürün miktarını azalt
  const handleDecreaseQuantity = (productId) => {
    if (onDecreaseQuantity) {
      const item = cartItems.find(item => item.id === productId)
      const willBeZero = item && item.quantity === 1
      
      onDecreaseQuantity(productId)
      
      // Miktar 0'a düşecekse seçimi kaldır
      if (willBeZero) {
        setSelectedProductId(null)
      }
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-center text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  const categoryProducts = selectedCategory ? (products[selectedCategory] || []) : []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Sadece backdrop'a tıklanınca kapat
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Ürün Seç</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Kategori seçimi */}
        <div className="p-4 border-b border-gray-200 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-2 flex-nowrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === category.id
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Ürünler grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {categoryProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Bu kategoride ürün bulunmamaktadır.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categoryProducts.map((product) => {
                const cartQuantity = getCartQuantity(product.id)
                // Online sipariş modunda online fiyatı kullan
                const onlineProduct = isOnlineOrder ? onlineProducts[product.id] : null
                const displayPrice = isOnlineOrder && onlineProduct?.online_price 
                  ? onlineProduct.online_price 
                  : product.price
                const isOutOfStock = isOnlineOrder && onlineProduct?.is_out_of_stock_online === true
                
                const isSelected = selectedProductId === product.id
                
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`bg-white rounded-xl border-2 transition-all overflow-hidden group ${
                      isOutOfStock 
                        ? 'border-gray-200 opacity-50 cursor-not-allowed' 
                        : isSelected
                        ? 'border-rose-500 shadow-lg'
                        : 'border-gray-100 hover:border-rose-300 cursor-pointer'
                    }`}
                    onMouseDown={(e) => {
                      e.stopPropagation()
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      if (!isOutOfStock) {
                        const currentQuantity = getCartQuantity(product.id)
                        
                        if (currentQuantity === 0) {
                          // Ürün sepette yoksa, sepete ekle ve seç
                          handleAddToCart(product)
                          setSelectedProductId(product.id)
                        } else {
                          // Ürün sepette varsa, sadece seçimi değiştir
                          setSelectedProductId(prev => {
                            // Eğer aynı ürün seçiliyse seçimi kaldır, değilse seç
                            return prev === product.id ? null : product.id
                          })
                        }
                      }
                    }}
                  >
                    {/* Ürün görseli */}
                    <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={getProductImage(product, categories.find(c => c.id === selectedCategory)?.name || '')}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                          isOutOfStock ? 'grayscale brightness-50' : 'group-hover:scale-105'
                        }`}
                        onError={(e) => {
                          if (e.target.src !== makaraWebp) {
                            e.target.src = makaraWebp
                          }
                        }}
                      />
                      {cartQuantity > 0 && !isOutOfStock && !isSelected && (
                        <div className="absolute top-2 right-2 bg-rose-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm z-10">
                          {cartQuantity}
                        </div>
                      )}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                          <Lock className="w-12 h-12 text-white mb-2" strokeWidth={1.5} />
                          <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold border border-white/30">
                            Tükendi
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Ürün bilgileri */}
                    <div className={`p-3 ${isOutOfStock ? 'opacity-60' : ''}`}>
                      <h3 className={`font-semibold text-sm mb-1 line-clamp-2 ${
                        isOutOfStock ? 'text-gray-500' : 'text-gray-900'
                      }`}>
                        {product.name}
                      </h3>
                      {displayPrice && !isOutOfStock && (
                        <div className="mb-2">
                          <p className="text-rose-600 font-bold">
                            {typeof displayPrice === 'number' 
                              ? `${displayPrice.toFixed(2)} ₺`
                              : displayPrice
                            }
                          </p>
                        </div>
                      )}
                      {isOutOfStock && (
                        <p className="text-xs text-red-600 font-semibold mt-1">
                          Stokta yok
                        </p>
                      )}
                      {/* + ve - butonları - sadece seçili ürün için */}
                      {isSelected && !isOutOfStock && (
                        <div className="flex items-center justify-center gap-3 mt-2 pt-2 border-t border-gray-200">
                          <button
                            type="button"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              const item = cartItems.find(item => item.id === product.id)
                              if (item && item.quantity > 1) {
                                handleDecreaseQuantity(product.id)
                              } else if (item && item.quantity === 1) {
                                // Miktar 1 ise, azaltınca 0 olacak
                                handleDecreaseQuantity(product.id)
                                // handleDecreaseQuantity içinde zaten seçim kaldırılıyor
                              }
                            }}
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={cartQuantity === 0}
                          >
                            <Minus className="w-4 h-4 text-gray-700" />
                          </button>
                          <span className="text-lg font-bold text-gray-900 min-w-[2rem] text-center">
                            {cartQuantity || 0}
                          </span>
                          <button
                            type="button"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              handleIncreaseQuantity(product)
                            }}
                            className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-rose-600 text-white py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Sepete Dön
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
