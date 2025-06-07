## 🌐 MikroWeb v2.0.1 - Fullstack Hotspot Dashboard 🔥

MikroWeb adalah sistem dashboard hotspot berbasis **MikroTik RouterOS** yang terhubung ke **Firebase** dan **PHP**, memungkinkan kamu mengelola user hotspot, topup paket, tracking statistik, dan automasi jadwal kadaluarsa akun user.

> 🔐 Fullstack & Secure — Backend dengan PHP + Firebase Auth + Firebase Realtime Database. Frontend pakai HTML + JS (Jekyll friendly).

---

## 🚀 Fitur Utama

- 🔐 Login dengan Firebase Auth
- 📡 Integrasi Mikrotik API (PEAR2 RouterOS Client)
- 💳 Topup user langsung dari dashboard (enable user expired)
- 📜 Scheduler otomatis: disable user setelah masa aktif habis
- ✅ Tidak perlu generate Voucher / Print / Kertas
- 📈 Statistik penggunaan dan income harian/bulanan
- 🛠️ Settings Router, Paket Hotspot, dan Bandwidth
- 📁 Struktur folder rapi dan terpisah (modular)
- PPPoE (soon)

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
### Bonus template login hotspot mikrotik nonvoucher
|  Login hotspot  |
|-----------------|
| ![](/hotspot/img/WiFiLogin.png) |


##  ✅ Script Lengkap (Gabungan)

### script on-login yang dipakai.
```rsc
{
  :local date [ /system clock get date ];                          # Ambil tanggal hari ini
  :local year [ :pick $date 7 11 ];                                # Ambil tahun (dari string date)
  :local month [ :pick $date 0 3 ];                                # Ambil bulan dalam huruf (Jan, Feb, dst)

  :local comment [ /ip hotspot user get [find where name="$user"] comment]; # Ambil comment dari user
  :local ucode [:pick $comment 0 2];                               # Ambil 2 karakter pertama (kalo ada tag khusus)

  :if ($ucode = "up" or $comment = "") do={                        # Kalau belum ada comment yang valid
    /system scheduler add name="$user" disable=no start-date=$date interval="1d";

    :delay 2s; # Nunggu scheduler kebentuk

    :local exp [ /system scheduler get [find where name="$user"] next-run]; # Ambil waktu next-run scheduler

    :local getxp [len $exp];
    :if ($getxp = 15) do={                                         # Format panjang (misal: "jun/06 13:05:00")
      :local d [:pick $exp 0 6];                                   # Ambil tanggal
      :local t [:pick $exp 7 16];                                  # Ambil jam
      :local s ("/");
      :local exp ("$d$s$year $t");                                 # Gabungkan jadi format final
      /ip hotspot user set comment=$exp [find where name="$user"];
    };

    :if ($getxp = 8) do={                                          # Format pendek (kalau ada case aneh)
      /ip hotspot user set comment="$date $exp" [find where name="$user"];
    };

    :if ($getxp > 15) do={                                         # Kalau format panjang tapi gak pas
      /ip hotspot user set comment=$exp [find where name="$user"];
    };

    /system scheduler remove [find where name="$user"];           # Hapus scheduler dummy tadi

    [:local mac $"mac-address";                                   # Set MAC address
     /ip hotspot user set mac-address=$mac [find where name=$user]];
  }
}
```
---

### script on-event yang dipakai.
```rsc
:local dateint do={
  :local montharray {"jan";"feb";"mar";"apr";"may";"jun";"jul";"aug";"sep";"oct";"nov";"dec"};
  :local days [:pick $d 4 6];
  :local month [:pick $d 0 3];
  :local year [:pick $d 7 11];
  :local monthint [:find $montharray $month];
  :set month ($monthint + 1);
  :if ([:len $month] = 1) do={:set month ("0".$month);}
  :return [:tonum ($year.$month.$days)];
}

:local timeint do={
  :local hours [:pick $t 0 2];
  :local minutes [:pick $t 3 5];
  :return ($hours * 60 + $minutes);
}

:local date [/system clock get date];
:local time [/system clock get time];
:local today [$dateint d=$date];
:local curtime [$timeint t=$time];

:foreach i in=[/ip hotspot user find] do={
  :local comment [/ip hotspot user get $i comment];
  :local name [/ip hotspot user get $i name];
  :if ([:len $comment] >= 19) do={
    :if ([:pick $comment 2 3] = "/" && [:pick $comment 5 6] = "/") do={
      :local gettime [:pick $comment 11 16];
      :local expd [$dateint d=$comment];
      :local expt [$timeint t=$gettime];

      :if (($expd < $today) or ($expd = $today and $expt < $curtime)) do={
        /ip hotspot user set $i limit-uptime=1s;
        :foreach a in=[/ip hotspot active find where user=$name] do={
          /ip hotspot active remove $a;
        }
      }
    }
  }
}
```

## 🧠 Catatan Penting

Script on-login langsung nempel ke user-profile, bukan user individu → jadi semua user yang pakai profile ini akan pakai script itu.

Scheduler AutoKiller_* akan berjalan setiap 30 detik untuk cek siapa yang expired → scalable, tapi jangan terlalu sering kalau router kamu low resource.

Kalau kamu mau bikin hanya 1 scheduler global untuk semua profile (bukan per profile), kamu bisa pisah prosesnya. Tapi ini udah auto dari PHP.

---

## 🖼️ Screenshot

| Dashboard Admin | User List |
|-----------------|------------|
| ![](/frontend/assets/images/dashboard.png) | ![](/frontend/assets/images/users.png) |

| Dashboard Setting | Terminal |
|-----------------|------------|
| ![](/frontend/assets/images/settings.png) | ![](/frontend/assets/images/terminal.png) |

| Dash Mobile | User Mobile |
|-----------------|------------|
| ![](/frontend/assets/images/mobiledashboard.png) | ![](/frontend/assets/images/mobileusers.png) |

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
```pgsql
Method	Endpoint	Keterangan
POST	/push_topup.php	TopUp user & jadwal expired
POST	/routerOs/tambah_user.php	Tambah user ke Mikrotik
GET	/conn/router_connect.php	Test koneksi router
```

## ❤️ Credits
PEAR2 RouterOS Library

Firebase PHP SDK by kreait/firebase-php

Bootstrap, JS, Jekyll compatible

### 🔐 Lisensi
MIT License — bebas dipakai & dimodifikasi, tapi bantu kasih credit ya kalau open source. ❤️

### ✉️ Kontak
Kalau kamu butuh bantuan, rules database, atau punya ide kolaborasi, kontak saya.


