# Özpolat İnşaat - Backend API Dokümantasyonu

## 📁 Klasör Yapısı

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # TypeORM veritabanı konfigürasyonu
│   ├── entities/
│   │   ├── Project.ts           # Proje entity
│   │   ├── News.ts              # Haber entity
│   │   ├── Career.ts            # Kariyer ilanı entity
│   │   ├── Settings.ts          # Site ayarları entity
│   │   └── HeroSlide.ts         # Ana sayfa slider entity
│   ├── controllers/
│   │   ├── authController.ts    # Kimlik doğrulama işlemleri
│   │   ├── projectController.ts # Proje CRUD işlemleri
│   │   ├── newsController.ts    # Haber CRUD işlemleri
│   │   ├── careerController.ts  # Kariyer CRUD işlemleri
│   │   ├── settingsController.ts# Site ayarları işlemleri
│   │   └── uploadController.ts  # Dosya yükleme işlemleri
│   ├── routes/
│   │   ├── auth.ts              # /api/auth rotaları
│   │   ├── projects.ts          # /api/projects rotaları
│   │   ├── news.ts              # /api/news rotaları
│   │   ├── careers.ts           # /api/careers rotaları
│   │   ├── settings.ts          # /api/settings rotaları
│   │   └── upload.ts            # /api/upload rotaları
│   ├── middleware/
│   │   ├── auth.ts              # JWT doğrulama middleware
│   │   └── upload.ts            # Multer dosya yükleme middleware
│   └── index.ts                 # Ana giriş dosyası
├── uploads/                     # Yüklenen dosyalar
│   ├── projects/
│   ├── news/
│   ├── hero/
│   └── general/
├── package.json
├── tsconfig.json
├── .env
└── database.sqlite              # SQLite veritabanı dosyası
```

---

## 📦 Gerekli Paketler

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "typeorm": "^0.3.20",
    "reflect-metadata": "^0.2.1",
    "sqlite3": "^5.1.7",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5-lts.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "typescript": "^5.3.2",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6",
    "@types/multer": "^1.4.11",
    "@types/uuid": "^9.0.7",
    "@types/node": "^20.10.0"
  }
}
```

---

## ⚙️ Ortam Değişkenleri (.env)

```env
PORT=5000
JWT_SECRET=ozpolat-insaat-super-secret-key-2024
ADMIN_PASSWORD=ozpolat2024
CORS_ORIGIN=http://localhost:3000
```

---

## 🗄️ Entity'ler (Veritabanı Modelleri)

### 1. Project Entity

**Tablo adı:** `projects`

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | UUID (PK) | Benzersiz kimlik |
| title | string | Proje başlığı |
| description | text | Proje açıklaması |
| category | enum | `devam-eden` veya `tamamlanan` |
| image | string (nullable) | Ana görsel URL'i |
| location | string | Proje lokasyonu (örn: "Ankara, Çankaya") |
| year | string | Proje yılı |
| details | text (nullable) | Detaylı açıklama |
| gallery | JSON array (nullable) | Galeri görselleri URL listesi |
| createdAt | datetime | Oluşturulma tarihi (otomatik) |
| updatedAt | datetime | Güncellenme tarihi (otomatik) |

### 2. News Entity

**Tablo adı:** `news`

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | UUID (PK) | Benzersiz kimlik |
| title | string | Haber başlığı |
| content | text | Haber içeriği (tam metin) |
| excerpt | text | Kısa özet (liste görünümü için) |
| image | string (nullable) | Kapak görseli URL'i |
| date | string | Haber tarihi (YYYY-MM-DD formatında) |
| slug | string (unique) | SEO dostu URL (otomatik oluşturulur) |
| createdAt | datetime | Oluşturulma tarihi (otomatik) |
| updatedAt | datetime | Güncellenme tarihi (otomatik) |

### 3. Career Entity

**Tablo adı:** `careers`

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | UUID (PK) | Benzersiz kimlik |
| title | string | Pozisyon adı |
| department | string | Departman (örn: "İnşaat", "Muhasebe") |
| location | string | Çalışma lokasyonu |
| type | enum | `tam-zamanli`, `yari-zamanli`, `staj` |
| description | text | İş tanımı |
| requirements | JSON array | Gereksinimler listesi (string[]) |
| isActive | boolean | İlan aktif mi? (default: true) |
| createdAt | datetime | Oluşturulma tarihi (otomatik) |
| updatedAt | datetime | Güncellenme tarihi (otomatik) |

### 4. Settings Entity

**Tablo adı:** `settings`

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | integer (PK) | Her zaman 1 (tek kayıt) |
| companyName | string | Şirket adı |
| phone | string | Telefon numarası |
| email | string | E-posta adresi |
| address | string | Adres |
| workingHours | string | Çalışma saatleri |
| socialMedia | JSON | `{facebook, instagram, linkedin, twitter}` |
| stats | JSON | `{experience, ongoingProjects, completedProjects}` |
| aboutText | text | Hakkımızda metni |
| missionText | text | Misyon metni |
| visionText | text | Vizyon metni |

**İlişki:** Settings → HeroSlide (OneToMany)

### 5. HeroSlide Entity

**Tablo adı:** `hero_slides`

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | UUID (PK) | Benzersiz kimlik |
| title | string | Ana başlık |
| subtitle | string (nullable) | Üst başlık (örn: "KURUMSAL") |
| description | text (nullable) | Açıklama metni |
| image | string (nullable) | Arka plan görseli URL'i |
| ctaText | string (nullable) | Buton metni |
| ctaLink | string (nullable) | Buton linki |
| order | integer | Sıralama (0, 1, 2...) |
| settingsId | FK | Settings tablosuna referans |

---

## 🛣️ API Endpoints

### Authentication

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/api/auth/login` | Admin girişi | ❌ |
| GET | `/api/auth/check` | Token geçerliliği kontrolü | ✅ |
| POST | `/api/auth/logout` | Çıkış | ❌ |

**POST /api/auth/login**
```json
// Request Body
{
  "password": "ozpolat2024"
}

// Response (200)
{
  "success": true,
  "message": "Giriş başarılı",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

// Response (401)
{
  "error": "Hatalı şifre"
}
```

---

### Projects

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/projects` | Tüm projeleri getir | ❌ |
| GET | `/api/projects/:id` | Tek proje getir | ❌ |
| POST | `/api/projects` | Yeni proje oluştur | ✅ |
| PUT | `/api/projects/:id` | Proje güncelle | ✅ |
| DELETE | `/api/projects/:id` | Proje sil | ✅ |

**GET /api/projects**
```json
// Response (200)
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Ankara Konut Projesi",
    "description": "120 daireli modern konut projesi",
    "category": "devam-eden",
    "image": "/uploads/projects/abc123.jpg",
    "location": "Ankara, Çankaya",
    "year": "2024",
    "details": "Detaylı açıklama...",
    "gallery": ["/uploads/projects/1.jpg", "/uploads/projects/2.jpg"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**POST /api/projects**
```json
// Request Body
{
  "title": "Yeni Proje",
  "description": "Proje açıklaması",
  "category": "devam-eden",
  "image": "/uploads/projects/image.jpg",
  "location": "İstanbul",
  "year": "2024",
  "details": "Detaylı bilgi",
  "gallery": []
}

// Response (201)
{
  "id": "generated-uuid",
  "title": "Yeni Proje",
  ...
}
```

---

### News

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/news` | Tüm haberleri getir | ❌ |
| GET | `/api/news/:id` | Tek haber getir (id veya slug ile) | ❌ |
| POST | `/api/news` | Yeni haber oluştur | ✅ |
| PUT | `/api/news/:id` | Haber güncelle | ✅ |
| DELETE | `/api/news/:id` | Haber sil | ✅ |

**POST /api/news**
```json
// Request Body
{
  "title": "Yeni İhale Kazanıldı",
  "content": "Tam haber içeriği...",
  "excerpt": "Kısa özet...",
  "image": "/uploads/news/image.jpg",
  "date": "2024-01-15"
}

// Response (201)
{
  "id": "generated-uuid",
  "title": "Yeni İhale Kazanıldı",
  "slug": "yeni-ihale-kazanildi",  // Otomatik oluşturulur
  ...
}
```

**Slug Oluşturma Algoritması:**
```typescript
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};
```

---

### Careers

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/careers` | Tüm ilanları getir | ❌ |
| GET | `/api/careers/:id` | Tek ilan getir | ❌ |
| POST | `/api/careers` | Yeni ilan oluştur | ✅ |
| PUT | `/api/careers/:id` | İlan güncelle | ✅ |
| DELETE | `/api/careers/:id` | İlan sil | ✅ |

**POST /api/careers**
```json
// Request Body
{
  "title": "Şantiye Şefi",
  "department": "İnşaat",
  "location": "Ankara",
  "type": "tam-zamanli",
  "description": "Şantiye yönetimi...",
  "requirements": [
    "İnşaat Mühendisliği mezunu",
    "En az 5 yıl deneyim",
    "B sınıfı ehliyet"
  ],
  "isActive": true
}
```

---

### Settings

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/settings` | Site ayarlarını getir | ❌ |
| PUT | `/api/settings` | Site ayarlarını güncelle | ✅ |

**GET /api/settings**
```json
// Response (200)
{
  "id": 1,
  "companyName": "Özpolat İnşaat",
  "phone": "+90 312 000 00 00",
  "email": "info@ozpolatinsaat.tr",
  "address": "Ankara, Türkiye",
  "workingHours": "Pazartesi - Cuma: 09:00 - 18:00",
  "socialMedia": {
    "facebook": "https://facebook.com/ozpolatinsaat",
    "instagram": "https://instagram.com/ozpolatinsaat",
    "linkedin": "https://linkedin.com/company/ozpolatinsaat",
    "twitter": "https://twitter.com/ozpolatinsaat"
  },
  "stats": {
    "experience": 20,
    "ongoingProjects": 5,
    "completedProjects": 150
  },
  "aboutText": "Hakkımızda metni...",
  "missionText": "Misyon metni...",
  "visionText": "Vizyon metni...",
  "heroSlides": [
    {
      "id": "uuid",
      "title": "Güvenle İnşa Ediyoruz",
      "subtitle": "KURUMSAL",
      "description": "Açıklama...",
      "image": "https://...",
      "ctaText": "Hakkımızda",
      "ctaLink": "/kurumsal",
      "order": 0
    }
  ]
}
```

**PUT /api/settings**
```json
// Request Body (partial update desteklenir)
{
  "companyName": "Özpolat İnşaat A.Ş.",
  "stats": {
    "experience": 21,
    "ongoingProjects": 6,
    "completedProjects": 160
  },
  "heroSlides": [
    {
      "title": "Yeni Başlık",
      "subtitle": "YENİ",
      "description": "Yeni açıklama",
      "image": "/uploads/hero/new.jpg",
      "ctaText": "İncele",
      "ctaLink": "/projeler"
    }
  ]
}
```

---

### Upload

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/api/upload` | Tek dosya yükle | ✅ |
| POST | `/api/upload/multiple` | Çoklu dosya yükle | ✅ |

**POST /api/upload**
```
Content-Type: multipart/form-data

Form Fields:
- file: (binary) Yüklenecek dosya
- folder: (string) Hedef klasör (projects, news, hero, general)
```

```json
// Response (200)
{
  "success": true,
  "url": "/uploads/projects/abc123-uuid.jpg",
  "filename": "abc123-uuid.jpg"
}
```

**Desteklenen Formatlar:** JPEG, PNG, WEBP, GIF  
**Maksimum Boyut:** 10MB

---

## 🔐 Authentication Middleware

Her korumalı endpoint için `Authorization` header'ı gerekli:

```
Authorization: Bearer <token>
```

**Middleware Mantığı:**
```typescript
// 1. Header'dan token'ı al
const token = req.headers.authorization?.split(' ')[1];

// 2. Token yoksa 401 dön
if (!token) return res.status(401).json({ error: 'Yetkilendirme gerekli' });

// 3. Token'ı doğrula
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  req.userId = decoded.userId;
  next();
} catch {
  return res.status(401).json({ error: 'Geçersiz token' });
}
```

---

## 📤 Upload Middleware (Multer)

**Konfigürasyon:**
```typescript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.folder || 'general';
    cb(null, `uploads/${folder}`);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuid()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  cb(null, allowed.includes(file.mimetype));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});
```

---

## 🚀 Başlatma

```bash
# 1. Backend klasörüne git
cd backend

# 2. Paketleri yükle
npm install

# 3. .env dosyasını oluştur
cp .env.example .env

# 4. Development modunda başlat
npm run dev

# 5. Production build
npm run build
npm start
```

---

## 🔗 Frontend Entegrasyonu

Frontend'de API'ye bağlanmak için:

```typescript
// lib/api.ts
const API_BASE = 'http://localhost:5000/api';

// Token'ı localStorage'da sakla
const getToken = () => localStorage.getItem('admin_token');

// Her istekte token ekle
const fetchAPI = async (endpoint: string, options?: RequestInit) => {
  const token = getToken();
  
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });
  
  if (!res.ok) throw new Error('Request failed');
  return res.json();
};

// Kullanım
const projects = await fetchAPI('/projects');
const newProject = await fetchAPI('/projects', {
  method: 'POST',
  body: JSON.stringify({ title: 'Test', ... })
});
```

---

## 📝 Notlar

1. **İlk çalıştırmada** SQLite veritabanı otomatik oluşturulur
2. **Settings tablosu** ilk GET isteğinde varsayılan değerlerle oluşturulur
3. **Uploads klasörü** backend/uploads altında saklanır
4. **Static files** `/uploads/*` path'i ile erişilebilir
5. **CORS** sadece frontend origin'ine izin verir

---

## 🐛 Hata Kodları

| Kod | Anlam |
|-----|-------|
| 200 | Başarılı |
| 201 | Oluşturuldu |
| 400 | Geçersiz istek |
| 401 | Yetkisiz (token yok/geçersiz) |
| 404 | Bulunamadı |
| 500 | Sunucu hatası |

Her hata response'u şu formatta:
```json
{
  "error": "Hata mesajı"
}
```

