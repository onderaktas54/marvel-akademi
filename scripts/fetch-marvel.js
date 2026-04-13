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
