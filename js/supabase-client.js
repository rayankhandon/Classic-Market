/**
 * Classic Market — Supabase Database Client & Services
 * Direct REST API client with optional @supabase/supabase-js wrapper.
 */

const SUPABASE_CONFIG = {
  url: "https://csuwidtjqkjpndlrlrkv.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzdXdpZHRqcWtqcG5kbHJscmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1ODY2MTAsImV4cCI6MjEwNDE2MjYxMH0.95chelJ7MtUlmu54UVKdLUPw5cWIDxUeDVeslTxzBkQ"
};

let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (typeof window !== "undefined" && window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    return supabaseClient;
  }
  return null;
}

function getHeaders() {
  return {
    "apikey": SUPABASE_CONFIG.anonKey,
    "Authorization": `Bearer ${SUPABASE_CONFIG.anonKey}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };
}

const SupabaseDB = {
  config: SUPABASE_CONFIG,

  /**
   * Fetch all products from Supabase 'products' table.
   */
  async fetchProducts() {
    try {
      const client = getSupabaseClient();
      if (client) {
        const { data, error } = await client
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && Array.isArray(data)) {
          this.updateStatus(true, data.length);
          return data;
        }
      }

      // Native fetch fallback (direct REST API)
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/products?select=*&order=created_at.desc`, {
        headers: getHeaders()
      });
      if (!res.ok) {
        console.warn("[Supabase REST] Notice querying products:", res.status, res.statusText);
        this.updateStatus(false, 0);
        return null;
      }
      const data = await res.json();
      this.updateStatus(true, data.length);
      return data;
    } catch (err) {
      console.warn("[Supabase] Network error fetching products:", err);
      this.updateStatus(false, 0);
      return null;
    }
  },

  /**
   * Insert a newly submitted listing from the Sell Product form into Supabase.
   */
  async insertProduct(productData) {
    try {
      const client = getSupabaseClient();
      if (client) {
        const { data, error } = await client
          .from("products")
          .insert([productData])
          .select();
        if (!error) return data;
      }

      // Native fetch fallback
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/products`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(productData)
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `HTTP ${res.status}: Failed to insert product`);
      }
      return await res.json();
    } catch (err) {
      console.error("[Supabase] Insert error:", err);
      throw err;
    }
  },

  /**
   * Insert a newly completed order from the Checkout Form into Supabase 'orders' table.
   */
  async createOrder(orderData) {
    try {
      const client = getSupabaseClient();
      if (client) {
        const { data, error } = await client
          .from("orders")
          .insert([orderData])
          .select();
        if (!error) return data;
      }

      // Native fetch fallback
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/orders`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(orderData)
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `HTTP ${res.status}: Failed to create order`);
      }
      return await res.json();
    } catch (err) {
      console.error("[Supabase] Order creation error:", err);
      throw err;
    }
  },

  /**
   * Update UI status indicators in header and DOM
   */
  updateStatus(isConnected, count) {
    const dots = document.querySelectorAll(".status-pulse-dot, #supabaseDot");
    const texts = document.querySelectorAll(".status-text, #supabaseStatusText");
    const pills = document.querySelectorAll(".btn-supabase-status, .supabase-status-pill");

    dots.forEach(d => {
      d.classList.toggle("connected", isConnected);
      d.classList.toggle("offline", !isConnected);
    });

    texts.forEach(t => {
      t.textContent = isConnected ? `Supabase Live (${count} items)` : "Supabase Offline";
    });

    pills.forEach(p => {
      p.classList.toggle("active-connected", isConnected);
      p.setAttribute("title", isConnected 
        ? `Connected to Supabase (csuwidtjqkjpndlrlrkv). ${count} active records in database.`
        : "Supabase connection pending...");
    });
  }
};

window.SupabaseDB = SupabaseDB;
window.getSupabaseClient = getSupabaseClient;

// Auto-check connection on load
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      SupabaseDB.fetchProducts();
    }, 200);
  });
}
