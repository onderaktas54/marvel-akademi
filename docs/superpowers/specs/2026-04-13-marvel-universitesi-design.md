# Marvel Üniversitesi — Tasarım Dokümanı

## Özet

Kurgu bir üniversite web sitesi. Kadro ve öğrenciler Marvel evreninden karakterlerle doldurulur. Marvel API'den çekilen veriler statik JSON'a yazılır, site bu JSON'dan beslenen sade HTML/CSS/JS ile çalışır. Hobi projesi.

## Teknoloji

- **Frontend:** Sade HTML/CSS/JS (framework yok)
- **Veri kaynağı:** Marvel API (`developer.marvel.com`)
- **Build step:** Node.js scripti API'den veri çeker, `data/characters.json` üretir
- **Deploy:** Statik dosyalar — GitHub Pages veya herhangi bir statik hosting

## Sayfalar

### 1. Ana Sayfa (`index.html`)
- Üniversite adı ve hero banner
- Öne çıkan kadro kartları (3-4 karakter)
- Fakültelere kısa bakış/linkler
- Duyuru/slogan alanı

### 2. Kadro (`kadro.html`)
- Tüm karakterlerin kart grid'i
- Her kartta: görsel (thumbnail), isim, rol, fakülte
- Fakülteye göre filtreleme
- Karta tıklayınca karakter detay sayfasına yönlendirme

### 3. Karakter Detay (`karakter.html?id=<marvelId>`)
- Büyük karakter görseli
- İsim, rol, fakülte
- Biyografi (API'den gelen `description` alanı)
- Güçler/yetenekler listesi
- Yer aldığı comic sayısı (API'den `comics.available`)

### 4. Fakülteler (`fakulteler.html`)
- Fakülte kartları: isim, açıklama, kadro sayısı
- Her fakültenin altında o fakülteye atanmış karakterler

### 5. Hakkında (`hakkinda.html`)
- Kurgu kampüs hikayesi
- Misyon ve vizyon
- Kurgu iletişim bilgileri

## Rol Atama Mantığı

Karakterler Marvel API'den gelen verilerdeki seri/takım bilgisine göre kategorize edilir:

| Marvel Kategorisi | Üniversite Rolü |
|---|---|
| Avengers | Profesör |
| X-Men | Araştırma Görevlisi |
| Guardians of the Galaxy | Misafir Öğretim Üyesi |
| Villains (Thanos, Loki, Magneto vb.) | Dekanlık / Yönetim |
| Spider-verse (Spider-Man, Miles Morales vb.) | Öğrenci |
| Diğer | Asistan |

Atama scriptte yapılır ve JSON'a yazılır. Kategorize edilemeyen karakterler "Asistan" rolü alır.

## Fakülteler

| Fakülte | Açıklama | Örnek Karakterler |
|---|---|---|
| Süper Güç Mühendisliği | Fiziksel güçler ve dövüş sanatları | Thor, Hulk, Captain America |
| Kozmik Bilimler | Uzay ve boyutlar arası bilim | Thanos, Gamora, Star-Lord |
| Teknoloji ve Zırh Tasarımı | Mühendislik, yapay zeka, silah sistemleri | Iron Man, War Machine, Shuri |
| Büyü ve Mistik Sanatlar | Büyü, zaman manipülasyonu | Doctor Strange, Scarlet Witch, Loki |
| Strateji ve Liderlik | Taktik, espiyonaj, takım yönetimi | Nick Fury, Black Widow, Captain America |

Karakterin fakültesi, scriptte güç/seri bilgisine göre atanır. Bir karakter birden fazla fakülteye ait olabilir (örn. Captain America hem Süper Güç Müh. hem Strateji).

## Dosya Yapısı

```
1.ders/
├── index.html
├── kadro.html
├── fakulteler.html
├── hakkinda.html
├── karakter.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── data/
│   └── characters.json
├── scripts/
│   └── fetch-marvel.js
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-04-13-marvel-universitesi-design.md
```

## Veri Akışı

1. `scripts/fetch-marvel.js` çalıştırılır (Marvel API key + hash gerekli)
2. Script belirli karakter isimlerini/serilerini API'den çeker
3. Her karaktere rol ve fakülte atar
4. Sonucu `data/characters.json` olarak yazar
5. Site HTML dosyaları `js/main.js` aracılığıyla bu JSON'u fetch eder ve render eder

## Marvel API Notları

- Kayıt: `developer.marvel.com` üzerinden ücretsiz hesap
- Kimlik doğrulama: public key + ts + md5(ts + privateKey + publicKey) hash
- Rate limit: Günlük 3000 istek
- Görseller: API thumbnail URL verir (`path` + `extension` formatında)
- Lisans: "Data provided by Marvel. © 2026 Marvel" attribution zorunlu

## Stil

- **Renk paleti:** Koyu kırmızı (#B71C1C), siyah (#1a1a1a), beyaz (#ffffff), açık gri (#f5f5f5)
- **Font:** Sistem fontları (sans-serif stack)
- **Layout:** CSS Grid kart yapısı, responsive
- **Tema:** Marvel temalı, koyu tonlu, hero görselleri ön planda
