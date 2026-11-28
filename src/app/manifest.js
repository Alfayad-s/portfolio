export default function manifest() {
  return {
    name: "Alfayad Shameer",
    short_name: "Alfayad",
    description: "Full-stack developer working in Bengaluru at Codeteak Technologies, from Alappuzha, Kerala.",
    start_url: "/",
    display: "standalone",
    background_color: "#e6e6e6",
    theme_color: "#e6e6e6",
    icons: [
      { src: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { src: "/favicon-96.png", sizes: "96x96", type: "image/png" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
