/**
 * Classic Market — Drawer Inline Checkout Flow
 * Manages the slide transitions between Cart Items View & Checkout Form inside the cart drawer.
 */

(function () {
  function initDrawerCheckout() {
    const checkoutBtn = document.getElementById("checkoutBtn");
    const cartItemsView = document.getElementById("cartItemsView");
    const drawerCheckoutView = document.getElementById("drawerCheckoutView");
    const drawerBackToCartBtn = document.getElementById("drawerBackToCartBtn");
    const closeDrawerCheckoutBtn = document.getElementById("closeDrawerCheckoutBtn");
    const closeCartBtn = document.getElementById("closeCartBtn");
    const cartDrawerWrap = document.getElementById("cartDrawerWrap");

    const drawerEscrowForm = document.getElementById("drawerEscrowForm");
    const drawerSubmitOrderBtn = document.getElementById("drawerSubmitOrderBtn");
    const drawerSummaryItemsList = document.getElementById("drawerSummaryItemsList");
    const drawerCheckoutTotal = document.getElementById("drawerCheckoutTotal");

    const orderSuccessModal = document.getElementById("orderSuccessModal");
    const closeOrderSuccessBtn = document.getElementById("closeOrderSuccessBtn");
    const finishOrderBtn = document.getElementById("finishOrderBtn");

    if (!checkoutBtn || !cartItemsView || !drawerCheckoutView || !drawerEscrowForm) return;

    // View Switching
    function showCheckoutView() {
      const items = window.CartState ? window.CartState.getItems() : [];
      const subtotal = window.CartState ? window.CartState.getSubtotal() : 0;

      if (!items || items.length === 0 || subtotal <= 0) {
        if (typeof showToast === "function") {
          showToast("Cart is empty. Add a product first.");
        }
        return;
      }

      // Populate mini summary in drawer
      if (drawerSummaryItemsList) {
        drawerSummaryItemsList.innerHTML = items.map(item => `
          <div class="drawer-summary-item">
            <span style="font-weight: 500; color: var(--color-black);">${item.name} &times; ${item.quantity}</span>
            <strong style="color: var(--color-black);">$${(item.price * item.quantity).toLocaleString("en-US")}</strong>
          </div>
        `).join("");
      }

      if (drawerCheckoutTotal) {
        drawerCheckoutTotal.textContent = `Rs. ${subtotal.toLocaleString("en-US")}`;
      }

      cartItemsView.hidden = true;
      drawerCheckoutView.hidden = false;
      drawerCheckoutView.scrollTop = 0;
    }

    function showCartView() {
      drawerCheckoutView.hidden = true;
      cartItemsView.hidden = false;
    }

    function closeCartDrawer() {
      if (cartDrawerWrap) {
        cartDrawerWrap.classList.remove("open");
        document.body.style.overflow = "";
      }
      setTimeout(showCartView, 300);
    }

    checkoutBtn.addEventListener("click", showCheckoutView);
    if (drawerBackToCartBtn) drawerBackToCartBtn.addEventListener("click", showCartView);
    if (closeDrawerCheckoutBtn) closeDrawerCheckoutBtn.addEventListener("click", closeCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartDrawer);

    // Reset view when clicking backdrop
    const cartBackdrop = document.querySelector(".cart-backdrop");
    if (cartBackdrop) {
      cartBackdrop.addEventListener("click", closeCartDrawer);
    }

    // Validation helpers
    function setFieldError(id, msg) {
      const el = document.getElementById(id);
      if (el) el.textContent = msg;
    }
    function clearFieldError(id) {
      const el = document.getElementById(id);
      if (el) el.textContent = "";
    }

    // Handle Inline Checkout Form Submit
    drawerEscrowForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("dName");
      const emailInput = document.getElementById("dEmail");
      const phoneInput = document.getElementById("dPhone");
      const addressInput = document.getElementById("dAddress");
      const cityInput = document.getElementById("dCity");
      const stateInput = document.getElementById("dState");
      const zipInput = document.getElementById("dZip");

      let isValid = true;

      // Full Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        setFieldError("dNameError", "Full legal name is required.");
        nameInput.classList.add("is-invalid");
        isValid = false;
      } else {
        clearFieldError("dNameError");
        nameInput.classList.remove("is-invalid");
      }

      // Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        setFieldError("dEmailError", "Valid email address is required.");
        emailInput.classList.add("is-invalid");
        isValid = false;
      } else {
        clearFieldError("dEmailError");
        emailInput.classList.remove("is-invalid");
      }

      // Phone
      if (!phoneInput.value.trim() || phoneInput.value.trim().length < 7) {
        setFieldError("dPhoneError", "Phone number is required.");
        phoneInput.classList.add("is-invalid");
        isValid = false;
      } else {
        clearFieldError("dPhoneError");
        phoneInput.classList.remove("is-invalid");
      }

      // Address
      if (!addressInput.value.trim()) {
        setFieldError("dAddressError", "Delivery street address is required.");
        addressInput.classList.add("is-invalid");
        isValid = false;
      } else {
        clearFieldError("dAddressError");
        addressInput.classList.remove("is-invalid");
      }

      // City
      if (!cityInput.value.trim()) {
        setFieldError("dCityError", "City is required.");
        cityInput.classList.add("is-invalid");
        isValid = false;
      } else {
        clearFieldError("dCityError");
        cityInput.classList.remove("is-invalid");
      }

      // State
      if (!stateInput.value.trim()) {
        setFieldError("dStateError", "Province/State is required.");
        stateInput.classList.add("is-invalid");
        isValid = false;
      } else {
        clearFieldError("dStateError");
        stateInput.classList.remove("is-invalid");
      }

      // Zip
      if (!zipInput.value.trim()) {
        setFieldError("dZipError", "Postal code is required.");
        zipInput.classList.add("is-invalid");
        isValid = false;
      } else {
        clearFieldError("dZipError");
        zipInput.classList.remove("is-invalid");
      }

      if (!isValid) {
        const firstInvalid = drawerEscrowForm.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const items = window.CartState ? window.CartState.getItems() : [];
      const subtotal = window.CartState ? window.CartState.getSubtotal() : 0;
      const orderNumber = "CM-" + Math.floor(100000 + Math.random() * 900000);

      const orderPayload = {
        order_number: orderNumber,
        customer_name: nameInput.value.trim(),
        customer_email: emailInput.value.trim(),
        customer_phone: phoneInput.value.trim(),
        shipping_address: addressInput.value.trim(),
        shipping_city: cityInput.value.trim(),
        shipping_state: stateInput.value.trim(),
        shipping_zip: zipInput.value.trim(),
        payment_method: "Escrow Protection Guarantee",
        items: items,
        subtotal: subtotal,
        status: "Escrow Locked / Order Placed"
      };

      // Button loading state
      const origBtnText = drawerSubmitOrderBtn.textContent;
      drawerSubmitOrderBtn.disabled = true;
      drawerSubmitOrderBtn.textContent = "Locking Escrow Deposit...";

      try {
        if (window.SupabaseDB && window.SupabaseDB.createOrder) {
          await window.SupabaseDB.createOrder(orderPayload);
          console.log("[Supabase] Order stored successfully in database:", orderNumber);
        }
      } catch (err) {
        console.warn("[Supabase] Notice saving order to database:", err.message || err);
      } finally {
        drawerSubmitOrderBtn.disabled = false;
        drawerSubmitOrderBtn.textContent = origBtnText;
      }

      // Clear cart
      if (window.CartState) {
        window.CartState.clear();
      }

      // Populate success receipt
      const recNum = document.getElementById("receiptOrderNum");
      const recCust = document.getElementById("receiptCustomerName");
      const recDest = document.getElementById("receiptDestination");
      const recTot = document.getElementById("receiptTotal");

      if (recNum) recNum.textContent = orderNumber;
      if (recCust) recCust.textContent = orderPayload.customer_name;
      if (recDest) recDest.textContent = `${orderPayload.shipping_city}, ${orderPayload.shipping_state}`;
      if (recTot) recTot.textContent = `$${subtotal.toLocaleString("en-US")}`;

      // Reset form and close drawer
      closeCartDrawer();
      drawerEscrowForm.reset();

      if (orderSuccessModal) {
        orderSuccessModal.classList.add("open");
        document.body.style.overflow = "hidden";
      }
    });

    // Close success modal listeners
    if (closeOrderSuccessBtn) {
      closeOrderSuccessBtn.addEventListener("click", () => {
        if (orderSuccessModal) orderSuccessModal.classList.remove("open");
        document.body.style.overflow = "";
      });
    }
    if (finishOrderBtn) {
      finishOrderBtn.addEventListener("click", () => {
        if (orderSuccessModal) orderSuccessModal.classList.remove("open");
        document.body.style.overflow = "";
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDrawerCheckout);
  } else {
    initDrawerCheckout();
  }
})();
