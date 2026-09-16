/**
 * Classic Market - Sell Product Form Handler
 * Page 2: Sell Product
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements - Global Navigation
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
  const accountBtn = document.getElementById("accountToggleBtn");
  const accountModal = document.getElementById("accountModal");
  const closeAccountModalBtn = document.getElementById("closeAccountModalBtn");

  // DOM Elements - Sell Form
  const sellForm = document.getElementById("sellProductForm");
  const dropzone = document.getElementById("imageDropzone");
  const imageFileInput = document.getElementById("productImageInput");
  const imagePreviewContainer = document.getElementById("imagePreviewContainer");
  const previewThumbnail = document.getElementById("previewThumbnail");
  const previewFileName = document.getElementById("previewFileName");
  const previewFileSize = document.getElementById("previewFileSize");
  const removeImageBtn = document.getElementById("removeImageBtn");
  const imageErrorMsg = document.getElementById("imageErrorMsg");

  // DOM Elements - Confirmation Modal
  const confirmationModal = document.getElementById("confirmationModal");
  const closeConfirmModalBtn = document.getElementById("closeConfirmModalBtn");
  const confirmImg = document.getElementById("confirmImg");
  const confirmTitle = document.getElementById("confirmTitle");
  const confirmCategory = document.getElementById("confirmCategory");
  const confirmCondition = document.getElementById("confirmCondition");
  const confirmPrice = document.getElementById("confirmPrice");
  const confirmSeller = document.getElementById("confirmSeller");
  const listAnotherBtn = document.getElementById("listAnotherBtn");

  // State
  let uploadedImageData = null;

  // --- Header Scroll Effect ---
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  }, { passive: true });

  // --- Cart Drawer Sync ---
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

  function renderCartDrawer() {
    const items = CartState.getItems();
    const count = CartState.getTotalCount();
    const subtotal = CartState.getSubtotal();
    const cartItemsList = document.getElementById("cartItemsList");
    const cartEmptyState = document.getElementById("cartEmptyState");
    const cartSubtotalEl = document.getElementById("cartSubtotal");
    const cartCountDrawer = document.getElementById("cartCountDrawer");
    const checkoutBtn = document.getElementById("checkoutBtn");

    if (cartCountDrawer) cartCountDrawer.textContent = `(${count} item${count === 1 ? '' : 's'})`;

    if (items.length === 0) {
      if (cartItemsList) cartItemsList.style.display = "none";
      if (cartEmptyState) cartEmptyState.style.display = "block";
      if (checkoutBtn) checkoutBtn.disabled = true;
      if (cartSubtotalEl) cartSubtotalEl.textContent = "Rs. 0";
    } else {
      if (cartItemsList) cartItemsList.style.display = "flex";
      if (cartEmptyState) cartEmptyState.style.display = "none";
      if (checkoutBtn) checkoutBtn.disabled = false;
      if (cartSubtotalEl) cartSubtotalEl.textContent = `Rs. ${subtotal.toLocaleString("en-US")}`;

      if (cartItemsList) {
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
          });
        });
      }
    }

    updateBadge();
  }

  function openCart() {
    cartDrawerWrap.classList.add("open");
    renderCartDrawer();
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

  window.addEventListener("cart-updated", () => {
    updateBadge();
    if (cartDrawerWrap && cartDrawerWrap.classList.contains("open")) {
      renderCartDrawer();
    }
  });

  // Checkout Action handled by js/checkout.js (Checkout with Escrow modal)

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

  // --- Search Bar Toggle ---
  if (searchToggleBtn) {
    searchToggleBtn.addEventListener("click", () => {
      window.location.href = "index.html#shop";
    });
  }

  // --- Account Modal ---
  if (accountBtn) {
    accountBtn.addEventListener("click", () => {
      accountModal.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  }
  if (closeAccountModalBtn) {
    closeAccountModalBtn.addEventListener("click", () => {
      accountModal.classList.remove("open");
      document.body.style.overflow = "";
    });
  }
  if (accountModal) {
    accountModal.addEventListener("click", (e) => {
      if (e.target === accountModal) {
        accountModal.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  }

  // --- Image Upload & Drag-and-Drop Handling ---
  function handleImageFile(file) {
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      showInputError(imageErrorMsg, "Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showInputError(imageErrorMsg, "Image file size must be less than 10 MB.");
      return;
    }

    clearInputError(imageErrorMsg);

    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImageData = {
        dataUrl: e.target.result,
        name: file.name,
        size: formatBytes(file.size)
      };

      previewThumbnail.src = uploadedImageData.dataUrl;
      previewThumbnail.alt = file.name;
      previewFileName.textContent = file.name;
      previewFileSize.textContent = uploadedImageData.size;

      imagePreviewContainer.classList.add("active");
      dropzone.style.display = "none";
    };
    reader.readAsDataURL(file);
  }

  if (imageFileInput) {
    imageFileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        handleImageFile(e.target.files[0]);
      }
    });
  }

  if (dropzone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("dragover");
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("dragover");
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files[0]) {
        handleImageFile(files[0]);
      }
    });
  }

  if (removeImageBtn) {
    removeImageBtn.addEventListener("click", () => {
      uploadedImageData = null;
      imageFileInput.value = "";
      imagePreviewContainer.classList.remove("active");
      dropzone.style.display = "block";
    });
  }

  // --- Validation Helpers ---
  function showInputError(errorEl, message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.add("visible");
  }

  function clearInputError(errorEl) {
    if (!errorEl) return;
    errorEl.textContent = "";
    errorEl.classList.remove("visible");
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    // Allows standard phone formats
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone.trim());
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  }

  // --- Form Submission & Validation ---
  if (sellForm) {
    sellForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let isValid = true;

      // Fields
      const productName = document.getElementById("productName");
      const productCategory = document.getElementById("productCategory");
      const productCondition = document.getElementById("productCondition");
      const productPrice = document.getElementById("productPrice");
      const productDescription = document.getElementById("productDescription");
      const sellerName = document.getElementById("sellerName");
      const sellerEmail = document.getElementById("sellerEmail");
      const sellerPhone = document.getElementById("sellerPhone");
      const sellerLocation = document.getElementById("sellerLocation");

      // Product Name
      const nameError = document.getElementById("productNameError");
      if (!productName.value.trim() || productName.value.trim().length < 3) {
        showInputError(nameError, "Please enter a descriptive product title (min 3 characters).");
        productName.classList.add("is-invalid");
        isValid = false;
      } else {
        clearInputError(nameError);
        productName.classList.remove("is-invalid");
      }

      // Category
      const catError = document.getElementById("productCategoryError");
      if (!productCategory.value) {
        showInputError(catError, "Please select an electronics category.");
        productCategory.classList.add("is-invalid");
        isValid = false;
      } else {
        clearInputError(catError);
        productCategory.classList.remove("is-invalid");
      }

      // Condition
      const condError = document.getElementById("productConditionError");
      if (!productCondition.value) {
        showInputError(condError, "Please specify the cosmetic and functional condition.");
        productCondition.classList.add("is-invalid");
        isValid = false;
      } else {
        clearInputError(condError);
        productCondition.classList.remove("is-invalid");
      }

      // Price
      const priceError = document.getElementById("productPriceError");
      const priceVal = parseFloat(productPrice.value);
      if (isNaN(priceVal) || priceVal < 5 || priceVal > 100000) {
        showInputError(priceError, "Please enter a realistic price between $5 and $100,000.");
        productPrice.classList.add("is-invalid");
        isValid = false;
      } else {
        clearInputError(priceError);
        productPrice.classList.remove("is-invalid");
      }

      // Description
      const descError = document.getElementById("productDescError");
      if (!productDescription.value.trim() || productDescription.value.trim().length < 15) {
        showInputError(descError, "Please provide an accurate description (at least 15 characters).");
        productDescription.classList.add("is-invalid");
        isValid = false;
      } else {
        clearInputError(descError);
        productDescription.classList.remove("is-invalid");
      }

      // Product Image
      if (!uploadedImageData) {
        showInputError(imageErrorMsg, "Please upload at least one photograph of the hardware.");
        isValid = false;
      } else {
        clearInputError(imageErrorMsg);
      }

      // Seller Name
      const sNameError = document.getElementById("sellerNameError");
      if (!sellerName.value.trim() || sellerName.value.trim().length < 2) {
        showInputError(sNameError, "Please enter your full name.");
        sellerName.classList.add("is-invalid");
        isValid = false;
      } else {
        clearInputError(sNameError);
        sellerName.classList.remove("is-invalid");
      }

      // Seller Email
      const sEmailError = document.getElementById("sellerEmailError");
      if (!validateEmail(sellerEmail.value)) {
        showInputError(sEmailError, "Please enter a valid email address.");
        sellerEmail.classList.add("is-invalid");
        isValid = false;
      } else {
        clearInputError(sEmailError);
        sellerEmail.classList.remove("is-invalid");
      }

      // Seller Phone
      const sPhoneError = document.getElementById("sellerPhoneError");
      if (!validatePhone(sellerPhone.value)) {
        showInputError(sPhoneError, "Please enter a valid phone number (e.g. 555-019-2834).");
        sellerPhone.classList.add("is-invalid");
        isValid = false;
      } else {
        clearInputError(sPhoneError);
        sellerPhone.classList.remove("is-invalid");
      }

      // Location
      const sLocError = document.getElementById("sellerLocationError");
      if (!sellerLocation.value.trim()) {
        showInputError(sLocError, "Please enter your city and state/country.");
        sellerLocation.classList.add("is-invalid");
        isValid = false;
      } else {
        clearInputError(sLocError);
        sellerLocation.classList.remove("is-invalid");
      }

      if (!isValid) {
        showToast("Please correct the errors in the form.");
        const firstInvalid = sellForm.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Prepare product payload
      const submitBtn = sellForm.querySelector('button[type="submit"]');
      const origBtnText = submitBtn ? submitBtn.textContent : "Publish Listing";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Saving to Database...";
      }

      const productPayload = {
        name: productName.value.trim(),
        category: productCategory.value,
        price: priceVal,
        condition: productCondition.value,
        condition_note: document.getElementById("productConditionNote") ? document.getElementById("productConditionNote").value.trim() : "",
        description: productDescription.value.trim(),
        image: uploadedImageData ? uploadedImageData.dataUrl : "",
        seller: sellerName.value.trim(),
        seller_email: sellerEmail.value.trim(),
        seller_phone: sellerPhone.value.trim(),
        location: sellerLocation.value.trim()
      };

      // Save to Supabase (and keep local cache sync)
      (async () => {
        let savedToSupabase = false;
        try {
          if (window.SupabaseDB) {
            await window.SupabaseDB.insertProduct(productPayload);
            savedToSupabase = true;
            console.log("[Supabase] Product saved successfully to Supabase DB:", productPayload.name);
          }
        } catch (dbErr) {
          console.warn("[Supabase] Notice saving to Supabase table:", dbErr.message || dbErr);
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = origBtnText;
          }
        }

        // Form is valid! Populate confirmation modal
        confirmImg.src = uploadedImageData.dataUrl;
        confirmImg.alt = productName.value.trim();
        confirmTitle.textContent = productName.value.trim();
        confirmCategory.textContent = productCategory.options[productCategory.selectedIndex].text;
        confirmCondition.textContent = productCondition.options[productCondition.selectedIndex].text;
        confirmPrice.textContent = `$${priceVal.toLocaleString("en-US")}`;
        confirmSeller.textContent = `${sellerName.value.trim()} (${sellerLocation.value.trim()})`;

        // Update modal status hint
        const modalDesc = confirmationModal.querySelector("p");
        if (modalDesc) {
          if (savedToSupabase) {
            modalDesc.innerHTML = 'Saved directly to <strong>Supabase Database</strong> and queued for hardware verification.';
          } else {
            modalDesc.textContent = 'Your listing has been submitted and queued for verification inspection.';
          }
        }

        confirmationModal.classList.add("open");
        document.body.style.overflow = "hidden";
        showToast(savedToSupabase ? "Listing saved to Supabase Database!" : "Listing successfully prepared!");
      })();
    });
  }

  // --- Confirmation Modal Handlers ---
  function closeConfirmationModal() {
    confirmationModal.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (closeConfirmModalBtn) closeConfirmModalBtn.addEventListener("click", closeConfirmationModal);
  if (listAnotherBtn) {
    listAnotherBtn.addEventListener("click", () => {
      closeConfirmationModal();
      sellForm.reset();
      uploadedImageData = null;
      imageFileInput.value = "";
      imagePreviewContainer.classList.remove("active");
      dropzone.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("Form cleared. You can list another product.");
    });
  }

  // --- Global Keyboard & Toast ---
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (confirmationModal && confirmationModal.classList.contains("open")) closeConfirmationModal();
      if (cartDrawerWrap && cartDrawerWrap.classList.contains("open")) closeCart();
      if (mobileMenu && mobileMenu.classList.contains("open")) closeMobileMenu();
      if (accountModal && accountModal.classList.contains("open")) {
        accountModal.classList.remove("open");
        document.body.style.overflow = "";
      }
    }
  });

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

  // Initial Sync
  updateBadge();
});
