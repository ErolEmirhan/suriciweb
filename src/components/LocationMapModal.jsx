import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api'
import { X, Navigation, MapPin, Search, Store } from 'lucide-react'

const RESTAURANT_LAT = 37.86225866037972
const RESTAURANT_LNG = 32.47138873014679
const MAX_DELIVERY_KM = 7

// Konya sınırları – modal içi aramada sadece Konya
const KONYA_BOUNDS = { north: 38.15, south: 37.50, east: 32.85, west: 32.15 }

const mapContainerStyle = { width: '100%', height: '100%' }

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// 7 km daire içinde düzgün dağılımlı rastgele nokta (mesafe + yön formülü)
const getRandomPointInCircle = () => {
  const R = 6371000 // metre
  const rKm = MAX_DELIVERY_KM * Math.sqrt(Math.random())
  const d = rKm * 1000
  const bearing = 2 * Math.PI * Math.random()
  const φ1 = (RESTAURANT_LAT * Math.PI) / 180
  const λ1 = (RESTAURANT_LNG * Math.PI) / 180
  const φ2 = Math.asin(Math.sin(φ1) * Math.cos(d / R) + Math.cos(φ1) * Math.sin(d / R) * Math.cos(bearing))
  const λ2 = λ1 + Math.atan2(Math.sin(bearing) * Math.sin(d / R) * Math.cos(φ1), Math.cos(d / R) - Math.sin(φ1) * Math.sin(φ2))
  return { lat: (φ2 * 180) / Math.PI, lng: (λ2 * 180) / Math.PI }
}

export default function LocationMapModal({ isOpen, onClose, onConfirm, initialCoords }) {
  const [userLocation, setUserLocation] = useState(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [showOutOfRangePopup, setShowOutOfRangePopup] = useState(false)
  const mapRef = useRef(null)
  const circleRef = useRef(null)
  const autocompleteRef = useRef(null)

  useEffect(() => {
    if (isOpen) setShowOutOfRangePopup(false)
  }, [isOpen])

  // initialCoords → userLocation: paint’ten önce set et (mavi iğne “Mevcut konumu kullan” ile hemen görünsün)
  useLayoutEffect(() => {
    if (isOpen && initialCoords) {
      setUserLocation({ lat: initialCoords.lat, lng: initialCoords.lng })
    } else if (isOpen && !initialCoords) {
      setUserLocation(null)
    }
  }, [isOpen, initialCoords])

  useEffect(() => {
    if (!isOpen) {
      setIsMapLoaded(false)
      if (circleRef.current) {
        circleRef.current.setMap(null)
        circleRef.current = null
      }
    }
  }, [isOpen])

  const fitMapToShowBoth = (position) => {
    const pos = position || userLocation || (initialCoords ? { lat: initialCoords.lat, lng: initialCoords.lng } : null)
    if (!mapRef.current || !pos) return
    const bounds = new window.google.maps.LatLngBounds()
    bounds.extend({ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG })
    bounds.extend(pos)
    mapRef.current.fitBounds(bounds)
    setTimeout(() => {
      if (mapRef.current && mapRef.current.getZoom() > 12) {
        mapRef.current.setZoom(12)
      }
    }, 200)
  }

  useEffect(() => {
    const pos = userLocation || (initialCoords ? { lat: initialCoords.lat, lng: initialCoords.lng } : null)
    if (isMapLoaded && pos) fitMapToShowBoth(pos)
  }, [isMapLoaded, userLocation?.lat, userLocation?.lng, initialCoords?.lat, initialCoords?.lng])

  const handleMapClick = (e) => {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    setUserLocation({ lat, lng })
  }

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    if (!navigator.geolocation) {
      alert('Tarayıcınız konum servisini desteklemiyor.')
      setIsGettingLocation(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const next = { lat, lng }
        setUserLocation(next)
        setIsGettingLocation(false)
        // Harita hemen yeni konuma gitsin (mavi iğne görünsün)
        if (mapRef.current && typeof window !== 'undefined' && window.google?.maps) {
          const bounds = new window.google.maps.LatLngBounds()
          bounds.extend({ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG })
          bounds.extend(next)
          mapRef.current.fitBounds(bounds)
          const z = mapRef.current.getZoom()
          if (z > 12) mapRef.current.setZoom(12)
        }
      },
      (err) => {
        setIsGettingLocation(false)
        if (err.code === err.PERMISSION_DENIED) {
          alert('Konum izni gereklidir. Lütfen tarayıcı ayarlarınızdan konum iznini açın.')
        } else {
          alert('Konum alınamadı. Lütfen haritadan konumunuzu seçin.')
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const handleConfirm = () => {
    const pos = userLocation || (initialCoords ? { lat: initialCoords.lat, lng: initialCoords.lng } : null)
    if (!pos) return
    const dist = calculateDistance(RESTAURANT_LAT, RESTAURANT_LNG, pos.lat, pos.lng)
    const withinRange = dist <= MAX_DELIVERY_KM

    if (!withinRange) {
      setShowOutOfRangePopup(true)
      return
    }

    const payload = {
      lat: pos.lat,
      lng: pos.lng,
      distance: dist.toFixed(2),
      withinRange: true,
      address: ''
    }
    if (typeof window !== 'undefined' && window.google?.maps) {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ location: { lat: pos.lat, lng: pos.lng } }, (results, status) => {
        if (status === 'OK' && results?.[0]) payload.address = results[0].formatted_address || ''
        onConfirm(payload)
        onClose()
      })
    } else {
      onConfirm(payload)
      onClose()
    }
  }

  const handleAnladim = () => {
    setUserLocation(getRandomPointInCircle())
    setShowOutOfRangePopup(false)
  }

  // Arama ile seçilen konum da dahil: iğne her zaman görünsün (userLocation veya initialCoords)
  const pinPosition = userLocation || (initialCoords ? { lat: initialCoords.lat, lng: initialCoords.lng } : null)

  const handlePlaceSelect = () => {
    const ac = autocompleteRef.current
    if (!ac) return
    const place = ac.getPlace()
    if (!place?.geometry?.location) return
    setUserLocation({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-100 rounded-xl">
                <MapPin className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Teslimat Konumu</h3>
                <p className="text-xs text-gray-500">Haritaya tıklayarak veya mevcut konumunuzu kullanarak seçin</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Search bar */}
          <div className="px-5 pt-3 pb-0">
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
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                />
              </div>
            </Autocomplete>
          </div>

          {/* Map */}
          <div className="relative h-80 bg-gray-100">
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-rose-600 border-t-transparent mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Harita yükleniyor...</p>
                </div>
              </div>
            )}
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={userLocation || { lat: RESTAURANT_LAT, lng: RESTAURANT_LNG }}
              zoom={12}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true
              }}
              onClick={handleMapClick}
              onLoad={(map) => {
                mapRef.current = map
                setIsMapLoaded(true)

                // 7 km daire – doğrudan Google Maps API ile (React Circle bazen haritaya bağlanmıyor)
                if (typeof window !== 'undefined' && window.google?.maps) {
                  if (circleRef.current) {
                    circleRef.current.setMap(null)
                  }
                  circleRef.current = new window.google.maps.Circle({
                    map,
                    center: { lat: RESTAURANT_LAT, lng: RESTAURANT_LNG },
                    radius: MAX_DELIVERY_KM * 1000,
                    clickable: false,
                    strokeColor: '#059669',
                    strokeOpacity: 0.6,
                    strokeWeight: 2,
                    fillColor: '#10b981',
                    fillOpacity: 0.1
                  })
                }

                if (userLocation) fitMapToShowBoth()
              }}
            >
              {/* Kafe: kırmızı iğne (pin) */}
              <Marker
                position={{ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG }}
                icon={
                  typeof window !== 'undefined' && window.google?.maps
                    ? {
                        url: 'https://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png',
                        scaledSize: new window.google.maps.Size(48, 48),
                        anchor: new window.google.maps.Point(24, 48)
                      }
                    : undefined
                }
                title="Makara Kafe"
              />

              {/* 7 km daire: onLoad içinde google.maps.Circle ile çiziliyor */}

              {/* Seçilen konum: mavi işaret (Symbol – harici URL yok, her zaman görünür) */}
              {(userLocation || (initialCoords && typeof initialCoords.lat === 'number' && typeof initialCoords.lng === 'number')) && (
                <Marker
                  key={`pin-${(userLocation || initialCoords).lat}-${(userLocation || initialCoords).lng}`}
                  position={userLocation || { lat: initialCoords.lat, lng: initialCoords.lng }}
                  icon={
                    typeof window !== 'undefined' && window.google?.maps
                      ? {
                          path: window.google.maps.SymbolPath.CIRCLE,
                          scale: 14,
                          fillColor: '#2563EB',
                          fillOpacity: 1,
                          strokeColor: '#1D4ED8',
                          strokeWeight: 2
                        }
                      : undefined
                  }
                  title="Teslimat adresiniz"
                />
              )}
            </GoogleMap>
          </div>

          {/* Distance & Actions */}
          <div className="px-5 py-4 border-t border-gray-200 space-y-3 bg-gray-50/50">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Navigation className={`w-5 h-5 ${isGettingLocation ? 'animate-spin' : ''}`} />
                {isGettingLocation ? 'Konum alınıyor...' : 'Mevcut konumu kullan'}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!pinPosition}
                className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Onayla
              </button>
            </div>
          </div>

          {/* Menzil dışı popup – profesyonel / kurumsal */}
          <AnimatePresence>
            {showOutOfRangePopup && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200"
                >
                  <div className="p-6 sm:p-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 ring-4 ring-amber-100/60">
                      <Store className="w-7 h-7 text-amber-600" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Hizmet Alanı Dışında
                    </h3>
                    <p className="text-slate-600 text-[15px] leading-relaxed mb-6">
                      Üzgünüz, şu anda bulunduğunuz konuma hizmet veremiyoruz. Restoranımıza gelip yiyebilirsiniz.
                    </p>
                    <button
                      type="button"
                      onClick={handleAnladim}
                      className="w-full py-3 px-5 rounded-xl font-semibold text-white bg-slate-800 hover:bg-slate-900 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
                    >
                      Anladım
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
