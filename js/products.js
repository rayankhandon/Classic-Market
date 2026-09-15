/**
 * Classic Market — Product Catalog
 * Exactly 6 curated premium computer electronics products
 */

const PRODUCTS = [
  {
    id: "prod-laptop-01",
    name: "Apex Pro 16 G3 Gaming Laptop",
    category: "Laptops",
    price: 1299,
    condition: "Like New",
    conditionNote: "Mint condition, original box and 280W charger included. Battery cycle count: 18.",
    description: "Ultra-slim matte black performance chassis featuring Intel Core i9-13900H, 32GB DDR5 5200MHz, NVIDIA GeForce RTX 4070 8GB, 1TB NVMe Gen4 SSD, and a factory-calibrated 16-inch QHD 240Hz IPS display.",
    specs: [
      { label: "Processor", value: "Intel Core i9-13900H (14-Core, up to 5.4GHz)" },
      { label: "Graphics", value: "NVIDIA GeForce RTX 4070 Laptop GPU (140W TGP)" },
      { label: "Memory", value: "32GB Dual-Channel DDR5 5200MHz" },
      { label: "Storage", value: "1TB PCIe 4.0 NVMe M.2 SSD" },
      { label: "Display", value: "16\" QHD+ (2560x1600) 240Hz 500 nits 100% DCI-P3" },
      { label: "Weight", value: "2.18 kg (4.8 lbs)" }
    ],
    image: "assets/images/gaming-laptop.jpg",
    availability: "In Stock",
    seller: "K. Vance (Verified Tech Dealer)",
    location: "Seattle, WA"
  },
  {
    id: "prod-keyboard-02",
    name: "Tactile V80 Custom Mechanical Keyboard",
    category: "Accessories",
    price: 149,
    condition: "Brand New",
    conditionNote: "Factory sealed in original packaging with aviator coiled cable and keycap puller.",
    description: "Anodized CNC 6063 aluminum keyboard engineered with gasket-mounted flex-cut FR4 plate, pre-lubed tactile switches, sound-dampening IXPE foam, hot-swappable sockets, and double-shot PBT keycaps.",
    specs: [
      { label: "Layout", value: "75% Exploded Layout (82 Keys)" },
      { label: "Mounting", value: "Silicone Gasket with Flex-Cut FR4 Plate" },
      { label: "Switches", value: "Factory-Lubed Gateron Baby Kangaroo Tactile" },
      { label: "Keycaps", value: "Double-Shot PBT Cherry Profile" },
      { label: "Connectivity", value: "Detachable USB-C / Coiled Aviator Cable" },
      { label: "Weight", value: "1.45 kg Solid CNC Aluminum" }
    ],
    image: "assets/images/mechanical-keyboard.jpg",
    availability: "In Stock",
    seller: "StudioKeebs NYC",
    location: "Brooklyn, NY"
  },
  {
    id: "prod-mouse-03",
    name: "Precision Zero Ultralight Wireless Mouse",
    category: "Accessories",
    price: 79,
    condition: "Brand New",
    conditionNote: "Sealed box with extra virgin PTFE skates and grip tapes.",
    description: "Symmetrical ultralight wireless competitive mouse weighing just 54 grams with no honeycomb holes. Equipped with 26,000 DPI flagship optical sensor, optical micro-switches, and 100-hour battery life.",
    specs: [
      { label: "Sensor", value: "PixArt PAW3395 (26,000 DPI, 650 IPS, 50G)" },
      { label: "Weight", value: "54g (Featherlight Solid Shell)" },
      { label: "Switches", value: "Optical Micro Switches (90M Click Rating)" },
      { label: "Polling Rate", value: "1000Hz (4000Hz Ready with Dongle)" },
      { label: "Battery Life", value: "Up to 100 continuous gaming hours" },
      { label: "Skates", value: "100% Virgin-Grade Curved PTFE" }
    ],
    image: "assets/images/gaming-mouse.jpg",
    availability: "In Stock",
    seller: "Apex Gear Labs",
    location: "Austin, TX"
  },
  {
    id: "prod-monitor-04",
    name: "Spectra 32\" 4K UHD Pro Creator Monitor",
    category: "Monitors",
    price: 499,
    condition: "Refurbished",
    conditionNote: "Certified grade-A refurbished by manufacturer. Zero dead pixels guaranteed.",
    description: "Razor-thin bezel 32-inch 4K UHD (3840x2160) IPS workstation monitor designed for color-critical workflows and clean minimalist desks. Built-in 90W USB-C Power Delivery and ergonomic aluminum stand.",
    specs: [
      { label: "Panel Size & Type", value: "31.5-inch Anti-Glare IPS Panel" },
      { label: "Resolution", value: "4K UHD (3840 x 2160) at 60Hz" },
      { label: "Color Accuracy", value: "99% DCI-P3, 100% sRGB, Delta E < 2" },
      { label: "Brightness & HDR", value: "400 nits, VESA DisplayHDR 400" },
      { label: "Connectivity", value: "1x USB-C (90W PD), 1x DP 1.4, 2x HDMI 2.0" },
      { label: "Stand Adjustments", value: "Height, Tilt, Swivel, and 90° Pivot" }
    ],
    image: "assets/images/creator-monitor.jpg",
    availability: "In Stock",
    seller: "Studio Display Exchange",
    location: "San Francisco, CA"
  },
  {
    id: "prod-gpu-05",
    name: "Titan RTX 4080 Super Founders Graphics Card",
    category: "Components",
    price: 899,
    condition: "Open Box",
    conditionNote: "Tested 100% operational in workstation benchmark. Complete with original 12VHPWR adapter.",
    description: "Flagship gaming and AI compute powerhouse featuring 16GB high-speed GDDR6X VRAM, Ada Lovelace architecture, 10,240 CUDA cores, 3rd Gen RT cores, and whisper-quiet dual axial flow-through cooling.",
    specs: [
      { label: "GPU Architecture", value: "NVIDIA Ada Lovelace (AD103-400)" },
      { label: "CUDA Cores", value: "10,240 Cores" },
      { label: "Video Memory", value: "16GB GDDR6X (256-bit, 23 Gbps)" },
      { label: "Boost Clock", value: "2,550 MHz" },
      { label: "Power & TDP", value: "320W TGP (16-Pin 12VHPWR Connector)" },
      { label: "Video Outputs", value: "3x DisplayPort 1.4a, 1x HDMI 2.1a" }
    ],
    image: "assets/images/graphics-card.jpg",
    availability: "In Stock",
    seller: "Silicon Vault Labs",
    location: "Denver, CO"
  },
  {
    id: "prod-audio-06",
    name: "Acoustic Nova Studio Wireless ANC Headphones",
    category: "Audio",
    price: 249,
    condition: "Brand New",
    conditionNote: "Factory sealed with magnetic hard travel case and braided 3.5mm analog cable.",
    description: "Master-tuned audiophile wireless over-ear headphones with custom 40mm beryllium drivers, hybrid Active Noise Cancellation, aptX Lossless transmission, and ultra-plush memory foam magnetic ear cushions.",
    specs: [
      { label: "Acoustic System", value: "Custom 40mm Beryllium-Coated Drivers" },
      { label: "Noise Cancellation", value: "Adaptive Hybrid ANC with Transparency Mode" },
      { label: "Battery Life", value: "40 hours with ANC enabled (Fast Charge: 15m = 6h)" },
      { label: "Codecs", value: "aptX Adaptive, AAC, SBC, High-Res Audio Wireless" },
      { label: "Microphones", value: "4-mic beamforming array with AI noise reduction" },
      { label: "Materials", value: "Anodized aluminum, lambskin trim, memory foam" }
    ],
    image: "assets/images/wireless-headphones.jpg",
    availability: "In Stock",
    seller: "Acoustic Masters",
    location: "Portland, OR"
  }
];

/**
 * Client Cart State Management backed by localStorage
 */
const CartState = {
  STORAGE_KEY: "classicmarket_cart_v1",

  getItems() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn("Could not read cart from localStorage", e);
      return [];
    }
  },

  saveItems(items) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
    window.dispatchEvent(new CustomEvent("cart-updated", { detail: { items } }));
  },

  addItem(productId, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const items = this.getItems();
    const existingIndex = items.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        condition: product.condition,
        quantity: quantity
      });
    }

    this.saveItems(items);
  },

  updateQuantity(productId, quantity) {
    let items = this.getItems();
    if (quantity <= 0) {
      items = items.filter(item => item.id !== productId);
    } else {
      const target = items.find(item => item.id === productId);
      if (target) {
        target.quantity = quantity;
      }
    }
    this.saveItems(items);
  },

  removeItem(productId) {
    const items = this.getItems().filter(item => item.id !== productId);
    this.saveItems(items);
  },

  clear() {
    this.saveItems([]);
  },

  getTotalCount() {
    return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal() {
    return this.getItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
};
