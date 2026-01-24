import { useState, useEffect, useRef } from 'react'
import { GoogleMap, LoadScript, Marker, Circle, Autocomplete, OverlayView } from '@react-google-maps/api'
import { MapPin, Navigation, Search } from 'lucide-react'

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyBOAUUi6M_1eqBrCqeOTN0ZXvGkCOG7VDc'

// Google Maps kütüphaneleri
const libraries = ['places']

// Kafe koordinatları
const RESTAURANT_LAT = 37.86225866037972
const RESTAURANT_LNG = 32.47138873014679
const MAX_DELIVERY_DISTANCE_KM = 7

// Haversine formülü ile mesafe hesaplama
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

// Harita stilleri
const mapContainerStyle = {
  width: '100%',
  height: '100%',
}

const defaultMapOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
}

export default function LocationPicker({ onLocationSelect, selectedLocation, isWithinRange }) {
  const [userLocation, setUserLocation] = useState(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG })
  const [mapZoom, setMapZoom] = useState(11.5)
  const [autocomplete, setAutocomplete] = useState(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const mapRef = useRef(null)

  // Autocomplete yüklendiğinde
  const onLoadAutocomplete = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance)
  }

  // Yer seçildiğinde
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        const address = place.formatted_address || place.name || ''
        
        setUserLocation({ lat, lng })
        
        // Hem kafe hem de seçilen yeri gösterecek şekilde haritayı ayarla
        if (mapRef.current) {
          const bounds = new window.google.maps.LatLngBounds()
          bounds.extend({ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG })
          bounds.extend({ lat, lng })
          mapRef.current.fitBounds(bounds)
          
          // Zoom çok fazla yakınlaşmasın diye limit koy
          setTimeout(() => {
            if (mapRef.current.getZoom() > 13) {
              mapRef.current.setZoom(13)
            }
          }, 100)
        } else {
          // Map ref yoksa manuel center ve zoom ayarla
          const centerLat = (RESTAURANT_LAT + lat) / 2
          const centerLng = (RESTAURANT_LNG + lng) / 2
          setMapCenter({ lat: centerLat, lng: centerLng })
          setMapZoom(12)
        }
        
        handleLocationChange(lat, lng, address)
      }
    }
  }

  // Tarayıcı konumunu al
  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    
    if (!navigator.geolocation) {
      alert('Tarayıcınız konum servisini desteklemiyor.')
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setUserLocation({ lat, lng })
        
        // Hem kafe hem de kullanıcı konumunu gösterecek şekilde haritayı ayarla
        if (mapRef.current) {
          const bounds = new window.google.maps.LatLngBounds()
          bounds.extend({ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG })
          bounds.extend({ lat, lng })
          mapRef.current.fitBounds(bounds)
          
          setTimeout(() => {
            if (mapRef.current.getZoom() > 13) {
              mapRef.current.setZoom(13)
            }
          }, 100)
        } else {
          const centerLat = (RESTAURANT_LAT + lat) / 2
          const centerLng = (RESTAURANT_LNG + lng) / 2
          setMapCenter({ lat: centerLat, lng: centerLng })
          setMapZoom(12)
        }
        
        handleLocationChange(lat, lng)
        setIsGettingLocation(false)
      },
      (error) => {
        console.error('Konum hatası:', error)
        setIsGettingLocation(false)
        
        if (error.code === error.PERMISSION_DENIED) {
          alert('Konum izni gereklidir. Lütfen tarayıcı ayarlarınızdan konum iznini açın.')
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          alert('Konum bilgisi alınamadı. Lütfen konum servisinizin açık olduğundan emin olun.')
        } else {
          alert('Konum alınamadı. Lütfen haritadan konumunuzu seçin.')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  // Haritaya tıklanınca
  const handleMapClick = (e) => {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    setUserLocation({ lat, lng })
    
    // Hem kafe hem de tıklanan yeri gösterecek şekilde haritayı ayarla
    if (mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend({ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG })
      bounds.extend({ lat, lng })
      mapRef.current.fitBounds(bounds)
      
      setTimeout(() => {
        if (mapRef.current.getZoom() > 13) {
          mapRef.current.setZoom(13)
        }
      }, 100)
    }
    
    handleLocationChange(lat, lng)
  }

  // Konum değiştiğinde mesafe kontrolü yap
  const handleLocationChange = (lat, lng, address = '') => {
    if (!lat || !lng) return

    const distance = calculateDistance(RESTAURANT_LAT, RESTAURANT_LNG, lat, lng)
    const withinRange = distance <= MAX_DELIVERY_DISTANCE_KM

    onLocationSelect({
      lat,
      lng,
      distance: distance.toFixed(2),
      withinRange,
      address
    })
  }

  // Seçili konum değiştiğinde haritayı güncelle
  useEffect(() => {
    if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      setUserLocation({ lat: selectedLocation.lat, lng: selectedLocation.lng })
      setMapCenter({ lat: selectedLocation.lat, lng: selectedLocation.lng })
    }
  }, [selectedLocation])

  return (
    <LoadScript 
      googleMapsApiKey={GOOGLE_MAPS_API_KEY} 
      libraries={libraries}
      onLoad={() => setIsScriptLoaded(true)}
    >
      <div className="space-y-4">
        {/* Arama ve Konum Butonları */}
        <div className="flex flex-col gap-3">
          {/* Yer Arama */}
          <div className="relative">
            <Autocomplete
              onLoad={onLoadAutocomplete}
              onPlaceChanged={onPlaceChanged}
              options={{
                componentRestrictions: { country: 'tr' },
                fields: ['geometry', 'name', 'formatted_address']
              }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Adres, mahalle veya sokak ara..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </Autocomplete>
          </div>

          {/* Konumumu Kullan Butonu */}
          <button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Navigation className={`w-5 h-5 ${isGettingLocation ? 'animate-spin' : ''}`} />
            {isGettingLocation ? 'Konum Alınıyor...' : 'Konumumu Kullan'}
          </button>
        </div>

        {/* Harita */}
        <div className="relative h-80 rounded-xl overflow-hidden border-2 border-gray-200">
          {!isScriptLoaded || !isMapLoaded ? (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Harita yükleniyor...</p>
              </div>
            </div>
          ) : null}
          
          {isScriptLoaded && (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={mapZoom}
              options={defaultMapOptions}
              onClick={handleMapClick}
              onLoad={(map) => {
                mapRef.current = map
                setIsMapLoaded(true)
              }}
            >
              {/* Kafe konumu (Kırmızı marker) */}
              <Marker
                position={{ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG }}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  scaledSize: window.google?.maps ? new window.google.maps.Size(40, 40) : undefined
                }}
                title="Makara Kafe"
              />

              {/* Teslimat alanı (7 km daire) */}
              <Circle
                center={{ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG }}
                radius={MAX_DELIVERY_DISTANCE_KM * 1000}
                options={{
                  strokeColor: '#10b981',
                  strokeOpacity: 0.9,
                  strokeWeight: 3,
                  fillColor: '#10b981',
                  fillOpacity: 0.2,
                }}
              />

              {/* Teslimat alanı yazısı */}
              <OverlayView
                position={{ 
                  lat: RESTAURANT_LAT + 0.02, 
                  lng: RESTAURANT_LNG 
                }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div style={{
                  position: 'absolute',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(16, 185, 129, 0.9)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(8px)',
                  pointerEvents: 'none',
                  zIndex: 10,
                  letterSpacing: '0.3px'
                }}>
                  🚚 Bu Alanlara Hizmet Verebilmekteyiz
                </div>
              </OverlayView>

              {/* Kullanıcı konumu (Mavi marker) */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    scaledSize: window.google?.maps ? new window.google.maps.Size(40, 40) : undefined
                  }}
                  title="Konumunuz"
                />
              )}
            </GoogleMap>
          )}
        </div>

        {/* Mesafe bilgisi */}
        {selectedLocation && (
          <div className={`p-3 rounded-xl ${
            isWithinRange 
              ? 'bg-green-50 border-2 border-green-200' 
              : 'bg-red-50 border-2 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              <MapPin className={`w-5 h-5 ${isWithinRange ? 'text-green-600' : 'text-red-600'}`} />
              <div className="flex-1">
                {isWithinRange ? (
                  <p className="text-sm font-medium text-green-800">
                    ✓ Teslimat alanı içindesiniz ({selectedLocation.distance} km)
                  </p>
                ) : (
                  <p className="text-sm font-medium text-red-800">
                    ✗ Teslimat alanı dışındasınız ({selectedLocation.distance} km)
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bilgilendirme */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800 text-center leading-relaxed">
            💡 <strong>İpucu:</strong> Yukarıdaki arama kutusuna adresinizi yazabilir, haritaya tıklayabilir veya "Konumumu Kullan" butonuna basabilirsiniz.
          </p>
        </div>
      </div>
    </LoadScript>
  )
}
