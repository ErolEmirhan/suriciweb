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
 * @param {string} name Kategori adı
 */
export function isMenuCategoryHidden(name) {
  const u = normalizeCategoryKey(name)
  if (!u) return false
  if (u.includes('FRAPPE')) return true
  if (u.includes('YAŞ') && u.includes('PASTA')) return true
  if (u.includes('YAS') && u.includes('PASTA')) return true
  if (u.includes('ŞERBETLET') || u.includes('SERBETLET')) return true
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
function isMilkshakeSmoothieCategory(categoryName) {
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
 * @param {string} n normalizeProductKey sonucu
 */
function isAllowedMilkshakeSmoothieProduct(n) {
  if (!n) return false
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
