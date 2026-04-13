// === Fakülte tanımları ===
const FACULTIES = {
  "Süper Güç Mühendisliği": "Fiziksel güçler ve dövüş sanatları alanında eğitim verir.",
  "Kozmik Bilimler": "Uzay, boyutlar arası yolculuk ve kozmik enerji araştırmaları.",
  "Teknoloji ve Zırh Tasarımı": "Mühendislik, yapay zeka ve ileri silah sistemleri.",
  "Büyü ve Mistik Sanatlar": "Büyü, zaman manipülasyonu ve boyutlar arası iletişim.",
  "Strateji ve Liderlik": "Taktik, espiyonaj ve takım yönetimi."
};

// === Cookie yönetimi ===
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + expires + ";path=/;SameSite=Lax";
}

// === Sepet yönetimi (cookie tabanlı) ===
function getCart() {
  const raw = getCookie("marvel_cart");
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function saveCart(cart) {
  setCookie("marvel_cart", JSON.stringify(cart), 30);
  updateCartCount();
}

function addToCart(courseId) {
  const cart = getCart();
  if (!cart.includes(courseId)) {
    cart.push(courseId);
    saveCart(cart);
  }
}

function removeFromCart(courseId) {
  const cart = getCart().filter(id => id !== courseId);
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.textContent = getCart().length;
  }
}

// === Veri yükleme ===
function loadCharacters() {
  return CHARACTER_DATA.characters;
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
document.addEventListener("DOMContentLoaded", () => {
  const characters = loadCharacters();
  const path = window.location.pathname.split("/").pop() || "index.html";

  updateCartCount();

  if (path === "index.html" || path === "") {
    renderHomePage(characters);
  } else if (path === "kadro.html") {
    renderKadroPage(characters);
  } else if (path === "karakter.html") {
    renderCharacterDetail(characters);
  } else if (path === "fakulteler.html") {
    renderFacultiesPage(characters);
  } else if (path === "dersler.html") {
    renderCoursesPage();
  } else if (path === "sepet.html") {
    renderCartPage();
  }
});

// === Ana sayfa ===
function renderHomePage(characters) {
  const featuredGrid = document.getElementById("featured-grid");
  if (featuredGrid) {
    characters.slice(0, 4).forEach(c => {
      featuredGrid.appendChild(createCharacterCard(c));
    });
  }

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

  const faculties = ["Tümü", ...Object.keys(FACULTIES)];

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

// === Dersler sayfası ===
function renderCoursesPage() {
  const filterBar = document.getElementById("course-filter-bar");
  const grid = document.getElementById("course-grid");
  if (!filterBar || !grid) return;

  const faculties = ["Tümü", ...Object.keys(FACULTIES)];
  const cart = getCart();

  faculties.forEach(faculty => {
    const btn = document.createElement("button");
    btn.className = "filter-bar__btn" + (faculty === "Tümü" ? " active" : "");
    btn.textContent = faculty;
    btn.addEventListener("click", () => {
      filterBar.querySelectorAll(".filter-bar__btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCourses(faculty === "Tümü" ? COURSES_DATA : COURSES_DATA.filter(c => c.faculty === faculty));
    });
    filterBar.appendChild(btn);
  });

  function renderCourses(courses) {
    grid.innerHTML = "";
    courses.forEach(course => {
      const inCart = getCart().includes(course.id);
      const card = document.createElement("div");
      card.className = "course-card";
      card.innerHTML = `
        <div class="course-card__id">${course.id}</div>
        <div class="course-card__name">${course.name}</div>
        <div class="course-card__faculty">${course.faculty}</div>
        <div class="course-card__meta">
          <span>Hoca: ${course.instructor}</span>
          <span>Kredi: ${course.credits}</span>
          <span>${course.schedule}</span>
        </div>
        <div class="course-card__desc">${course.description}</div>
        <button class="btn ${inCart ? "btn--add added" : "btn--add"}" data-course-id="${course.id}">
          ${inCart ? "Sepete Eklendi" : "Sepete Ekle"}
        </button>
      `;

      const btn = card.querySelector("button");
      if (!inCart) {
        btn.addEventListener("click", () => {
          addToCart(course.id);
          btn.textContent = "Sepete Eklendi";
          btn.classList.add("added");
        });
      }

      grid.appendChild(card);
    });
  }

  renderCourses(COURSES_DATA);
}

// === Sepet sayfası ===
function renderCartPage() {
  const container = document.getElementById("cart-container");
  const summary = document.getElementById("cart-summary");
  const emptyMsg = document.getElementById("cart-empty");
  if (!container) return;

  function render() {
    const cart = getCart();
    container.innerHTML = "";

    if (cart.length === 0) {
      summary.style.display = "none";
      emptyMsg.style.display = "block";
      return;
    }

    emptyMsg.style.display = "none";
    summary.style.display = "block";
    let totalCredits = 0;

    cart.forEach(courseId => {
      const course = COURSES_DATA.find(c => c.id === courseId);
      if (!course) return;

      totalCredits += course.credits;

      const item = document.createElement("div");
      item.className = "cart-item";
      item.innerHTML = `
        <div class="cart-item__info">
          <div class="cart-item__name">${course.id} — ${course.name}</div>
          <div class="cart-item__details">
            ${course.instructor} | ${course.credits} Kredi | ${course.schedule}
          </div>
        </div>
        <button class="btn btn--remove" data-course-id="${course.id}">Kaldır</button>
      `;

      item.querySelector("button").addEventListener("click", () => {
        removeFromCart(course.id);
        render();
      });

      container.appendChild(item);
    });

    summary.querySelector(".cart-total").textContent =
      `Toplam: ${cart.length} ders, ${totalCredits} kredi`;
  }

  const clearBtn = document.getElementById("clear-cart-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      clearCart();
      render();
    });
  }

  render();
}
