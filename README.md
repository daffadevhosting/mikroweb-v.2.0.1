## 🌐 MikroWeb v.2.0.1 - Fullstack Dashboard Hotspot 🔥

[![GitHub stars](https://img.shields.io/github/stars/putridinar/mikroweb-v.2.0.1.svg)](https://github.com/putridinar/mikroweb-v.2.0.1/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/putridinar/mikroweb-v.2.0.1.svg)](https://github.com/putridinar/mikroweb-v.2.0.1/network)
[![Last Commit](https://img.shields.io/github/last-commit/putridinar/mikroweb-v.2.0.1.svg)](https://github.com/putridinar/mikroweb-v.2.0.1/commits/main)

MikroWeb adalah **open-source hotspot management tool** untuk **MikroTik RouterOS**, menggunakan **PHP backend, Firebase Realtime Database**, dan frontend ringan berbasis **Jekyll**. Cocok untuk **ISP lokal, RT/RW Net**, dan **warung internet** yang ingin mengelola user secara otomatis dan efisien.

> 🔐 Fullstack & Secure — Backend dengan PHP + Firebase Auth + Firebase Realtime Database. Frontend pakai HTML + JS (Jekyll friendly).

---

## 🌍 Live Demo
Kamu bisa melihat demo dashboard online di sini:

👉 [Demo Dummy](https://dummy-mikroweb.pages.dev)

Project ini juga bisa di-deploy ke [Cloudflare Pages](https://pages.cloudflare.com).


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
:put (",ntf,,enable,")

:local userComment [/ip hotspot user get [find where name="$user"] comment]

# ✅ Lewati jika sudah ada comment yang berisi "exp:"
:if ([:pick $userComment 0 4] != "exp:") do={

  :local curDate [/system clock get date]   ;# format: jun/07/2025
  :local curTime [/system clock get time]   ;# format: 07:40:02

  # Tambahkan scheduler sebagai placeholder expired
  /system scheduler add name="exp-$user" interval=1d start-date=$curDate start-time=$curTime on-event=":log info expired-$user" comment="temp"

  # Ambil scheduler `next-run` pakai polling (maks 5 detik)
  :local expireTime ""
  :local count 0
  :do {
    :set expireTime [/system scheduler get [find where name="exp-$user"] next-run]
    :if ($expireTime != "") do={ :set count 99 } else={ :delay 1s }
    :set count ($count + 1)
  } while=($count < 5)

  # Format ulang next-run menjadi "exp:DD/MM/YYYY HH:MM"
  :if ($expireTime != "") do={

    # Contoh hasil: "jun/08/2025 07:40:00"
    :local rawDate [:pick $expireTime 0 11]
    :local rawTime [:pick $expireTime 12 17]

    :local day [:pick $rawDate 4 6]
    :local monthStr [:pick $rawDate 0 3]
    :local year [:pick $rawDate 7 11]

    # Konversi month ke angka
    :local monthArray {"jan"=1;"feb"=2;"mar"=3;"apr"=4;"may"=5;"jun"=6;"jul"=7;"aug"=8;"sep"=9;"oct"=10;"nov"=11;"dec"=12}
    :local monthNum ($monthArray->$monthStr)
    :if ([:len $monthNum] = 1) do={ :set monthNum ("0" . $monthNum) }

    :local formattedDate ("exp:" . $day . "/" . $monthNum . "/" . $year . " " . $rawTime)

    # Set comment user dengan format yang dikenali auto-kick script
    /ip hotspot user set [find where name="$user"] comment=$formattedDate
  }

  # Hapus scheduler setelah selesai
  /system scheduler remove [find where name="exp-$user"]
}
```
---

### script on-event yang dipakai.
```rsc
:local name "{$name}"

:local dateint do={
  :local montharray ( "jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec" );
  :local days [:pick $d 4 6];
  :local month [:pick $d 0 3];
  :local year [:pick $d 7 11];
  :local monthint ([:find $montharray $month]);
  :local month ($monthint + 1);
  :if ( [len $month] = 1) do={:return [:tonum ("$year0$month$days")];} else={:return [:tonum ("$year$month$days")];}
};

:local timeint do={ :local hours [:pick $t 0 2]; :local minutes [:pick $t 3 5]; :return ($hours * 60 + $minutes); };

:local date [/system clock get date];
:local time [/system clock get time];
:local today [$dateint d=$date];
:local curtime [$timeint t=$time];

:foreach i in=[/ip hotspot user find where profile=$name] do={
  :local comment [/ip hotspot user get $i comment];
  :local uname [/ip hotspot user get $i name];

  :if ([:pick $comment 0 4] = "exp:") do={
    :local expdate [:pick $comment 4 14];
    :local exptime [:pick $comment 15 20];

    :local expd [$dateint d=$expdate];
    :local expt [$timeint t=$exptime];

    :if (($expd < $today) or ($expd = $today and $expt < $curtime)) do={
      /ip hotspot user set limit-uptime=1s $i
      /ip hotspot active remove [find where user=$uname]
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
git clone https://github.com/putridinar/mikroweb-v.2.0.1.git
cd mikroweb-v.2.0.1
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

## 🔎 Keywords
mikrotik hotspot manager, mikrotik dashboard, hotspot voucherless, rt rw net system, wifi management php, firebase hotspot panel, routerOS API PHP, open source mikrotik frontend

## ❤️ Credits
PEAR2 RouterOS Library

Firebase PHP SDK by kreait/firebase-php

Bootstrap, JS, Jekyll compatible

### 🔐 Lisensi
MIT License — bebas dipakai & dimodifikasi, tapi bantu kasih credit ya kalau open source. ❤️

### ✉️ Kontak
Kalau kamu butuh bantuan, rules database, atau punya ide kolaborasi, kontak saya.


