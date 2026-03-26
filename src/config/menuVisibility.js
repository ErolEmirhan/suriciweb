/**
 * Menüde gösterilmeyecek kategoriler ve ürünler (Firebase’de kalır, sadece UI filtrelenir).
 */

function normalizeCategoryKey(name) {
  return (name || '')
    .toLocaleUpperCase('tr-TR')
    .trim()
    .replace(/\s+/g, ' ')
}

/**
 * Türkçe büyük harfleri ASCII'ye indirger; İ/I ve Ş/S eşleşmesi için (substring includes güvenilir olsun).
 */
function foldCategoryAscii(name) {
  return normalizeCategoryKey(name)
    .replace(/Ğ/g, 'G')
    .replace(/Ü/g, 'U')
    .replace(/Ş/g, 'S')
    .replace(/İ/g, 'I')
    .replace(/Ö/g, 'O')
    .replace(/Ç/g, 'C')
}

/**
 * @param {string} name Kategori adı
 */
export function isMenuCategoryHidden(name) {
  const u = normalizeCategoryKey(name)
  const f = foldCategoryAscii(name)
  if (!u && !f) return false

  if (f.includes('FRAPPE')) return true

  // Yaş pastalar — DB'de "Yaş Patalar" gibi yazım hatası da olabilir (PASTA yok)
  if (
    f.includes('YAS') &&
    (f.includes('PASTA') || f.includes('PATAL'))
  ) {
    return true
  }

  if (f.includes('SERBETLET')) return true

  // Ekstralar
  if (f.includes('EKSTRALAR') || f === 'EKSTRA') return true

  // Şans kurabiyesi (KURABİYE / kurabiye — İ→I sonrası KURABI ile yakalanır)
  if (f.includes('SANS') && f.includes('KURABI')) return true

  // Şerbetler
  if (f.includes('SERBETLER')) return true

  return false
}

function normalizeProductKey(name) {
  if (!name) return ''
  return name
    .toLocaleLowerCase('tr-TR')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
}

/**
 * @param {string} productName
 */
export function isMenuProductHidden(productName) {
  const n = normalizeProductKey(productName)
  if (!n) return false

  if (n.startsWith('v60')) return true

  if (n.includes('bal kabak') && n.includes('latte')) return true
  if (n.includes('chai') && n.includes('latte')) return true
  if (n.includes('black eye')) return true
  if (n.includes('red eye')) return true
  if (n.includes('frambuaz') && n.includes('latte')) return true
  if ((n.includes('pecan') || n.includes('pekan')) && n.includes('ceviz') && n.includes('latte')) return true
  if (n.includes('fistikli') && n.includes('latte')) return true
  if (n.includes('madagaskar') && n.includes('vanilya') && n.includes('latte')) return true
  if (n.includes('badem') && n.includes('latte')) return true
  if (n.includes('seftali') && n.includes('frozen')) return true

  return false
}

export function filterCategoriesForMenu(categories) {
  return (categories || []).filter((c) => !isMenuCategoryHidden(c?.name))
}

/**
 * Milkshake / smoothie kategorisinde sadece bu ürünler listelenir (isim eşlemesi normalize edilir).
 */
export function isMilkshakeSmoothieCategory(categoryName) {
  const u = normalizeCategoryKey(categoryName)
  if (!u) return false
  return (
    u.includes('MİLKSHAKE') ||
    u.includes('MILKSHAKE') ||
    u.includes('SMOOTHIE') ||
    u.includes('SMOOTHI')
  )
}

/**
 * Milkshake & Smoothie kategori kartı arka planı: mümkünse "Çilekli Milkshake" / çilek milkshake ürününün görseli.
 * @param {{ id?: string, name?: string }[]} products
 */
export function pickMilkshakeCategoryBannerProduct(products) {
  if (!products?.length) return null
  const items = products.map((p) => ({
    p,
    n: normalizeProductKey(p?.name || ''),
  }))
  const milkshake = items.find(
    ({ n }) => n.includes('cilek') && n.includes('milkshake')
  )
  if (milkshake) return milkshake.p
  const cilekli = items.find(({ n }) => n.includes('cilekli'))
  if (cilekli) return cilekli.p
  const cilek = items.find(({ n }) => n.includes('cilek'))
  return cilek?.p ?? null
}

/**
 * @param {string} n normalizeProductKey sonucu
 */
function isAllowedMilkshakeSmoothieProduct(n) {
  if (!n) return false
  // Çilekli Smoothie — bu kategoride gösterilmez (çilek / çilekli + smoothie)
  if (n.includes('smoothie') && n.includes('cilek')) return false
  if (n.includes('cikolatali')) return true
  if (n.includes('muzlu')) return true
  if (n.includes('vanilya')) return true
  if (n.includes('karamel')) return true
  // Kategori zaten milkshake; isimde "çilek" / "çilekli" geçmesi yeterli
  if (n.includes('cilek')) return true
  return false
}

/**
 * @param {unknown[]} products
 * @param {string} [categoryName] Kategori adı (milkshake/smoothie için beyaz liste)
 */
export function filterProductsForMenu(products, categoryName) {
  const list = products || []
  if (categoryName && isMilkshakeSmoothieCategory(categoryName)) {
    return list.filter((p) => {
      if (isMenuProductHidden(p?.name)) return false
      return isAllowedMilkshakeSmoothieProduct(normalizeProductKey(p?.name))
    })
  }
  return list.filter((p) => !isMenuProductHidden(p?.name))
}
