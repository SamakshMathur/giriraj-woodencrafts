export type Product = {
  slug: string;
  name: string;
  collection: string;
  wood: string;
  finish: string;
  dimensions: string;
  storage: boolean;
  /** Omit when not yet confirmed; shown as "Available on request". */
  lighting?: boolean;
  marble: boolean;
  style: "Wall Mounted" | "Floor Mounted";
  finishing: "Antique" | "Dark Wooden" | "Light Wooden";
  image: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "shreeji",
    name: "Shree Kshetra",
    collection: "Traditional Collection",
    wood: "Burma Teak",
    finish: "Matte Walnut",
    dimensions: "4ft W x 3ft D x 9ft H",
    storage: true,
    lighting: true,
    marble: true,
    style: "Floor Mounted",
    finishing: "Dark Wooden",
    image: "/images/mandirs/showcase-shreeji-arch.webp",
  },
  {
    slug: "vaikuntha",
    name: "Vaikuntha",
    collection: "Royal Collection",
    wood: "Sheesham",
    finish: "Antique Gold Trim",
    dimensions: "3ft W x 2ft D x 5ft H",
    storage: true,
    lighting: true,
    marble: true,
    style: "Floor Mounted",
    finishing: "Antique",
    image: "/images/mandirs/showcase-vaikuntha-deity-altar.webp",
  },
  {
    slug: "ananta",
    name: "Ananta",
    collection: "Modern Collection",
    wood: "Oak",
    finish: "Natural Satin",
    dimensions: "4ft W x 2ft D x 5ft H",
    storage: false,
    lighting: true,
    marble: false,
    style: "Wall Mounted",
    finishing: "Light Wooden",
    image: "/images/mandirs/compact-apartments-mandir.webp",
  },
  {
    slug: "suvarna",
    name: "Narasimha Kshetra",
    collection: "Luxury Maharaja Series",
    wood: "Burma Teak",
    finish: "Hand-gilded Gold Leaf",
    dimensions: "4ft W x 9in D x 5ft H",
    storage: true,
    lighting: true,
    marble: true,
    style: "Floor Mounted",
    finishing: "Antique",
    image: "/images/mandirs/showcase-suvarna-gold-dome-frame.webp",
  },
];

// Showroom pieces photographed in October 2026 (shared Drive folder).
// Names, wood and sizes below are placeholders until the owner confirms
// them; only what is visible in the photos is stated as fact (drawers,
// marble top, finish colour). Sizes read "Made to your space".
PRODUCTS.push(
  {
    slug: "kamdhenu",
    name: "Kamdhenu Mahal",
    collection: "Showroom Collection",
    wood: "Solid hardwood",
    finish: "Dark walnut polish",
    dimensions: "Made to your space",
    storage: true,
    marble: true,
    style: "Floor Mounted",
    finishing: "Dark Wooden",
    image: "/images/mandirs/kamdhenu-hero.webp",
  },
  {
    slug: "swarna",
    name: "Swarna Mandap",
    collection: "Showroom Collection",
    wood: "Solid hardwood",
    finish: "Gold leaf carving on walnut",
    dimensions: "Made to your space",
    storage: true,
    marble: true,
    style: "Floor Mounted",
    finishing: "Antique",
    image: "/images/mandirs/swarna-hero.webp",
  },
  {
    slug: "shyam-mayur",
    name: "Shyam Mayur",
    collection: "Showroom Collection",
    wood: "Solid hardwood",
    finish: "Deep walnut polish",
    dimensions: "Made to your space",
    storage: true,
    marble: true,
    style: "Floor Mounted",
    finishing: "Dark Wooden",
    image: "/images/mandirs/shyam-mayur-hero.webp",
  },
  {
    slug: "madhu-mayur",
    name: "Madhu Mayur",
    collection: "Showroom Collection",
    wood: "Solid hardwood",
    finish: "Honey teak polish",
    dimensions: "Made to your space",
    storage: true,
    marble: true,
    style: "Floor Mounted",
    finishing: "Light Wooden",
    image: "/images/mandirs/madhu-mayur-hero.webp",
  }
);

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
