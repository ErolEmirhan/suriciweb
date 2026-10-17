/** Ürün kalorisi (admin paneli farklı alanlara yazabiliyor) */
export function getProductCalories(product) {
  const value = product?.calories ?? product?.calorie ?? product?.calorie_info ?? product?.kalori
  if (!value) return null
  return String(value).trim()
}

/**
 * İçerik metnini "Etiket: değer" bölümlerine ayırır.
 * Admin panelindeki biçimde metnin başındaki ürün adı satırı ve sonundaki
 * "Menü kategorisi:" satırı gösterilmez (başlıkta zaten var).
 */
export function parseProductContentSections(content, productName) {
  if (!content || typeof content !== 'string') return []

  const name = String(productName || '').trim().toLocaleLowerCase('tr-TR')
  const lines = content.split('\n').map((line) => line.trim())
  const sections = []
  let current = null

  lines.forEach((line, index) => {
    if (!line) return
    if (line.startsWith('Menü kategorisi')) return
    if (index === 0 && name && line.toLocaleLowerCase('tr-TR') === name) return

    const colonIndex = line.indexOf(':')
    const isLabel = colonIndex > 0 && colonIndex < 24

    if (isLabel) {
      if (current) sections.push(current)
      current = {
        label: line.slice(0, colonIndex).trim(),
        value: line.slice(colonIndex + 1).trim(),
      }
      return
    }

    if (current) {
      current.value = current.value ? `${current.value}\n${line}` : line
    } else {
      sections.push({ label: null, value: line })
    }
  })

  if (current) sections.push(current)
  return sections
}
