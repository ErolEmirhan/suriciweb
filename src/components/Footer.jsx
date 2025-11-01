import { Link } from 'react-router-dom'
import { Phone, MapPin } from 'lucide-react'

export default function Footer() {

  const quickLinks = [
    { name: 'Anasayfa', path: '/' },
    { name: 'Hakkımızda', path: '/hakkimizda' },
    { name: 'Galeri', path: '/galeri' },
    { name: 'Menü', path: '/menu' },
    { name: 'İletişim', path: '/iletisim' },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
      
      <div className="container-custom py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Sayfalar</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 transition-all hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">İletişim</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-300">
                <div className="bg-white p-2 rounded-xl shadow-md">
                  <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0" />
                </div>
                <span>Havzan Mah. Ebusuhud Efendi Caddesi, NO : 15 / 1A</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <div className="bg-white p-2 rounded-xl shadow-md">
                  <Phone className="w-5 h-5 text-pink-500 flex-shrink-0" />
                </div>
                <a href="tel:+905015431010" className="hover:text-primary-400 transition-colors">
                  +90 501 543 10 10
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Çalışma Saatleri</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-3">
                <div className="bg-white p-2 rounded-xl shadow-md">
                  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex justify-between flex-1">
                  <span>Pazartesi - Pazar</span>
                </div>
              </div>
              <div className="bg-white rounded-xl px-4 py-2 inline-block">
                <span className="text-pink-500 font-semibold text-lg">
                  10:30 - 21:30
                </span>
              </div>
              <p className="text-sm pt-4">
                Her gün sizlere hizmet vermekten mutluluk duyuyoruz.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 relative">
          {/* Gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm font-medium">
              Copyright © 2025 Emirhan Erol. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

