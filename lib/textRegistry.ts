import { PRODUCTS } from "./products";

/**
 * Text that appears on the site but can't be clicked to edit in place:
 * form placeholder hints, dropdown choices, labels drawn over photos,
 * pre-filled WhatsApp messages and the browser tab title. Each entry is
 * listed on Admin > All other text, where it can be edited.
 *
 * Everything else (headings, paragraphs, buttons, menu items, labels) is
 * edited by clicking it directly on the page in admin mode.
 *
 * Ids are stable: changing one orphans its saved edit.
 */
export type RegistryItem = { id: string; label: string; group: string; default: string; hint?: string };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const styles = Array.from(new Set(PRODUCTS.map((p) => p.style)));
const finishings = Array.from(new Set(PRODUCTS.map((p) => p.finishing)));

export const PRODUCT_PHOTO_LABELS = ["Front", "45°", "Side", "Close-up Carving", "Drawer"];

export const TEXT_REGISTRY: RegistryItem[] = [
  // Whole site
  { group: "Whole site", id: "site-title", label: "Browser tab title", default: "Giriraj Woodencrafts — Handcrafted Divine Spaces" },
  {
    group: "Whole site",
    id: "site-description",
    label: "Search engine description",
    default: "Every home deserves its own temple. Handcrafted wooden mandirs made with generations of craftsmanship.",
  },

  // Menu (header and footer). Edited here rather than by clicking, so the
  // menu keeps working for getting around while in admin mode.
  { group: "Menu", id: "breadcrumb-home", label: "Breadcrumb: Home (top of product pages)", default: "Home" },
  { group: "Menu", id: "nav-products", label: "Menu: Products (also the product page breadcrumb)", default: "Products" },
  { group: "Menu", id: "nav-customization", label: "Menu: Customization", default: "Customization" },
  { group: "Menu", id: "nav-craft", label: "Menu: Our Craft", default: "Our Craft" },
  { group: "Menu", id: "nav-gallery", label: "Menu: Gallery", default: "Gallery" },
  { group: "Menu", id: "nav-about", label: "Menu: About", default: "About" },
  { group: "Menu", id: "nav-contact", label: "Menu: Contact", default: "Contact" },

  // WhatsApp messages
  {
    group: "WhatsApp messages",
    id: "whatsapp-msg-general",
    label: "Floating WhatsApp button and footer button",
    default: "Hi Giriraj, I'd like to know more about your mandirs.",
  },
  {
    group: "WhatsApp messages",
    id: "whatsapp-msg-expert",
    label: "Home page “Talk to Our Expert” button",
    default: "Hi Giriraj, I'd like to talk to an expert about a mandir.",
  },
  {
    group: "WhatsApp messages",
    id: "whatsapp-msg-product",
    label: "Product page WhatsApp and Request Quote buttons",
    default: "Hi Giriraj, I'm interested in the {name} mandir ({dimensions}). Could you share the price and details?",
    hint: "{name} and {dimensions} are replaced with the product's values.",
  },
  {
    group: "WhatsApp messages",
    id: "whatsapp-msg-contact-intro",
    label: "First line of a Contact page enquiry",
    default: "Hello Giriraj Woodencrafts, I have an enquiry.",
  },
  {
    group: "WhatsApp messages",
    id: "whatsapp-msg-custom-intro",
    label: "First line of a Customization page enquiry",
    default: "Hello Giriraj Woodencrafts, I'd like a custom mandir.",
  },

  {
    group: "WhatsApp messages",
    id: "whatsapp-label-interest",
    label: "Line label before the chosen interest",
    default: "I'm interested in:",
  },
  { group: "WhatsApp messages", id: "whatsapp-label-name", label: "Line label before the customer's name", default: "Name:" },
  { group: "WhatsApp messages", id: "whatsapp-label-phone", label: "Line label before the customer's phone", default: "Phone:" },
  { group: "WhatsApp messages", id: "whatsapp-label-idea", label: "Line label before the customer's design idea", default: "My idea:" },
  {
    group: "WhatsApp messages",
    id: "whatsapp-label-photo",
    label: "Line label before the link to the customer's photo",
    default: "My reference design:",
  },
  {
    group: "WhatsApp messages",
    id: "whatsapp-label-photo-attach",
    label: "Line used when the photo couldn't upload",
    default: "I'll attach my reference photo in this chat.",
  },

  // Contact form
  { group: "Contact page form", id: "contact-thanks-title", label: "Thank-you heading", default: "Thank you, {name}", hint: "{name} is replaced with the customer's name." },
  {
    group: "Contact page form",
    id: "contact-thanks-body",
    label: "Thank-you message",
    default: "WhatsApp has opened with your enquiry. Press send there and our team will reply shortly. We've also kept a copy, so we can call you on {phone} if needed.",
    hint: "{phone} is replaced with the customer's phone number.",
  },
  { group: "Contact page form", id: "contact-thanks-again", label: "“Send another” link", default: "Send another enquiry" },
  { group: "Contact page form", id: "contact-form-name-placeholder", label: "Name box hint", default: "Full Name*" },
  { group: "Contact page form", id: "contact-form-phone-placeholder", label: "Phone box hint", default: "Phone / WhatsApp Number*" },
  { group: "Contact page form", id: "contact-form-interest-placeholder", label: "Dropdown prompt", default: "I'm interested in…" },
  { group: "Contact page form", id: "contact-form-interest-1", label: "Dropdown choice 1", default: "Requesting a Quote" },
  { group: "Contact page form", id: "contact-form-interest-2", label: "Dropdown choice 2", default: "Video Consultation" },
  { group: "Contact page form", id: "contact-form-interest-3", label: "Dropdown choice 3", default: "Booking a Showroom Visit" },
  { group: "Contact page form", id: "contact-form-interest-4", label: "Dropdown choice 4", default: "Bulk / Temple Setup Order" },
  { group: "Contact page form", id: "contact-form-message-placeholder", label: "Message box hint", default: "Tell us about your space and vision" },
  {
    group: "Contact page form",
    id: "contact-form-error-required",
    label: "Error when name or phone is missing",
    default: "Please add your name and phone number so we can reach you.",
  },
  { group: "Contact page form", id: "contact-form-sending", label: "Button while sending", default: "Sending…" },

  // Customization page
  { group: "Customization page", id: "config-idea-placeholder", label: "Design idea box hint", default: "Or describe your own design idea here..." },
  { group: "Customization page", id: "config-name-placeholder", label: "Name box hint", default: "Your name*" },
  { group: "Customization page", id: "config-phone-placeholder", label: "Phone box hint", default: "Phone / WhatsApp number*" },
  {
    group: "Customization page",
    id: "config-error-required",
    label: "Error when name or phone is missing",
    default: "Please add your name and phone number so we can reach you.",
  },
  {
    group: "Customization page",
    id: "config-whatsapp-opened",
    label: "Note after WhatsApp opens",
    default: "WhatsApp is open with your design ready. Just press send.",
  },
  {
    group: "Customization page",
    id: "config-whatsapp-photo-failed",
    label: "Note when the photo couldn't upload",
    default: "WhatsApp is open with your details. Your photo didn't upload, so please attach it in the chat.",
  },
  { group: "Customization page", id: "config-preparing", label: "WhatsApp button while preparing", default: "Preparing…" },
  { group: "Customization page", id: "config-sending", label: "Get Quote button while sending", default: "Sending…" },
  {
    group: "Customization page",
    id: "config-quote-error",
    label: "Error when a quote request fails",
    default: "Couldn't send your request — please try again",
  },

  { group: "Customization page", id: "config-thanks-title", label: "Heading after a quote request", default: "Request Sent" },
  {
    group: "Customization page",
    id: "config-thanks-body",
    label: "Message after a quote request",
    default: "Thank you, {name}. We've received your custom mandir request and will reach out on {phone} soon.",
    hint: "{name} and {phone} are replaced with the customer's details.",
  },
  { group: "Customization page", id: "config-toast-sending", label: "Pop-up while a quote request sends", default: "Sending your request…" },
  { group: "Customization page", id: "config-toast-sent", label: "Pop-up after a quote request", default: "Request sent — we'll be in touch soon" },

  // Products
  ...PRODUCT_PHOTO_LABELS.map((label) => ({
    group: "Product pages",
    id: `product-photo-label-${slug(label)}`,
    label: `Photo label “${label}” (shown on the product photo)`,
    default: label,
  })),
  ...styles.map((s) => ({
    group: "Products page filters",
    id: `products-filter-style-${slug(s)}`,
    label: `Style choice “${s}”`,
    default: s,
  })),
  ...finishings.map((f) => ({
    group: "Products page filters",
    id: `products-filter-finishing-${slug(f)}`,
    label: `Finishing choice “${f}”`,
    default: f,
  })),
  { group: "Products page filters", id: "products-filter-all", label: "“All” choice", default: "All" },
  { group: "Products page filters", id: "products-count-one", label: "Count word, one result", default: "design" },
  { group: "Products page filters", id: "products-count-many", label: "Count word, several results", default: "designs" },
];

const DEFAULTS = new Map(TEXT_REGISTRY.map((item) => [item.id, item.default]));

/** The built-in text for a registry id. */
export function registryDefault(id: string): string {
  const value = DEFAULTS.get(id);
  if (value === undefined) throw new Error(`Unknown text id: ${id}`);
  return value;
}

export { slug as textSlug };
