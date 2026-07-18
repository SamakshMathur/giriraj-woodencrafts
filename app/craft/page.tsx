import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { CRAFT_STAGES } from "@/lib/craft";

export default function CraftPage() {
  return (
    <>
      <PageHero
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
                <Image
                  src={stage.image}
                  alt={stage.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-display text-xs uppercase tracking-widest2 text-accent">
                  Stage {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-heading text-3xl text-text">{stage.name}</h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary">
                  Detail on this stage of the journey coming soon.
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-bg-secondary">
        <SectionHeading
          eyebrow="Meet the Artisans"
          title="Hands That Carry Generations"
          subtitle="The craftsmen behind every Giriraj mandir."
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto flex aspect-square w-full items-center justify-center rounded-2xl bg-card font-display text-xs uppercase tracking-widest2 text-muted shadow-warm-sm">
                Image
              </div>
              <p className="mt-4 text-sm font-medium text-text">Artisan Name</p>
              <p className="text-xs text-muted">Master Carver</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
