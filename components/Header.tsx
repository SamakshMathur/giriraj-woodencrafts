"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/customization", label: "Customization" },
  { href: "/craft", label: "Our Craft" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`glass fixed inset-x-0 top-0 z-50 transition-shadow duration-500 ease-reverent ${
        scrolled ? "shadow-warm-sm" : ""
      }`}
    >
      <div className="relative mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full shadow-warm-sm">
            <Image
              src="/images/logo/giriraj-emblem.jpg"
              alt="Giriraj Woodencrafts emblem"
              fill
              className="object-cover"
            />
          </span>
          <span className="flex flex-col justify-center leading-none">
            <span className="block font-display text-base leading-none tracking-widest2 uppercase text-text">
              Giriraj
            </span>
            <span className="mt-1.5 block text-[10px] leading-none tracking-widest2 uppercase text-text-secondary">
              Woodencrafts
            </span>
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm text-text-secondary transition-colors duration-300 hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/customization"
            className="hidden rounded-full bg-brand px-5 py-2.5 text-sm text-white transition-colors duration-300 hover:bg-brand-secondary md:inline-block"
          >
            Customize Yours
          </Link>
        </div>
      </div>
    </header>
  );
}
