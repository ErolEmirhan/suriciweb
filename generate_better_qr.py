import qrcode
from PIL import Image

# QR kod için URL
url = "https://makara.network/menu"

# Daha yüksek kaliteli QR kod oluştur
qr = qrcode.QRCode(
    version=3,  # Daha büyük QR kod
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # En yüksek hata düzeltme
    box_size=15,  # Daha büyük kutucuklar
    border=6,  # Daha geniş kenarlık
)

# URL'i ekle
qr.add_data(url)
qr.make(fit=True)

# QR kodu görsel olarak oluştur - daha yüksek çözünürlük
img = qr.make_image(fill_color="black", back_color="white")

# Ana QR kodu kaydet
output_file = "makara_menu_qr_high_quality.png"
img.save(output_file, quality=100, optimize=False)

print("=" * 60)
print("✓ YÜKSEK KALİTELİ QR KOD OLUŞTURULDU!")
print("=" * 60)
print(f"📁 Dosya: {output_file}")
print(f"🔗 URL: {url}")
print(f"📏 Boyut: Yüksek çözünürlüklü (basım için optimize)")
print(f"🛡️  Hata Düzeltme: Maksimum seviye")
print("=" * 60)
print("\n💡 Bu yeni QR kodu deneyin!")







