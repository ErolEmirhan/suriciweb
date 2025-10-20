import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Anasayfa', path: '/' },
    { name: 'Hakkımızda', path: '/hakkimizda' },
    { name: 'Galeri', path: '/galeri' },
    { name: 'Menü', path: '/menu' },
    { name: 'İletişim', path: '/iletisim' },
  ]

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/makara.konya/', label: 'Instagram' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  ]

  return (
    <footer className="bg-dark-900 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <h3 className="text-3xl font-display font-bold text-primary-500">
              MAKARA
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Çekya'nın meşhur Trdelnik tatlısını, özel tarifimizle Konya'da sizler için hazırlıyoruz.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Sayfalar</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-500 transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-6">İletişim</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                <span>Aziziye, Mengüc Cd. No:41, 42030 Karatay/Konya</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <a href="mailto:info@makara.com" className="hover:text-primary-500 transition-colors">
                  info@makara.com
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <a href="tel:+905060404200" className="hover:text-primary-500 transition-colors">
                  +90 506 040 4200
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Çalışma Saatleri</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex justify-between">
                <span>Pazartesi - Pazar</span>
              </div>
              <div className="text-primary-500 font-semibold text-lg">
                10:30 - 21:30
              </div>
              <p className="text-sm pt-4">
                Her gün sizlere hizmet vermekten mutluluk duyuyoruz.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              Copyright © {currentYear} Makara Restaurant. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-primary-500 transition-colors">
                Gizlilik Politikası
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                Kullanım Koşulları
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

