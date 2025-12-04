import qrcode
from PIL import Image

# QR kod için URL (www ile)
url = "https://www.makara.network/menu"

# Yüksek kaliteli QR kod oluştur
qr = qrcode.QRCode(
    version=3,  # Daha büyük QR kod
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # En yüksek hata düzeltme
    box_size=15,  # Daha büyük kutucuklar
    border=6,  # Daha geniş kenarlık
)

# URL'i ekle
qr.add_data(url)
qr.make(fit=True)

# QR kodu görsel olarak oluştur
img = qr.make_image(fill_color="black", back_color="white")

# QR kodu kaydet
output_file = "makara_menu_qr_www.png"
img.save(output_file, quality=100, optimize=False)

print("=" * 60)
print("✓ WWW İLE QR KOD OLUŞTURULDU!")
print("=" * 60)
print(f"📁 Dosya: {output_file}")
print(f"🔗 URL: {url}")
print(f"📏 Boyut: Yüksek çözünürlüklü")
print(f"🛡️  Hata Düzeltme: Maksimum seviye")
print("=" * 60)
print("\n✨ WWW'li versiyonu deneyin!")

