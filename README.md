# Marvel Üniversitesi 🦸‍♂️🎓

Marvel evrenindeki kurgusal karakterlerin ve derslerin bulunduğu interaktif bir eğitim platformu prototipi.

## Özellikler

- **Kadro:** Marvel evreninden rastgele değil, özellikleriyle Marvel Üniversitesi'ne atanmış 20 kişilik süper kahraman kadrosu.
- **Karakter Detayları:** Seçilen kahramanların detay özellikleri ve hikayeleri.
- **Fakülteler:** "Süper Güç Mühendisliği", "Kozmik Bilimler" gibi fantastik eğitim alanları.
- **Ders Kayıt Sistemi:** Cookie tabanlı hafif bir sepet sistemiyle istenilen derslerin sepete eklenebilmesi, çıkarılabilmesi.

## Teknolojiler

Bu proje tamamen sade (vanilla) web teknolojileriyle geliştirilmiştir:
- **Tasarım:** Vanilla HTML & CSS, Flexbox/CSS Grid
- **İş Mantığı:** Vanilla JavaScript (Cookie yönetimi ve DOM manipülasyonu)
- **Veri:** Lokal `.json` dosyalarından ya da statik array verilerinden asenkron okuma
- **Opsiyonel (API Entegrasyonu):** `scripts/fetch-marvel.js` içerisinde gerçek Marvel Geliştirici API'si ile çalışabilecek Node.js tabanlı bir script bulunmaktadır.

## Kurulum ve Çalıştırma

Projenin arayüzünü çalıştırmak için herhangi bir yerel web sunucusu (Live Server, `npx serve` vs.) kullanmanız yeterlidir:

1. Projeyi klonlayın.
2. Proje dizininde `baslat.bat` dosyasına tıklayın veya terminalden sunucu başlatın:
   ```bash
   npx serve .
   ```
3. Terminalde beliren `http://localhost:3000` adresinden sayfayı ziyaret edin.

## Veri Çekme (Opsiyonel)

Gerçek Marvel servislerinden karakter verisi tazelemek isterseniz:

1. [developer.marvel.com](https://developer.marvel.com/) adresinden API Key alın.
2. Node ortamınız kurulu olmalı. API key'lerinizi çevre değişkenlerine ekleyin:
   ```bash
   MARVEL_PUBLIC_KEY=sizin_public_key MARVEL_PRIVATE_KEY=sizin_private_key node scripts/fetch-marvel.js
   ```

## Lisans

Bu proje kişisel/eğitim amaçlı olup tüm telif hakları, veriler ve karakter adları **Marvel©**'e aittir. Marvel'in sağladığı resim ve bilgilerin hakları kuruma ait olup ticari amaçla kullanılamaz.
