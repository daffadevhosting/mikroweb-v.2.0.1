# 🌐 MikroWeb v2.0.1 - Fullstack Hotspot Dashboard 🔥

MikroWeb adalah sistem dashboard hotspot berbasis **MikroTik RouterOS** yang terhubung ke **Firebase** dan **PHP**, memungkinkan kamu mengelola user hotspot, topup paket, tracking statistik, dan automasi jadwal kadaluarsa akun user.

> 🔐 Fullstack & Secure — Backend dengan PHP + Firebase Auth + Firebase Realtime Database. Frontend pakai HTML + JS (Jekyll friendly).

---

## 🚀 Fitur Utama

- 🔐 Login dengan Firebase Auth
- 📡 Integrasi Mikrotik API (PEAR2 RouterOS Client)
- 💳 Topup user langsung dari dashboard (enable user expipred)
- 📜 Scheduler otomatis: disable user setelah masa aktif habis
- 📈 Statistik penggunaan dan income harian/bulanan
- 🛠️ Settings Router, Paket Hotspot, dan Bandwidth
- 📁 Struktur folder rapi dan terpisah (modular)

---

## 🗂️ Struktur Folder

```pgsql
/project-root
├── backend/
├── secret/
│   └── firebase-adminsdk.json
├─── php/
│   ├── vendor/PEAR2/Net/RouterOS/...
│   ├── firebase_init.php
│   ├── device_info.php
│   ├── user_stats.php
│   └── ...
├──── vendor/
├── frontend/
│   ├── index.html
│   ├── dashboard.js
│   ├── assets/css/main.css
│   ├── desktop/
│   ├── mobile/
├── .env
└── README.md
```

---

## 🖼️ Screenshot

| Dashboard Admin | User List |
|-----------------|------------|
| ![](/frontend/dashboard.png) | ![](/frontend/users.png) |

| Dashboard Mobile | User Mobile |
|-----------------|------------|
| ![](/frontend/mobiledasboard.png) | ![](/frontend/mobileuser.png) |

---

### 1. **Clone project**

```bash
git clone https://github.com/putridinar/mikroweb-v2.0.1.git
cd mikroweb-v2.0.1
```

## 🔧 Setup & Install

### 2. Pasang Dependensi

PEAR2 RouterOS Library disimpan secara manual di ```backend/php/vendor/PEAR2```

Pastikan file ```firebase-adminsdk.json``` tersedia di folder ```/secret/```

### 3. Konfigurasi .env

Buat file ```.env``` di root backend atau ```php/```:
```ini
FIREBASE_API_KEY=...
FIREBASE_PROJECT_ID=...
FIREBASE_DB_URL=...
FIREBASE_CREDENTIAL_PATH=/path/ke/firebase-adminsdk.json
```
Buat file ```.env``` di root frontend:
```ini
api_key=******************-aWSjhk0FZ4
auth_domain=projectkamu.firebaseapp.com
database_url=https://projectkamu-default-rtdb.bandung-dagopakar1.firebasedatabase.app
project_id=lalajo-bokep
storage_bucket=projectkamu.firebasestorage.app
sender_id=0987654321
app_id=1:app:web:1234567890
measure_id=G-************
php_url=http://localhost:5000
```
### 4. Jalankan dengan Localhost

Jalankan server lokal untuk mengakses backend:
```bash
composer install
php -S localhost:5000
```
Jalankan server lokal untuk mengakses frontend:
```bash
bundle install
bundle exec jekyll serve
```
Untuk menjalankan keduanya secara bersamaan di linux:
```bash
chmod +x run.sh
./run.sh
```

Pastikan PHP berjalan di backend untuk endpoint API.

---

## ✅ Endpoint Penting
Method	Endpoint	Keterangan
POST	/push_topup.php	TopUp user & jadwal expired
POST	/routerOs/tambah_user.php	Tambah user ke Mikrotik
GET	/conn/router_connect.php	Test koneksi router

## ❤️ Credits
PEAR2 RouterOS Library

Firebase PHP SDK by kreait/firebase-php

Bootstrap, JS, Jekyll compatible

### 🔐 Lisensi
MIT License — bebas dipakai & dimodifikasi, tapi bantu kasih credit ya kalau open source. ❤️

### ✉️ Kontak
Kalau kamu butuh bantuan, rules database, atau punya ide kolaborasi, kontak saya.


