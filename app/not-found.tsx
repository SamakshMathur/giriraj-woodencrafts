import Link from "next/link";
import { EditableText } from "@/components/EditableText";
import { Ornament } from "@/components/Ornament";

// Shown for any address that doesn't exist. Editable like the rest of the
// site (open a broken link while in admin mode to edit it).
export default function NotFound() {
  return (
    <section className="page-hero-gradient flex min-h-[70vh] items-center px-6 pb-24 pt-40 text-center md:px-10">
      <div className="mx-auto max-w-xl">
        <EditableText
          id="notfound-eyebrow"
          defaultValue="Page not found"
          as="p"
          className="font-display text-xs uppercase tracking-widest2 text-accent"
        />
        <EditableText
          id="notfound-title"
          defaultValue="This page has moved or never existed"
          as="h1"
          className="mt-4 font-heading text-4xl text-text md:text-5xl"
        />
        <Ornament className="mx-auto mt-5" />
        <EditableText
          id="notfound-copy"
          defaultValue="The mandir you're looking for may have a new address. Browse the full collection or head back home."
          as="p"
          multiline
          className="mt-5 text-base leading-relaxed text-text-secondary"
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="rounded-md bg-brand px-6 py-3 text-sm text-white hover:bg-brand-secondary">
            <EditableText id="notfound-cta-products" defaultValue="Browse the collection" as="span" />
          </Link>
          <Link href="/" className="rounded-md border border-border px-6 py-3 text-sm text-text hover:border-accent">
            <EditableText id="notfound-cta-home" defaultValue="Back to home" as="span" />
          </Link>
        </div>
      </div>
    </section>
  );
}
