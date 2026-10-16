import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { EditableText } from "@/components/EditableText";
import { instagramLink, mailLink, resolveContact, telLink, whatsAppLink } from "@/lib/whatsapp";
import { getOverrides } from "@/lib/content";
import { isAdminRequest } from "@/lib/adminAuth";
import { registryDefault } from "@/lib/textRegistry";

// See app/about/page.tsx for why this is explicit here rather than relied
// on cascading from app/template.tsx.
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  // Contact details are shared with the footer (same ids), and each link is
  // built from the edited text so they never disagree.
  const { text: saved } = await getOverrides({ fresh: await isAdminRequest() });
  const contact = resolveContact(saved);
  const rows = [
    { id: "contact-whatsapp", labelId: "contact-label-whatsapp", label: "WhatsApp", value: contact.whatsapp, href: whatsAppLink(undefined, contact.whatsappNumber), external: true },
    { id: "contact-phone", labelId: "contact-label-phone", label: "Phone", value: contact.phone, href: telLink(contact.phone) },
    { id: "contact-email", labelId: "contact-label-email", label: "Email", value: contact.email, href: mailLink(contact.email) },
    { id: "contact-instagram", labelId: "contact-label-instagram", label: "Instagram", value: contact.instagram, href: instagramLink(contact.instagram), external: true },
  ];
  const generalMessage = saved["whatsapp-msg-general"] ?? registryDefault("whatsapp-msg-general");

  return (
    <>
      <PageHero
        id="contact-hero"
        eyebrow="Contact"
        title="Begin Your Mandir's Story"
        subtitle="Speak with our design experts or book a showroom visit."
        image="/images/mandirs/madhu-mayur-gallery-45.webp"
        imagePosition="center 25%"
      />

      <Section className="bg-bg pt-8 md:pt-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <div>
            <EditableText id="contact-form-title" defaultValue="Send us an enquiry" as="h2" className="font-heading text-3xl text-text" />
            <EditableText
              id="contact-form-subtitle"
              defaultValue="Tell us what you have in mind and we’ll get back to you on WhatsApp."
              as="p"
              multiline
              className="mb-6 mt-2 text-sm text-text-secondary"
            />
            <ContactForm />
          </div>

          <aside className="h-fit border border-border bg-card">
            <div className="border-b border-border p-6 md:p-8">
              <EditableText id="contact-aside-eyebrow" defaultValue="Reach us directly" as="p" className="text-xs uppercase tracking-widest2 text-accent" />
              <EditableText id="contact-aside-title" defaultValue="We’re a message away" as="p" className="mt-2 font-heading text-2xl text-text" />
            </div>
            <dl className="divide-y divide-border">
              {rows.map((row) => (
                <div key={row.id} className="px-6 py-4 md:px-8">
                  <dt className="text-[10px] uppercase tracking-widest2 text-muted">
                    <EditableText id={row.labelId} defaultValue={row.label} as="span" />
                  </dt>
                  <dd className="mt-1 text-sm">
                    <a
                      href={row.href}
                      {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="break-all text-text transition-colors hover:text-accent"
                    >
                      <EditableText id={row.id} defaultValue={row.value} as="span" />
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="border-t border-border p-6 md:p-8">
              <a
                href={whatsAppLink(generalMessage, contact.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-md bg-[#25D366] px-6 py-3 text-sm font-medium text-[#0b3d20] transition-opacity hover:opacity-90"
              >
                <EditableText id="contact-aside-button" defaultValue="Chat on WhatsApp" as="span" />
              </a>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
