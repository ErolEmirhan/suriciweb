import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock } from 'lucide-react'

export default function Footer() {

  const quickLinks = [
    { name: 'Anasayfa', path: '/' },
    { name: 'Hakkımızda', path: '/hakkimizda' },
    { name: 'Galeri', path: '/galeri' },
    { name: 'Menü', path: '/menu' },
    { name: 'İletişim', path: '/iletisim' },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"></div>
      
      <div className="container-custom py-16 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Quick Links - Modern Design */}
          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-6 text-white tracking-tight">Sayfalar</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-pink-400 transition-all duration-300 hover:translate-x-2 inline-block text-sm sm:text-base font-medium group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Professional Design */}
          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-6 text-white tracking-tight">İletişim</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-sm p-3 rounded-xl border border-pink-500/30 flex-shrink-0 group-hover:border-pink-400/50 transition-colors">
                  <MapPin className="w-5 h-5 text-pink-400" />
                </div>
                <div className="pt-1">
                  <span className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Havzan Mah. Ebusuhud Efendi Caddesi, NO : 15 / 1A
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-sm p-3 rounded-xl border border-pink-500/30 flex-shrink-0 group-hover:border-pink-400/50 transition-colors">
                  <Phone className="w-5 h-5 text-pink-400" />
                </div>
                <a 
                  href="tel:+905015431010" 
                  className="text-gray-300 hover:text-pink-400 transition-colors duration-300 text-sm sm:text-base font-medium"
                >
                  +90 501 543 10 10
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours - Premium Design */}
          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-6 text-white tracking-tight">Çalışma Saatleri</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-sm p-3 rounded-xl border border-pink-500/30 flex-shrink-0">
                  <Clock className="w-5 h-5 text-pink-400" />
                </div>
                <div className="flex-1">
                  <span className="text-gray-300 text-sm sm:text-base">Pazartesi - Pazar</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-pink-500/20 shadow-lg">
                <span className="text-pink-400 font-bold text-xl sm:text-2xl tracking-wide">
                  11:30 - 23:30
                </span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed pt-2">
                Her gün sizlere hizmet vermekten mutluluk duyuyoruz.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Corporate Design */}
        <div className="mt-16 pt-8 border-t border-gray-700/50 relative">
          {/* Subtle gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent"></div>
          <p className="text-gray-500 text-center text-xs sm:text-sm mb-4 max-w-2xl mx-auto">
            Makara – Konya tatlıcı, Konya en iyi tatlıcılar ve Konya tatlı mekanları arasında waffle, künefe, baklava, Prag tatlısı ve Konya tatlı sipariş ile hizmetinizde. Konya dessert cafe ve Konya en iyi tatlı yerleri için Havzan, Ebusuhud Efendi Caddesi.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <p className="text-gray-400 text-xs sm:text-sm font-medium">
              Copyright © 2025 Emirhan Erol. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

