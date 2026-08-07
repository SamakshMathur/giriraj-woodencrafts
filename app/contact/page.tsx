import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

// See app/about/page.tsx for why this is explicit here rather than relied
// on cascading from app/template.tsx.
export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <>
      <PageHero
        id="contact-hero"
        eyebrow="Contact"
        title="Begin Your Mandir's Story"
        subtitle="Speak with our design experts or book a showroom visit."
      />

      <Section className="bg-bg pt-0">
        <div className="grid gap-14 md:grid-cols-2">
          <form className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Full Name"
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <select className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent">
              <option>I&apos;m interested in&hellip;</option>
              <option>Requesting a Quote</option>
              <option>Video Consultation</option>
              <option>Booking a Showroom Visit</option>
              <option>Bulk / Temple Setup Order</option>
            </select>
            <textarea
              placeholder="Tell us about your space and vision"
              rows={5}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-brand py-3.5 text-sm text-white transition-all hover:bg-brand-secondary hover:shadow-[0_0_24px_rgba(198,156,69,0.4)] sm:w-auto sm:px-10"
            >
              Send Enquiry
            </button>
          </form>

          <div className="space-y-8">
            <div className="flex aspect-video items-center justify-center rounded-2xl bg-brand-secondary/10 font-display text-xs uppercase tracking-widest2 text-muted shadow-warm-sm">
              Map
            </div>
            <div className="space-y-3 text-sm text-text-secondary">
              <p>
                <span className="text-text">Workshop &amp; Showroom</span>
                <br />
                Address line, City, State, PIN
              </p>
              <p>
                <span className="text-text">Phone</span>
                <br />
                +91 82905 83377
              </p>
              <p>
                <span className="text-text">Email</span>
                <br />
                hello@giriraj.com
              </p>
              <a
                href="https://wa.me/918290583377"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full border border-accent px-6 py-2.5 text-sm text-text transition-all hover:bg-accent hover:text-brand-secondary hover:shadow-[0_0_24px_rgba(198,156,69,0.4)]"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
