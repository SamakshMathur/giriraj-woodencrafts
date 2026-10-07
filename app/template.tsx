import { OverridesProvider } from "@/components/OverridesProvider";
import { getOverrides } from "@/lib/content";
import { isAdminRequest } from "@/lib/adminAuth";

// A template (not a layout) on purpose: layouts persist across client-side
// navigation and do NOT re-run their data fetching when you click a <Link>
// to another page — only on a hard reload. That was the actual bug behind
// "only a few images update" — overrides were fetched once per browser
// session (in the old layout.tsx placement) and then silently stale for
// every page visited afterward via client-side nav. Templates re-mount
// (and thus re-fetch) on every navigation, so this can't go stale.
export const dynamic = "force-dynamic";
// getOverrides reads from MongoDB (a TCP connection,
// not fetch()), so Next.js's fetch-based Data Cache doesn't apply; keeping
// `force-no-store` guards against caching surprises if a future data
// source goes through fetch().
export const fetchCache = "force-no-store";

export default async function Template({ children }: { children: React.ReactNode }) {
  // Admins always read fresh so their own edits show immediately; visitors
  // get the briefly cached copy (see getOverrides in lib/content.ts).
  const { text, images } = await getOverrides({ fresh: await isAdminRequest() });

  return (
    <OverridesProvider text={text} images={images}>
      {children}
    </OverridesProvider>
  );
}
