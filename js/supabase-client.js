/**
 * Classic Market — Supabase Database Client & Services
 * Handles live synchronization for listed products and marketplace items.
 */

const SUPABASE_CONFIG = {
  url: "https://nlljxlmymdwdwxfbmavu.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sbGp4bG15bWR3ZHd4ZmJtYXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MjcxNzEsImV4cCI6MjEwNTEwMzE3MX0.7kit1ntCOVC28b9OD_7m09QtJgSO-FqSqhYNorKOOVM"
};

// Initialize Supabase Client instance (uses official @supabase/supabase-js CDN when loaded)
let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (typeof window !== "undefined" && window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    return supabaseClient;
  }
  return null;
}

const SupabaseDB = {
  /**
   * Fetch all products from Supabase 'products' table.
   * If table hasn't been created yet or fails, safely falls back.
   */
  async fetchProducts() {
    const client = getSupabaseClient();
    if (!client) {
      console.warn("[Supabase] Client not initialized yet.");
      return null;
    }

    try {
      const { data, error } = await client
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("[Supabase] Notice querying products table:", error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn("[Supabase] Network/fetch error:", err);
      return null;
    }
  },

  /**
   * Insert a newly submitted listing from the Sell Product form into Supabase.
   */
  async insertProduct(productData) {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Supabase client is not ready");
    }

    const { data, error } = await client
      .from("products")
      .insert([productData])
      .select();

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Insert a newly completed order from the Checkout Form into Supabase 'orders' table.
   */
  async createOrder(orderData) {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Supabase client is not ready");
    }

    const { data, error } = await client
      .from("orders")
      .insert([orderData])
      .select();

    if (error) {
      throw error;
    }

    return data;
  }
};

window.SupabaseDB = SupabaseDB;
window.getSupabaseClient = getSupabaseClient;
