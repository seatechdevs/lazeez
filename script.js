const ORDER_URL = "https://order.posorderx.com/store/23941ecf-d67e-4680-a4b7-c2d4b70a18a1";
const PHONE_NUMBER = "2539049187";
const MENU_ITEMS_TO_REMOVE = new Set([
  "dahi bhalla",
  "dahi bahlla",
  "dahi papdi",
  "dahi poori",
  "dahi puri",
  "chicken steam roast"
]);

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
  const itemsServedWithYogurt = new Set([
    "Lacha Parantha",
    "Aloo Parantha",
    "Paneer Naan"
  ]);

  template.innerHTML = window.MENU_HTML.trim();
  const menuRoot = template.content.firstElementChild;

  if (!menuRoot) {
    return;
  }

  menuRoot.removeAttribute("style");
  menuRoot.className = "menu-catalog-raw";

  const dessertsSection = [...menuRoot.querySelectorAll(".category-item")].find(
    (section) => section.querySelector(":scope > div")?.textContent.trim() === "DESSERTS"
  );

  if (dessertsSection) {
    const thaliSection = document.createElement("section");
    thaliSection.className = "category-item";
    thaliSection.innerHTML = `
      <div>LAZEEZ THALI</div>
      <div>
        <div>
          <div>
            <div>Veg Thali</div>
            <div><div>2 veg curries, raita, rice and salad.</div></div>
            <div>$ 19.99</div>
          </div>
          <img src="https://res.us.disoo.com/store/53d172c3-c44b-49f2-bf12-e4cbc27fa08d.png" alt="Veg Thali">
        </div>
        <div>
          <div>
            <div>Non Veg Thali</div>
            <div><div>2 chicken curries, raita, rice and salad.</div></div>
            <div>$ 21.99</div>
          </div>
          <img src="https://res.us.disoo.com/store/544d8410-9852-467b-90d6-c76d2c9d8066.png" alt="Non Veg Thali">
        </div>
      </div>
    `;
    dessertsSection.before(thaliSection);
  }

  const addMenuItem = (categoryTitle, item) => {
    const category = [...menuRoot.querySelectorAll(".category-item")].find(
      (section) => section.querySelector(":scope > div")?.textContent.trim() === categoryTitle
    );
    const grid = category?.querySelector(":scope > div:nth-of-type(2)");

    if (!grid) return;

    const card = document.createElement("div");
    card.innerHTML = `
      <div>
        <div>${item.name}</div>
        <div><div>${item.description}</div></div>
        <div>${item.price ? `$ ${item.price}` : ""}</div>
      </div>
      <img src="${item.image}" alt="${item.name}">
    `;
    grid.appendChild(card);
  };

  const drinksSection = [...menuRoot.querySelectorAll(".category-item")].find(
    (section) => section.querySelector(":scope > div")?.textContent.trim() === "DRINKS"
  );
  const pizzaSection = document.createElement("section");
  pizzaSection.className = "category-item";
  pizzaSection.innerHTML = "<div>PIZZA</div><div></div>";
  drinksSection?.before(pizzaSection);

  const pizzaPhotos = {
    pepperoni: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Closeup_of_a_pepperoni_pizza.jpg?width=800",
    meatLover: "https://slice-menu-assets-prod.imgix.net/39790/1609352294_b443b1e422",
    bbq: "https://images.squarespace-cdn.com/content/v1/604a53652a239b09920815e1/1622729629993-2YZMPZG3514J5TRY5IOB/pc_1930.jpg",
    supreme: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Supreme_pizza.jpg?width=800",
    hawaiian: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Hawaiian_pizza_image.jpg?width=800",
    chickenBaconRanch: "https://static.spotapps.co/spots/90/9d63617a6a4da0b7923cd6fe566d59/full",
    chickenAlfredo: "https://static.spotapps.co/spots/e3/523f3fce0344149bec8705aebf505c/full",
    cheese: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Cheese_pizza.png?width=800",
    veggie: "https://photos.tryotter.com/menu-photos/263198fa-1dd1-44b4-a23f-3fc8064fefcf.png",
    butterPaneer: "https://139438472.cdn6.editmysite.com/uploads/1/3/9/4/139438472/7CAN7WSD3KD6ZA6QFOIZJXHW.jpeg?optimize=medium&width=1200",
    tandooriChicken: "https://d2s742iet3d3t1.cloudfront.net/restaurants/restaurant-248610000000000000/menu/items/8/item-400000049180191858_1737145726.jpg?size=medium",
    butterChicken: "https://slicelife.imgix.net/53006/photos/original/TandooriPizza_Grill_ButterChickenPizza.jpg?auto=compress%2Cformat&fit=crop&h=800&w=1200",
    achariChicken: "https://d2s742iet3d3t1.cloudfront.net/restaurants/restaurant-248610000000000000/menu/items/8/item-400000049180191898_1737145881.jpg?size=medium",
    garlicBreadsticks: "https://photos.tryotter.com/cdn-cgi/image/fit=crop,width=1200,quality=80/menu-photos/de90cd13-8fd1-47af-a2d4-474a7fad3614.jpeg",
    cheeseBreadsticks: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Cheese_Bread_Sticks.jpg?width=800",
    fries: "https://commons.wikimedia.org/wiki/Special:Redirect/file/French_Fries_on_plate.JPG?width=800",
    greekFries: "https://flipdish-web.imgix.net/br13032/04276ad02a3f24edd72702497e9ae718.png",
    custom: "https://slice-menu-assets-prod.imgix.net/111820/1768118026_6afea0a1b3?fit=crop&h=800&w=1200",
    toppings: "https://slice-menu-assets-prod.imgix.net/48430/1620123207_d9fed767b5?fit=crop&h=800&w=1200",
    sauces: "https://d2s742iet3d3t1.cloudfront.net/restaurants/restaurant-201297000000000000/menu/items/1/item-1100000000417890701_1717613814.jpg?size=medium"
  };
  const classicPizzaPrice = "15.99 M · $19.99 L · $22.99 XL";
  const indianPizzaPrice = "19.99 M · $21.99 L · $23.99 XL";

  [
    ["Pepperoni", "Classic pepperoni with mozzarella cheese and pizza sauce.", pizzaPhotos.pepperoni],
    ["Meat Lover", "Pepperoni, Italian sausage, ground beef, ham, diced bacon and mozzarella.", pizzaPhotos.meatLover],
    ["BBQ Chicken Pizza", "Grilled chicken, red onions, mozzarella and barbecue sauce.", pizzaPhotos.bbq],
    ["Supreme", "Pepperoni, Italian sausage, green peppers, onions, olives, mushrooms and mozzarella.", pizzaPhotos.supreme],
    ["Hawaiian", "Ham, pineapple and mozzarella cheese.", pizzaPhotos.hawaiian],
    ["Chicken Bacon N Ranch", "Grilled chicken, diced bacon, mozzarella and ranch drizzle.", pizzaPhotos.chickenBaconRanch],
    ["Chicken Alfredo", "Grilled chicken, Alfredo sauce, mozzarella and Italian herbs.", pizzaPhotos.chickenAlfredo],
    ["Cheese Pizza", "Classic cheese pizza with mozzarella and pizza sauce.", pizzaPhotos.cheese]
  ].forEach(([name, description, image]) =>
    addMenuItem("PIZZA", { name, description, price: classicPizzaPrice, image })
  );

  [
    ["Veggie Lovers Pizza", "Onions, green peppers, mushrooms, tomatoes, black olives, sweet corn and mozzarella.", pizzaPhotos.veggie],
    ["Butter Paneer Pizza", "Paneer tikka, onions, green peppers, butter masala sauce and mozzarella.", pizzaPhotos.butterPaneer],
    ["Tandoori Chicken Pizza", "Tandoori chicken, onions, green peppers, mozzarella and tandoori mayo drizzle.", pizzaPhotos.tandooriChicken],
    ["Butter Chicken Pizza", "Butter chicken, onions, mozzarella and cilantro.", pizzaPhotos.butterChicken],
    ["Achari Chicken Pizza", "Achari chicken, onions, green chilies, red onions, mozzarella and achari sauce.", pizzaPhotos.achariChicken]
  ].forEach(([name, description, image]) =>
    addMenuItem("PIZZA", { name, description, price: indianPizzaPrice, image })
  );

  addMenuItem("PIZZA", {
    name: "Create Your Own Pizza",
    description: "Pick your size, choose your sauce and add any toppings.",
    price: "22.99 M · $24.99 L · $26.99 XL",
    image: pizzaPhotos.custom
  });
  [
    ["Garlic Bread Sticks", "6.99", pizzaPhotos.garlicBreadsticks],
    ["Cheese Bread Sticks", "8.99", pizzaPhotos.cheeseBreadsticks],
    ["Chicken Wings", "11.99", "https://res.us.disoo.com/store/c667af9c-6a79-43f4-a2fa-203ef1210bcc.png"],
    ["French Fries", "6.99", pizzaPhotos.fries],
    ["Greek Fries", "7.99", pizzaPhotos.greekFries]
  ].forEach(([name, price, image]) =>
    addMenuItem("PIZZA", { name, description: "Pizza menu appetizer.", price, image })
  );
  addMenuItem("PIZZA", {
    name: "Pizza Add-ons",
    description: "Meats, onions, peppers, jalapeños, olives, mushrooms, pineapple, roasted garlic and feta cheese.",
    price: "1.75 each",
    image: pizzaPhotos.toppings
  });
  addMenuItem("PIZZA", {
    name: "Dipping Sauces",
    description: "Homemade red sauce, ranch, garlic butter, barbecue, Alfredo and buffalo.",
    price: "",
    image: pizzaPhotos.sauces
  });

  addMenuItem("TANDOORI SPECIAL", {
    name: "Haryali Chicken",
    description: "Chicken marinated in mint, cilantro, green chili and spices, then grilled.",
    price: "18.99",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Chicken_Hariyali_kebab.jpg?width=800"
  });
  addMenuItem("GOAT & LAMB ENTREES", {
    name: "Rogan Josh Lamb",
    description: "Lamb cooked in a rich, aromatic Kashmiri-style gravy.",
    price: "19.99",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Mutton_rogan_josh.jpg?width=800"
  });
  addMenuItem("BREAD", {
    name: "Paneer Parantha",
    description: "Whole-wheat flatbread stuffed with spiced paneer. Served with yogurt.",
    price: "7.99",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Paneer_Parantha.jpg?width=800"
  });
  addMenuItem("VEGETARIAN ENTREES", {
    name: "Paneer Tikka Masala",
    description: "Paneer tikka cooked in a rich and creamy tomato sauce.",
    price: "17.99",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Paneer_Tikka_Masala_(2026)_01.jpg?width=800"
  });
  addMenuItem("VEGETARIAN ENTREES", {
    name: "Tofu Butter Curry",
    description: "Tofu cooked in a rich, buttery tomato sauce.",
    price: "17.99",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tofu_Tikka_Masala_with_Brown_Rice_and_Chilies_(4940054389).jpg?width=800"
  });

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
    [...grid.children].forEach((card) => {
      const itemName = card.querySelector(":scope > div > div")?.textContent.trim().toLowerCase();

      if (itemName && MENU_ITEMS_TO_REMOVE.has(itemName)) {
        card.remove();
      }
    });

    if (title === "CHICKEN ENTREES") {
      const referenceCard = [...grid.children].find((card) =>
        card.querySelector(":scope > div > div")?.textContent.trim() === "Chicken Curry"
      );

      if (referenceCard) {
        const kormaCard = referenceCard.cloneNode(true);
        const body = kormaCard.querySelector(":scope > div");
        const name = body?.querySelector(":scope > div");
        const description = body?.querySelector(":scope > div:nth-of-type(2) > div");
        const price = body?.querySelector(":scope > div:nth-of-type(3)");

        if (name) name.textContent = "Chicken Korma";
        if (description) description.textContent = "A rich, velvety blend of aromatic spices and cream.";
        if (price) price.textContent = "$ 18.99";
        grid.appendChild(kormaCard);
      }
    }

    const cards = [...grid.children];
    const firstImage = cards[0]?.querySelector("img")?.src || "";

    section.id = id;
    section.classList.add("catalog-section");
    titleElement.className = "catalog-section__title";
    titleElement.textContent = title;

    if (title.includes("ENTREES")) {
      const riceNote = document.createElement("span");
      riceNote.className = "catalog-section__rice-note";
      riceNote.innerHTML = '<i class="fa-solid fa-bowl-rice" aria-hidden="true"></i> Complimentary rice with every entrée';
      titleElement.appendChild(riceNote);
    }

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

      const menuPriceUpdates = {
        "Chicken Wings": "$ 11.99",
        "Daal Soup": "$ 7.99",
        "Tandoori Shrimp": "$ 21.99",
        "Tandoori Mix Grill": "$ 21.99",
        "Chicken Curry": "$ 18.99",
        "Chicken Tikka Masala": "$ 19.99",
        "Methi Chicken": "$ 19.99",
        "Chicken Korma": "$ 19.99",
        "Baingan Bharta": "$ 15.99",
        "Saag Chana": "$ 15.99",
        "Bottled Water": "$ 2.00",
        Kheer: "$ 4.99",
        "Gulab Jamun": "$ 4.99",
        "Ras Malai": "$ 5.99"
      };

      if (name && price && menuPriceUpdates[name.textContent.trim()]) {
        price.textContent = menuPriceUpdates[name.textContent.trim()];
      }

      if (name && description && itemsServedWithYogurt.has(name.textContent.trim())) {
        description.textContent = `${description.textContent.trim()} Served with yogurt.`;
      }

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
