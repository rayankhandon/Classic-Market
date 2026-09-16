/**
 * Classic Market Main Application Logic
 * Page 1: Home / Shop
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements - Header & Global
  const siteHeader = document.querySelector(".site-header");
  const cartBtn = document.getElementById("cartToggleBtn");
  const cartBadge = document.getElementById("cartBadge");
  const navCartLink = document.getElementById("navCartLink");
  const navCartPill = document.getElementById("navCartPill");
  const mobileCartLink = document.getElementById("mobileCartLink");
  const mobileCartPill = document.getElementById("mobileCartPill");
  const cartDrawerWrap = document.getElementById("cartDrawerWrap");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const mobileToggleBtn = document.getElementById("mobileToggleBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMobileMenuBtn = document.getElementById("closeMobileMenuBtn");
  const searchToggleBtn = document.getElementById("searchToggleBtn");
  const headerSearchBar = document.getElementById("headerSearchBar");
  const closeHeaderSearchBtn = document.getElementById("closeHeaderSearchBtn");
  const headerSearchInput = document.getElementById("headerSearchInput");
  const accountBtn = document.getElementById("accountToggleBtn");
  const accountModal = document.getElementById("accountModal");
  const closeAccountModalBtn = document.getElementById("closeAccountModalBtn");

  // DOM Elements - Product Discovery & Catalog
  const productGrid = document.getElementById("productGrid");
  const catalogSearchInput = document.getElementById("catalogSearchInput");
  const sortSelect = document.getElementById("sortSelect");
  const filterChips = document.querySelectorAll(".filter-chip");
  const productCountDisplay = document.getElementById("productCountDisplay");

  // DOM Elements - Quick View Modal
  const quickViewModal = document.getElementById("quickViewModal");
  const closeQuickViewBtn = document.getElementById("closeQuickViewBtn");
  const qvImage = document.getElementById("qvImage");
  const qvCategory = document.getElementById("qvCategory");
  const qvCondition = document.getElementById("qvCondition");
  const qvTitle = document.getElementById("qvTitle");
  const qvPrice = document.getElementById("qvPrice");
  const qvConditionNote = document.getElementById("qvConditionNote");
  const qvDesc = document.getElementById("qvDesc");
  const qvSpecsList = document.getElementById("qvSpecsList");
  const qvSeller = document.getElementById("qvSeller");
  const qvLocation = document.getElementById("qvLocation");
  const qvAddToCartBtn = document.getElementById("qvAddToCartBtn");

  // DOM Elements - Cart Drawer Components
  const cartItemsList = document.getElementById("cartItemsList");
  const cartEmptyState = document.getElementById("cartEmptyState");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const cartCountDrawer = document.getElementById("cartCountDrawer");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // State
  let activeCategory = "all";
  let activeSort = "featured";
  let searchQuery = "";
  let activeQuickViewId = null;
  const baseProducts = (typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS)) ? PRODUCTS : (Array.isArray(window.PRODUCTS) ? window.PRODUCTS : []);
  let allProducts = [...baseProducts];

  // Fetch live products from Supabase
  async function loadProductsFromSupabase() {
    try {
      if (window.SupabaseDB) {
        const remoteProducts = await window.SupabaseDB.fetchProducts();
        if (remoteProducts && remoteProducts.length > 0) {
          // Normalize remote products to match schema
          const mapped = remoteProducts.map(p => ({
            id: p.id || `supa-${p.name.toLowerCase().replace(/\s+/g, '-')}`,
            name: p.name,
            category: p.category,
            price: Number(p.price) || 0,
            condition: p.condition || "Used",
            conditionNote: p.condition_note || p.conditionNote || "",
            description: p.description || "",
            specs: Array.isArray(p.specs) ? p.specs : [],
            image: p.image || "assets/images/hero-tech.jpg",
            availability: p.availability || "In Stock",
            seller: p.seller || "Verified Member",
            location: p.location || "Online"
          }));

          // Merge: remote items take priority, fallback with curated catalog
          allProducts = [...mapped, ...PRODUCTS.filter(cp => !mapped.some(m => m.name.toLowerCase() === cp.name.toLowerCase()))];
          renderProducts();
          console.log(`[Supabase] Loaded ${remoteProducts.length} live product(s) from Supabase.`);
        }
      }
    } catch (err) {
      console.warn("[Supabase] Fallback to local products:", err);
    }
  }

  // --- Scroll Header Effect ---
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  }, { passive: true });

  // --- Cart Drawer Toggle ---
  function openCart() {
    cartDrawerWrap.classList.add("open");
    renderCart();
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    cartDrawerWrap.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (cartBtn) cartBtn.addEventListener("click", openCart);
  if (navCartLink) navCartLink.addEventListener("click", openCart);
  if (mobileCartLink) {
    mobileCartLink.addEventListener("click", () => {
      closeMobileMenu();
      openCart();
    });
  }
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  const cartBackdrop = document.querySelector(".cart-backdrop");
  if (cartBackdrop) cartBackdrop.addEventListener("click", closeCart);

  // --- Mobile Drawer Toggle ---
  function openMobileMenu() {
    mobileMenu.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (mobileToggleBtn) mobileToggleBtn.addEventListener("click", openMobileMenu);
  if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener("click", closeMobileMenu);
  const mobileBackdrop = document.querySelector(".mobile-backdrop");
  if (mobileBackdrop) mobileBackdrop.addEventListener("click", closeMobileMenu);

  // Close mobile drawer when link clicked
  document.querySelectorAll(".mobile-nav-link").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });

  // --- Header Search Bar Toggle ---
  function toggleHeaderSearch() {
    const isOpen = headerSearchBar.classList.contains("open");
    if (isOpen) {
      headerSearchBar.classList.remove("open");
    } else {
      headerSearchBar.classList.add("open");
      headerSearchInput.focus();
    }
  }

  if (searchToggleBtn) searchToggleBtn.addEventListener("click", toggleHeaderSearch);
  if (closeHeaderSearchBtn) closeHeaderSearchBtn.addEventListener("click", () => {
    headerSearchBar.classList.remove("open");
  });

  if (headerSearchInput) {
    headerSearchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (catalogSearchInput) catalogSearchInput.value = e.target.value;
      renderProducts();
    });
  }

  // --- Account Modal ---
  function openAccountModal() {
    accountModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeAccountModal() {
    accountModal.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (accountBtn) accountBtn.addEventListener("click", openAccountModal);
  if (closeAccountModalBtn) closeAccountModalBtn.addEventListener("click", closeAccountModal);
  if (accountModal) {
    accountModal.addEventListener("click", (e) => {
      if (e.target === accountModal) closeAccountModal();
    });
  }

  const accountForm = document.getElementById("demoAccountForm");
  if (accountForm) {
    accountForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Signed in as verified technology member");
      closeAccountModal();
    });
  }

  // --- Catalog Search Input ---
  if (catalogSearchInput) {
    catalogSearchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (headerSearchInput) headerSearchInput.value = e.target.value;
      renderProducts();
    });
  }

  // --- Category Filters ---
  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      filterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeCategory = chip.dataset.category.toLowerCase();
      renderProducts();
    });
  });

  // --- Sort Dropdown ---
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      activeSort = e.target.value;
      renderProducts();
    });
  }

  // --- Render Products ---
  function getFilteredAndSortedProducts() {
    window.allProducts = allProducts;
    let list = [...allProducts];

    // Category Filter
    if (activeCategory !== "all") {
      list = list.filter(item => item.category.toLowerCase() === activeCategory);
    }

    // Search Query Filter
    if (searchQuery) {
      list = list.filter(item => {
        const matchName = item.name.toLowerCase().includes(searchQuery);
        const matchCategory = item.category.toLowerCase().includes(searchQuery);
        const matchDesc = item.description.toLowerCase().includes(searchQuery);
        const matchSpecs = item.specs.some(s => s.value.toLowerCase().includes(searchQuery) || s.label.toLowerCase().includes(searchQuery));
        return matchName || matchCategory || matchDesc || matchSpecs;
      });
    }

    // Sort
    if (activeSort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (activeSort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }

  function renderProducts() {
    if (!productGrid) return;

    const filtered = getFilteredAndSortedProducts();
    if (productCountDisplay) {
      productCountDisplay.textContent = `${filtered.length} product${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      productGrid.innerHTML = `
        <div class="empty-catalog">
          <h3>No products match your criteria</h3>
          <p>Try searching for "laptop", "keyboard", "mouse", "monitor", or "gpu", or reset the category filter.</p>
          <button class="btn btn-secondary btn-sm" id="resetFiltersBtn">Reset Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById("resetFiltersBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          activeCategory = "all";
          searchQuery = "";
          if (catalogSearchInput) catalogSearchInput.value = "";
          if (headerSearchInput) headerSearchInput.value = "";
          filterChips.forEach(c => {
            if (c.dataset.category === "all") c.classList.add("active");
            else c.classList.remove("active");
          });
          renderProducts();
        });
      }
      return;
    }

    productGrid.innerHTML = filtered.map(product => {
      const formattedPrice = product.price.toLocaleString("en-US");
      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-image-wrap" role="button" tabindex="0" aria-label="Quick view of ${product.name}">
            <div class="product-card-top-badges">
              <span class="badge badge-condition">${product.condition}</span>
              <span class="badge badge-dark">${product.availability}</span>
            </div>
            <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" width="400" height="300">
          </div>
          <div class="product-body">
            <div class="product-meta-row">
              <span class="product-category-tag">${product.category}</span>
            </div>
            <h3 class="product-title" role="button" tabindex="0">${product.name}</h3>
            <p class="product-desc">${product.description}</p>
            <div class="product-footer">
              <div class="product-price-block">
                <span class="price-label">Price</span>
                <span class="product-price">$${formattedPrice}</span>
              </div>
              <div class="product-actions-group">
                <button class="btn btn-outline btn-sm quick-view-trigger" data-id="${product.id}" aria-label="View specifications for ${product.name}">
                  View
                </button>
                <button class="btn btn-primary btn-sm add-to-cart-trigger" data-id="${product.id}" aria-label="Add ${product.name} to cart">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join("");

    // Attach click events
    productGrid.querySelectorAll(".product-card").forEach(card => {
      const id = card.dataset.id;
      const imgWrap = card.querySelector(".product-image-wrap");
      const title = card.querySelector(".product-title");
      const qvBtn = card.querySelector(".quick-view-trigger");
      const cartBtn = card.querySelector(".add-to-cart-trigger");

      [imgWrap, title, qvBtn].forEach(el => {
        if (el) {
          el.addEventListener("click", () => openQuickView(id));
          el.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openQuickView(id);
            }
          });
        }
      });

      if (cartBtn) {
        cartBtn.addEventListener("click", () => {
          CartState.addItem(id, 1);
          const p = allProducts.find(item => item.id === id) || PRODUCTS.find(item => item.id === id);
          showToast(`Added "${p ? p.name : 'Product'}" to cart`);
        });
      }
    });
  }

  // --- Quick View Modal Flow ---
  function openQuickView(productId) {
    const product = allProducts.find(p => p.id === productId) || PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    activeQuickViewId = productId;
    qvImage.src = product.image;
    qvImage.alt = product.name;
    qvCategory.textContent = product.category;
    qvCondition.textContent = product.condition;
    qvTitle.textContent = product.name;
    qvPrice.textContent = `$${product.price.toLocaleString("en-US")}`;
    qvConditionNote.textContent = product.conditionNote;
    qvDesc.textContent = product.description;
    qvSeller.textContent = product.seller;
    qvLocation.textContent = product.location;

    // Specs table
    qvSpecsList.innerHTML = (product.specs || []).map(spec => `
      <tr>
        <td>${spec.label}</td>
        <td>${spec.value}</td>
      </tr>
    `).join("");

    quickViewModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeQuickView() {
    quickViewModal.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (closeQuickViewBtn) closeQuickViewBtn.addEventListener("click", closeQuickView);
  if (quickViewModal) {
    quickViewModal.addEventListener("click", (e) => {
      if (e.target === quickViewModal) closeQuickView();
    });
  }

  if (qvAddToCartBtn) {
    qvAddToCartBtn.addEventListener("click", () => {
      if (!activeQuickViewId) return;
      CartState.addItem(activeQuickViewId, 1);
      const product = allProducts.find(p => p.id === activeQuickViewId) || PRODUCTS.find(p => p.id === activeQuickViewId);
      showToast(`Added "${product ? product.name : 'Product'}" to cart`);
      closeQuickView();
      openCart();
    });
  }

  // --- Cart UI Rendering ---
  function updateBadge() {
    const totalCount = CartState.getTotalCount();
    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.style.display = totalCount > 0 ? "flex" : "none";
    }
    if (navCartPill) {
      navCartPill.textContent = `(${totalCount})`;
      navCartPill.style.display = totalCount > 0 ? "inline" : "none";
    }
    if (mobileCartPill) {
      mobileCartPill.textContent = `(${totalCount})`;
      mobileCartPill.style.display = totalCount > 0 ? "inline" : "none";
    }
  }

  function renderCart() {
    const items = CartState.getItems();
    const count = CartState.getTotalCount();
    const subtotal = CartState.getSubtotal();

    if (cartCountDrawer) {
      cartCountDrawer.textContent = `(${count} item${count === 1 ? '' : 's'})`;
    }

    if (items.length === 0) {
      cartItemsList.style.display = "none";
      cartEmptyState.style.display = "block";
      if (checkoutBtn) checkoutBtn.disabled = true;
      if (cartSubtotalEl) cartSubtotalEl.textContent = "Rs. 0";
    } else {
      cartItemsList.style.display = "flex";
      cartEmptyState.style.display = "none";
      if (checkoutBtn) checkoutBtn.disabled = false;
      if (cartSubtotalEl) cartSubtotalEl.textContent = `Rs. ${subtotal.toLocaleString("en-US")}`;

      cartItemsList.innerHTML = items.map(item => `
        <div class="cart-item-row" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-meta">${item.condition} · Verified</div>
            <div class="cart-item-price">$${(item.price * item.quantity).toLocaleString("en-US")}</div>
            <div class="cart-qty-controls">
              <button class="qty-btn dec-qty" aria-label="Decrease quantity">−</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn inc-qty" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="cart-item-remove" aria-label="Remove ${item.name} from cart">×</button>
        </div>
      `).join("");

      // Attach row events
      cartItemsList.querySelectorAll(".cart-item-row").forEach(row => {
        const id = row.dataset.id;
        const currentItem = items.find(i => i.id === id);

        row.querySelector(".dec-qty").addEventListener("click", () => {
          CartState.updateQuantity(id, currentItem.quantity - 1);
        });

        row.querySelector(".inc-qty").addEventListener("click", () => {
          CartState.updateQuantity(id, currentItem.quantity + 1);
        });

        row.querySelector(".cart-item-remove").addEventListener("click", () => {
          CartState.removeItem(id);
          showToast(`Removed from cart`);
        });
      });
    }

    updateBadge();
  }

  // Listen to external cart-updated events
  window.addEventListener("cart-updated", () => {
    updateBadge();
    if (cartDrawerWrap.classList.contains("open")) {
      renderCart();
    }
  });

  // Checkout Action handled by js/checkout.js (Checkout with Escrow modal)

  // --- Keyboard Shortcuts & Esc Listener ---
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (quickViewModal && quickViewModal.classList.contains("open")) closeQuickView();
      if (cartDrawerWrap && cartDrawerWrap.classList.contains("open")) closeCart();
      if (mobileMenu && mobileMenu.classList.contains("open")) closeMobileMenu();
      if (accountModal && accountModal.classList.contains("open")) closeAccountModal();
      if (headerSearchBar && headerSearchBar.classList.contains("open")) headerSearchBar.classList.remove("open");
    }
  });

  // --- Toast Notification ---
  function showToast(message) {
    let toast = document.querySelector(".toast-msg");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast-msg";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  // Initial Render
  updateBadge();
  renderProducts();
  loadProductsFromSupabase();
});
