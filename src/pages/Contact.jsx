import { motion } from 'framer-motion'
import { MapPin, Phone, Clock } from 'lucide-react'

export default function Contact() {

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adres',
      content: 'Havzan Mah. Ebusuhud Efendi Caddesi, NO : 15 / 1A',
      link: 'https://www.google.com/maps?q=37.862200,32.471324',
    },
    {
      icon: Phone,
      title: 'Telefon',
      content: '+90 501 543 10 10',
      link: 'tel:+905015431010',
    },
    {
      icon: Clock,
      title: 'Çalışma Saatleri',
      content: 'Pazartesi - Pazar: 10:30 - 21:30',
      link: null,
    },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden">
      {/* Contact Section */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-display font-bold mb-8">
                Bize Ulaşın
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Sorularınız, sipariş talepleriniz veya özel etkinlik planlarınız için 
                bizimle iletişime geçin. Size en kısa sürede dönüş yapacağız.
              </p>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          target={info.link.startsWith('http') ? '_blank' : undefined}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-gray-600 hover:text-primary-600 transition-colors"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-gray-600">{info.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Google Maps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-8 rounded-2xl overflow-hidden shadow-2xl"
                style={{ height: '450px' }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3161.5542280890826!2d32.46913467599958!3d37.86220000166524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzfCsDUxJzQzLjkiTiAzMsKwMjgnMTYuOCJF!5e0!3m2!1str!2str!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MAKARA Location"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
