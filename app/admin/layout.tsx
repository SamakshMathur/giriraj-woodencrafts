// The admin pages are client components, which can't declare their own
// rendering mode. The shared template reads the admin cookie on every
// request, so without this the admin pages were treated as static and
// crashed in production with DYNAMIC_SERVER_USAGE.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
