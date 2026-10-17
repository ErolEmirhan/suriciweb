import { useMemo, useState } from 'react'
import { Printer, Search, AlertTriangle, Flame, Info } from 'lucide-react'

/**
 * Toplu tüketim yerleri için ürün bileşen, alerjen ve enerji bilgisi listesi.
 * Dayanak: Türk Gıda Kodeksi Gıda Etiketleme ve Tüketicileri Bilgilendirme
 * Yönetmeliği ve Bakanlık Kılavuzu (md. 41: bileşen + enerji bildirimi,
 * alerjenlerin diğer bileşenlerden ayırt edilebilir biçimde gösterilmesi,
 * karekod kullanılıyorsa talep halinde bilgi verileceğinin belirtilmesi).
 *
 * Bu bileşen iki şube sitesinde (Havzan / Suriçi) aynıdır; veriyi sayfa yükler.
 * groups: [{ name, products: [{ id, name, content, calories }] }]
 */

// Yönetmelik Ek-1'deki 14 alerjen grubu
const ALERJEN_GRUPLARI = [
  'Gluten içeren tahıllar (buğday, çavdar, arpa, yulaf vb.)',
  'Kabuklular',
  'Yumurta',
  'Balık',
  'Yer fıstığı',
  'Soya',
  'Süt (laktoz dahil)',
  'Sert kabuklu meyveler (badem, fındık, ceviz, kaju, Antep fıstığı vb.)',
  'Kereviz',
  'Hardal',
  'Susam',
  'Kükürt dioksit ve sülfitler',
  'Acı bakla (lupin)',
  'Yumuşakçalar',
]

// Bileşen listesinde vurgulanacak alerjen kaynakları
const ALERJEN_KELIMELERI = [
  'buğday unu', 'buğday', 'unu', 'un', 'gluten', 'arpa', 'çavdar', 'yulaf', 'irmik',
  'bisküvi', 'bisküvisi', 'gofret', 'pandispanya',
  'süt tozu', 'süt', 'sütü', 'tereyağı', 'krema', 'kreması', 'kaymak', 'peynir', 'peyniri',
  'yoğurt', 'mascarpone', 'labne', 'kaşar', 'krem peynir',
  'yumurta', 'yumurta akı', 'yumurta sarısı',
  'antep fıstığı', 'fıstık', 'fındık', 'badem', 'ceviz', 'kaju', 'yer fıstığı', 'menengiç',
  'soya', 'susam', 'kereviz', 'hardal', 'sülfit',
]
// Eski Safari sürümlerinde de çalışsın diye lookbehind kullanılmaz:
// kelimeden önceki karakter 1. grupta yakalanır ve metne geri eklenir.
const LETTER = 'a-zA-ZçÇğĞıİöÖşŞüÜâÂîÎûÛ'
const ALERJEN_REGEX = new RegExp(
  `(^|[^${LETTER}])(${[...ALERJEN_KELIMELERI]
    .sort((a, b) => b.length - a.length)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')})(?=[^${LETTER}]|$)`,
  'gi'
)

function vurgula(text) {
  if (!text) return null
  const out = []
  let last = 0
  let m
  ALERJEN_REGEX.lastIndex = 0
  while ((m = ALERJEN_REGEX.exec(text)) !== null) {
    const start = m.index + m[1].length
    if (start > last) out.push(text.slice(last, start))
    out.push(
      <strong key={start} className="font-bold text-red-700">
        {m[2]}
      </strong>
    )
    last = start + m[2].length
    ALERJEN_REGEX.lastIndex = last
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function parseSections(content, productName) {
  if (!content || typeof content !== 'string') return []
  const name = String(productName || '').trim().toLocaleLowerCase('tr-TR')
  const out = []
  let current = null
  content.split('\n').forEach((raw, index) => {
    const line = raw.trim()
    if (!line || line.startsWith('Menü kategorisi')) return
    if (index === 0 && line.toLocaleLowerCase('tr-TR') === name) return
    const c = line.indexOf(':')
    if (c > 0 && c < 24) {
      if (current) out.push(current)
      current = { label: line.slice(0, c).trim(), value: line.slice(c + 1).trim() }
    } else if (current) {
      current.value = current.value ? `${current.value} ${line}` : line
    } else {
      out.push({ label: null, value: line })
    }
  })
  if (current) out.push(current)
  return out
}

function splitProduct(product) {
  const sections = parseSections(product.content || product.description, product.name)
  const lower = (s) => (s || '').toLocaleLowerCase('tr-TR')
  const icindekiler = sections.find((s) => lower(s.label).startsWith('içindekiler') || lower(s.label).startsWith('bileşen'))
  const alerjen = sections.find((s) => lower(s.label).startsWith('alerjen'))
  const notlar = sections.filter(
    (s) => s !== icindekiler && s !== alerjen && s.label && ['uyarı', 'not'].includes(lower(s.label))
  )
  const kcal =
    product.calories ?? product.calorie ?? product.calorie_info ?? product.kalori ?? null
  return { icindekiler, alerjen, notlar, kcal: kcal ? String(kcal).trim() : null }
}

export default function BesinBilgileriListesi({ subeAdi, groups: hamGruplar, loading, error, guncelleme }) {
  const [arama, setArama] = useState('')
  // Kategori adlarındaki ;Atıştırmalıklar; gibi süs karakterlerini temizle
  const groups = useMemo(
    () => hamGruplar.map((g) => ({ ...g, name: g.name.replace(/^[;\s]+|[;\s]+$/g, '') })),
    [hamGruplar]
  )

  const filtered = useMemo(() => {
    const q = arama.trim().toLocaleLowerCase('tr-TR')
    if (!q) return groups
    return groups
      .map((g) => ({
        ...g,
        products: g.products.filter((p) =>
          `${p.name} ${p.content || ''}`.toLocaleLowerCase('tr-TR').includes(q)
        ),
      }))
      .filter((g) => g.products.length > 0)
  }, [groups, arama])

  const toplam = groups.reduce((n, g) => n + g.products.length, 0)

  return (
    <div className="besin-sayfa min-h-screen bg-white pb-16 pt-24 text-gray-800 print:pt-0">
      <style>{`
        @media print {
          nav, footer, .besin-no-print, [class*="Floating"] { display: none !important; }
          .besin-sayfa { padding-top: 0 !important; }
          .besin-urun { break-inside: avoid; }
          a[href]:after { content: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-3xl px-4">
        <header className="border-b border-rose-100 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
            Makara {subeAdi} Şubesi
          </p>
          <h1 className="mt-1 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
            Ürün Bileşen, Alerjen ve Enerji Bilgileri
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Bu liste; Tarım ve Orman Bakanlığı Türk Gıda Kodeksi Gıda Etiketleme ve Tüketicileri
            Bilgilendirme Yönetmeliği ve Kılavuzu kapsamında, şubemizde sunulan ürünlerin
            bileşenleri, alerjenleri ve enerji değerleri hakkında misafirlerimizi bilgilendirmek
            amacıyla hazırlanmıştır.
          </p>
          {guncelleme && (
            <p className="mt-2 text-xs text-gray-500">Son güncelleme: {guncelleme}</p>
          )}
        </header>

        <section className="mt-5 space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <p className="flex gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Bileşen listelerinde alerjen kaynakları <strong className="text-red-700">kırmızı ve kalın</strong>{' '}
              yazılmıştır. Gıda alerjiniz veya intoleransınız varsa lütfen siparişinizden önce
              personelimize bildiriniz.
            </span>
          </p>
          <p className="flex gap-2">
            <Flame className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Enerji değerleri bir porsiyon içindir; tarif ve porsiyona göre küçük farklılıklar gösterebilir.</span>
          </p>
          <p className="flex gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Karekod okutacak cihazı olmayan misafirlerimize bu bilgiler talep halinde personelimiz
              tarafından basılı veya sözlü olarak sunulur.
            </span>
          </p>
        </section>

        <details className="mt-4 rounded-2xl border border-gray-200 p-4 text-sm">
          <summary className="cursor-pointer font-semibold text-gray-800">
            Alerjen veya intoleransa neden olan 14 madde grubu
          </summary>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-gray-600">
            {ALERJEN_GRUPLARI.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ol>
        </details>

        <div className="besin-no-print sticky top-16 z-10 mt-5 flex gap-2 bg-white/95 py-2 backdrop-blur">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={arama}
              onChange={(e) => setArama(e.target.value)}
              placeholder="Ürün veya bileşen ara (ör. fındık, süt)"
              className="w-full rounded-full border border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
          </label>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Yazdır</span>
          </button>
        </div>

        {groups.length > 0 && (
          <nav className="besin-no-print mt-2 flex flex-wrap gap-2" aria-label="Kategoriler">
            {groups.map((g, i) => (
              <a
                key={g.name}
                href={`#kategori-${i}`}
                className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100"
              >
                {g.name}
              </a>
            ))}
          </nav>
        )}

        {loading && <p className="mt-10 text-center text-sm text-gray-500">Bilgiler yükleniyor…</p>}
        {!loading && error && (
          <p className="mt-10 rounded-2xl bg-red-50 p-4 text-center text-sm text-red-700">
            Bilgiler şu anda yüklenemedi. Lütfen sayfayı yenileyin veya personelimizden basılı
            listeyi isteyin.
          </p>
        )}
        {!loading && !error && filtered.length === 0 && (
          <p className="mt-10 text-center text-sm text-gray-500">Aramanızla eşleşen ürün bulunamadı.</p>
        )}

        {filtered.map((g) => (
          <section
            key={g.name}
            id={`kategori-${groups.findIndex((x) => x.name === g.name)}`}
            className="mt-8 scroll-mt-32"
          >
            <h2 className="border-b-2 border-rose-200 pb-1.5 text-lg font-bold text-gray-900">{g.name}</h2>
            <ul className="divide-y divide-gray-100">
              {g.products.map((p) => {
                const { icindekiler, alerjen, notlar, kcal } = splitProduct(p)
                return (
                  <li key={p.id} className="besin-urun py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold leading-snug text-gray-900">{p.name.trim()}</h3>
                      {kcal && (
                        <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
                          {kcal}
                        </span>
                      )}
                    </div>
                    {icindekiler ? (
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">
                        <span className="font-medium text-gray-700">Bileşenler: </span>
                        {vurgula(icindekiler.value)}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">
                        Bileşen bilgisi için lütfen personelimize danışınız.
                      </p>
                    )}
                    {alerjen && (
                      <p className="mt-1 text-sm font-semibold text-red-700">
                        Alerjenler: {alerjen.value}
                      </p>
                    )}
                    {notlar.map((n) => (
                      <p key={n.label} className="mt-1 text-xs leading-relaxed text-gray-500">
                        {n.label}: {n.value}
                      </p>
                    ))}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}

        {!loading && !error && (
          <p className="mt-10 border-t border-gray-100 pt-4 text-xs leading-relaxed text-gray-500">
            Toplam {toplam} ürün listelenmiştir. Ürünlerimiz; gluten, süt, yumurta, soya ve sert
            kabuklu meyvelerin kullanıldığı ortamda hazırlandığından eser miktarda bu alerjenleri
            içerebilir.
          </p>
        )}
      </div>
    </div>
  )
}
