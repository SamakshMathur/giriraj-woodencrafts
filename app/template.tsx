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
// getTextOverrides/getImageOverrides now read from MongoDB (a real TCP
// connection, not fetch()), so Next.js's fetch-based Data Cache doesn't
// apply here the way it did with the old Vercel Blob SDK — but keeping
// `force-no-store` costs nothing and guards against the same class of
// caching surprise if a future data source goes through fetch() again.
export const fetchCache = "force-no-store";

export default async function Template({ children }: { children: React.ReactNode }) {
  const [text, images] = await Promise.all([getTextOverrides(), getImageOverrides()]);

  return (
    <OverridesProvider text={text} images={images}>
      {children}
    </OverridesProvider>
  );
}
