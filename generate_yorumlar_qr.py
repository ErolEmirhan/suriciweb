# -*- coding: utf-8 -*-
import qrcode
from PIL import Image
import sys

# Windows konsol encoding sorununu çöz
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# QR kod için URL
url = "https://www.google.com/search?rlz=1CDGOYI_enTR1039TR1039&hl=tr&uds=AOm0WdE2fekQnsyfYEw8JPYozOKzQeKKVL0s_JmK5IZk0pNw8FIsH9EUBeyMOev558zQ_Lwisui0UBststsnc0ciRFADpgYJNi9VFT9_Ou7nAgNZjJ5fLdNwcCVnhSfMcutmPGb05csiJiXtAQmxxYsJ-wlZC-YKoQ&q=MAKARA%20Yorumlar&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-EyxghN4i4uK3S7JR00wrNw02rnLF37vXxlSx44UxSi8YhmNGJHN3oVibBUekItaD_D3jgBpvZztKDN62qVM0E93rV3DV&sa=X&ved=0CB4Q_4MLahcKEwiQlYHG2vmRAxUAAAAAHQAAAAAQEA&biw=440&bih=766&dpr=3"

# QR kod ayarları
qr = qrcode.QRCode(
    version=1,  # QR kod versiyonu (1-40 arası, otomatik ayarlanabilir)
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # Yüksek hata düzeltme
    box_size=10,  # Her kare için piksel boyutu
    border=4,  # Kenar boşluğu
)

# URL'yi ekle
qr.add_data(url)
qr.make(fit=True)

# QR kod görselini oluştur
img = qr.make_image(fill_color="black", back_color="white")

# Dosyayı kaydet
filename = "makara_yorumlar_qr.png"
img.save(filename)

print("=" * 60)
print("QR KOD BASARIYLA OLUSTURULDU!")
print("=" * 60)
print(f"\nDosya Adi: {filename}")
print(f"URL: {url[:80]}...")
print(f"\nQR kod '{filename}' olarak kaydedildi!")
print("=" * 60)
