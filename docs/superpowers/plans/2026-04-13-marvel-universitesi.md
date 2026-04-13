# Marvel Üniversitesi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Marvel karakterlerinden oluşan kurgu bir üniversite web sitesi oluşturmak.

**Architecture:** Node.js scripti Marvel API'den karakter verilerini çekip `data/characters.json` dosyasına yazar. Statik HTML sayfaları bu JSON'u `fetch()` ile okuyup vanilla JS ile render eder. Çoklu HTML sayfası, tek CSS, tek JS dosyası.

**Tech Stack:** HTML, CSS (Grid/Flexbox), Vanilla JS, Node.js (fetch scripti), Marvel API

---

## Dosya Yapısı

| Dosya | Sorumluluk |
|---|---|
| `scripts/fetch-marvel.js` | Marvel API'den karakter çeker, rol/fakülte atar, JSON yazar |
| `data/characters.json` | Tüm karakter verisi (script tarafından üretilir) |
| `css/style.css` | Tüm sayfalarda ortak stil |
| `js/main.js` | JSON yükleme, kart render, filtreleme, sayfa routing mantığı |
| `index.html` | Ana sayfa |
| `kadro.html` | Kadro listesi |
| `karakter.html` | Karakter detay sayfası (query param ile) |
| `fakulteler.html` | Fakülteler listesi |
| `hakkinda.html` | Hakkında sayfası |

---

### Task 1: Proje İskeleti ve Örnek Veri

**Files:**
- Create: `data/characters.json`
- Create: `scripts/fetch-marvel.js` (boş placeholder)

Bu task'ta gerçek API bağlantısı kurmadan önce, geliştirme sırasında kullanılacak örnek bir `characters.json` oluşturuyoruz. Böylece frontend geliştirmesi API'ye bağımlı olmadan ilerleyebilir.

- [ ] **Step 1: Proje dizinlerini oluştur**

```bash
mkdir -p data scripts css js
```

- [ ] **Step 2: Örnek characters.json oluştur**

`data/characters.json` dosyasını aşağıdaki içerikle oluştur:

```json
{
  "meta": {
    "fetchedAt": "2026-04-13",
    "attribution": "Data provided by Marvel. © 2026 Marvel"
  },
  "characters": [
    {
      "id": 1009368,
      "name": "Iron Man",
      "description": "Wounded, captured and forced to build a weapon by his enemies, billionaire industrialist Tony Stark instead created an advanced suit of armor to save his life and escape captivity.",
      "thumbnail": "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55.jpg",
      "role": "Profesör",
      "faculty": "Teknoloji ve Zırh Tasarımı",
      "category": "avengers",
      "comicsCount": 2600,
      "powers": ["Genius-level intellect", "Powered armor suit", "Flight"]
    },
    {
      "id": 1009664,
      "name": "Thor",
      "description": "Thor is the Asgardian God of Thunder and the son of Odin, the All-Father.",
      "thumbnail": "https://i.annihil.us/u/prod/marvel/i/mg/d/d0/5269657a74350.jpg",
      "role": "Profesör",
      "faculty": "Süper Güç Mühendisliği",
      "category": "avengers",
      "comicsCount": 1700,
      "powers": ["Superhuman strength", "Mjolnir", "Lightning control"]
    },
    {
      "id": 1009220,
      "name": "Captain America",
      "description": "Vowing to serve his country any way he could, young Steve Rogers took the super soldier serum to become America's one-man army.",
      "thumbnail": "https://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087.jpg",
      "role": "Profesör",
      "faculty": "Strateji ve Liderlik",
      "category": "avengers",
      "comicsCount": 2400,
      "powers": ["Super soldier serum", "Vibranium shield", "Master tactician"]
    },
    {
      "id": 1009282,
      "name": "Doctor Strange",
      "description": "Dr. Stephen Strange is the Sorcerer Supreme, the primary protector of Earth against magical and mystical threats.",
      "thumbnail": "https://i.annihil.us/u/prod/marvel/i/mg/5/f0/5261a85a501fe.jpg",
      "role": "Profesör",
      "faculty": "Büyü ve Mistik Sanatlar",
      "category": "avengers",
      "comicsCount": 800,
      "powers": ["Sorcery", "Time manipulation", "Dimensional travel"]
    },
    {
      "id": 1009652,
      "name": "Thanos",
      "description": "The Mad Titan Thanos, a filtered through his obsession with Death, is one of the most powerful villains in the Marvel Universe.",
      "thumbnail": "https://i.annihil.us/u/prod/marvel/i/mg/6/40/5274137e3e2cd.jpg",
      "role": "Rektör",
      "faculty": "Kozmik Bilimler",
      "category": "villain",
      "comicsCount": 400,
      "powers": ["Cosmic power", "Superhuman strength", "Genius intellect"]
    },
    {
      "id": 1009407,
      "name": "Loki",
      "description": "Loki is the God of Mischief and the adopted son of Odin.",
      "thumbnail": "https://i.annihil.us/u/prod/marvel/i/mg/d/90/5261a6eed4b16.jpg",
      "role": "Dekan",
      "faculty": "Büyü ve Mistik Sanatlar",
      "category": "villain",
      "comicsCount": 500,
      "powers": ["Sorcery", "Shapeshifting", "Illusion casting"]
    },
    {
      "id": 1009610,
      "name": "Spider-Man",
      "description": "Bitten by a radioactive spider, high school student Peter Parker gained the speed, strength and powers of a spider.",
      "thumbnail": "https://i.annihil.us/u/prod/marvel/i/mg/9/30/538cd33e15ab7.jpg",
      "role": "Öğrenci",
      "faculty": "Teknoloji ve Zırh Tasarımı",
      "category": "spider-verse",
      "comicsCount": 4000,
      "powers": ["Wall-crawling", "Spider-sense", "Web-shooting"]
    },
    {
      "id": 1010733,
      "name": "Star-Lord",
      "description": "Peter Quill is Star-Lord, the half-human, half-alien leader of the Guardians of the Galaxy.",
      "thumbnail": "https://i.annihil.us/u/prod/marvel/i/mg/9/a0/537bc55e8b1f5.jpg",
      "role": "Misafir Öğretim Üyesi",
      "faculty": "Kozmik Bilimler",
      "category": "guardians",
      "comicsCount": 300,
      "powers": ["Expert marksman", "Master tactician", "Element Gun"]
    },
    {
      "id": 1009629,
      "name": "Storm",
      "description": "Ororo Monroe is a mutant with the ability to control the weather.",
      "thumbnail": "https://i.annihil.us/u/prod/marvel/i/mg/6/40/526963dad214d.jpg",
      "role": "Araştırma Görevlisi",
      "faculty": "Süper Güç Mühendisliği",
      "category": "x-men",
      "comicsCount": 1200,
      "powers": ["Weather manipulation", "Flight", "Energy projection"]
    },
    {
      "id": 1009718,
      "name": "Wolverine",
      "description": "Born with super-human senses and the power to heal from almost any wound, Wolverine was unwillingly transformed into a living weapon.",
      "thumbnail": "https://i.annihil.us/u/prod/marvel/i/mg/2/60/537bcaef0f6cf.jpg",
      "role": "Araştırma Görevlisi",
      "faculty": "Strateji ve Liderlik",
      "category": "x-men",
      "comicsCount": 3000,
      "powers": ["Adamantium claws", "Healing factor", "Enhanced senses"]
    },
    {
      "id": 1009189,
      "name": "Black Widow",
      "description": "Natasha Romanoff is one of the most skilled spies and assassins in the world.",
      "thumbnail": "https://i.annihil.us/u/prod/marvel/i/mg/f/30/50fecad1f395b.jpg",
      "role": "Profesör",
      "faculty": "Strateji ve Liderlik",
      "category": "avengers",
      "comicsCount": 500,
      "powers": ["Expert martial artist", "Espionage", "Weapons specialist"]
    },
    {
      "id": 1009351,
      "name": "Hulk",
      "description": "Caught in a gamma bomb explosion while trying to save the life of a teenager, Dr. Bruce Banner was transformed into the incredibly powerful creature called the Hulk.",
      "thumbnail": "https://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0.jpg",
      "role": "Profesör",
      "faculty": "Süper Güç Mühendisliği",
      "category": "avengers",
      "comicsCount": 1800,
      "powers": ["Superhuman strength", "Healing factor", "Gamma radiation"]
    }
  ]
}
```

- [ ] **Step 3: Boş fetch script placeholder oluştur**

`scripts/fetch-marvel.js` dosyasını oluştur:

```javascript
// Marvel API fetch script
// Task 7'de implement edilecek
// Kullanım: MARVEL_PUBLIC_KEY=xxx MARVEL_PRIVATE_KEY=yyy node scripts/fetch-marvel.js

console.log("TODO: Marvel API fetch script - Task 7'de implement edilecek");
```

- [ ] **Step 4: Commit**

```bash
git init
git add data/characters.json scripts/fetch-marvel.js
git commit -m "chore: add project skeleton with sample character data"
```

---

### Task 2: Ortak CSS Stili

**Files:**
- Create: `css/style.css`

Tüm sayfalar için ortak stil. Marvel temalı koyu renk paleti, responsive grid layout, kart bileşeni, navigasyon.

- [ ] **Step 1: style.css oluştur**

`css/style.css` dosyasını aşağıdaki içerikle oluştur:

```css
/* === Reset & Base === */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --red: #B71C1C;
  --red-dark: #7f0000;
  --black: #1a1a1a;
  --dark-gray: #2c2c2c;
  --gray: #444;
  --light-gray: #f5f5f5;
  --white: #ffffff;
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: var(--black);
  color: var(--white);
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a {
  color: var(--white);
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}

/* === Navigation === */
.navbar {
  background-color: var(--red);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.navbar__logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.navbar__links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

.navbar__links a {
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.navbar__links a:hover,
.navbar__links a.active {
  background-color: var(--red-dark);
}

/* === Hero Banner === */
.hero {
  background: linear-gradient(135deg, var(--red-dark), var(--black));
  padding: 4rem 2rem;
  text-align: center;
}

.hero__title {
  font-size: 3rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 1rem;
}

.hero__subtitle {
  font-size: 1.2rem;
  color: var(--light-gray);
  max-width: 600px;
  margin: 0 auto;
}

/* === Section === */
.section {
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.section__title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  border-left: 4px solid var(--red);
  padding-left: 1rem;
}

/* === Card Grid === */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* === Character Card === */
.card {
  background-color: var(--dark-gray);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(183, 28, 28, 0.3);
}

.card__image {
  width: 100%;
  height: 280px;
  object-fit: cover;
}

.card__body {
  padding: 1rem;
}

.card__name {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.card__role {
  font-size: 0.85rem;
  color: var(--red);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card__faculty {
  font-size: 0.8rem;
  color: #aaa;
  margin-top: 0.25rem;
}

/* === Faculty Card === */
.faculty-card {
  background: linear-gradient(145deg, var(--dark-gray), var(--gray));
  border-radius: 8px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
}

.faculty-card__title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--red);
}

.faculty-card__desc {
  font-size: 0.9rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.faculty-card__count {
  font-size: 0.8rem;
  color: #888;
}

/* === Character Detail === */
.detail {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  padding: 3rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.detail__image {
  width: 100%;
  border-radius: 8px;
  box-shadow: var(--card-shadow);
}

.detail__name {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}

.detail__role {
  color: var(--red);
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.detail__faculty {
  color: #aaa;
  margin-bottom: 1.5rem;
}

.detail__description {
  line-height: 1.8;
  color: #ddd;
  margin-bottom: 1.5rem;
}

.detail__powers {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.detail__powers li {
  background-color: var(--red);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* === Filter Bar === */
.filter-bar {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-bar__btn {
  background: var(--dark-gray);
  color: var(--white);
  border: 1px solid var(--gray);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s, border-color 0.2s;
}

.filter-bar__btn:hover,
.filter-bar__btn.active {
  background: var(--red);
  border-color: var(--red);
}

/* === Footer === */
.footer {
  margin-top: auto;
  background-color: var(--dark-gray);
  padding: 1.5rem 2rem;
  text-align: center;
  font-size: 0.8rem;
  color: #888;
}

/* === About Page === */
.about-content {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  color: #ddd;
}

.about-content h2 {
  color: var(--red);
  margin: 2rem 0 1rem;
  font-size: 1.5rem;
}

.about-content p {
  margin-bottom: 1rem;
}

/* === Responsive === */
@media (max-width: 768px) {
  .hero__title {
    font-size: 2rem;
  }

  .detail {
    grid-template-columns: 1fr;
  }

  .navbar {
    flex-direction: column;
    gap: 1rem;
  }

  .navbar__links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
```

- [ ] **Step 2: Tarayıcıda doğrula**

Henüz HTML yok, bu adım sadece CSS syntax doğrulaması. Dosyayı açıp syntax hatası olmadığını kontrol et.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: add complete CSS styles with Marvel theme"
```

---

### Task 3: Ortak Navigasyon ve Footer ile Ana Sayfa

**Files:**
- Create: `index.html`

- [ ] **Step 1: index.html oluştur**

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Marvel Üniversitesi</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <nav class="navbar">
    <a href="index.html" class="navbar__logo">Marvel Üniversitesi</a>
    <ul class="navbar__links">
      <li><a href="index.html" class="active">Ana Sayfa</a></li>
      <li><a href="kadro.html">Kadro</a></li>
      <li><a href="fakulteler.html">Fakülteler</a></li>
      <li><a href="hakkinda.html">Hakkında</a></li>
    </ul>
  </nav>

  <section class="hero">
    <h1 class="hero__title">Marvel Üniversitesi</h1>
    <p class="hero__subtitle">Süper kahramanlar yetiştiren, evrenin en güçlü akademik kadrosuna sahip kurgu üniversite.</p>
  </section>

  <section class="section">
    <h2 class="section__title">Öne Çıkan Kadro</h2>
    <div class="card-grid" id="featured-grid">
      <!-- JS tarafından doldurulacak -->
    </div>
  </section>

  <section class="section">
    <h2 class="section__title">Fakültelerimiz</h2>
    <div class="card-grid" id="faculties-preview">
      <!-- JS tarafından doldurulacak -->
    </div>
  </section>

  <footer class="footer">
    <p>Data provided by Marvel. © 2026 Marvel</p>
    <p>Bu site bir kurgu hobi projesidir.</p>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Tarayıcıda aç ve navigasyon/hero/footer görünümünü kontrol et**

Henüz JS yok, grid'ler boş olacak. Navbar, hero ve footer'ın düzgün render edildiğini doğrula.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add home page with navbar, hero, and layout"
```

---

### Task 4: Kadro Sayfası

**Files:**
- Create: `kadro.html`

- [ ] **Step 1: kadro.html oluştur**

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kadro — Marvel Üniversitesi</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <nav class="navbar">
    <a href="index.html" class="navbar__logo">Marvel Üniversitesi</a>
    <ul class="navbar__links">
      <li><a href="index.html">Ana Sayfa</a></li>
      <li><a href="kadro.html" class="active">Kadro</a></li>
      <li><a href="fakulteler.html">Fakülteler</a></li>
      <li><a href="hakkinda.html">Hakkında</a></li>
    </ul>
  </nav>

  <section class="section">
    <h2 class="section__title">Akademik Kadro</h2>
    <div class="filter-bar" id="filter-bar">
      <!-- JS tarafından doldurulacak -->
    </div>
    <div class="card-grid" id="kadro-grid">
      <!-- JS tarafından doldurulacak -->
    </div>
  </section>

  <footer class="footer">
    <p>Data provided by Marvel. © 2026 Marvel</p>
    <p>Bu site bir kurgu hobi projesidir.</p>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add kadro.html
git commit -m "feat: add kadro page with filter bar and card grid"
```

---

### Task 5: Karakter Detay, Fakülteler ve Hakkında Sayfaları

**Files:**
- Create: `karakter.html`
- Create: `fakulteler.html`
- Create: `hakkinda.html`

- [ ] **Step 1: karakter.html oluştur**

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Karakter — Marvel Üniversitesi</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <nav class="navbar">
    <a href="index.html" class="navbar__logo">Marvel Üniversitesi</a>
    <ul class="navbar__links">
      <li><a href="index.html">Ana Sayfa</a></li>
      <li><a href="kadro.html">Kadro</a></li>
      <li><a href="fakulteler.html">Fakülteler</a></li>
      <li><a href="hakkinda.html">Hakkında</a></li>
    </ul>
  </nav>

  <div class="detail" id="character-detail">
    <!-- JS tarafından doldurulacak -->
  </div>

  <footer class="footer">
    <p>Data provided by Marvel. © 2026 Marvel</p>
    <p>Bu site bir kurgu hobi projesidir.</p>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: fakulteler.html oluştur**

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fakülteler — Marvel Üniversitesi</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <nav class="navbar">
    <a href="index.html" class="navbar__logo">Marvel Üniversitesi</a>
    <ul class="navbar__links">
      <li><a href="index.html">Ana Sayfa</a></li>
      <li><a href="kadro.html">Kadro</a></li>
      <li><a href="fakulteler.html" class="active">Fakülteler</a></li>
      <li><a href="hakkinda.html">Hakkında</a></li>
    </ul>
  </nav>

  <section class="section">
    <h2 class="section__title">Fakülteler</h2>
    <div id="faculties-container">
      <!-- JS tarafından doldurulacak -->
    </div>
  </section>

  <footer class="footer">
    <p>Data provided by Marvel. © 2026 Marvel</p>
    <p>Bu site bir kurgu hobi projesidir.</p>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: hakkinda.html oluştur**

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hakkında — Marvel Üniversitesi</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <nav class="navbar">
    <a href="index.html" class="navbar__logo">Marvel Üniversitesi</a>
    <ul class="navbar__links">
      <li><a href="index.html">Ana Sayfa</a></li>
      <li><a href="kadro.html">Kadro</a></li>
      <li><a href="fakulteler.html">Fakülteler</a></li>
      <li><a href="hakkinda.html" class="active">Hakkında</a></li>
    </ul>
  </nav>

  <section class="section">
    <div class="about-content">
      <h1>Marvel Üniversitesi Hakkında</h1>

      <h2>Tarihçe</h2>
      <p>Marvel Üniversitesi, 1963 yılında Nick Fury'nin öncülüğünde, dünyanın en yetenekli bireylerini bir araya getirmek amacıyla kurulmuştur. Kampüsümüz, Avengers Kulesi'nin alt katlarından başlayarak bugünkü devasa yerleşkeye ulaşmıştır.</p>

      <h2>Misyon</h2>
      <p>Evrenin dört bir yanından gelen öğrencilere süper güçlerini kontrol etme, geliştirme ve insanlığın hizmetine sunma becerisi kazandırmak. Hem fiziksel hem zihinsel olarak en üst düzeyde eğitim vermek.</p>

      <h2>Vizyon</h2>
      <p>Multiverse genelinde tanınan, boyutlar arası akreditasyona sahip, her türlü süper yeteneği bilimsel ve etik çerçevede şekillendiren bir akademik kurum olmak.</p>

      <h2>Kampüs</h2>
      <p>Ana kampüsümüz New York'ta yer almaktadır. Wakanda Teknoloji Laboratuvarı, Sanctum Sanctorum Kütüphanesi, Danger Room Spor Salonu ve Bifrost Uluslararası Terminal gibi tesislerimiz öğrencilerin hizmetindedir.</p>

      <h2>İletişim</h2>
      <p>Adres: 890 Fifth Avenue, Manhattan, New York</p>
      <p>Tel: +1 (212) MARVEL-0</p>
      <p>E-posta: info@marveluniversitesi.edu</p>
    </div>
  </section>

  <footer class="footer">
    <p>Data provided by Marvel. © 2026 Marvel</p>
    <p>Bu site bir kurgu hobi projesidir.</p>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Tüm sayfaları tarayıcıda aç, navigasyon linklerinin çalıştığını doğrula**

- [ ] **Step 5: Commit**

```bash
git add karakter.html fakulteler.html hakkinda.html
git commit -m "feat: add character detail, faculties, and about pages"
```

---

### Task 6: JavaScript — Veri Yükleme ve Render

**Files:**
- Create: `js/main.js`

Bu task tüm JS mantığını içerir: JSON yükleme, kart render, filtreleme, karakter detay, fakülte listesi.

- [ ] **Step 1: main.js oluştur — veri yükleme ve yardımcı fonksiyonlar**

`js/main.js` dosyasını aşağıdaki içerikle oluştur:

```javascript
// === Fakülte tanımları ===
const FACULTIES = {
  "Süper Güç Mühendisliği": "Fiziksel güçler ve dövüş sanatları alanında eğitim verir.",
  "Kozmik Bilimler": "Uzay, boyutlar arası yolculuk ve kozmik enerji araştırmaları.",
  "Teknoloji ve Zırh Tasarımı": "Mühendislik, yapay zeka ve ileri silah sistemleri.",
  "Büyü ve Mistik Sanatlar": "Büyü, zaman manipülasyonu ve boyutlar arası iletişim.",
  "Strateji ve Liderlik": "Taktik, espiyonaj ve takım yönetimi."
};

// === Veri yükleme ===
async function loadCharacters() {
  const response = await fetch("data/characters.json");
  const data = await response.json();
  return data.characters;
}

// === Kart HTML üretme ===
function createCharacterCard(character) {
  const card = document.createElement("a");
  card.href = `karakter.html?id=${character.id}`;
  card.className = "card";
  card.innerHTML = `
    <img class="card__image" src="${character.thumbnail}" alt="${character.name}">
    <div class="card__body">
      <div class="card__name">${character.name}</div>
      <div class="card__role">${character.role}</div>
      <div class="card__faculty">${character.faculty}</div>
    </div>
  `;
  return card;
}

// === Sayfa tespiti ve başlatma ===
document.addEventListener("DOMContentLoaded", async () => {
  const characters = await loadCharacters();
  const path = window.location.pathname.split("/").pop() || "index.html";

  if (path === "index.html" || path === "") {
    renderHomePage(characters);
  } else if (path === "kadro.html") {
    renderKadroPage(characters);
  } else if (path === "karakter.html") {
    renderCharacterDetail(characters);
  } else if (path === "fakulteler.html") {
    renderFacultiesPage(characters);
  }
});

// === Ana sayfa ===
function renderHomePage(characters) {
  // Öne çıkan kadro: ilk 4 karakter
  const featuredGrid = document.getElementById("featured-grid");
  if (featuredGrid) {
    characters.slice(0, 4).forEach(c => {
      featuredGrid.appendChild(createCharacterCard(c));
    });
  }

  // Fakülte önizleme
  const facultiesPreview = document.getElementById("faculties-preview");
  if (facultiesPreview) {
    Object.entries(FACULTIES).forEach(([name, desc]) => {
      const count = characters.filter(c => c.faculty === name).length;
      const card = document.createElement("div");
      card.className = "faculty-card";
      card.innerHTML = `
        <div class="faculty-card__title">${name}</div>
        <div class="faculty-card__desc">${desc}</div>
        <div class="faculty-card__count">${count} akademisyen</div>
      `;
      facultiesPreview.appendChild(card);
    });
  }
}

// === Kadro sayfası ===
function renderKadroPage(characters) {
  const filterBar = document.getElementById("filter-bar");
  const grid = document.getElementById("kadro-grid");
  if (!filterBar || !grid) return;

  // Fakülte isimleri
  const faculties = ["Tümü", ...Object.keys(FACULTIES)];

  // Filtre butonları
  faculties.forEach(faculty => {
    const btn = document.createElement("button");
    btn.className = "filter-bar__btn" + (faculty === "Tümü" ? " active" : "");
    btn.textContent = faculty;
    btn.addEventListener("click", () => {
      filterBar.querySelectorAll(".filter-bar__btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCards(faculty === "Tümü" ? characters : characters.filter(c => c.faculty === faculty));
    });
    filterBar.appendChild(btn);
  });

  function renderCards(list) {
    grid.innerHTML = "";
    list.forEach(c => grid.appendChild(createCharacterCard(c)));
  }

  renderCards(characters);
}

// === Karakter detay ===
function renderCharacterDetail(characters) {
  const container = document.getElementById("character-detail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const character = characters.find(c => c.id === id);

  if (!character) {
    container.innerHTML = `<p style="padding:2rem;">Karakter bulunamadı.</p>`;
    return;
  }

  document.title = `${character.name} — Marvel Üniversitesi`;

  container.innerHTML = `
    <div>
      <img class="detail__image" src="${character.thumbnail}" alt="${character.name}">
    </div>
    <div>
      <h1 class="detail__name">${character.name}</h1>
      <div class="detail__role">${character.role}</div>
      <div class="detail__faculty">${character.faculty}</div>
      <p class="detail__description">${character.description}</p>
      <ul class="detail__powers">
        ${character.powers.map(p => `<li>${p}</li>`).join("")}
      </ul>
      <p style="margin-top:1rem;color:#888;font-size:0.85rem;">
        Toplam ${character.comicsCount} çizgi romanda yer aldı.
      </p>
    </div>
  `;
}

// === Fakülteler sayfası ===
function renderFacultiesPage(characters) {
  const container = document.getElementById("faculties-container");
  if (!container) return;

  Object.entries(FACULTIES).forEach(([name, desc]) => {
    const members = characters.filter(c => c.faculty === name);

    const section = document.createElement("div");
    section.style.marginBottom = "3rem";
    section.innerHTML = `
      <div class="faculty-card" style="margin-bottom:1.5rem;">
        <div class="faculty-card__title">${name}</div>
        <div class="faculty-card__desc">${desc}</div>
        <div class="faculty-card__count">${members.length} akademisyen</div>
      </div>
    `;

    const grid = document.createElement("div");
    grid.className = "card-grid";
    members.forEach(c => grid.appendChild(createCharacterCard(c)));
    section.appendChild(grid);

    container.appendChild(section);
  });
}
```

- [ ] **Step 2: Tüm sayfaları tarayıcıda test et**

Bir HTTP sunucusu başlat (fetch için gerekli):

```bash
npx serve .
```

Kontrol listesi:
- `index.html`: 4 öne çıkan kart görünüyor, 5 fakülte kartı görünüyor
- `kadro.html`: 12 kart görünüyor, filtre butonları çalışıyor
- `karakter.html?id=1009368`: Iron Man detayları görünüyor
- `fakulteler.html`: Her fakülte altında ilgili karakterler var
- `hakkinda.html`: Statik içerik düzgün görünüyor

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: add main.js with data loading, card rendering, filtering, and routing"
```

---

### Task 7: Marvel API Fetch Scripti

**Files:**
- Modify: `scripts/fetch-marvel.js`

Bu script gerçek Marvel API'den karakter çeker, rol ve fakülte atar, `data/characters.json`'a yazar.

- [ ] **Step 1: package.json oluştur**

```bash
npm init -y
```

- [ ] **Step 2: fetch-marvel.js'yi implement et**

`scripts/fetch-marvel.js` dosyasını aşağıdaki içerikle değiştir:

```javascript
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// === Yapılandırma ===
const PUBLIC_KEY = process.env.MARVEL_PUBLIC_KEY;
const PRIVATE_KEY = process.env.MARVEL_PRIVATE_KEY;
const BASE_URL = "https://gateway.marvel.com/v1/public";

if (!PUBLIC_KEY || !PRIVATE_KEY) {
  console.error("Hata: MARVEL_PUBLIC_KEY ve MARVEL_PRIVATE_KEY ortam değişkenlerini ayarlayın.");
  console.error("Kayıt: https://developer.marvel.com/");
  process.exit(1);
}

// === Marvel API auth ===
function getAuthParams() {
  const ts = Date.now().toString();
  const hash = crypto.createHash("md5").update(ts + PRIVATE_KEY + PUBLIC_KEY).digest("hex");
  return `ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;
}

// === Belirli karakter isimlerini çek ===
const CHARACTER_NAMES = [
  "Iron Man", "Thor", "Captain America", "Doctor Strange",
  "Thanos", "Loki", "Spider-Man (Peter Parker)", "Star-Lord (Peter Quill)",
  "Storm", "Wolverine", "Black Widow", "Hulk",
  "Scarlet Witch", "Black Panther", "Nick Fury", "Gamora",
  "Magneto", "Shuri", "War Machine (James Rhodes)", "Miles Morales (Spider-Man)"
];

// === Kategori tespiti ===
function detectCategory(name, description) {
  const n = name.toLowerCase();
  const d = (description || "").toLowerCase();
  if (n.includes("spider") || n.includes("miles morales")) return "spider-verse";
  if (n.includes("star-lord") || n.includes("gamora") || n.includes("groot") || n.includes("rocket") || n.includes("drax")) return "guardians";
  if (n.includes("thanos") || n.includes("loki") || n.includes("magneto")) return "villain";
  if (n.includes("storm") || n.includes("wolverine") || n.includes("cyclops") || d.includes("x-men") || d.includes("mutant")) return "x-men";
  return "avengers";
}

// === Rol atama ===
const ROLE_MAP = {
  "avengers": "Profesör",
  "x-men": "Araştırma Görevlisi",
  "guardians": "Misafir Öğretim Üyesi",
  "villain": "Rektör",
  "spider-verse": "Öğrenci"
};

// === Fakülte atama ===
function assignFaculty(name, powers) {
  const n = name.toLowerCase();
  const p = (powers || []).join(" ").toLowerCase();
  if (n.includes("strange") || n.includes("scarlet") || n.includes("loki")) return "Büyü ve Mistik Sanatlar";
  if (n.includes("iron") || n.includes("shuri") || n.includes("war machine") || n.includes("spider")) return "Teknoloji ve Zırh Tasarımı";
  if (n.includes("thanos") || n.includes("star-lord") || n.includes("gamora")) return "Kozmik Bilimler";
  if (n.includes("fury") || n.includes("widow") || n.includes("captain america") || n.includes("wolverine")) return "Strateji ve Liderlik";
  if (p.includes("strength") || p.includes("power") || n.includes("thor") || n.includes("hulk") || n.includes("storm") || n.includes("panther")) return "Süper Güç Mühendisliği";
  return "Süper Güç Mühendisliği";
}

// === Güçler listesi (API'de direkt yok, description'dan çıkarılır veya sabit atanır) ===
const POWERS_MAP = {
  "iron man": ["Genius-level intellect", "Powered armor suit", "Flight"],
  "thor": ["Superhuman strength", "Mjolnir", "Lightning control"],
  "captain america": ["Super soldier serum", "Vibranium shield", "Master tactician"],
  "doctor strange": ["Sorcery", "Time manipulation", "Dimensional travel"],
  "thanos": ["Cosmic power", "Superhuman strength", "Genius intellect"],
  "loki": ["Sorcery", "Shapeshifting", "Illusion casting"],
  "spider-man": ["Wall-crawling", "Spider-sense", "Web-shooting"],
  "star-lord": ["Expert marksman", "Master tactician", "Element Gun"],
  "storm": ["Weather manipulation", "Flight", "Energy projection"],
  "wolverine": ["Adamantium claws", "Healing factor", "Enhanced senses"],
  "black widow": ["Expert martial artist", "Espionage", "Weapons specialist"],
  "hulk": ["Superhuman strength", "Healing factor", "Gamma radiation"],
  "scarlet witch": ["Reality warping", "Chaos magic", "Telekinesis"],
  "black panther": ["Vibranium suit", "Enhanced agility", "Genius intellect"],
  "nick fury": ["Master strategist", "Espionage", "Weapons expert"],
  "gamora": ["Superhuman agility", "Master assassin", "Enhanced durability"],
  "magneto": ["Magnetism control", "Force fields", "Flight"],
  "shuri": ["Genius-level intellect", "Vibranium tech", "Engineering"],
  "war machine": ["Powered armor suit", "Heavy weaponry", "Flight"],
  "miles morales": ["Wall-crawling", "Venom blast", "Invisibility"]
};

function getPowers(name) {
  const key = Object.keys(POWERS_MAP).find(k => name.toLowerCase().includes(k));
  return key ? POWERS_MAP[key] : ["Bilinmiyor"];
}

// === Ana fonksiyon ===
async function main() {
  console.log("Marvel API'den karakterler çekiliyor...");
  const characters = [];

  for (const name of CHARACTER_NAMES) {
    const url = `${BASE_URL}/characters?name=${encodeURIComponent(name)}&${getAuthParams()}`;
    try {
      const res = await fetch(url);
      const json = await res.json();

      if (json.data && json.data.results && json.data.results.length > 0) {
        const c = json.data.results[0];
        const thumb = c.thumbnail;
        const thumbnailUrl = thumb ? `${thumb.path}.${thumb.extension}` : "";
        const category = detectCategory(c.name, c.description);
        const powers = getPowers(c.name);

        characters.push({
          id: c.id,
          name: c.name,
          description: c.description || "Açıklama mevcut değil.",
          thumbnail: thumbnailUrl.replace("http://", "https://"),
          role: ROLE_MAP[category] || "Asistan",
          faculty: assignFaculty(c.name, powers),
          category: category,
          comicsCount: c.comics ? c.comics.available : 0,
          powers: powers
        });
        console.log(`  ✓ ${c.name}`);
      } else {
        console.log(`  ✗ ${name} bulunamadı`);
      }
    } catch (err) {
      console.error(`  ✗ ${name} — hata: ${err.message}`);
    }
  }

  // Villain rolündeki ilk karakteri Rektör, diğerlerini Dekan yap
  let rectorAssigned = false;
  characters.forEach(c => {
    if (c.category === "villain") {
      if (!rectorAssigned) {
        c.role = "Rektör";
        rectorAssigned = true;
      } else {
        c.role = "Dekan";
      }
    }
  });

  const output = {
    meta: {
      fetchedAt: new Date().toISOString().split("T")[0],
      attribution: "Data provided by Marvel. © 2026 Marvel"
    },
    characters: characters
  };

  const outPath = path.join(__dirname, "..", "data", "characters.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");
  console.log(`\n${characters.length} karakter data/characters.json dosyasına yazıldı.`);
}

main();
```

- [ ] **Step 3: Scripti test et**

```bash
MARVEL_PUBLIC_KEY=your_key MARVEL_PRIVATE_KEY=your_key node scripts/fetch-marvel.js
```

Beklenen: 20 karakter çekilir, `data/characters.json` güncellenir.

- [ ] **Step 4: Commit**

```bash
git add scripts/fetch-marvel.js package.json
git commit -m "feat: add Marvel API fetch script with role and faculty assignment"
```

---

### Task 8: Son Doğrulama ve Temizlik

**Files:**
- Modify: `data/characters.json` (API'den çekildiyse güncellenir)

- [ ] **Step 1: Tüm sayfaları test et**

```bash
npx serve .
```

Her sayfayı kontrol et:
- Ana sayfa: hero, öne çıkan kadro, fakülte kartları
- Kadro: tüm kartlar, filtre çalışıyor
- Karakter detay: `?id=` ile doğru karakter açılıyor
- Fakülteler: her fakülte altında doğru karakterler
- Hakkında: statik içerik düzgün
- Responsive: tarayıcı penceresini daralt, mobil görünüm uygun

- [ ] **Step 2: Attribution kontrolü**

Footer'da "Data provided by Marvel. © 2026 Marvel" yazısının tüm sayfalarda mevcut olduğunu doğrula (Marvel API lisans şartı).

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: final verification and cleanup"
```
