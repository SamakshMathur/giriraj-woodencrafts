"use client";

import { EditableImage } from "@/components/EditableImage";
import { AddPhotoTile, useAddedPhotos } from "@/components/AddablePhotos";

/**
 * A simple grid of photos: the built-in ones, then any the admin added,
 * then (admin mode only) an "+ Add photo" tile.
 */
export function PhotoGrid({
  section,
  idPrefix,
  photos,
  alt,
  className = "mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
}: {
  /** Where added photos are stored, e.g. "about-workshop". */
  section: string;
  /** Admin id prefix for the built-in photos, e.g. "about-factory" gives about-factory-0. */
  idPrefix: string;
  photos: string[];
  alt: string;
  className?: string;
}) {
  const added = useAddedPhotos(section);
  const tile = "relative aspect-[4/5] overflow-hidden rounded-md shadow-warm-sm";

  return (
    <div className={className}>
      {photos.map((src, i) => (
        <div key={src} className={tile}>
          <EditableImage id={`${idPrefix}-${i}`} src={src} alt={alt} className="object-cover object-top" />
        </div>
      ))}
      {added.slots.map((slot) => (
        <div key={slot.id} className={tile}>
          <EditableImage
            id={slot.id}
            src={added.urlFor(slot.id)}
            alt={alt}
            className="object-cover object-top"
            onRemove={() => added.remove(slot.id)}
          />
        </div>
      ))}
      <AddPhotoTile onAdd={added.add} busy={added.busy} className="aspect-[4/5]" />
    </div>
  );
}
