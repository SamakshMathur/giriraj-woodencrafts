import Link from "next/link";

const QUICK_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/customization", label: "Customization" },
  { href: "/craft", label: "Our Craft" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="mx-auto max-w-content px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <p className="font-display text-lg tracking-widest2 uppercase text-text">
              Giriraj Woodencrafts
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              A legacy of sacred woodwork. Handcrafted wooden mandirs made with
              generations of craftsmanship.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-text">Quick Links</p>
            <ul className="mt-4 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-text">Reach Us</p>
            <ul className="mt-4 space-y-3 text-sm text-text-secondary">
              <li>WhatsApp: +91 82905 83377</li>
              <li>Phone: +91 82905 83377</li>
              <li>hello@giriraj.com</li>
              <li>Instagram: @giriraj.woodencrafts</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-text">Newsletter</p>
            <p className="mt-4 text-sm text-text-secondary">
              Stories of craftsmanship, once a month.
            </p>
            <form className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-full border border-border bg-card px-4 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm text-white transition-colors hover:bg-brand-secondary"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted md:flex-row">
          <p>&copy; {new Date().getFullYear()} Giriraj Woodencrafts. Made in India.</p>
          <p>Crafted for Generations.</p>
        </div>
      </div>
    </footer>
  );
}
