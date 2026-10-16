"use client";

import Link from "next/link";
import { EditableText } from "@/components/EditableText";
import { useContact, useRegistryText } from "@/components/OverridesProvider";
import { NAV_LINKS, NavLabel } from "@/components/Header";
import { instagramLink, mailLink, telLink, whatsAppLink } from "@/lib/whatsapp";

// Every word here is editable in admin mode. Menu names come from the
// header's list (edited on Admin > All other text). Contact
// details share ids with the Contact page, and their links are built from
// the edited text.
export function Footer() {
  const contact = useContact();
  const message = useRegistryText("whatsapp-msg-general");
  const link = "transition-colors hover:text-accent";

  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="mx-auto max-w-content px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <EditableText
              id="footer-brand"
              defaultValue="Giriraj Woodencrafts"
              as="p"
              className="font-display text-lg uppercase tracking-widest2 text-text"
            />
            <EditableText
              id="footer-blurb"
              defaultValue="A legacy of sacred woodwork. Handcrafted wooden mandirs made with generations of craftsmanship."
              as="p"
              multiline
              className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary"
            />
          </div>

          <div>
            <EditableText id="footer-links-title" defaultValue="Quick Links" as="p" className="text-sm font-medium text-text" />
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`text-sm text-text-secondary ${link}`}>
                    <NavLabel id={item.id} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <EditableText id="footer-reach-title" defaultValue="Reach Us" as="p" className="text-sm font-medium text-text" />
            <ul className="mt-4 space-y-3 text-sm text-text-secondary">
              <li>
                <EditableText id="contact-label-whatsapp" defaultValue="WhatsApp" as="span" />:{" "}
                <a href={whatsAppLink(undefined, contact.whatsappNumber)} target="_blank" rel="noopener noreferrer" className={link}>
                  <EditableText id="contact-whatsapp" defaultValue={contact.whatsapp} as="span" />
                </a>
              </li>
              <li>
                <EditableText id="contact-label-phone" defaultValue="Phone" as="span" />:{" "}
                <a href={telLink(contact.phone)} className={link}>
                  <EditableText id="contact-phone" defaultValue={contact.phone} as="span" />
                </a>
              </li>
              <li>
                <a href={mailLink(contact.email)} className={`break-all ${link}`}>
                  <EditableText id="contact-email" defaultValue={contact.email} as="span" />
                </a>
              </li>
              <li>
                <EditableText id="contact-label-instagram" defaultValue="Instagram" as="span" />:{" "}
                <a href={instagramLink(contact.instagram)} target="_blank" rel="noopener noreferrer" className={link}>
                  <EditableText id="contact-instagram" defaultValue={contact.instagram} as="span" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <EditableText id="footer-talk-title" defaultValue="Talk to Us" as="p" className="text-sm font-medium text-text" />
            <EditableText
              id="footer-talk-copy"
              defaultValue="Questions about a design, size or delivery? Message us and an expert will reply."
              as="p"
              multiline
              className="mt-4 text-sm text-text-secondary"
            />
            <a
              href={whatsAppLink(message, contact.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm text-white transition-colors hover:bg-brand-secondary"
            >
              <EditableText id="footer-talk-button" defaultValue="Chat on WhatsApp" as="span" />
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted md:flex-row">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <EditableText id="footer-copyright" defaultValue="Giriraj Woodencrafts. Made in India." as="span" />
          </p>
          <EditableText id="footer-tagline" defaultValue="Crafted for Generations." as="p" />
        </div>
      </div>
    </footer>
  );
}
