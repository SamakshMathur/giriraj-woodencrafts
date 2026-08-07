import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { EditableImage } from "@/components/EditableImage";
import { EditableText } from "@/components/EditableText";
import { CRAFT_STAGES } from "@/lib/craft";

// See app/about/page.tsx for why this is explicit here rather than relied
// on cascading from app/template.tsx.
export const dynamic = "force-dynamic";

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
                <EditableText
                  id={`craft-stage-${stage.slug}-name`}
                  defaultValue={stage.name}
                  as="h3"
                  className="mt-3 font-heading text-3xl text-text"
                />
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
    </>
  );
}
