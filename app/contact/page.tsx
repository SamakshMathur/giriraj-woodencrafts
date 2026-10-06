import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { whatsAppLink } from "@/lib/whatsapp";

// See app/about/page.tsx for why this is explicit here rather than relied
// on cascading from app/template.tsx.
export const dynamic = "force-dynamic";

const CONTACT_ROWS: { label: string; value: string; href: string; external?: boolean }[] = [
  { label: "WhatsApp", value: "+91 82905 83377", href: whatsAppLink(), external: true },
  { label: "Phone", value: "+91 88528 20399", href: "tel:+918852820399" },
  { label: "Email", value: "girirajwoodencrafts@gmail.com", href: "mailto:girirajwoodencrafts@gmail.com" },
  {
    label: "Instagram",
    value: "@girirajwoodencrafts",
    href: "https://www.instagram.com/girirajwoodencrafts?igsh=aGN6Z3lzc2Zwb3A1",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        id="contact-hero"
        eyebrow="Contact"
        title="Begin Your Mandir's Story"
        subtitle="Speak with our design experts or book a showroom visit."
      />

      <Section className="bg-bg pt-8 md:pt-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <div>
            <h2 className="font-heading text-3xl text-text">Send us an enquiry</h2>
            <p className="mb-6 mt-2 text-sm text-text-secondary">
              Tell us what you have in mind and we&rsquo;ll get back to you on WhatsApp.
            </p>
            <ContactForm />
          </div>

          <aside className="h-fit border border-border bg-card">
            <div className="border-b border-border p-6 md:p-8">
              <p className="text-xs uppercase tracking-widest2 text-accent">Reach us directly</p>
              <p className="mt-2 font-heading text-2xl text-text">We&rsquo;re a message away</p>
            </div>
            <dl className="divide-y divide-border">
              {CONTACT_ROWS.map((row) => (
                <div key={row.label} className="px-6 py-4 md:px-8">
                  <dt className="text-[10px] uppercase tracking-widest2 text-muted">{row.label}</dt>
                  <dd className="mt-1 text-sm">
                    <a
                      href={row.href}
                      {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="break-all text-text transition-colors hover:text-accent"
                    >
                      {row.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="border-t border-border p-6 md:p-8">
              <a
                href={whatsAppLink("Hi Giriraj, I'd like to know more about your mandirs.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-md bg-[#25D366] px-6 py-3 text-sm font-medium text-[#0b3d20] transition-opacity hover:opacity-90"
              >
                Chat on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
