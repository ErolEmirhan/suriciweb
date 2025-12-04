import cv2

try:
    # QR kodu oku
    img = cv2.imread("makara_menu_qr.png")
    detector = cv2.QRCodeDetector()
    data, bbox, straight_qrcode = detector.detectAndDecode(img)
    
    if data:
        print("=" * 50)
        print("✓ QR KOD BAŞARIYLA OKUNDU!")
        print("=" * 50)
        print(f"\n📱 QR Kod İçeriği:\n{data}\n")
        print("=" * 50)
        
        # Beklenen URL ile karşılaştır
        expected_url = "https://makara.network/menu"
        if data == expected_url:
            print("✅ URL DOĞRU!")
        else:
            print(f"⚠️  URL FARKLILIĞI BULUNDU!")
            print(f"   Beklenen: {expected_url}")
            print(f"   Bulunan:  {data}")
    else:
        print("❌ QR kod okunamadı!")
        
except Exception as e:
    print(f"❌ Hata oluştu: {e}")

