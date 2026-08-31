export type Product = {
  slug: string;
  name: string;
  collection: string;
  wood: string;
  finish: string;
  dimensions: string;
  storage: boolean;
  lighting: boolean;
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
    image: "/images/mandirs/showcase-ananta-peacock-table.webp",
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

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
