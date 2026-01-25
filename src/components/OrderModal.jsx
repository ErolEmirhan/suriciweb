import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, MapPin, CreditCard, Banknote, ShoppingCart, CheckCircle, Phone, Lock, Search, Navigation, Package } from 'lucide-react'
import { LoadScript, Autocomplete } from '@react-google-maps/api'
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore'
import { dbOnline } from '../config/firebaseOnline'
import ProductSelector from './ProductSelector'
import LocationMapModal from './LocationMapModal'
import makaraWebp from '../assets/makara.webp'

const GOOGLE_MAPS_API_KEY = 'AIzaSyBOAUUi6M_1eqBrCqeOTN0ZXvGkCOG7VDc'

// Konya sınırları – adres aramada sadece Konya çıksın (elitkent sitesi → Konya, İstanbul değil)
const KONYA_BOUNDS = {
  north: 38.15,
  south: 37.50,
  east: 32.85,
  west: 32.15
}

export default function OrderModal({ isOpen, onClose }) {
  const [showProductSelector, setShowProductSelector] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    paymentMethod: '',
    note: '',
    deliveryInstructions: '' // Adres tarifi (kapı, bina, kat, yol tarifi)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isWithinRange, setIsWithinRange] = useState(false)
  const [showLocationMapModal, setShowLocationMapModal] = useState(false)
  const [mapModalInitialCoords, setMapModalInitialCoords] = useState(null)
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false)
  const autocompleteRef = useRef(null)
  const [minimumOrderAmount, setMinimumOrderAmount] = useState(0)
  const [onlineProducts, setOnlineProducts] = useState({}) // Ürün ID'lerine göre online fiyat ve stok bilgisi
  const [isActive, setIsActive] = useState(true) // Online sipariş aktif mi?
  const [isLoadingSettings, setIsLoadingSettings] = useState(true) // Settings yükleniyor mu?
  
  // Restoran koordinatları
  const RESTAURANT_LAT = 37.86225866037972
  const RESTAURANT_LNG = 32.47138873014679
  const SERVICE_RADIUS_KM = 7 // 7km yarıçap

  // Firebase Online'dan settings ve products çek
  useEffect(() => {
    if (!isOpen) return

    const fetchOnlineData = async () => {
      try {
        setIsLoadingSettings(true)
        
        // active koleksiyonundan is_active kontrolü yap
        const activeRef = collection(dbOnline, 'active')
        const activeSnapshot = await getDocs(activeRef)
        
        if (!activeSnapshot.empty) {
          // İlk belgeyi al (genellikle tek belge olur)
          const activeDoc = activeSnapshot.docs[0]
          const activeData = activeDoc.data()
          setIsActive(activeData.is_active === true)
        } else {
          setIsActive(false) // Belge yoksa kapalı kabul et
        }
        
        // Settings'ten minimum sepet tutarını çek
        // settings koleksiyonunda minimum_order_amount belgesi var, içinde amount alanı var
        const settingsRef = doc(dbOnline, 'settings', 'minimum_order_amount')
        const settingsSnap = await getDoc(settingsRef)
        if (settingsSnap.exists()) {
          const settingsData = settingsSnap.data()
          setMinimumOrderAmount(settingsData.amount || 0)
        }

        // Products koleksiyonundan online fiyat ve stok bilgilerini çek
        const productsRef = collection(dbOnline, 'products')
        const productsSnapshot = await getDocs(productsRef)
        const productsMap = {}
        
        productsSnapshot.docs.forEach(doc => {
          const productData = doc.data()
          productsMap[doc.id] = {
            online_price: productData.online_price || productData.price || 0,
            is_out_of_stock_online: productData.is_out_of_stock_online === true
          }
        })
        
        setOnlineProducts(productsMap)
      } catch (error) {
        console.error('Online veriler yüklenirken hata:', error)
        setIsActive(false) // Hata durumunda kapalı kabul et
      } finally {
        setIsLoadingSettings(false)
      }
    }

    fetchOnlineData()
  }, [isOpen])

  // Paket servis ücreti (online siparişte sepette menü fiyatları + bu ücret)
  const PAKET_SERVIS_UCRETI = 100

  // Ürünü sepete ekle (order_index'e göre sıralı) – menü fiyatları kullanılır, online özel fiyat yok
  const handleAddToCart = (product) => {
    const onlineProduct = onlineProducts[product.id]
    
    // Stok kontrolü - is_out_of_stock_online true ise ürün tükendi
    if (onlineProduct && onlineProduct.is_out_of_stock_online === true) {
      alert('Bu ürün şu anda stokta bulunmamaktadır.')
      return
    }

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      let newItems
      
      // Menü fiyatı (product.price) – online özel fiyat kullanılmıyor
      const productPrice = product.price
      
      if (existingItem) {
        newItems = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, price: productPrice }
            : item
        )
      } else {
        newItems = [...prev, { 
          ...product, 
          quantity: 1,
          price: productPrice // Menü fiyatı (product.price)
        }]
      }
      // order_index'e göre sırala
      return newItems.sort((a, b) => {
        const aOrder = a.order_index ?? a.order ?? 999
        const bOrder = b.order_index ?? b.order ?? 999
        if (aOrder !== bOrder) return aOrder - bOrder
        return (a.name || '').localeCompare(b.name || '', 'tr')
      })
    })
  }

  // Sepetten ürün çıkar
  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  // Ürün miktarını artır
  const handleIncreaseQuantity = (productId) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  // Ürün miktarını azalt
  const handleDecreaseQuantity = (productId) => {
    setCartItems(prev => {
      const item = prev.find(item => item.id === productId)
      if (item && item.quantity > 1) {
        // Miktar 1'den fazlaysa azalt
        return prev.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      } else if (item && item.quantity === 1) {
        // Miktar 1 ise, sepette tamamen çıkar
        return prev.filter(item => item.id !== productId)
      }
      return prev
    })
  }

  // Toplam fiyatı hesapla
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0
      return total + (price * item.quantity)
    }, 0)
  }

  const handleLocationConfirm = (location) => {
    setSelectedLocation(location)
    setIsWithinRange(location.withinRange)
    setFormData(prev => ({ ...prev, address: location.address || prev.address }))
    setShowLocationMapModal(false)
  }

  const handlePlaceSelect = () => {
    const ac = autocompleteRef.current
    if (!ac) return
    const place = ac.getPlace()
    if (!place?.geometry?.location) return
    const lat = place.geometry.location.lat()
    const lng = place.geometry.location.lng()
    const address = place.formatted_address || place.name || ''
    setFormData(prev => ({ ...prev, address: address || prev.address }))
    setMapModalInitialCoords({ lat, lng })
    setShowLocationMapModal(true)
  }

  const handleUseCurrentLocation = () => {
    setIsGettingCurrentLocation(true)
    if (!navigator.geolocation) {
      alert('Tarayıcınız konum servisini desteklemiyor.')
      setIsGettingCurrentLocation(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setMapModalInitialCoords({ lat, lng })
        setShowLocationMapModal(true)
        setIsGettingCurrentLocation(false)
      },
      (err) => {
        setIsGettingCurrentLocation(false)
        if (err.code === err.PERMISSION_DENIED) {
          alert('Konum izni gereklidir. Lütfen tarayıcı ayarlarınızdan konum iznini açın.')
        } else {
          alert('Konum alınamadı. Lütfen adres araması veya haritadan seçim yapın.')
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  useEffect(() => {
    if (!isOpen) {
      setSelectedLocation(null)
      setIsWithinRange(false)
      setShowLocationMapModal(false)
      setMapModalInitialCoords(null)
    }
  }, [isOpen])

  const handleSubmitOrder = async () => {
    if (!selectedLocation) {
      alert('Lütfen teslimat adresi seçin. Adres araması yapıp haritadan onaylayın veya "Mevcut konumu kullan" butonunu kullanın.')
      return
    }
    if (!isWithinRange) {
      alert('Üzgünüz, seçtiğiniz adres hizmet alanımızın dışındadır. (Maksimum teslimat: 7 km – kuş uçumu)')
      return
    }

    const errors = []
    if (!formData.name?.trim()) errors.push('İsim soyisim zorunludur.')
    if (!formData.address?.trim()) errors.push('Teslimat adresi zorunludur.')
    if (!formData.phone || !formData.phone.trim()) {
      errors.push('Telefon numarası zorunludur.')
    }
    if (cartItems.length === 0) {
      errors.push('Sepette en az bir ürün bulunmalıdır.')
    }
    if (!formData.paymentMethod) {
      errors.push('Ödeme yöntemi seçilmelidir.')
    }

    // Minimum sepet tutarı kontrolü
    const total = calculateTotal()
    if (minimumOrderAmount > 0 && total < minimumOrderAmount) {
      const missingAmount = minimumOrderAmount - total
      errors.push(`Minimum sepet tutarı ${minimumOrderAmount.toFixed(2)} ₺'dir. Sepetinize ${missingAmount.toFixed(2)} ₺ değerinde daha ürün eklemelisiniz.`)
    }

    // Stok kontrolü - sepetteki ürünlerin stokta olup olmadığını kontrol et
    for (const item of cartItems) {
      const onlineProduct = onlineProducts[item.id]
      if (onlineProduct && onlineProduct.is_out_of_stock_online === true) {
        errors.push(`${item.name} ürünü artık stokta bulunmamaktadır. Lütfen sepetten çıkarın.`)
      }
    }

    if (errors.length > 0) {
      alert(errors.join('\n'))
      return
    }

    setIsSubmitting(true)

    try {
      const adresTarifi = formData.deliveryInstructions?.trim() || ''
      const adres = [formData.address.trim(), adresTarifi].filter(Boolean).join(' | ')

      const orderData = {
        name: formData.name.trim(),
        address: adres,
        phone: formData.phone.trim(),
        paymentMethod: formData.paymentMethod,
        note: formData.note.trim() || null,
        location: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          distance: selectedLocation.distance
        },
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || item.imageUrl || null
        })),
        subtotal: calculateTotal(),
        paket_servis_ucreti: PAKET_SERVIS_UCRETI,
        total: calculateTotal() + PAKET_SERVIS_UCRETI,
        status: 'pending',
        createdAt: new Date(),
        timestamp: Date.now()
      }

      console.log('Sipariş gönderiliyor...', orderData)

      // Firebase'e kaydet
      const docRef = await addDoc(collection(dbOnline, 'orders'), orderData)
      console.log('Sipariş başarıyla kaydedildi:', docRef.id)

      setFormData({
        name: '',
        address: '',
        phone: '',
        paymentMethod: '',
        note: '',
        deliveryInstructions: ''
      })
      setCartItems([])
      setIsSubmitting(false)
      
      // Başarı modal'ını göster
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Sipariş gönderilirken hata:', error)
      console.error('Hata detayları:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      })
      alert(`Sipariş gönderilirken bir hata oluştu: ${error.message}\nLütfen tekrar deneyiniz.`)
      setIsSubmitting(false)
    }
  }

  // Eğer modal kapalıysa ve sayfa olarak kullanılmıyorsa hiçbir şey gösterme
  if (!isOpen) return null

  // Settings yükleniyorsa loading göster
  if (isLoadingSettings) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </motion.div>
      </motion.div>
    )
  }

  // Online sipariş aktif değilse hizmete kapalı mesajı göster
  if (!isActive) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
        >
          <div className="p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
                <Lock className="w-16 h-16 text-red-600 relative z-10" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Online Sipariş Kapalı
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Şu anda online sipariş hizmetimiz geçici olarak kapalıdır. 
              Lütfen daha sonra tekrar deneyin veya restoranımıza gelerek siparişinizi verebilirsiniz.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-rose-600 text-white py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors"
            >
              Tamam
            </button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
        <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
      >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-pink-50">
            <h2 className="text-2xl font-bold text-gray-900">Online Sipariş</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/80 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Form Alanları */}
            <div className="space-y-4">
              {/* İsim Soyisim */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İsim Soyisim *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Adınız ve soyadınız"
                />
              </div>

              {/* Teslimat Adresi */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Teslimat Adresi *
                </label>

                <Autocomplete
                  onLoad={(ac) => { autocompleteRef.current = ac }}
                  onPlaceChanged={handlePlaceSelect}
                  options={{
                    bounds: KONYA_BOUNDS,
                    strictBounds: true,
                    componentRestrictions: { country: 'tr' },
                    fields: ['geometry', 'name', 'formatted_address']
                  }}
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Adres veya yer ara..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                </Autocomplete>

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isGettingCurrentLocation}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Navigation className={`w-5 h-5 ${isGettingCurrentLocation ? 'animate-spin' : ''}`} />
                  {isGettingCurrentLocation ? 'Konum alınıyor...' : 'Mevcut konumu kullan'}
                </button>

                {selectedLocation && (
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 shadow-sm">
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                      <CheckCircle className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-0.5">Seçilen konum</p>
                      <p className="text-sm font-medium text-slate-800 leading-snug">{formData.address || 'Adres seçildi'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMapModalInitialCoords({ lat: selectedLocation.lat, lng: selectedLocation.lng })
                        setShowLocationMapModal(true)
                      }}
                      className="flex-shrink-0 py-2 px-3.5 text-sm font-semibold text-emerald-700 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 hover:border-emerald-400 transition-colors"
                    >
                      Değiştir
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adres tarifi</label>
                  <textarea
                    value={formData.deliveryInstructions}
                    onChange={(e) => setFormData({ ...formData, deliveryInstructions: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                    placeholder="Kapı kodu, bina no, kat, yol tarifi vb. (opsiyonel)"
                    rows={2}
                  />
                </div>
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon Numarası *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="05XX XXX XX XX"
                />
              </div>
            </div>

            {/* Sepet */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Sepet
                </h3>
                <button
                  onClick={() => {
                    if (!selectedLocation) {
                      alert('Lütfen önce teslimat adresi seçin. Adres arayıp haritadan onaylayın veya "Mevcut konumu kullan"ı deneyin.')
                      return
                    }
                    setShowProductSelector(true)
                  }}
                  disabled={!selectedLocation}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Ürün Ekle
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Sepetiniz boş</p>
                  <p className="text-sm mt-1">Ürün eklemek için yukarıdaki butona tıklayın</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const onlineProduct = onlineProducts[item.id]
                    const isOutOfStock = onlineProduct?.is_out_of_stock_online === true
                    // Menü fiyatı (online özel fiyat yok)
                    const displayPrice = item.price
                    
                    return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        isOutOfStock ? 'bg-red-50 border-2 border-red-200' : 'bg-gray-50'
                      }`}
                    >
                      {/* Ürün görseli */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        <img
                          src={item.image || item.imageUrl || makaraWebp}
                          alt={item.name}
                          className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                          onError={(e) => {
                            if (e.target.src !== makaraWebp) {
                              e.target.src = makaraWebp
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-semibold ${isOutOfStock ? 'text-red-600' : 'text-gray-900'}`}>
                            {item.name}
                          </h4>
                          {isOutOfStock && (
                            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">
                              Tükendi
                            </span>
                          )}
                        </div>
                        <p className={`text-sm font-bold ${isOutOfStock ? 'text-red-600' : 'text-rose-600'}`}>
                          {typeof displayPrice === 'number' 
                            ? `${displayPrice.toFixed(2)} ₺`
                            : displayPrice
                          } x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDecreaseQuantity(item.id)}
                          className="p-1 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleIncreaseQuantity(item.id)}
                          className="p-1 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="p-1 bg-red-50 rounded-lg hover:bg-red-100 transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    )
                  })}
                  <div className="border-t border-slate-200 pt-4 mt-4 space-y-3">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-sm font-medium">Ara Toplam</span>
                      <span className="font-semibold">{calculateTotal().toFixed(2)} ₺</span>
                    </div>
                    {/* Paket Servis Ücreti - 100 ₺ */}
                    <div className="flex justify-between items-center gap-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-slate-50 to-zinc-50 border border-slate-200/80 shadow-sm">
                      <span className="text-sm font-semibold text-slate-800 flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/80 border border-slate-200 shadow-sm">
                          <Package className="w-4 h-4 text-slate-600" strokeWidth={2} />
                        </span>
                        100 ₺ Paket Servis Ücreti
                      </span>
                      <span className="font-bold text-slate-900 tabular-nums">100,00 ₺</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <span className="text-base font-semibold text-gray-900">Ödenecek Tutar</span>
                      <span className="text-xl font-bold text-rose-600 tabular-nums">
                        {(calculateTotal() + PAKET_SERVIS_UCRETI).toFixed(2)} ₺
                      </span>
                    </div>
                    {minimumOrderAmount > 0 && (
                      <div className={`text-sm font-medium ${
                        calculateTotal() >= minimumOrderAmount 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {calculateTotal() >= minimumOrderAmount ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Minimum sepet tutarı karşılandı
                          </span>
                        ) : (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-700 font-semibold mb-1">
                              Minimum sepet tutarı: {minimumOrderAmount.toFixed(2)} ₺
                            </p>
                            <p className="text-red-600">
                              Sepetinize <span className="font-bold">{(minimumOrderAmount - calculateTotal()).toFixed(2)} ₺</span> değerinde daha ürün eklemelisiniz.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Ödeme Yöntemi */}
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Ödeme Yöntemi *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                    formData.paymentMethod === 'card'
                      ? 'border-rose-600 bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">Kapıda Kredi Kartı</span>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                    formData.paymentMethod === 'cash'
                      ? 'border-rose-600 bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span className="font-medium">Nakit</span>
                </button>
              </div>
            </div>

            {/* Not Alanı */}
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Eklemek istediğiniz not var mı?
                <span className="text-gray-400 font-normal ml-1">(Opsiyonel)</span>
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Özel istekleriniz, notlarınız veya ek bilgilerinizi buraya yazabilirsiniz..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {formData.note.length}/500 karakter
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
            {/* Minimum tutar kontrolü - butonun üstünde göster */}
            {minimumOrderAmount > 0 && calculateTotal() < minimumOrderAmount && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-2">
                <p className="text-xs text-red-600 text-center">
                  Sipariş verebilmek için sepetinize <span className="font-bold">{(minimumOrderAmount - calculateTotal()).toFixed(2)} ₺</span> değerinde daha ürün eklemelisiniz.
                </p>
              </div>
            )}
            {!selectedLocation && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2">
                <p className="text-xs text-amber-800 text-center">
                  Teslimat adresi seçin: arama yapıp haritadan onaylayın veya "Mevcut konumu kullan" deyin.
                </p>
              </div>
            )}
            {selectedLocation && !isWithinRange && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                <p className="text-xs text-red-800 text-center font-medium">
                  Seçtiğiniz adres 7 km sınırının dışında; sipariş tamamlanamaz.
                </p>
              </div>
            )}
            
            <button
              onClick={handleSubmitOrder}
              disabled={
                isSubmitting || 
                (minimumOrderAmount > 0 && calculateTotal() < minimumOrderAmount) ||
                !selectedLocation ||
                !isWithinRange
              }
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/50"
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Siparişi Gönder'}
            </button>
            <p className="text-xs text-center text-gray-500">
              Sipariş onayınız için aranacaksınız
            </p>
          </div>
        </motion.div>
      </motion.div>

          <LocationMapModal
            isOpen={showLocationMapModal}
            onClose={() => setShowLocationMapModal(false)}
            onConfirm={handleLocationConfirm}
            initialCoords={mapModalInitialCoords}
          />
        </>
      </LoadScript>

      {/* Ürün Seçici Modal */}
      <AnimatePresence>
        {showProductSelector && (
          <ProductSelector
            onClose={() => setShowProductSelector(false)}
            onAddToCart={handleAddToCart}
            onDecreaseQuantity={handleDecreaseQuantity}
            cartItems={cartItems}
            isOnlineOrder={true}
            onlineProducts={onlineProducts}
          />
        )}
      </AnimatePresence>

      {/* Başarı Modal - Modern ve Profesyonel */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => {
              setShowSuccessModal(false)
              onClose()
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
            >
              {/* Başarı İkonu ve Animasyon */}
              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 200, 
                    damping: 15,
                    delay: 0.1
                  }}
                  className="relative mb-4"
                >
                  {/* Glow efekti */}
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-50 animate-pulse" />
                  
                  {/* Check ikonu */}
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-4 shadow-lg">
                    <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
                  </div>
                  
                  {/* Animasyonlu çemberler */}
                  <motion.div
                    className="absolute inset-0 border-4 border-green-400 rounded-full"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  />
                </motion.div>

                {/* Başlık */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-900 mb-2 text-center"
                >
                  Siparişiniz Alındı!
                </motion.h2>

                {/* Açıklama */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-center text-sm leading-relaxed"
                >
                  Siparişiniz başarıyla kaydedildi
                </motion.p>
              </div>

              {/* İçerik */}
              <div className="p-6 space-y-4">
                {/* Bilgi kutusu */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        Sipariş Onayı
                      </p>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Sipariş onayınız için en kısa sürede sizinle iletişime geçilecektir.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Teşekkür mesajı */}
                <p className="text-center text-sm text-gray-500">
                  Tercih ettiğiniz için teşekkür ederiz! 🎉
                </p>
              </div>

              {/* Kapat Butonu */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    setShowSuccessModal(false)
                    onClose()
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-green-500/50 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Tamam
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
