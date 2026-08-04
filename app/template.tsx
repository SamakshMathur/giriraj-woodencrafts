import { OverridesProvider } from "@/components/OverridesProvider";
import { getTextOverrides, getImageOverrides } from "@/lib/content";

// A template (not a layout) on purpose: layouts persist across client-side
// navigation and do NOT re-run their data fetching when you click a <Link>
// to another page — only on a hard reload. That was the actual bug behind
// "only a few images update" — overrides were fetched once per browser
// session (in the old layout.tsx placement) and then silently stale for
// every page visited afterward via client-side nav. Templates re-mount
// (and thus re-fetch) on every navigation, so this can't go stale.
export const dynamic = "force-dynamic";
// getTextOverrides/getImageOverrides call the @vercel/blob SDK, which
// makes its own internal fetch() calls — and Next.js patches the global
// fetch to go through its persistent Data Cache by default, even for
// fetches buried inside third-party libraries, independent of per-request
// rendering mode. `dynamic = "force-dynamic"` alone does not override an
// explicit or inherited cache on those inner fetches. This was the real
// reason removed images kept coming back on refresh: the removal was
// correctly saved, but this route kept serving a cached pre-removal
// list() result. `force-no-store` overrides caching for every fetch in
// this segment, including ones made deep inside a dependency.
export const fetchCache = "force-no-store";

export default async function Template({ children }: { children: React.ReactNode }) {
  const [text, images] = await Promise.all([getTextOverrides(), getImageOverrides()]);

  return (
    <OverridesProvider text={text} images={images}>
      {children}
    </OverridesProvider>
  );
}
