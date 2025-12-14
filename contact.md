# 📬 Contact API Dokümantasyonu

## Base URL
```
https://ozpolatinsaat.tr/backend/api/contact
```

---

## 📤 Endpoints

### 1. POST `/api/contact` - Yeni Mesaj Gönder
**Auth:** ❌ Gerekmiyor (Public)

```bash
curl -X POST https://ozpolatinsaat.tr/backend/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmet Yılmaz",
    "email": "ahmet@example.com",
    "phone": "0532 123 45 67",
    "subject": "Teklif Talebi",
    "message": "Merhaba, villa projesi için fiyat teklifi almak istiyorum."
  }'
```

**Request Body:**
| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| name | string | ✅ | Ad Soyad |
| email | string | ✅ | E-posta adresi |
| phone | string | ❌ | Telefon numarası |
| subject | string | ✅ | Konu (aşağıdaki seçeneklerden biri) |
| message | string | ✅ | Mesaj içeriği |

**Geçerli Konu Değerleri:**
- `Genel Bilgi`
- `Teklif Talebi`
- `İş Birliği`
- `Şikayet / Öneri`
- `Diğer`

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Ad Soyad, E-posta, Konu ve Mesaj alanları zorunludur"
}
```

```json
{
  "error": "Geçerli bir e-posta adresi giriniz"
}
```

```json
{
  "error": "Geçersiz konu seçimi",
  "validSubjects": ["Genel Bilgi", "Teklif Talebi", "İş Birliği", "Şikayet / Öneri", "Diğer"]
}
```

---

### 2. GET `/api/contact` - Tüm Mesajları Listele
**Auth:** ✅ Gerekli (Admin)

```bash
curl -X GET https://ozpolatinsaat.tr/backend/api/contact \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| isRead | boolean | `true` veya `false` - Okundu filtresi |
| isReplied | boolean | `true` veya `false` - Yanıtlandı filtresi |

**Filtreli Örnekler:**
```bash
# Sadece okunmamış mesajlar
curl -X GET "https://ozpolatinsaat.tr/backend/api/contact?isRead=false" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Sadece yanıtlanmamış mesajlar
curl -X GET "https://ozpolatinsaat.tr/backend/api/contact?isReplied=false" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Okunmuş ama yanıtlanmamış
curl -X GET "https://ozpolatinsaat.tr/backend/api/contact?isRead=true&isReplied=false" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Ahmet Yılmaz",
    "email": "ahmet@example.com",
    "phone": "0532 123 45 67",
    "subject": "Teklif Talebi",
    "message": "Merhaba, villa projesi için fiyat teklifi almak istiyorum.",
    "isRead": false,
    "isReplied": false,
    "adminNotes": null,
    "ipAddress": "192.168.1.1",
    "createdAt": "2025-12-14T10:30:00.000Z",
    "updatedAt": "2025-12-14T10:30:00.000Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Mehmet Demir",
    "email": "mehmet@example.com",
    "phone": null,
    "subject": "Genel Bilgi",
    "message": "Çalışma saatleriniz nedir?",
    "isRead": true,
    "isReplied": true,
    "adminNotes": "Telefonda bilgi verildi",
    "ipAddress": "10.0.0.1",
    "createdAt": "2025-12-13T14:20:00.000Z",
    "updatedAt": "2025-12-13T15:00:00.000Z"
  }
]
```

---

### 3. GET `/api/contact/unread-count` - Okunmamış Mesaj Sayısı
**Auth:** ✅ Gerekli (Admin)

```bash
curl -X GET https://ozpolatinsaat.tr/backend/api/contact/unread-count \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "count": 5
}
```

---

### 4. GET `/api/contact/:id` - Tek Mesaj Getir
**Auth:** ✅ Gerekli (Admin)

```bash
curl -X GET https://ozpolatinsaat.tr/backend/api/contact/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "phone": "0532 123 45 67",
  "subject": "Teklif Talebi",
  "message": "Merhaba, villa projesi için fiyat teklifi almak istiyorum.",
  "isRead": false,
  "isReplied": false,
  "adminNotes": null,
  "ipAddress": "192.168.1.1",
  "createdAt": "2025-12-14T10:30:00.000Z",
  "updatedAt": "2025-12-14T10:30:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Mesaj bulunamadı"
}
```

---

### 5. PUT `/api/contact/:id` - Mesaj Güncelle
**Auth:** ✅ Gerekli (Admin)

```bash
curl -X PUT https://ozpolatinsaat.tr/backend/api/contact/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "isRead": true,
    "isReplied": true,
    "adminNotes": "Müşteriyle telefonda görüşüldü, teklif gönderildi."
  }'
```

**Request Body:**
| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| isRead | boolean | ❌ | Okundu olarak işaretle |
| isReplied | boolean | ❌ | Yanıtlandı olarak işaretle |
| adminNotes | string | ❌ | Admin notları |

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "phone": "0532 123 45 67",
  "subject": "Teklif Talebi",
  "message": "Merhaba, villa projesi için fiyat teklifi almak istiyorum.",
  "isRead": true,
  "isReplied": true,
  "adminNotes": "Müşteriyle telefonda görüşüldü, teklif gönderildi.",
  "ipAddress": "192.168.1.1",
  "createdAt": "2025-12-14T10:30:00.000Z",
  "updatedAt": "2025-12-14T11:00:00.000Z"
}
```

---

### 6. DELETE `/api/contact/:id` - Mesaj Sil
**Auth:** ✅ Gerekli (Admin)

```bash
curl -X DELETE https://ozpolatinsaat.tr/backend/api/contact/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Mesaj silindi"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Mesaj bulunamadı"
}
```

---

## 📊 TypeScript Interfaces

```typescript
// Contact Entity
interface Contact {
  id: string;           // UUID
  name: string;         // Ad Soyad
  email: string;        // E-posta
  phone: string | null; // Telefon (opsiyonel)
  subject: string;      // Konu
  message: string;      // Mesaj
  isRead: boolean;      // Okundu mu?
  isReplied: boolean;   // Yanıtlandı mı?
  adminNotes: string | null; // Admin notları
  ipAddress: string | null;  // IP adresi
  createdAt: Date;      // Oluşturma tarihi
  updatedAt: Date;      // Güncelleme tarihi
}

// Yeni mesaj gönderme DTO
interface CreateContactDto {
  name: string;
  email: string;
  phone?: string;
  subject: 'Genel Bilgi' | 'Teklif Talebi' | 'İş Birliği' | 'Şikayet / Öneri' | 'Diğer';
  message: string;
}

// Mesaj güncelleme DTO
interface UpdateContactDto {
  isRead?: boolean;
  isReplied?: boolean;
  adminNotes?: string;
}

// Başarılı mesaj gönderimi response
interface CreateContactResponse {
  success: true;
  message: string;
}

// Okunmamış mesaj sayısı response
interface UnreadCountResponse {
  count: number;
}

// Silme response
interface DeleteContactResponse {
  success: true;
  message: string;
}
```

---

## 🔐 Auth Token Alma

```bash
# Login yaparak token al
curl -X POST https://ozpolatinsaat.tr/backend/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ozpolatinsaat.tr",
    "password": "YOUR_PASSWORD"
  }'

# Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@ozpolatinsaat.tr"
  }
}
```

---

## ⚠️ HTTP Status Kodları

| Kod | Açıklama |
|-----|----------|
| 200 | Başarılı |
| 201 | Oluşturuldu (yeni mesaj) |
| 400 | Geçersiz istek (validasyon hatası) |
| 401 | Yetkisiz (token gerekli) |
| 404 | Bulunamadı |
| 500 | Sunucu hatası |

