import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'waffle', name: 'Waffle & Pancake' },
    { id: 'chocolate', name: 'Çikolata' },
    { id: 'cake', name: 'Pasta & Kek' },
    { id: 'icecream', name: 'Dondurma' },
  ]

  const images = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&q=80',
      category: 'waffle',
      title: 'Belçika Waffle',
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=80',
      category: 'chocolate',
      title: 'Belçika Çikolatası',
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
      category: 'cake',
      title: 'Prag Tatlısı',
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
      category: 'cake',
      title: 'Özel Pasta',
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80',
      category: 'waffle',
      title: 'Çikolatalı Waffle',
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?w=800&q=80',
      category: 'icecream',
      title: 'Gelato',
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
      category: 'cake',
      title: 'Cheesecake',
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
      category: 'waffle',
      title: 'Frambuazlı Waffle',
    },
    {
      id: 9,
      src: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=80',
      category: 'chocolate',
      title: 'Çikolata Fondü',
    },
    {
      id: 10,
      src: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=800&q=80',
      category: 'cake',
      title: 'Red Velvet',
    },
    {
      id: 11,
      src: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=800&q=80',
      category: 'cake',
      title: 'Tiramisu',
    },
    {
      id: 12,
      src: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&q=80',
      category: 'icecream',
      title: 'Dondurma Çeşitleri',
    },
  ]

  const filteredImages =
    activeCategory === 'all'
      ? images
      : images.filter((img) => img.category === activeCategory)

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
          <img
            src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1920&q=80"
            alt="Gallery"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-custom relative z-20 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              Galeri
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Tatlılarımızı ve atmosferimizi keşfedin
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* Image Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="aspect-square">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white font-bold text-xl">{image.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-primary-500 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="text-center mt-6">
                <h3 className="text-white text-2xl font-bold">{selectedImage.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
