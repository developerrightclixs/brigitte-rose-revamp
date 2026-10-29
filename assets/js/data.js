/* ==========================================================================
   Brigitte Rose — Catalog & store configuration
   Product data mirrors the live WooCommerce store (names, prices, copy,
   fabric, design, care). Edit here to update the whole site.
   ========================================================================== */
window.BR = window.BR || {};

BR.CONFIG = {
  storeName: "Brigitte Rose",
  currency: "USD",
  locale: "en-US",
  // Shipping
  freeShippingThreshold: 150, // USD — orders at/above this get free standard shipping
  shippingMethods: [
    { id: "standard", name: "Standard Shipping", desc: "Arrives in 24–48 hours", price: 10 },
    { id: "express",  name: "Express Shipping",  desc: "Next business day",       price: 25 }
  ],
  // Tax: California sales tax applied for CA addresses (brand is based in Pacific Palisades).
  taxRates: { CA: 0.095 },
  // Promo codes
  promoCodes: {
    SPARKLE10: { type: "percent", value: 10, label: "10% off your order" },
    WELCOME15: { type: "percent", value: 15, label: "15% off your first order" },
    FREESHIP:  { type: "shipping", value: 0, label: "Free standard shipping" }
  },
  sizes: ["S", "M", "L"],
  // Optional "Pay in 4" messaging on the product page (set enabled:true once a provider is integrated)
  installments: { enabled: false, provider: "Klarna", count: 4 },
  // Standard US size guide shown in the Size Guide modal (confirm measurements with the client)
  sizeGuide: [
    { size: "S", us: "4\u20136",   bust: "34\u201335\"", waist: "26\u201327\"", hips: "36\u201337\"" },
    { size: "M", us: "8\u201310",  bust: "36\u201337\"", waist: "28\u201329\"", hips: "38\u201339\"" },
    { size: "L", us: "12\u201314", bust: "38\u201340\"", waist: "30\u201332\"", hips: "40\u201342\"" }
  ],
  contact: {
    email: "info@brigitterose.shop",
    location: "Pacific Palisades, California",
    instagram: "https://www.instagram.com/" // TODO client: confirm handle
  }
};

BR.PRODUCTS = [
  {
    id: "leopard-sparkle-set",
    swatch: "#b4742c",
    color: "Leopard",
    style: "BR-002",
    bullets: ["Long-sleeve top and pants", "Leopard print", "Volcano-red piping", "Red sequin pocket strip"],
    badges: ["New"],
    reviews: [],
    name: "Leopard Sparkle Set",
    price: 198,
    fabric: "95% polyester, 5% spandex",
    fabricKey: "polyester",
    design: "Long-sleeve top and pants; leopard print; volcano-red piping; red sequin pocket strip",
    description: "A statement leopard print meets striking red accents and our signature sparkle. Designed to bring a glamorous touch to comfort, with every detail carefully chosen to stand out.",
    care: "Delicate wash; tumble dry low or lay flat to dry",
    images: ["leopard_1", "leopard_2", "leopard_3", "leopard_4", "leopard_5"],
    badge: "Debut Collection"
  },
  {
    id: "grey-sparkle-set",
    swatch: "#7d7f84",
    color: "Grey",
    style: "BR-004",
    bullets: ["Long-sleeve top and pants", "Black / gunmetal piping", "Gunmetal sequin pocket strip"],
    badges: ["New"],
    reviews: [],
    name: "Grey Sparkle Set",
    price: 160,
    fabric: "90% modal, 10% spandex",
    fabricKey: "modal",
    design: "Long-sleeve top and pants; black/gunmetal piping; gunmetal sequin pocket strip",
    description: "Soft grey meets subtle gunmetal sparkle in a design that feels both modern and timeless. Finished with refined detailing and our luxurious modal fabric, this set is made for beautiful moments of comfort.",
    care: "Delicate wash; tumble dry low or lay flat to dry",
    images: ["grey_1", "grey_2", "grey_3", "grey_4", "grey_5"],
    badge: "Debut Collection"
  },
  {
    id: "navy-sparkle-set",
    swatch: "#1c2340",
    color: "Navy",
    style: "BR-003",
    bullets: ["Long-sleeve top and pants", "Navy / titanium piping", "Navy sequin pocket strip"],
    badges: ["New"],
    reviews: [],
    name: "Navy Sparkle Set",
    price: 189,
    fabric: "90% rayon, 10% spandex",
    fabricKey: "rayon",
    design: "Long-sleeve top and pants; navy/titanium piping; navy sequin pocket strip",
    description: "Rich navy, delicate detailing, and our signature sparkle come together in a design that celebrates timeless elegance. Crafted from a soft rayon fabric for a luxurious feel.",
    care: "Delicate wash; tumble dry low or lay flat to dry",
    images: ["navy_1", "navy_2", "navy_3", "navy_4", "navy_6"],
    badge: "Debut Collection"
  },
  {
    id: "camouflage-sparkle-set",
    swatch: "#4f5b3c",
    color: "Camouflage",
    style: "BR-001",
    bullets: ["Long-sleeve top and pants", "Camouflage print", "Dark chocolate / light bronze piping", "Mocha sequin pocket strip"],
    badges: ["New"],
    reviews: [],
    name: "Camouflage Sparkle Set",
    price: 175,
    fabric: "95% polyester, 5% spandex",
    fabricKey: "polyester",
    design: "Long-sleeve top and pants; camouflage print; dark chocolate/light bronze piping; mocha sequin pocket strip",
    description: "Classic camouflage takes on a luxurious new look with rich chocolate accents and our signature mocha sparkle. A distinctive design that brings together individuality, beautiful detailing, and comfort.",
    care: "Delicate wash; tumble dry low or lay flat to dry",
    images: ["camo_1", "camo_2", "camo_3", "camo_4", "camo_6"],
    badge: "Debut Collection"
  },
  {
    id: "black-sparkle-set",
    swatch: "#111111",
    color: "Black",
    style: "BR-005",
    bullets: ["Long-sleeve top and pants", "Black piping", "Black sequin pocket strip"],
    badges: ["New"],
    reviews: [],
    name: "Black Sparkle Set",
    price: 189,
    fabric: "90% modal, 10% spandex",
    fabricKey: "modal",
    design: "Long-sleeve top and pants; black piping; black sequin pocket strip",
    description: "Our signature sparkle brings a beautiful finishing touch to classic black. Thoughtfully designed with delicate sequin detailing and a soft modal fabric, this set makes comfort feel as luxurious as it looks.",
    care: "Delicate wash; tumble dry low or lay flat to dry",
    images: ["black_1", "black_2", "black_3", "black_4", "black_5"],
    badge: "Debut Collection"
  }
];

BR.GALLERY = [
  // First 8 feed the homepage strip; the gallery page shows all (1600px images in assets/img/gallery, 800px in /sm)
  { src: "ga29", alt: "Brigitte Rose campaign photo", w: 1024, h: 683 },
  { src: "ga7", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "ga3", alt: "Brigitte Rose campaign photo", w: 1600, h: 1066 },
  { src: "ga20", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "ga14", alt: "Brigitte Rose campaign photo", w: 1600, h: 1067 },
  { src: "ga23", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "ga4", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "ga18", alt: "Brigitte Rose campaign photo", w: 1600, h: 1170 },
  { src: "ga1", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "ga2", alt: "Brigitte Rose campaign photo", w: 1600, h: 1067 },
  { src: "ga5", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "ga6", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "ga8", alt: "Brigitte Rose campaign photo", w: 1142, h: 1600 },
  { src: "ga9", alt: "Brigitte Rose campaign photo", w: 1600, h: 1600 },
  { src: "ga10", alt: "Brigitte Rose campaign photo", w: 1066, h: 1600 },
  { src: "ga11", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "ga12", alt: "Brigitte Rose campaign photo", w: 1600, h: 1157 },
  { src: "ga13", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "ga15", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "ga16", alt: "Brigitte Rose campaign photo", w: 1066, h: 1600 },
  { src: "ga17", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "ga19", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "ga21", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "ga22", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "ga24", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "ga25", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "ga26", alt: "Brigitte Rose campaign photo", w: 1066, h: 1600 },
  { src: "ga28", alt: "Brigitte Rose campaign photo", w: 1067, h: 1600 },
  { src: "g1", alt: "Brigitte Rose campaign photo", w: 800, h: 800 },
  { src: "g2", alt: "Brigitte Rose campaign photo", w: 927, h: 1280 },
  { src: "g3", alt: "Brigitte Rose campaign photo", w: 1024, h: 683 },
  { src: "g4", alt: "Brigitte Rose campaign photo", w: 853, h: 1280 }
];

BR.US_STATES = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["DC","District of Columbia"],["FL","Florida"],["GA","Georgia"],["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"]
];

/* Helpers for images */
BR.img = function (name, size) {
  // size: "sm" (640w) or "lg" (1024w)
  return (size === "sm" ? "assets/img/products/sm/" : "assets/img/products/") + name + ".jpg";
};
BR.galleryImg = function (name, size) { return (size === "sm" ? "assets/img/gallery/sm/" : "assets/img/gallery/") + name + ".jpg"; };
BR.getProduct = function (id) { return BR.PRODUCTS.find(function (p) { return p.id === id; }); };
