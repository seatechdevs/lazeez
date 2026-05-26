const ORDER_URL = "https://order.posorderx.com/store/23941ecf-d67e-4680-a4b7-c2d4b70a18a1";
const PHONE_NUMBER = "2069637663";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function setOrderLinks() {
  document.querySelectorAll("[data-order-link]").forEach((link) => {
    link.href = ORDER_URL;
  });

  document.querySelectorAll("[data-phone-link]").forEach((link) => {
    link.href = `tel:${PHONE_NUMBER}`;
  });
}

function buildPopularCards(categories) {
  const container = document.getElementById("popularCategories");

  container.innerHTML = categories
    .map(
      (category) => `
        <a class="category-card" href="#menu" data-category-link="${category.id}">
          <img class="category-card__image" src="${category.image}" alt="${category.title}">
          <div class="category-card__body">
            <h3 class="category-card__title">${category.title}</h3>
          </div>
        </a>
      `
    )
    .join("");
}

function buildFeaturedCards(items) {
  const container = document.getElementById("featuredCards");

  container.innerHTML = items
    .map(
      (item) => `
        <article class="featured-card">
          <div class="featured-card__image-wrap">
            <img class="featured-card__image" src="${item.image}" alt="${item.name}">
            <span class="featured-card__tag">${item.category}</span>
          </div>
          <div class="featured-card__body">
            <div class="featured-card__meta">
              <span>${item.price}</span>
              <span class="featured-card__meta-divider"></span>
              <span>Lazeez Favorite</span>
            </div>
            <h3 class="featured-card__title">${item.name}</h3>
            <p class="featured-card__desc">${item.description}</p>
            <a class="btn-link" href="${ORDER_URL}">order now <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </article>
      `
    )
    .join("");
}

function populateFooter(categories) {
  const footerMenu = document.getElementById("footerMenu");

  footerMenu.innerHTML = categories
    .slice(0, 5)
    .map(
      (category) => `
        <li><a href="#menu" data-category-link="${category.id}">${category.title}</a></li>
      `
    )
    .join("");
}

function updateStats(itemsCount, categoriesCount) {
  const itemsStat = document.querySelector('[data-stat="items"]');
  const categoriesStat = document.querySelector('[data-stat="categories"]');

  if (itemsStat) {
    itemsStat.textContent = itemsCount;
  }

  if (categoriesStat) {
    categoriesStat.textContent = categoriesCount;
  }
}

function setActiveTab(categoryId) {
  document.querySelectorAll(".menu-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.target === categoryId);
  });
}

function buildMenuCatalog() {
  const mount = document.getElementById("menuCatalog");
  const tabs = document.getElementById("categoryNav");
  const template = document.createElement("template");

  template.innerHTML = window.MENU_HTML.trim();
  const menuRoot = template.content.firstElementChild;

  if (!menuRoot) {
    return;
  }

  menuRoot.removeAttribute("style");
  menuRoot.className = "menu-catalog-raw";

  mount.innerHTML = "";
  mount.appendChild(menuRoot);
  tabs.innerHTML = "";

  const categories = [];
  const featuredItems = [];
  let totalItems = 0;
  let activateCategory = null;

  mount.querySelectorAll(".category-item").forEach((section) => {
    const titleElement = section.querySelector(":scope > div");
    const grid = section.querySelector(":scope > div:nth-of-type(2)");

    if (!titleElement || !grid) {
      return;
    }

    const rawTitle = titleElement.textContent.trim();
    const title = rawTitle === "CHICEKN ENTREES" ? "CHICKEN ENTREES" : rawTitle;
    const id = slugify(title);
    const cards = [...grid.children];
    const firstImage = cards[0]?.querySelector("img")?.src || "";

    section.id = id;
    section.classList.add("catalog-section");
    titleElement.className = "catalog-section__title";
    titleElement.textContent = title;
    grid.className = "catalog-grid";

    categories.push({
      id,
      title,
      image: firstImage
    });

    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "menu-tab";
    tab.dataset.target = id;
    tab.textContent = title;
    tabs.appendChild(tab);

    cards.forEach((card) => {
      totalItems += 1;
      card.className = "catalog-card";

      const cardBody = card.querySelector(":scope > div");
      const image = card.querySelector("img");
      const name = cardBody?.querySelector(":scope > div");
      const details = cardBody?.querySelector(":scope > div:nth-of-type(2)");
      const description = details?.querySelector("div");
      const price = cardBody?.querySelector(":scope > div:nth-of-type(3)");

      if (cardBody) {
        cardBody.className = "catalog-card__body";
      }

      if (name) {
        name.className = "catalog-card__name";
      }

      if (details) {
        details.className = "catalog-card__details";
      }

      if (description) {
        description.className = "catalog-card__desc";
      }

      if (price) {
        price.className = "catalog-card__price";
      }

      if (image) {
        image.className = "catalog-card__image";
        image.loading = "lazy";
      }

      if (featuredItems.length < 3 && image && name && price) {
        featuredItems.push({
          category: title,
          name: name.textContent.trim(),
          description: description?.textContent.trim() || "Freshly prepared at Lazeez Curry and Pizza.",
          price: price.textContent.trim(),
          image: image.src
        });
      }
    });
  });

  buildPopularCards(categories.slice(0, 4));
  buildFeaturedCards(featuredItems);
  populateFooter(categories);
  updateStats(totalItems, categories.length);

  const sections = [...mount.querySelectorAll(".catalog-section")];

  activateCategory = (categoryId) => {
    sections.forEach((section) => {
      section.hidden = section.id !== categoryId;
    });

    setActiveTab(categoryId);
  };

  tabs.querySelectorAll(".menu-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      activateCategory?.(tab.dataset.target);
    });
  });

  document.querySelectorAll("[data-category-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const categoryId = link.dataset.categoryLink;

      if (categoryId) {
        activateCategory?.(categoryId);
      }
    });
  });

  if (categories[0]) {
    activateCategory(categories[0].id);
  }
}

function setupHeaderState() {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("mainNav");

  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  navToggle?.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
setOrderLinks();
buildMenuCatalog();
setupHeaderState();

// ── Announcement Popup ──────────────────────────────────
function initAnnounceBanner() {
  const overlay = document.getElementById("announceOverlay");
  const badge = document.getElementById("announceBadge");
  const titleEl = document.getElementById("announceTitle");
  const subtitleEl = document.getElementById("announceSubtitle");
  const dateBox = document.getElementById("announceDateBox");
  const ctaLink = document.getElementById("announceCtaLink");
  const closeBtn = document.getElementById("announceClose");
  const dismissBtn = document.getElementById("announceDismiss");

  if (!overlay || !titleEl) return;

  // Opening date: Tuesday, May 26 2026, midnight local time
  const OPEN_DATE = new Date("2026-05-28T00:00:00");
  const now = new Date();
  const isOpen = now >= OPEN_DATE;

  // Don't show again if user dismissed this session
  const dismissedKey = isOpen ? "announce_dismissed_open" : "announce_dismissed_coming";
  if (sessionStorage.getItem(dismissedKey)) {
    overlay.classList.add("is-hidden");
    return;
  }

  function closePopup() {
    overlay.classList.add("is-hidden");
    sessionStorage.setItem(dismissedKey, "1");
  }

  if (isOpen) {
    // Post-opening state
    badge.textContent = "🎉 Now Open";
    badge.classList.add("is-open");
    titleEl.textContent = "We're Now Open!";
    subtitleEl.textContent = "Lazeez Curry & Pizza is ready to serve you. Order online for pickup or delivery today.";
    ctaLink.style.display = "inline-flex";
    ctaLink.href = ORDER_URL;
  } else {
    // Pre-opening state
    badge.textContent = "Coming Soon";
    titleEl.textContent = "Grand Opening";
    subtitleEl.textContent = "Lazeez Curry & Pizza. Mark your calendars — we can't wait to serve you!";
    dateBox.style.display = "flex";
  }

  closeBtn.addEventListener("click", closePopup);
  dismissBtn.addEventListener("click", closePopup);

  // Close when clicking the backdrop
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePopup();
  });
}

initAnnounceBanner();
