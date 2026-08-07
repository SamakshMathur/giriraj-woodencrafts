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
      />
      <Section className="bg-bg pt-0">
        <Configurator />
      </Section>
    </>
  );
}
