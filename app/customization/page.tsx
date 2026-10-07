import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Configurator } from "@/components/Configurator";

// See app/about/page.tsx for why this is explicit here rather than relied
// on cascading from app/template.tsx.
export const dynamic = "force-dynamic";

export default function CustomizationPage() {
  return (
    <>
      <PageHero
        id="customization-hero"
        eyebrow="Configurator"
        title="Design a Mandir That Is Only Yours"
        subtitle="Choose every detail — polishing, storage and lighting — and watch it come together."
        image="/images/mandirs/showroom-gold-drawers.webp"
        imagePosition="center 50%"
      />
      <Section className="bg-bg pt-8 md:pt-10">
        <Configurator />
      </Section>
    </>
  );
}
