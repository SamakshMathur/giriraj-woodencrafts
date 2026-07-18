import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Configurator } from "@/components/Configurator";

export default function CustomizationPage() {
  return (
    <>
      <PageHero
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
