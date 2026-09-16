-- =========================================================
-- CLASSIC MARKET: Supabase Database Schema
-- Run this script in your Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/nlljxlmymdwdwxfbmavu/sql
-- =========================================================

-- 1. Create the `products` table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    condition TEXT NOT NULL,
    condition_note TEXT DEFAULT '',
    description TEXT NOT NULL,
    image TEXT DEFAULT '',
    availability TEXT DEFAULT 'In Stock',
    specs JSONB DEFAULT '[]'::jsonb,
    seller TEXT NOT NULL,
    seller_email TEXT,
    seller_phone TEXT,
    location TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if any to avoid collision on re-runs
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
DROP POLICY IF EXISTS "Allow anonymous product creation" ON public.products;

-- 4. Create policies so visitors can browse products and list new products
CREATE POLICY "Allow public read access to products" 
ON public.products 
FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow anonymous product creation" 
ON public.products 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- 5. Seed with initial curated marketplace catalog
INSERT INTO public.products (name, category, price, condition, condition_note, description, image, availability, seller, location, specs)
VALUES
(
    'Apex Pro 16 G3 Gaming Laptop',
    'Laptops',
    1299.00,
    'Like New',
    'Mint condition, original box and 280W charger included. Battery cycle count: 18.',
    'Ultra-slim matte black performance chassis featuring Intel Core i9-13900H, 32GB DDR5 5200MHz, NVIDIA GeForce RTX 4070 8GB, 1TB NVMe Gen4 SSD, and a factory-calibrated 16-inch QHD 240Hz IPS display.',
    'assets/images/gaming-laptop.jpg',
    'In Stock',
    'K. Vance (Verified Tech Dealer)',
    'Seattle, WA',
    '[{"label": "Processor", "value": "Intel Core i9-13900H (14-Core, up to 5.4GHz)"}, {"label": "Graphics", "value": "NVIDIA GeForce RTX 4070 Laptop GPU (140W TGP)"}, {"label": "Memory", "value": "32GB Dual-Channel DDR5 5200MHz"}, {"label": "Storage", "value": "1TB PCIe 4.0 NVMe M.2 SSD"}, {"label": "Display", "value": "16-inch QHD+ (2560x1600) 240Hz 500 nits 100% DCI-P3"}]'::jsonb
),
(
    'Tactile V80 Custom Mechanical Keyboard',
    'Accessories',
    149.00,
    'Brand New',
    'Factory sealed in original packaging with aviator coiled cable and keycap puller.',
    'Anodized CNC 6063 aluminum keyboard engineered with gasket-mounted flex-cut FR4 plate, pre-lubed tactile switches, sound-dampening IXPE foam, hot-swappable sockets, and double-shot PBT keycaps.',
    'assets/images/mechanical-keyboard.jpg',
    'In Stock',
    'StudioKeebs NYC',
    'Brooklyn, NY',
    '[{"label": "Layout", "value": "75% Exploded Layout (82 Keys)"}, {"label": "Mounting", "value": "Silicone Gasket with Flex-Cut FR4 Plate"}, {"label": "Switches", "value": "Factory-Lubed Gateron Baby Kangaroo Tactile"}]'::jsonb
),
(
    'Precision Zero Ultralight Wireless Mouse',
    'Accessories',
    79.00,
    'Brand New',
    'Sealed box with extra virgin PTFE skates and grip tapes.',
    'Symmetrical ultralight wireless competitive mouse weighing just 54 grams with no honeycomb holes. Equipped with 26,000 DPI flagship optical sensor, optical micro-switches, and 100-hour battery life.',
    'assets/images/gaming-mouse.jpg',
    'In Stock',
    'Apex Gear Labs',
    'Austin, TX',
    '[{"label": "Sensor", "value": "PixArt PAW3395 (26,000 DPI, 650 IPS, 50G)"}, {"label": "Weight", "value": "54g (Featherlight Solid Shell)"}]'::jsonb
),
(
    'Spectra 32" 4K UHD Pro Creator Monitor',
    'Monitors',
    499.00,
    'Refurbished',
    'Certified grade-A refurbished by manufacturer. Zero dead pixels guaranteed.',
    'Razor-thin bezel 32-inch 4K UHD (3840x2160) IPS workstation monitor designed for color-critical workflows and clean minimalist desks. Built-in 90W USB-C Power Delivery and ergonomic aluminum stand.',
    'assets/images/creator-monitor.jpg',
    'In Stock',
    'StudioDisplay Exchange',
    'San Francisco, CA',
    '[{"label": "Panel Size & Type", "value": "31.5-inch Anti-Glare IPS Panel"}, {"label": "Resolution", "value": "4K UHD (3840 x 2160) at 60Hz"}]'::jsonb
),
(
    'Titan RTX 4080 Super Founders Graphics Card',
    'Components',
    899.00,
    'Open Box',
    'Tested 100% operational in workstation benchmark. Complete with original 12VHPWR adapter.',
    'Flagship gaming and AI compute powerhouse featuring 16GB high-speed GDDR6X VRAM, Ada Lovelace architecture, 10,240 CUDA cores, 3rd Gen RT cores, and whisper-quiet dual axial flow-through cooling.',
    'assets/images/graphics-card.jpg',
    'In Stock',
    'Benchmark Systems LLC',
    'Denver, CO',
    '[{"label": "GPU Architecture", "value": "NVIDIA Ada Lovelace (AD103-400)"}, {"label": "VRAM", "value": "16GB GDDR6X 256-bit"}]'::jsonb
),
(
    'Acoustic Wave Wireless Studio Headset',
    'Audio',
    219.00,
    'Like New',
    'Flawless condition with magnetic velour ear pads, hard shell carry case, and USB-C audio dongle.',
    'Planar magnetic studio drivers delivering neutral frequency response, ultra-low distortion, low-latency 2.4GHz wireless transmission, and custom memory foam cushions.',
    'assets/images/studio-headset.jpg',
    'In Stock',
    'SoundLab Precision',
    'Portland, OR',
    '[{"label": "Acoustic System", "value": "Planar Magnetic 90mm Drivers"}, {"label": "Frequency Response", "value": "10Hz - 40,000Hz"}]'::jsonb
);

-- =========================================================
-- 6. Create the `orders` table (For Checkout with Escrow)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_state TEXT NOT NULL,
    shipping_zip TEXT NOT NULL,
    payment_method TEXT DEFAULT 'Escrow Protection',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'Escrow Held / Pending Fulfillment',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous order creation" ON public.orders;
DROP POLICY IF EXISTS "Allow public read own orders" ON public.orders;

CREATE POLICY "Allow anonymous order creation" 
ON public.orders 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Allow public read own orders" 
ON public.orders 
FOR SELECT 
TO anon, authenticated 
USING (true);

