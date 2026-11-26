const ORDER_URL = "https://order.posorderx.com/store/23941ecf-d67e-4680-a4b7-c2d4b70a18a1";
const PHONE_NUMBER = "2539049187";

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
    link.target = "_blank";
    link.rel = "noopener noreferrer";
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
            <a class="btn-link" data-order-link href="${ORDER_URL}">order now <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
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

function formatCents(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatItemPrice(item) {
  const sizes = item.sizes || [];

  if (!sizes.length) {
    return item.priceCents == null ? "" : formatCents(item.priceCents);
  }

  if (sizes.length === 1 && sizes[0].name === "Default") {
    return formatCents(sizes[0].priceCents);
  }

  return sizes
    .map((size) => `${size.name} ${formatCents(size.priceCents)}`)
    .join(" · ");
}

function formatChoice(choice) {
  if (!choice.priceCents) {
    return choice.name;
  }

  return `${choice.name} +${formatCents(choice.priceCents)}`;
}

const PIZZA_CATEGORIES = new Set([
  "CLASSIC PIZZAS",
  "INDIAN FLAVOR PIZZAS",
  "CREATE YOUR OWN PIZZA",
  "PIZZA COMBOS"
]);

function isPizzaToppingGroup(name) {
  const label = name.toLowerCase();

  return label.includes("topping") || label === "meats";
}

function visibleOptions(categoryName, item) {
  const options = item.options || [];

  if (!PIZZA_CATEGORIES.has(categoryName)) {
    return options;
  }

  return options.filter((group) => !isPizzaToppingGroup(group.name));
}

function buildMenuCatalog() {
  const mount = document.getElementById("menuCatalog");
  const tabs = document.getElementById("categoryNav");
  const menu = window.LAZEEZ_MENU || [];

  if (!mount || !tabs) {
    return;
  }

  mount.innerHTML = "";
  tabs.innerHTML = "";

  const categories = [];
  const featuredItems = [];
  let totalItems = 0;

  menu.forEach((category) => {
    const id = slugify(category.name);
    const section = document.createElement("section");
    section.id = id;
    section.className = "catalog-section";

    const title = document.createElement("h3");
    title.className = "catalog-section__title";
    title.textContent = category.name;

    const grid = document.createElement("div");
    grid.className = "catalog-grid";

    category.items.forEach((item) => {
      totalItems += 1;

      const card = document.createElement("article");
      card.className = "catalog-card";

      const body = document.createElement("div");
      body.className = "catalog-card__body";

      const name = document.createElement("h4");
      name.className = "catalog-card__name";
      name.textContent = item.name;

      const details = document.createElement("div");
      details.className = "catalog-card__details";

      if (item.description) {
        const description = document.createElement("p");
        description.className = "catalog-card__desc";
        description.textContent = item.description;
        details.appendChild(description);
      }

      const itemOptions = visibleOptions(category.name, item);

      if (itemOptions.length) {
        const options = document.createElement("ul");
        options.className = "catalog-card__options";

        itemOptions.forEach((group) => {
          const option = document.createElement("li");
          const label = document.createElement("strong");
          label.textContent = `${group.name}: `;
          option.append(label, group.choices.map(formatChoice).join(", "));
          options.appendChild(option);
        });

        details.appendChild(options);
      }

      const price = document.createElement("p");
      price.className = "catalog-card__price";
      price.textContent = formatItemPrice(item);

      const order = document.createElement("a");
      order.className = "catalog-card__order";
      order.href = ORDER_URL;
      order.dataset.orderLink = "";
      order.innerHTML = 'Order now <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';

      body.append(name, details, price, order);
      card.appendChild(body);

      if (item.image) {
        const image = document.createElement("img");
        image.className = "catalog-card__image";
        image.src = item.image;
        image.alt = "";
        image.loading = "lazy";
        card.appendChild(image);
      } else {
        card.classList.add("catalog-card--text");
      }

      grid.appendChild(card);

      if (featuredItems.length < 3 && item.image && item.description) {
        featuredItems.push({
          category: category.name,
          name: item.name,
          description: item.description,
          price: formatItemPrice(item),
          image: item.image
        });
      }
    });

    section.append(title, grid);
    mount.appendChild(section);

    categories.push({
      id,
      title: category.name,
      image: category.items.find((item) => item.image)?.image || ""
    });

    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "menu-tab";
    tab.dataset.target = id;
    tab.textContent = category.name;
    tabs.appendChild(tab);
  });

  buildPopularCards(categories.filter((category) => category.image).slice(0, 4));
  buildFeaturedCards(featuredItems);
  populateFooter(categories);
  updateStats(totalItems, categories.length);

  const sections = [...mount.querySelectorAll(".catalog-section")];

  const activateCategory = (categoryId) => {
    sections.forEach((section) => {
      section.hidden = section.id !== categoryId;
    });

    setActiveTab(categoryId);
  };

  tabs.querySelectorAll(".menu-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      activateCategory(tab.dataset.target);
    });
  });

  document.querySelectorAll("[data-category-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const categoryId = link.dataset.categoryLink;

      if (categoryId) {
        activateCategory(categoryId);
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

// Delete with #thanksgiving-special and the .thanksgiving-special styles.
// Hides the promo after the data-end date, at the end of that day in Pacific time.
function hideThanksgivingSpecial() {
  const promo = document.getElementById("thanksgiving-special");
  const endDate = promo?.dataset.end;

  if (!promo || !endDate) {
    return;
  }

  const pacificDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());

  if (pacificDate > endDate) {
    promo.remove();
  }
}

document.getElementById("year").textContent = new Date().getFullYear();
hideThanksgivingSpecial();
buildMenuCatalog();
setOrderLinks();
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
