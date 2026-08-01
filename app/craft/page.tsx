import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { EditableImage } from "@/components/EditableImage";
import { EditableText } from "@/components/EditableText";
import { CRAFT_STAGES } from "@/lib/craft";

export default function CraftPage() {
  return (
    <>
      <PageHero
        id="craft-hero"
        eyebrow="Our Craft"
        title="A Legacy of Sacred Woodwork"
        subtitle="Every mandir passes through the hands of artisans carrying generations of technique."
      />

      <Section className="bg-bg pt-0">
        <div className="space-y-24">
          {CRAFT_STAGES.map((stage, i) => (
            <div
              key={stage.name}
              className={`grid items-center gap-10 md:grid-cols-2 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative aspect-video overflow-hidden rounded-2xl shadow-warm-sm">
                <EditableImage
                  id={`craft-stage-${stage.slug}`}
                  src={stage.image}
                  alt={stage.name}
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-display text-xs uppercase tracking-widest2 text-accent">
                  Stage {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-heading text-3xl text-text">{stage.name}</h3>
                <EditableText
                  id={`craft-stage-${stage.slug}-detail`}
                  defaultValue="Detail on this stage of the journey coming soon."
                  as="p"
                  multiline
                  className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-bg-secondary">
        <SectionHeading
          id="craft-artisans"
          eyebrow="Meet the Artisans"
          title="Hands That Carry Generations"
          subtitle="The craftsmen behind every Giriraj mandir."
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-2xl bg-card shadow-warm-sm">
                <EditableImage id={`craft-artisan-${i}`} alt="Artisan portrait" />
              </div>
              <EditableText
                id={`craft-artisan-${i}-name`}
                defaultValue="Artisan Name"
                as="p"
                className="mt-4 text-sm font-medium text-text"
              />
              <EditableText
                id={`craft-artisan-${i}-role`}
                defaultValue="Master Carver"
                as="p"
                className="text-xs text-muted"
              />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
