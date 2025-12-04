import qrcode
from PIL import Image

# QR kod için URL
url = "https://makara.network/menu"

# QR kod oluştur
qr = qrcode.QRCode(
    version=1,  # QR kodun boyutunu kontrol eder (1-40 arası)
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # Yüksek hata düzeltme
    box_size=10,  # Her kutunun pixel boyutu
    border=4,  # Kenarlık boyutu (minimum 4)
)

# URL'i ekle
qr.add_data(url)
qr.make(fit=True)

# QR kodu görsel olarak oluştur
img = qr.make_image(fill_color="black", back_color="white")

# Dosyaya kaydet
output_file = "makara_menu_qr.png"
img.save(output_file)

print(f"✓ QR kod başarıyla oluşturuldu: {output_file}")
print(f"✓ URL: {url}")
print(f"✓ Bu QR kodu taratıldığında direkt menü sayfanız açılacak!")

