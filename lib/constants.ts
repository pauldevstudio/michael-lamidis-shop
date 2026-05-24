export const SITE_NAME = "Michael Lamidis";
export const SITE_TAGLINE = "Open Box. Open Savings.";
export const SITE_DESCRIPTION =
  "Cyprus's premier destination for certified open box appliances. Premium brands at 30–70% off retail. Tested, warranted, delivered.";
export const SITE_URL = "https://michaellamidis.com.cy";
export const SITE_EMAIL = "info@michaellamidis.com.cy";
export const SITE_PHONE = "+357 25 123 456";
export const SITE_ADDRESS = "123 Makarios Avenue, Limassol, Cyprus 3025";
export const SITE_HOURS = "Mon–Sat: 09:00–20:00";

export const NAV_LINKS = [
  { href: "/", key: "home" as const },
  { href: "/services", key: "services" as const },
  { href: "/about", key: "about" as const },
  { href: "/testimonials", key: "testimonials" as const },
  { href: "/blog", key: "blog" as const },
  { href: "/contact", key: "contact" as const },
];

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/michaellamidisshop",
  instagram: "https://instagram.com/michaellamidisshop",
  youtube: "https://youtube.com/@michaellamidis",
};

export const PRODUCT_CATEGORIES = [
  { id: "all",              icon: "LayoutGrid", colorFrom: "#1E48B8", colorTo: "#3D62CC" },
  { id: "refrigerators",   icon: "Square",     colorFrom: "#0F766E", colorTo: "#14B8A6" },
  { id: "washing-machines",icon: "Loader",     colorFrom: "#7C3AED", colorTo: "#A78BFA" },
  { id: "ovens",           icon: "Flame",      colorFrom: "#C2410C", colorTo: "#F97316" },
  { id: "dishwashers",     icon: "Droplets",   colorFrom: "#1D4ED8", colorTo: "#60A5FA" },
  { id: "air-conditioners",icon: "Wind",       colorFrom: "#0369A1", colorTo: "#38BDF8" },
  { id: "tvs",             icon: "Monitor",    colorFrom: "#B45309", colorTo: "#F59E0B" },
  { id: "small-appliances",icon: "Coffee",     colorFrom: "#9D174D", colorTo: "#F472B6" },
];

// ─── Verified Pexels image URLs ────────────────────────────────────
// All images verified from pexels.com (free commercial license)

// Hero — premium appliance lineup (washer, fridge, oven, TV, microwave, vacuum)
export const HERO_IMAGE = "/hero-appliances.jpg?v=2";

// Floating product card images
export const HERO_FRIDGE_IMAGE =
  "https://images.pexels.com/photos/6987718/pexels-photo-6987718.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop";

export const HERO_WASHER_IMAGE =
  "https://images.pexels.com/photos/7282376/pexels-photo-7282376.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop";

// Built-in oven card — contemporary kitchen with built-in modern ovens
export const HERO_OVEN_IMAGE =
  "https://images.pexels.com/photos/8082207/pexels-photo-8082207.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop";

export const KITCHEN_IMAGE =
  "https://images.pexels.com/photos/18285887/pexels-photo-18285887.jpeg?auto=compress&cs=tinysrgb&w=1200&fit=crop";

export const KITCHEN_IMAGE_2 =
  "https://images.pexels.com/photos/29080604/pexels-photo-29080604.jpeg?auto=compress&cs=tinysrgb&w=1200&fit=crop";

export interface ProductSpec { label: string; value: string; }

export interface Product {
  id: string;
  brand: string;
  model: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  savings: number;
  grade: string;
  warranty: number;
  icon: string;
  colorFrom: string;
  colorTo: string;
  imageUrl: string;
  description: string;
  specs: ProductSpec[];
}

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: "1",
    brand: "Samsung",
    model: "RS68A8820WW",
    category: "refrigerators",
    originalPrice: 1499,
    salePrice: 699,
    savings: 53,
    grade: "A",
    warranty: 12,
    icon: "Square",
    colorFrom: "#0F766E",
    colorTo: "#14B8A6",
    imageUrl:
      "https://images.pexels.com/photos/6987718/pexels-photo-6987718.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
    description:
      "Spacious French door refrigerator with Twin Cooling Plus™ technology. No Frost system and All-Around Cooling keeps food fresh for longer — ideal for large families.",
    specs: [
      { label: "Capacity",     value: "609 L" },
      { label: "Energy Class", value: "A++" },
      { label: "No Frost",     value: "Yes" },
      { label: "Dimensions",   value: "178 × 91 × 72 cm" },
      { label: "Color",        value: "White" },
      { label: "Noise Level",  value: "35 dB" },
    ],
  },
  {
    id: "2",
    brand: "Bosch",
    model: "WAX32EH0GR",
    category: "washing-machines",
    originalPrice: 899,
    salePrice: 449,
    savings: 50,
    grade: "A+",
    warranty: 12,
    icon: "Loader",
    colorFrom: "#7C3AED",
    colorTo: "#A78BFA",
    imageUrl:
      "https://images.pexels.com/photos/7282376/pexels-photo-7282376.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
    description:
      "i-DOS automatic dosing, EcoSilence Drive motor, and i-Refresh steam function. 9 kg capacity with A energy class rating and ultra-quiet 1600 RPM spin.",
    specs: [
      { label: "Capacity",      value: "9 kg" },
      { label: "Spin Speed",    value: "1600 RPM" },
      { label: "Energy Class",  value: "A" },
      { label: "Noise (Wash)",  value: "47 dB" },
      { label: "Programmes",    value: "15" },
      { label: "Dimensions",    value: "84.8 × 59.8 × 58.8 cm" },
    ],
  },
  {
    id: "3",
    brand: "LG",
    model: "OLED55C36LC",
    category: "tvs",
    originalPrice: 1899,
    salePrice: 899,
    savings: 53,
    grade: "A",
    warranty: 12,
    icon: "Monitor",
    colorFrom: "#B45309",
    colorTo: "#F59E0B",
    imageUrl:
      "https://images.pexels.com/photos/7587735/pexels-photo-7587735.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
    description:
      "55\" OLED evo display with self-lit pixels, α9 Gen5 AI processor, Dolby Vision IQ, Dolby Atmos, and webOS Smart TV. Cinema-grade picture in your living room.",
    specs: [
      { label: "Screen Size",   value: "55 inches" },
      { label: "Panel",         value: "OLED evo" },
      { label: "Resolution",    value: "4K UHD (3840 × 2160)" },
      { label: "Refresh Rate",  value: "120 Hz" },
      { label: "HDR",           value: "Dolby Vision IQ, HDR10" },
      { label: "Smart TV",      value: "webOS 23" },
    ],
  },
  {
    id: "4",
    brand: "Siemens",
    model: "SN73HX36VE",
    category: "dishwashers",
    originalPrice: 799,
    salePrice: 379,
    savings: 53,
    grade: "A+",
    warranty: 12,
    icon: "Droplets",
    colorFrom: "#1D4ED8",
    colorTo: "#60A5FA",
    imageUrl:
      "https://images.pexels.com/photos/8082218/pexels-photo-8082218.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
    description:
      "Full-size dishwasher with 13 place settings, varioSpeed Plus for 3× faster cycles, and Zeolith® drying for spotlessly dry results every time.",
    specs: [
      { label: "Place Settings", value: "13" },
      { label: "Energy Class",   value: "A+" },
      { label: "Noise Level",    value: "46 dB" },
      { label: "Programmes",     value: "6" },
      { label: "Drying",         value: "Zeolith®" },
      { label: "Dimensions",     value: "84.5 × 59.8 × 55 cm" },
    ],
  },
  {
    id: "5",
    brand: "Miele",
    model: "MDA 5P Series",
    category: "air-conditioners",
    originalPrice: 1299,
    salePrice: 599,
    savings: 54,
    grade: "A",
    warranty: 12,
    icon: "Wind",
    colorFrom: "#0369A1",
    colorTo: "#38BDF8",
    imageUrl:
      "https://images.pexels.com/photos/8082222/pexels-photo-8082222.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
    description:
      "Inverter split-type air conditioning system with WiFi control and ultra-quiet 19 dB indoor operation. Covers up to 35 m² with R-32 refrigerant efficiency.",
    specs: [
      { label: "Cooling",       value: "12,000 BTU / 3.5 kW" },
      { label: "Energy Class",  value: "A" },
      { label: "Noise Indoor",  value: "19 dB" },
      { label: "Coverage",      value: "Up to 35 m²" },
      { label: "Control",       value: "WiFi + Remote" },
      { label: "Refrigerant",   value: "R-32" },
    ],
  },
  {
    id: "6",
    brand: "Philips",
    model: "EP3324/40",
    category: "small-appliances",
    originalPrice: 499,
    salePrice: 199,
    savings: 60,
    grade: "A++",
    warranty: 12,
    icon: "Coffee",
    colorFrom: "#9D174D",
    colorTo: "#F472B6",
    imageUrl:
      "https://images.pexels.com/photos/6032797/pexels-photo-6032797.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
    description:
      "Fully automatic bean-to-cup espresso machine with LatteGo milk system. 3 brew settings, ceramic grinder, intuitive touchscreen and 1.8L water tank.",
    specs: [
      { label: "Water Tank",    value: "1.8 L" },
      { label: "Bean Container",value: "275 g" },
      { label: "Pump Pressure", value: "15 bar" },
      { label: "Grinder",       value: "Ceramic" },
      { label: "Brew Time",     value: "30 sec" },
      { label: "Milk System",   value: "LatteGo" },
    ],
  },
  {
    id: "7",
    brand: "AEG",
    model: "BSK574221M",
    category: "ovens",
    originalPrice: 899,
    salePrice: 399,
    savings: 56,
    grade: "A+",
    warranty: 12,
    icon: "Flame",
    colorFrom: "#C2410C",
    colorTo: "#F97316",
    imageUrl:
      "https://images.pexels.com/photos/8082207/pexels-photo-8082207.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
    description:
      "Multifunction built-in electric oven with 9 heating modes, ProClean® catalytic self-cleaning liners, and SteamBake technology for perfect baking every time.",
    specs: [
      { label: "Volume",        value: "71 L" },
      { label: "Energy Class",  value: "A+" },
      { label: "Functions",     value: "9 heating modes" },
      { label: "Self-Clean",    value: "ProClean®" },
      { label: "Steam",         value: "SteamBake" },
      { label: "Dimensions",    value: "59 × 59.4 × 55 cm" },
    ],
  },
  {
    id: "8",
    brand: "Gorenje",
    model: "NRK6202AXL4",
    category: "refrigerators",
    originalPrice: 799,
    salePrice: 349,
    savings: 56,
    grade: "A+",
    warranty: 12,
    icon: "Square",
    colorFrom: "#0F766E",
    colorTo: "#14B8A6",
    imageUrl:
      "https://images.pexels.com/photos/18285887/pexels-photo-18285887.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
    description:
      "Stylish freestanding combi fridge-freezer with IonAir technology and FreshZone+ drawer. No Frost system keeps both compartments ice-free at all times.",
    specs: [
      { label: "Fridge Volume",  value: "235 L" },
      { label: "Freezer Volume", value: "96 L" },
      { label: "Energy Class",   value: "A+" },
      { label: "No Frost",       value: "Yes" },
      { label: "Color",          value: "Inox" },
      { label: "Dimensions",     value: "185 × 60 × 59.2 cm" },
    ],
  },
];

export const BLOG_POSTS = [
  {
    slug: "what-is-open-box",
    title: "What Is Open Box? The Complete Buyer's Guide",
    excerpt:
      "Everything you need to know before buying an open box appliance — what to look for, what to avoid, and why it might be the smartest purchase you ever make.",
    category: "Buyer's Guide",
    date: "2024-11-15",
    readTime: "5 min read",
    author: "Michael Lamidis",
    colorFrom: "#1E48B8",
    colorTo: "#3D62CC",
    // Verified: modern kitchen interior with stainless steel appliances
    imageUrl:
      "https://images.pexels.com/photos/36777886/pexels-photo-36777886.jpeg?auto=compress&cs=tinysrgb&w=800&h=440&fit=crop",
  },
  {
    slug: "top-brands-open-box-2024",
    title: "Top 10 Appliance Brands Worth Buying Open Box in 2024",
    excerpt:
      "Not all brands hold up equally well as open box. We rank the top 10 brands where you can safely save 40–70% without sacrificing reliability.",
    category: "Brand Review",
    date: "2024-10-28",
    readTime: "7 min read",
    author: "Giorgos Petrou",
    colorFrom: "#0F766E",
    colorTo: "#14B8A6",
    // Verified: washing machine in bright home laundry
    imageUrl:
      "https://images.pexels.com/photos/7282376/pexels-photo-7282376.jpeg?auto=compress&cs=tinysrgb&w=800&h=440&fit=crop",
  },
  {
    slug: "save-money-on-appliances-greece",
    title: "5 Smart Ways to Save on Appliances in Cyprus This Year",
    excerpt:
      "Inflation hitting hard? Our experts share five strategies that Cypriot families use to get premium appliances without premium prices.",
    category: "Money-Saving Tips",
    date: "2024-10-10",
    readTime: "4 min read",
    author: "Katerina Lamidis",
    colorFrom: "#B45309",
    colorTo: "#F59E0B",
    // Verified: contemporary Dubai kitchen with stainless steel appliances
    imageUrl:
      "https://images.pexels.com/photos/29080604/pexels-photo-29080604.jpeg?auto=compress&cs=tinysrgb&w=800&h=440&fit=crop",
  },
];
