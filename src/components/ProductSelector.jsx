import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart } from 'lucide-react'
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

export default function ProductSelector({ onClose, onAddToCart, cartItems }) {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState({})
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [productImages, setProductImages] = useState({})
  const [imagesCache, setImagesCache] = useState(null)

  // Kategorileri ve ürünleri yükle
  useEffect(() => {
    const fetchData = async () => {
      try {
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
    
    const productName = normalizeTurkish(product.name || '')
    const categoryNameLower = normalizeTurkish(categoryName || '')
    
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
    
    // Firebase'den cache'lenmiş görseli kontrol et
    if (productImages[product.id]) {
      const cachedImage = productImages[product.id]
      if (typeof cachedImage === 'string' && cachedImage.includes('unsplash.com')) {
        return makaraWebp
      }
      return cachedImage
    }
    
    // Ürünün kendi image alanını kontrol et
    if (product.image) {
      if (typeof product.image === 'string' && product.image.includes('unsplash.com')) {
        return makaraWebp
      }
      return product.image
    }
    if (product.imageUrl) {
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

  // Ürünü sepete ekle
  const handleAddToCart = (product) => {
    onAddToCart(product)
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
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
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
        <div className="p-4 border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
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
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl border-2 border-gray-100 hover:border-rose-300 transition-all overflow-hidden cursor-pointer group"
                    onClick={() => handleAddToCart(product)}
                  >
                    {/* Ürün görseli */}
                    <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={getProductImage(product, categories.find(c => c.id === selectedCategory)?.name || '')}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          if (e.target.src !== makaraWebp) {
                            e.target.src = makaraWebp
                          }
                        }}
                      />
                      {cartQuantity > 0 && (
                        <div className="absolute top-2 right-2 bg-rose-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                          {cartQuantity}
                        </div>
                      )}
                    </div>

                    {/* Ürün bilgileri */}
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      {product.price && (
                        <p className="text-rose-600 font-bold">
                          {typeof product.price === 'number' 
                            ? `${product.price.toFixed(2)} ₺`
                            : product.price
                          }
                        </p>
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
