import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import BesinBilgileriListesi from '../components/besin/BesinBilgileriListesi'
import { filterCategoriesForMenu, filterProductsForMenu } from '../config/menuVisibility'

const SUBE_ADI = 'Suriçi'

// Menü sayfasıyla aynı kategori sırası
const KATEGORI_SIRASI = [
  'MAKARALAR',
  'FRANSIZ PASTALARI',
  'KRUVASANLAR',
  'SÜTLÜ TATLILAR VE PASTALAR',
  'WAFFLE',
  'SICAK İÇECEKLER',
  'SOĞUK İÇECEKLER',
  'FROZENLER',
  'MİLKSHAKELER',
]

function sirala(categories) {
  const idx = (c) => {
    const n = (c.name || '').toUpperCase().trim()
    return KATEGORI_SIRASI.findIndex((o) => n.includes(o) || o.includes(n))
  }
  return [...categories].sort((a, b) => {
    const ai = idx(a)
    const bi = idx(b)
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    const ao = a.order_index ?? a.order ?? 999
    const bo = b.order_index ?? b.order ?? 999
    if (ao !== bo) return ao - bo
    return (a.name || '').localeCompare(b.name || '', 'tr')
  })
}

function urunSirala(products) {
  return [...products].sort((a, b) => {
    const ao = a.order_index ?? a.order ?? 999
    const bo = b.order_index ?? b.order ?? 999
    if (ao !== bo) return ao - bo
    return (a.name || '').localeCompare(b.name || '', 'tr')
  })
}

const gidaDisi = (name) => (name || '').toLocaleUpperCase('tr-TR').includes('HEDİYE')

export default function BesinBilgileri() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [guncelleme, setGuncelleme] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [catSnap, prodSnap] = await Promise.all([
          getDocs(collection(db, 'categories')),
          getDocs(collection(db, 'products')),
        ])
        if (cancelled) return
        // Menüdeki gibi: id olarak belge kimliği, sonra veri (veri içindeki id öncelikli)
        const categories = catSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        const products = prodSnap.docs.map((doc) => {
          // eslint-disable-next-line no-unused-vars
          const { image_base64, image_base64_migrated_at, ...rest } = doc.data()
          return { id: doc.id, ...rest }
        })

        const cats = filterCategoriesForMenu(sirala(categories)).filter((c) => !gidaDisi(c.name))
        const out = cats
          .map((c) => {
            const list = products.filter(
              (p) =>
                String(p.category_id) === String(c.id) ||
                Number(p.category_id) === Number(c.id) ||
                p.category_id === c.id
            )
            return { name: (c.name || '').trim(), products: urunSirala(filterProductsForMenu(list, c.name)) }
          })
          .filter((g) => g.products.length > 0)
        setGroups(out)

        const tarihler = products.map((p) => Date.parse(p.updatedAt)).filter((t) => Number.isFinite(t))
        if (tarihler.length) setGuncelleme(new Date(Math.max(...tarihler)).toLocaleDateString('tr-TR'))
      } catch (e) {
        console.error('Besin bilgileri yüklenemedi:', e)
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <BesinBilgileriListesi
      subeAdi={SUBE_ADI}
      groups={groups}
      loading={loading}
      error={error}
      guncelleme={guncelleme}
    />
  )
}
