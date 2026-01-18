import qrcode
from PIL import Image

# Google Maps yorum linki
review_url = "https://search.google.com/local/writereview?placeid=ChIJVz9uBACF0BQRv1wm7hxMaUA"

# QR kod ayarları
qr = qrcode.QRCode(
    version=1,  # QR kod versiyonu (1-40, otomatik için None)
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # Yüksek hata düzeltme
    box_size=10,  # Her modülün piksel boyutu
    border=4,  # Kenar boşluğu (modül sayısı)
)

# URL'i ekle
qr.add_data(review_url)
qr.make(fit=True)

# QR kod görüntüsü oluştur
img = qr.make_image(fill_color="black", back_color="white")

# Dosyayı kaydet
output_filename = "makara_google_review_qr.png"
img.save(output_filename)

print("=" * 60)
print("✓ QR KOD BAŞARIYLA OLUŞTURULDU!")
print("=" * 60)
print(f"\n📱 QR Kod İçeriği:\n{review_url}\n")
print(f"💾 Dosya Adı: {output_filename}")
print("=" * 60)



