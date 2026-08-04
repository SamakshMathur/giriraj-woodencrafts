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

export default async function Template({ children }: { children: React.ReactNode }) {
  const [text, images] = await Promise.all([getTextOverrides(), getImageOverrides()]);

  return (
    <OverridesProvider text={text} images={images}>
      {children}
    </OverridesProvider>
  );
}
