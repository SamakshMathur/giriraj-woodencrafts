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
    name: "Shreeji",
    collection: "Traditional Collection",
    wood: "Burma Teak",
    finish: "Matte Walnut",
    dimensions: "36in W x 24in D x 72in H",
    storage: true,
    lighting: true,
    marble: true,
    style: "Floor Mounted",
    finishing: "Dark Wooden",
    image: "/images/mandirs/shreeji-front.webp",
  },
  {
    slug: "vaikuntha",
    name: "Vaikuntha",
    collection: "Royal Collection",
    wood: "Sheesham",
    finish: "Antique Gold Trim",
    dimensions: "48in W x 28in D x 84in H",
    storage: true,
    lighting: true,
    marble: true,
    style: "Floor Mounted",
    finishing: "Antique",
    image: "/images/mandirs/vaikuntha-front.webp",
  },
  {
    slug: "ananta",
    name: "Ananta",
    collection: "Modern Collection",
    wood: "Oak",
    finish: "Natural Satin",
    dimensions: "24in W x 14in D x 30in H",
    storage: false,
    lighting: true,
    marble: false,
    style: "Wall Mounted",
    finishing: "Light Wooden",
    image: "/images/mandirs/ananta-front.webp",
  },
  {
    slug: "suvarna",
    name: "Suvarna",
    collection: "Luxury Maharaja Series",
    wood: "Burma Teak",
    finish: "Hand-gilded Gold Leaf",
    dimensions: "60in W x 32in D x 96in H",
    storage: true,
    lighting: true,
    marble: true,
    style: "Floor Mounted",
    finishing: "Antique",
    image: "/images/mandirs/suvarna-front.webp",
  },
];

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
