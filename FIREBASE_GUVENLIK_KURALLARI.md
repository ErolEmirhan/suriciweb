# Firebase Firestore Güvenlik Kuralları Güncelleme Rehberi

## Sorun
Uygulama Firebase'den veri çekerken "Missing or insufficient permissions" hatası alıyor. Bu, Firestore güvenlik kurallarının okuma izinlerini engellediği anlamına gelir.

## Çözüm

### Adım 1: Firebase Console'a Giriş
1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. Projenizi seçin: **makara-16344**

### Adım 2: Firestore Database'e Git
1. Sol menüden **Firestore Database** seçeneğine tıklayın
2. Üst menüden **Kurallar (Rules)** sekmesine tıklayın

### Adım 3: Güvenlik Kurallarını Güncelle

**Geliştirme/Test Ortamı İçin (Herkese Açık Okuma):**

Aşağıdaki kuralları yapıştırın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Kategoriler - Herkese okuma izni
    match /categories/{document=**} {
      allow read: if true;
      allow write: if false; // Sadece admin panelinden yazılabilir
    }
    
    // Ürünler - Herkese okuma izni
    match /products/{document=**} {
      allow read: if true;
      allow write: if false; // Sadece admin panelinden yazılabilir
    }
    
    // Görseller - Herkese okuma izni
    match /images/{document=**} {
      allow read: if true;
      allow write: if false; // Sadece admin panelinden yazılabilir
    }
    
    // Diğer tüm koleksiyonlar için varsayılan kural
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Üretim Ortamı İçin (Daha Güvenli - Önerilen):**

Eğer daha güvenli bir yapı istiyorsanız, sadece belirli koleksiyonlara okuma izni verin:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Kategoriler - Herkese okuma izni
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Ürünler - Herkese okuma izni
    match /products/{productId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Görseller - Herkese okuma izni
    match /images/{imageId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### Adım 4: Kuralları Yayınla
1. **Yayınla (Publish)** butonuna tıklayın
2. Onay mesajını kabul edin

### Adım 5: Test
1. Uygulamanızı yenileyin
2. Menü sayfasına gidin
3. Kategoriler ve ürünler yüklenmeli

## Önemli Notlar

⚠️ **Güvenlik Uyarısı:**
- `allow read: if true` kuralı herkese okuma izni verir
- Bu, halka açık veriler için uygundur (menü, ürünler, görseller)
- Yazma izinleri (`write`) kapalı tutulmalıdır
- Admin işlemleri için Firebase Authentication kullanılmalıdır

## Alternatif: Firebase Authentication ile Güvenli Kurallar

Eğer ileride admin paneli ekleyecekseniz, şu kuralları kullanabilirsiniz:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Herkese okuma izni
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Online Siparişler İçin Güvenlik Kuralları

**ÖNEMLİ:** Online siparişler için ayrı bir Firebase projesi kullanılıyor: **makaraonline-5464e**

### Adım 1: Online Siparişler Firebase Projesine Giriş
1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. Projenizi seçin: **makaraonline-5464e** (Online Siparişler projesi)

### Adım 2: Firestore Database'e Git
1. Sol menüden **Firestore Database** seçeneğine tıklayın
2. Üst menüden **Kurallar (Rules)** sekmesine tıklayın

### Adım 3: Online Siparişler İçin Güvenlik Kuralları

Aşağıdaki kuralları yapıştırın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Online siparişler koleksiyonu
    // Herkes sipariş oluşturabilir (yazma)
    match /orders/{orderId} {
      allow create: if true;
      
      // Okuma için authentication gerekli (admin paneli için)
      allow read: if request.auth != null;
      
      // Güncelleme ve silme sadece authenticated kullanıcılar için
      allow update, delete: if request.auth != null;
    }
    
    // Diğer koleksiyonlar için varsayılan kurallar
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Adım 4: Kuralları Yayınla
1. **Yayınla (Publish)** butonuna tıklayın
2. Onay mesajını kabul edin

### Alternatif: Daha Güvenli Kurallar (Önerilen)

Eğer daha güvenli bir yapı istiyorsanız, sadece belirli alanların yazılmasına izin verin:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /orders/{orderId} {
      // Sadece sipariş oluşturma izni (belirli alanlarla)
      allow create: if request.resource.data.keys().hasAll(['name', 'address', 'phone', 'paymentMethod', 'items', 'total', 'status', 'timestamp'])
                    && request.resource.data.name is string
                    && request.resource.data.address is string
                    && request.resource.data.phone is string
                    && request.resource.data.paymentMethod is string
                    && request.resource.data.items is list
                    && request.resource.data.total is number
                    && request.resource.data.status == 'pending'
                    && request.resource.data.timestamp is number;
      
      allow read: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Sorun Giderme

Eğer hala hata alıyorsanız:
1. Firebase Console'da kuralların yayınlandığından emin olun
2. Doğru Firebase projesinde olduğunuzdan emin olun:
   - Ana proje: **makara-16344** (menü, ürünler için)
   - Online siparişler: **makaraonline-5464e** (siparişler için)
3. Tarayıcı konsolunu kontrol edin
4. Firebase proje ayarlarını kontrol edin
5. API anahtarlarının doğru olduğundan emin olun


