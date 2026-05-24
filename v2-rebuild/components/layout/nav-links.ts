export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Catalog" },
  { href: "/#process", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
] as const;

export type NavLink = (typeof navLinks)[number];
