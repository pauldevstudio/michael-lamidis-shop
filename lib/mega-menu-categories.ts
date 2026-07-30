import {
  Square, RefreshCw, Flame, Droplets, Wind,
  CookingPot, Coffee, Sofa, TreePine, Printer, Dumbbell, PawPrint, Sparkles,
  Tag, LayoutGrid,
} from "lucide-react";
import type { ElementType } from "react";

export interface MegaMenuCategory {
  id: string;
  label: string;
  labelGr: string;
  icon: ElementType;
  colorFrom: string;
  colorTo: string;
  image: string;
  special?: boolean;
}

export const MEGA_MENU_SPECIAL: MegaMenuCategory[] = [
  { id: "best-deals",   label: "Best Deals",    labelGr: "Καλύτερες Προσφορές", icon: Tag,        colorFrom: "#DC2626", colorTo: "#F59E0B", image: "/categories/best-deals.webp",   special: true },
  { id: "all",           label: "All Products",  labelGr: "Όλα τα Προϊόντα",     icon: LayoutGrid, colorFrom: "#1E3A8A", colorTo: "#3B82F6", image: "/categories/all-products.webp", special: true },
];

export const MEGA_MENU_CATEGORIES: MegaMenuCategory[] = [
  { id: "refrigerators",      label: "Refrigerators",      labelGr: "Ψυγεία",                   icon: Square,     colorFrom: "#0F766E", colorTo: "#14B8A6", image: "/categories/refrigerators.webp" },
  { id: "washing-machines",   label: "Washing Machines",   labelGr: "Πλυντήρια Ρούχων",         icon: RefreshCw,  colorFrom: "#7C3AED", colorTo: "#A78BFA", image: "/categories/washing-machines.webp" },
  { id: "ovens",              label: "Ovens",              labelGr: "Φούρνοι",                   icon: Flame,      colorFrom: "#C2410C", colorTo: "#F97316", image: "/categories/ovens.webp" },
  { id: "dishwashers",        label: "Dishwashers",        labelGr: "Πλυντήρια Πιάτων",         icon: Droplets,   colorFrom: "#1D4ED8", colorTo: "#60A5FA", image: "/categories/dishwashers.webp" },
  { id: "air-conditioners",   label: "Air Conditioners",   labelGr: "Κλιματιστικά",             icon: Wind,       colorFrom: "#0369A1", colorTo: "#38BDF8", image: "/categories/air-conditioners.webp" },
  { id: "cookware",           label: "Cookware",           labelGr: "Μαγειρικά Σκεύη",          icon: CookingPot, colorFrom: "#B45309", colorTo: "#F59E0B", image: "/categories/cookware.webp" },
  { id: "small-appliances",   label: "Small Appliances",   labelGr: "Μικρές Συσκευές",          icon: Coffee,     colorFrom: "#9D174D", colorTo: "#F472B6", image: "/categories/small-appliances.webp" },
  { id: "vacuum-cleaners",    label: "Vacuum Cleaners",    labelGr: "Ηλεκτρικές Σκούπες",       icon: Sparkles,   colorFrom: "#6D28D9", colorTo: "#8B5CF6", image: "/categories/vacuum-cleaners.webp" },
  { id: "furniture",          label: "Furniture",          labelGr: "Έπιπλα",                    icon: Sofa,       colorFrom: "#854D0E", colorTo: "#A16207", image: "/categories/furniture.webp" },
  { id: "garden-furniture",   label: "Garden Furniture",   labelGr: "Έπιπλα Κήπου",             icon: TreePine,   colorFrom: "#166534", colorTo: "#22C55E", image: "/categories/garden-furniture.webp" },
  { id: "office-equipment",   label: "Office Equipment",   labelGr: "Εξοπλισμός Γραφείου",      icon: Printer,    colorFrom: "#4338CA", colorTo: "#6366F1", image: "/categories/office-equipment.webp" },
  { id: "fitness-equipment",  label: "Fitness Equipment",  labelGr: "Εξοπλισμός Γυμναστικής",   icon: Dumbbell,   colorFrom: "#DC2626", colorTo: "#F87171", image: "/categories/fitness-equipment.webp" },
  { id: "pet-accessories",    label: "Pet Accessories",    labelGr: "Αξεσουάρ Κατοικιδίων",     icon: PawPrint,   colorFrom: "#D97706", colorTo: "#FBBF24", image: "/categories/pet-accessories.webp" },
];
