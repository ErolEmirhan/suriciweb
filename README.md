# Makara Dessert Website

Modern, profesyonel ve şık bir tatlı mekanı web sitesi. React, Vite, TailwindCSS ve Framer Motion ile geliştirilmiştir.

## 🚀 Özellikler

- ✨ Modern ve şık tasarım
- 📱 Tam responsive (mobil, tablet, desktop)
- 🎨 Smooth animasyonlar ve geçişler
- 🎯 SEO optimizasyonu
- ⚡ Hızlı yükleme süreleri
- 🌐 Çoklu sayfa yapısı
- 📧 Sipariş formu
- 🖼️ Interaktif galeri
- 📋 Dinamik tatlı menüsü
- 🍰 Waffle, çikolata, pasta ve dondurma kategorileri

## 🛠️ Teknolojiler

- **React 18** - Modern UI geliştirme
- **Vite** - Hızlı build ve development
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Profesyonel animasyonlar
- **React Router** - Sayfa yönlendirme
- **Lucide React** - Modern ikonlar

## 📦 Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Development sunucusunu başlatın:
```bash
npm run dev
```

3. Tarayıcınızda açın:
```
http://localhost:3000
```

## 🏗️ Production Build

Production için optimize edilmiş build oluşturmak için:

```bash
npm run build
```

Build dosyaları `dist` klasöründe oluşturulacaktır.

Build'i önizlemek için:

```bash
npm run preview
```

## 📁 Proje Yapısı

```
makara-restaurant/
├── public/              # Statik dosyalar
├── src/
│   ├── components/      # React bileşenleri
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ScrollToTop.jsx
│   ├── pages/          # Sayfa bileşenleri
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Gallery.jsx
│   │   ├── Menu.jsx
│   │   └── Contact.jsx
│   ├── App.jsx         # Ana uygulama
│   ├── main.jsx        # Giriş noktası
│   └── index.css       # Global stiller
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Sayfalar

- **Anasayfa** - Hero section, istatistikler, özel tatlılar, yorumlar
- **Hakkımızda** - Hikaye, değerler, zaman çizelgesi
- **Galeri** - Kategorize edilmiş tatlı fotoğrafları
- **Tatlılarımız** - Waffle, çikolata, pasta, dondurma menüsü
- **İletişim** - İletişim bilgileri ve sipariş formu

## 🌐 Deployment

### Vercel (Önerilen)

1. [Vercel](https://vercel.com) hesabı oluşturun
2. GitHub repository'nizi bağlayın
3. Otomatik deploy edilecektir

### Netlify

1. [Netlify](https://netlify.com) hesabı oluşturun
2. `dist` klasörünü sürükle-bırak ile yükleyin
3. Veya GitHub ile otomatik deploy ayarlayın

### GitHub Pages

```bash
npm run build
# dist klasörünü GitHub Pages'e deploy edin
```

## 🎯 Özelleştirme

### Renkler

`tailwind.config.js` dosyasında renk paletini özelleştirebilirsiniz:

```javascript
colors: {
  primary: {
    // Renk değerlerini değiştirin
  }
}
```

### İçerik

Her sayfa için içeriği ilgili dosyalarda düzenleyebilirsiniz:
- `src/pages/Home.jsx` - Ana sayfa içeriği
- `src/pages/Menu.jsx` - Menü öğeleri
- `src/components/Footer.jsx` - Footer bilgileri

## 📱 Responsive Tasarım

Website tüm cihazlarda mükemmel görünecek şekilde optimize edilmiştir:
- 📱 Mobil (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1280px+)

## ⚡ Performans

- Lazy loading images
- Optimized animations
- Code splitting
- Minified production build
- Fast page transitions

## 🔧 Geliştirme

Yeni özellikler eklemek için:

1. Yeni bir branch oluşturun
2. Değişikliklerinizi yapın
3. Test edin
4. Pull request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen pull request göndermekten çekinmeyin.

## 📞 İletişim

Sorularınız için: info@makara.com

---

**Makara Dessert** - Dünya Tatlılarının Buluşma Noktası

