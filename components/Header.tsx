"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { EditableText } from "@/components/EditableText";
import { useRegistryText } from "@/components/OverridesProvider";

// Menu names are edited on Admin > All other text (not by clicking, so the
// menu still navigates in admin mode). The footer reuses these ids.
export const NAV_LINKS = [
  { href: "/products", id: "nav-products", label: "Products" },
  { href: "/customization", id: "nav-customization", label: "Customization" },
  { href: "/craft", id: "nav-craft", label: "Our Craft" },
  { href: "/gallery", id: "nav-gallery", label: "Gallery" },
  { href: "/about", id: "nav-about", label: "About" },
  { href: "/contact", id: "nav-contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the phone menu whenever the page changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`glass fixed inset-x-0 top-0 z-50 transition-shadow duration-500 ease-reverent ${
        scrolled || menuOpen ? "shadow-warm-sm" : ""
      }`}
    >
      <div className="relative mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full shadow-warm-sm">
            <Image
              src="/images/logo/giriraj-emblem.webp"
              alt="Giriraj Woodencrafts emblem"
              fill
              sizes="44px"
              className="object-cover"
            />
          </span>
          <span className="flex flex-col justify-center leading-none">
            <span className="block font-display text-base leading-none tracking-widest2 uppercase text-text">
              <EditableText id="brand-name" defaultValue="Giriraj" as="span" />
            </span>
            <span className="mt-1.5 block text-[10px] leading-none tracking-widest2 uppercase text-text-secondary">
              <EditableText id="brand-subname" defaultValue="Woodencrafts" as="span" />
            </span>
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`font-body text-sm transition-colors duration-300 hover:text-accent ${
                isActive(link.href) ? "text-accent" : "text-text-secondary"
              }`}
            >
              <NavLabel id={link.id} />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <ThemeToggle />
          <Link
            href="/customization"
            className="hidden rounded-md bg-brand px-5 py-2.5 text-sm text-white transition-colors duration-300 hover:bg-brand-secondary md:inline-block"
          >
            <EditableText id="header-cta" defaultValue="Customize Yours" as="span" />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-text lg:hidden"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" className="border-t border-border lg:hidden">
          <ul className="mx-auto max-w-content px-6 py-3 md:px-10">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`flex items-center justify-between border-b border-border py-3.5 text-sm ${
                    isActive(link.href) ? "text-accent" : "text-text"
                  }`}
                >
                  <NavLabel id={link.id} />
                  <span aria-hidden className="text-muted">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-auto max-w-content px-6 pb-5 md:hidden">
            <Link
              href="/customization"
              className="block rounded-md bg-brand px-5 py-3 text-center text-sm text-white"
            >
              <EditableText id="header-cta" defaultValue="Customize Yours" as="span" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

/** A menu item's current name (default or the admin's edit). */
export function NavLabel({ id }: { id: string }) {
  return <>{useRegistryText(id)}</>;
}
