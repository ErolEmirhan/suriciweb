from PIL import Image
from pyzbar.pyzbar import decode

# QR kodu oku ve içeriğini göster
try:
    img = Image.open("makara_menu_qr.png")
    decoded_objects = decode(img)
    
    if decoded_objects:
        for obj in decoded_objects:
            print(f"✓ QR Kod Tipi: {obj.type}")
            print(f"✓ QR Kod İçeriği: {obj.data.decode('utf-8')}")
    else:
        print("❌ QR kod okunamadı!")
except Exception as e:
    print(f"Hata: {e}")
    print("\nAlternatif yöntem kullanılıyor...")
    
    # Alternatif: cv2 ile okuma
    try:
        import cv2
        img = cv2.imread("makara_menu_qr.png")
        detector = cv2.QRCodeDetector()
        data, bbox, straight_qrcode = detector.detectAndDecode(img)
        if data:
            print(f"✓ QR Kod İçeriği: {data}")
        else:
            print("❌ QR kod okunamadı!")
    except ImportError:
        print("OpenCV kurulu değil. Manuel kontrol gerekiyor.")







