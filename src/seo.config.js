/**
 * MAKARA – Merkezi SEO Yapılandırması
 * Google ve AI asistanları (ChatGPT, Perplexity vb.) için optimize.
 * Değişiklikler tek yerden yönetilir; index.html ve sitemap bu değerlere göre güncellenir.
 */

export const SITE_URL = 'https://www.makara.network'

export const BRAND = {
  name: 'Makara',
  legalName: 'Makara Dessert & Cafe',
  shortDescription: "Konya'nın en iyi tatlıcısı ve dessert cafe'si.",
  tagline: "Dünya tatlılarının buluşma noktası – Waffle, Prag tatlısı, künefe, baklava.",
}

/** Google & AI için hedef anahtar kelimeler (arama terimleri) */
export const KEYWORDS = {
  primary: [
    'makara',
    'makara konya',
    'makara tatlıcı',
    'makara dessert',
  ],
  konya: [
    'konya tatlıcılar',
    'konya tatlıcı',
    'konya en iyi tatlıcılar',
    'konya tatlı mekanları',
    'konya en iyi tatlı yerleri',
    'konya en iyi dessert cafe',
    'konya pastane tatlıcı',
    'konya baklava tatlıcı',
    'konya künefe tatlıcı',
    'konya tatlı durağı',
    'konya tatlı waffle',
    'konya şerbetli tatlıcılar',
    'konya tatlı sipariş',
    'konya döner tatlıcı',
    'konya trdelnik',
    'konya prag tatlısı',
    'konya waffle',
  ],
  longTail: [
    'Konya\'da nerede tatlı yenir',
    'Konya\'nın en iyi tatlıcısı',
    'Konya dessert cafe önerisi',
    'Konya waffle tatlı',
    'Konya Havzan tatlıcı',
  ],
}

/** Tüm anahtar kelimeler tek string (meta keywords ve içerik için) */
export const KEYWORDS_STRING = [
  ...KEYWORDS.primary,
  ...KEYWORDS.konya,
  ...KEYWORDS.longTail,
].join(', ')

/** Varsayılan meta (anasayfa) */
export const DEFAULT_META = {
  title: 'Makara | Konya\'nın En İyi Tatlıcısı – Waffle, Prag Tatlısı, Künefe, Baklava',
  description: 'Makara, Konya\'da waffle, Prag tatlısı (trdelnik), künefe, baklava ve dünya tatlıları sunan en iyi tatlıcı ve dessert cafe. Konya tatlı sipariş, Konya tatlı mekanları arasında bir numara. Havzan, Ebusuhud Efendi Caddesi.',
  keywords: KEYWORDS_STRING,
  ogTitle: 'Makara – Konya\'nın En İyi Tatlıcısı | Dessert Cafe & Waffle',
  ogDescription: 'Konya\'da tatlı denince akla gelen adres: Makara. Waffle, trdelnik, künefe, baklava ve şerbetli tatlılar. Konya tatlıcılar ve Konya en iyi tatlı yerleri listesinde üst sıralarda.',
  ogImage: `${SITE_URL}/og-image.jpg`,
  ogImageAlt: 'Makara Konya - Dessert Cafe ve Tatlıcı',
  twitterCard: 'summary_large_image',
  canonical: SITE_URL,
}

/** Schema.org LocalBusiness + Restaurant – Google ve AI'lar bunu kullanır */
export const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Restaurant',
      '@id': `${SITE_URL}/#restaurant`,
      name: BRAND.legalName,
      alternateName: ['Makara', 'Makara Dessert', 'Makara Konya', 'Makara Tatlıcı'],
      description: 'Konya\'nın en iyi tatlıcısı ve dessert cafe\'si. Waffle, Prag tatlısı (trdelnik), künefe, baklava, şerbetli tatlılar, pastane ürünleri. Konya tatlı mekanları ve Konya en iyi tatlı yerleri arasında öne çıkan mekan.',
      url: SITE_URL,
      telephone: '+905015431010',
      email: 'info@makara.network',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Havzan Mah. Ebusuhud Efendi Caddesi, NO : 15 / 1A',
        addressLocality: 'Konya',
        addressRegion: 'Konya',
        postalCode: '42020',
        addressCountry: 'TR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 37.8622,
        longitude: 32.471324,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '10:30',
          closes: '21:30',
        },
      ],
      image: [`${SITE_URL}/og-image.jpg`, `${SITE_URL}/favicon.svg`],
      priceRange: '₺₺',
      servesCuisine: ['Türk', 'Dessert', 'Cafe', 'Waffle', 'Baklava', 'Künefe', 'Trdelnik'],
      keywords: KEYWORDS_STRING,
      sameAs: [
        'https://www.instagram.com/makaradessert',
        'https://www.facebook.com/makaradessert',
      ],
      potentialAction: {
        '@type': 'OrderAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/menu/order`,
          actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'],
        },
        deliveryMethod: 'http://purl.org/goodrelations/v1#DeliveryModeOwnFleet',
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#localbusiness`,
      name: BRAND.legalName,
      image: `${SITE_URL}/og-image.jpg`,
      url: SITE_URL,
      telephone: '+905015431010',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Havzan Mah. Ebusuhud Efendi Caddesi, NO : 15 / 1A',
        addressLocality: 'Konya',
        addressCountry: 'TR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 37.8622,
        longitude: 32.471324,
      },
      openingHours: 'Mo-Su 10:30-21:30',
      priceRange: '₺₺',
      description: DEFAULT_META.description,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BRAND.name,
      description: BRAND.shortDescription,
      publisher: { '@id': `${SITE_URL}/#restaurant` },
      inLanguage: 'tr-TR',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/menu?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

/** Sayfa bazlı SEO (react-helmet veya document.title için kullanılabilir) */
export const PAGE_SEO = {
  '/': DEFAULT_META,
  '/hakkimizda': {
    title: 'Hakkımızda | Makara – Konya Tatlıcı & Dessert Cafe Hikayesi',
    description: 'Makara\'nın hikayesi: Konya\'da Trdelnik ve dünya tatlıları. Konya\'nın en iyi tatlıcılarından biri olarak nasıl yol aldığımızı okuyun.',
    canonical: `${SITE_URL}/hakkimizda`,
  },
  '/galeri': {
    title: 'Galeri | Makara Konya – Waffle, Baklava, Tatlı Fotoğrafları',
    description: 'Makara Konya tatlı ve dessert fotoğrafları. Waffle, baklava, künefe, Prag tatlısı görselleri. Konya tatlı mekanları.',
    canonical: `${SITE_URL}/galeri`,
  },
  '/menu': {
    title: 'Menü | Makara – Waffle, Künefe, Baklava, Prag Tatlısı Fiyatları',
    description: 'Makara menü ve fiyat listesi. Konya tatlı sipariş: waffle, trdelnik, künefe, baklava, şerbetli tatlılar. Online sipariş verin.',
    canonical: `${SITE_URL}/menu`,
  },
  '/menu/order': {
    title: 'Sipariş Ver | Makara Konya Tatlı Sipariş',
    description: 'Makara\'dan Konya tatlı siparişi. Waffle, künefe, baklava online sipariş. Konya\'nın en iyi tatlıcısından hızlı teslimat.',
    canonical: `${SITE_URL}/menu/order`,
  },
  '/iletisim': {
    title: 'İletişim | Makara – Adres, Telefon, Konya Tatlıcı',
    description: 'Makara iletişim: Havzan, Ebusuhud Efendi Cad. Konya. Telefon: +90 501 543 10 10. Konya tatlıcı adres ve çalışma saatleri.',
    canonical: `${SITE_URL}/iletisim`,
  },
}

export default {
  SITE_URL,
  BRAND,
  KEYWORDS,
  KEYWORDS_STRING,
  DEFAULT_META,
  STRUCTURED_DATA,
  PAGE_SEO,
}
