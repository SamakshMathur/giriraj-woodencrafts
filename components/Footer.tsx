import Link from "next/link";
import { whatsAppLink } from "@/lib/whatsapp";

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
              <li>
                WhatsApp:{" "}
                <a
                  href={whatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  +91 82905 83377
                </a>
              </li>
              <li>
                Phone:{" "}
                <a href="tel:+918852820399" className="transition-colors hover:text-accent">
                  +91 88528 20399
                </a>
              </li>
              <li>
                <a
                  href="mailto:girirajwoodencrafts@gmail.com"
                  className="transition-colors hover:text-accent"
                >
                  girirajwoodencrafts@gmail.com
                </a>
              </li>
              <li>
                Instagram:{" "}
                <a
                  href="https://www.instagram.com/girirajwoodencrafts?igsh=aGN6Z3lzc2Zwb3A1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  girirajwoodencrafts
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-text">Talk to Us</p>
            <p className="mt-4 text-sm text-text-secondary">
              Questions about a design, size or delivery? Message us and an expert will reply.
            </p>
            <a
              href={whatsAppLink("Hi Giriraj, I'd like to know more about your mandirs.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm text-white transition-colors hover:bg-brand-secondary"
            >
              Chat on WhatsApp
              <span aria-hidden>→</span>
            </a>
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
