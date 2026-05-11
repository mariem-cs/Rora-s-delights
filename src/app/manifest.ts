import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rora’s Delights",
    short_name: "Rora’s",
    description: "Cookie shop — order via WhatsApp.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff9f1",
    theme_color: "#3d261f",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png" },
    ],
  };
}

