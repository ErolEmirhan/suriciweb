import { useState } from 'react'

const API_URL = import.meta.env.VITE_PERSONEL_API_URL || 'https://api.makara.network'

function Personel() {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!pin.trim()) {
      setError('Lütfen personel şifrenizi girin.')
      return
    }

    try {
      setLoading(true)
      // Burada gerçek API endpoint'inizi kullanın (örnek: /personel/login)
      const response = await fetch(`${API_URL}/personel/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: pin.trim() }),
      })

      if (!response.ok) {
        throw new Error('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.')
      }

      const data = await response.json()
      // TODO: Burada token / personel bilgileri ile personel paneline yönlendirme yapılabilir
      console.log('Personel giriş başarılı:', data)
      alert('Giriş başarılı (backend entegrasyonu tamamlanınca burası gerçek panele yönlendirilecek).')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Giriş sırasında bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4 py-16">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-700/80 shadow-2xl rounded-3xl p-8 backdrop-blur-xl">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-[0.35em] text-primary-400/80 uppercase mb-3">
            Makara Restaurant
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            Mobil Personel Giriş
          </h1>
          <p className="text-sm text-slate-300">
            QR kodu okuttuktan sonra size verilen personel şifresini girin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Personel Şifresi (PIN)
            </label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 text-base"
              placeholder="Örn: 1234"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center px-4 py-3 rounded-2xl bg-primary-500 hover:bg-primary-400 disabled:opacity-60 disabled:hover:bg-primary-500 text-white font-semibold text-base shadow-lg shadow-primary-500/30 transition-all duration-200"
          >
            {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-slate-400">
          Bu ekran sadece yetkili personel içindir. Giriş bilgileriniz yoksa yöneticinize başvurun.
        </p>
      </div>
    </div>
  )
}

export default Personel

