export const SITE_NAME = "Michael Lamidis";
export const SITE_TAGLINE = "Open Box. Open Savings.";
export const SITE_DESCRIPTION =
  "Cyprus's premier destination for certified open box appliances. Premium brands at 30–70% off retail. Tested, warranted, delivered.";
// Canonical site origin. Env-driven so the production domain can change without
// a code edit. Defaults to the domain actually serving the site today.
// To switch to michaellamidis.com.cy: set NEXT_PUBLIC_SITE_URL in Vercel and
// add that domain to the project — no code change needed. Trailing slash stripped.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.michaellamidisshop.com"
).replace(/\/+$/, "");
export const SITE_EMAIL = "lamidismichaelshop@gmail.com";
export const SITE_PHONE = "+357 97 755914";
export const SITE_WHATSAPP = "+357 97 755914";
export const SITE_ADDRESS = "Alassa Village, Limassol, Cyprus";
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
  facebook: "https://www.facebook.com/michaelsappliances",
  instagram: "https://www.instagram.com/michaellamidis/",
  youtube: "",
};

export const PRODUCT_CATEGORIES = [
  { id: "all",              icon: "LayoutGrid", colorFrom: "#1E48B8", colorTo: "#3D62CC" },
  { id: "refrigerators",   icon: "Square",     colorFrom: "#0F766E", colorTo: "#14B8A6" },
  { id: "washing-machines",icon: "Loader",     colorFrom: "#7C3AED", colorTo: "#A78BFA" },
  { id: "ovens",           icon: "Flame",      colorFrom: "#C2410C", colorTo: "#F97316" },
  { id: "dishwashers",     icon: "Droplets",   colorFrom: "#1D4ED8", colorTo: "#60A5FA" },
  { id: "freezers",        icon: "Snowflake",  colorFrom: "#0E7490", colorTo: "#22D3EE" },
  { id: "air-conditioners",icon: "Wind",       colorFrom: "#0369A1", colorTo: "#38BDF8" },
  { id: "furniture",       icon: "Sofa",       colorFrom: "#854D0E", colorTo: "#A16207" },
  { id: "garden-furniture",icon: "Trees",      colorFrom: "#166534", colorTo: "#22C55E" },
  { id: "office-equipment",icon: "Printer",    colorFrom: "#4338CA", colorTo: "#6366F1" },
];

// Color lookup keyed by slug, with a default for any CMS slug not in the map.
export const CATEGORY_COLOR_MAP: Record<string, { colorFrom: string; colorTo: string }> = {
  all:                { colorFrom: "#1E48B8", colorTo: "#3D62CC" },
  refrigerators:      { colorFrom: "#0F766E", colorTo: "#14B8A6" },
  "washing-machines": { colorFrom: "#7C3AED", colorTo: "#A78BFA" },
  ovens:              { colorFrom: "#C2410C", colorTo: "#F97316" },
  dishwashers:        { colorFrom: "#1D4ED8", colorTo: "#60A5FA" },
  freezers:           { colorFrom: "#0E7490", colorTo: "#22D3EE" },
  "air-conditioners": { colorFrom: "#0369A1", colorTo: "#38BDF8" },
  cookware:           { colorFrom: "#B45309", colorTo: "#F59E0B" },
  "small-appliances": { colorFrom: "#9D174D", colorTo: "#F472B6" },
  mattresses:         { colorFrom: "#475569", colorTo: "#94A3B8" },
  furniture:          { colorFrom: "#854D0E", colorTo: "#A16207" },
  "garden-furniture": { colorFrom: "#166534", colorTo: "#22C55E" },
  "office-equipment": { colorFrom: "#4338CA", colorTo: "#6366F1" },
  tools:              { colorFrom: "#991B1B", colorTo: "#DC2626" },
  kitchenware:        { colorFrom: "#65A30D", colorTo: "#84CC16" },
  bicycles:           { colorFrom: "#1E40AF", colorTo: "#3B82F6" },
};
export const DEFAULT_CATEGORY_COLOR = { colorFrom: "#475569", colorTo: "#94A3B8" };

// ─── Stock images (self-hosted, originally from Pexels — free license) ──
export const HERO_IMAGE = "/hero-appliances.webp";

export const HERO_FRIDGE_IMAGE = "/images/stock/pexels-6987718.jpg";
export const HERO_WASHER_IMAGE = "/images/stock/pexels-7282376.jpg";
export const HERO_OVEN_IMAGE = "/images/stock/pexels-8082207.jpg";
export const KITCHEN_IMAGE = "/images/stock/pexels-18285887.jpg";
export const KITCHEN_IMAGE_2 = "/images/stock/pexels-29080604.jpg";

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
  /** Full product gallery. images[0] mirrors imageUrl (the primary photo). */
  images?: string[];
  /** Optional product video (uploaded to Vercel Blob). Shows a ▶ play button on cards. */
  videoUrl?: string;
  /** When true, the item is sold — storefront hides Add to Cart + shows a Sold badge. */
  sold?: boolean;
  /** When true, the item is featured in the homepage "Special Offer" promo popup. */
  promo?: boolean;
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
      "/images/stock/pexels-6987718.jpg",
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
      "/images/stock/pexels-7282376.jpg",
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
    brand: "Tefal",
    model: "Ingenio Expertise 13-Piece Set",
    category: "cookware",
    originalPrice: 299,
    salePrice: 159,
    savings: 47,
    grade: "A",
    warranty: 24,
    icon: "CookingPot",
    colorFrom: "#B45309",
    colorTo: "#F59E0B",
    imageUrl:
      "/images/stock/pexels-6996085.jpg",
    description:
      "13-piece non-stick cookware set with a detachable Ingenio handle, Thermo-Signal heat indicator and a hard-anodised induction base. Oven-safe to 250°C and fully dishwasher-safe.",
    specs: [
      { label: "Pieces",        value: "13-piece set" },
      { label: "Material",      value: "Hard-anodised aluminium" },
      { label: "Coating",       value: "Titanium non-stick" },
      { label: "Compatibility", value: "All hobs incl. induction" },
      { label: "Oven-Safe",     value: "Up to 250°C" },
      { label: "Dishwasher",    value: "Safe" },
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
      "/images/stock/pexels-8082218.jpg",
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
      "/images/stock/pexels-8082222.jpg",
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
      "/images/stock/pexels-6032797.jpg",
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
      "/images/stock/pexels-8082207.jpg",
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
      "/images/stock/pexels-18285887.jpg",
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
      "/images/stock/pexels-36777886.jpg",
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
      "/images/stock/pexels-7282376.jpg",
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
      "/images/stock/pexels-29080604.jpg",
  },
];
