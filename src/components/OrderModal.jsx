import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, MapPin, CreditCard, Banknote, ShoppingCart, CheckCircle, Phone, Lock } from 'lucide-react'
import { collection, addDoc } from 'firebase/firestore'
import { dbOnline } from '../config/firebaseOnline'
import ProductSelector from './ProductSelector'
import makaraWebp from '../assets/makara.webp'

export default function OrderModal({ isOpen, onClose }) {
  const [showProductSelector, setShowProductSelector] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    paymentMethod: '', // 'card' or 'cash'
    note: '' // Opsiyonel not
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isLocationChecked, setIsLocationChecked] = useState(false)
  const [isWithinRange, setIsWithinRange] = useState(false)
  const [isCheckingLocation, setIsCheckingLocation] = useState(false)
  
  // Restoran koordinatları
  const RESTAURANT_LAT = 37.8623911668319
  const RESTAURANT_LNG = 32.471347381599806
  const SERVICE_RADIUS_KM = 3 // 3km yarıçap

  // Ürünü sepete ekle (order_index'e göre sıralı)
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      let newItems
      if (existingItem) {
        newItems = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newItems = [...prev, { ...product, quantity: 1 }]
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
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === productId) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 }
          }
        }
        return item
      })
    )
  }

  // Toplam fiyatı hesapla
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0
      return total + (price * item.quantity)
    }, 0)
  }

  // İki koordinat arasındaki mesafeyi hesapla (Haversine formülü)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Dünya yarıçapı (km)
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Mesafe (km)
  }

  // Konum kontrolü yap
  const checkLocation = async () => {
    setIsCheckingLocation(true)
    
    try {
      // Konum izni kontrolü
      if (!navigator.geolocation) {
        alert('Tarayıcınız konum servisini desteklemiyor.')
        setIsCheckingLocation(false)
        return false
      }

      // Konum al
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })

      const userLat = position.coords.latitude
      const userLng = position.coords.longitude

      // Mesafeyi hesapla
      const distance = calculateDistance(
        RESTAURANT_LAT,
        RESTAURANT_LNG,
        userLat,
        userLng
      )

      console.log('Kullanıcı konumu:', { lat: userLat, lng: userLng })
      console.log('Restoran konumu:', { lat: RESTAURANT_LAT, lng: RESTAURANT_LNG })
      console.log('Mesafe:', distance.toFixed(2), 'km')

      // 3km içinde mi kontrol et
      const withinRange = distance <= SERVICE_RADIUS_KM
      setIsWithinRange(withinRange)
      setIsLocationChecked(true)
      setIsCheckingLocation(false)

      return withinRange
    } catch (error) {
      console.error('Konum hatası:', error)
      setIsCheckingLocation(false)
      
      if (error.code === error.PERMISSION_DENIED) {
        alert('Konum izni gereklidir. Lütfen tarayıcı ayarlarınızdan konum iznini açın.')
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        alert('Konum bilgisi alınamadı. Lütfen konum servisinizin açık olduğundan emin olun.')
      } else {
        alert('Konum kontrolü yapılamadı. Lütfen tekrar deneyin.')
      }
      
      return false
    }
  }

  // KONUM KONTROLÜ ŞİMDİLİK DEVRE DIŞI
  // Modal kapandığında state'i sıfırla
  // useEffect(() => {
  //   if (!isOpen) {
  //     setIsLocationChecked(false)
  //     setIsWithinRange(false)
  //     setIsCheckingLocation(false)
  //   }
  // }, [isOpen])

  // Siparişi gönder
  const handleSubmitOrder = async () => {
    // KONUM KONTROLÜ ŞİMDİLİK DEVRE DIŞI - SONRA AKTİF EDİLECEK
    // Önce konum kontrolü yap (sadece butona basıldığında)
    // if (!isLocationChecked) {
    //   const withinRange = await checkLocation()
    //   if (!withinRange) {
    //     // Menzil dışındaysa işlemi durdur
    //     return
    //   }
    // } else if (!isWithinRange) {
    //   // Konum kontrolü yapıldıysa ve menzil dışındaysa
    //   return
    // }

    // Form validasyonu - daha sıkı kontrol
    const errors = []
    
    if (!formData.name || !formData.name.trim()) {
      errors.push('İsim soyisim zorunludur.')
    }
    if (!formData.address || !formData.address.trim()) {
      errors.push('Adres zorunludur.')
    }
    if (!formData.phone || !formData.phone.trim()) {
      errors.push('Telefon numarası zorunludur.')
    }
    if (cartItems.length === 0) {
      errors.push('Sepette en az bir ürün bulunmalıdır.')
    }
    if (!formData.paymentMethod) {
      errors.push('Ödeme yöntemi seçilmelidir.')
    }

    if (errors.length > 0) {
      alert(errors.join('\n'))
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        paymentMethod: formData.paymentMethod,
        note: formData.note.trim() || null, // Not varsa kaydet, yoksa null
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || item.imageUrl || null
        })),
        total: calculateTotal(),
        status: 'pending',
        createdAt: new Date(),
        timestamp: Date.now()
      }

      console.log('Sipariş gönderiliyor...', orderData)

      // Firebase'e kaydet
      const docRef = await addDoc(collection(dbOnline, 'orders'), orderData)
      console.log('Sipariş başarıyla kaydedildi:', docRef.id)

      // Formu temizle
      setFormData({
        name: '',
        address: '',
        phone: '',
        paymentMethod: '',
        note: ''
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

  return (
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
        {/* KONUM KONTROLÜ ŞİMDİLİK DEVRE DIŞI */}
        {/* Konum kontrolü yapıldıysa ve menzil dışındaysa overlay göster */}
        {/* {isLocationChecked && !isWithinRange && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center rounded-2xl">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="text-center px-6 relative z-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="mb-6 flex justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
                  <Lock className="w-24 h-24 text-red-600 relative z-10" strokeWidth={1.5} />
                </div>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-red-600 mb-3"
              >
                Üzgünüz
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-red-500 font-medium mb-2"
              >
                Adresinize hizmet vermiyoruz
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed"
              >
                Şu anda sadece restoranımızın 3 km yarıçapındaki bölgelere hizmet verebiliyoruz. 
                Lütfen daha sonra tekrar deneyin veya restoranımıza gelerek siparişinizi verebilirsiniz.
              </motion.p>
            </motion.div>
          </div>
        )} */}

        {/* Konum kontrol ediliyor */}
        {/* {isCheckingLocation && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-40 flex items-center justify-center rounded-2xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Konumunuz kontrol ediliyor...</p>
            </div>
          </div>
        )} */}
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

              {/* Adres */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Adres *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Adresinizi giriniz veya haritadan seçiniz"
                />
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
                  onClick={() => setShowProductSelector(true)}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition-colors flex items-center gap-2"
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
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      {/* Ürün görseli */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        <img
                          src={item.image || item.imageUrl || makaraWebp}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            if (e.target.src !== makaraWebp) {
                              e.target.src = makaraWebp
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-rose-600 font-bold">
                          {typeof item.price === 'number' 
                            ? `${item.price.toFixed(2)} ₺`
                            : item.price
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
                  ))}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Toplam:</span>
                      <span className="text-xl font-bold text-rose-600">
                        {calculateTotal().toFixed(2)} ₺
                      </span>
                    </div>
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
                  <span className="font-medium">Kart</span>
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
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
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

      {/* Ürün Seçici Modal */}
      <AnimatePresence>
        {showProductSelector && (
          <ProductSelector
            onClose={() => setShowProductSelector(false)}
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
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
