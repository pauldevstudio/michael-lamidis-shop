import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Michael Lamidis — Open Box Appliances",
    short_name: "Lamidis",
    description: "Certified open box appliances at 30–70% off retail. Limassol, Cyprus.",
    start_url: "/",
    display: "standalone",
    background_color: "#030813",
    theme_color: "#030813",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
