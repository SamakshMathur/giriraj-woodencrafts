// Next.js calls onRequestError for any error thrown while rendering a page
// or running a route on the server. Production hides the details from the
// visitor, so each error is also saved to a small "errorLog" collection in
// MongoDB (kept for 14 days) where it can be read when something breaks.

export async function register() {}

export async function onRequestError(
  err: unknown,
  request: { path: string; method: string },
  context: { routePath?: string; routeType?: string }
) {
  const error = err instanceof Error ? err : new Error(String(err));
  console.error("Request error:", request.method, request.path, error);
  try {
    const { getDb } = await import("./lib/db");
    const db = await getDb();
    const log = db.collection("errorLog");
    await log.createIndex({ at: 1 }, { expireAfterSeconds: 14 * 24 * 60 * 60 });
    await log.insertOne({
      at: new Date(),
      method: request.method,
      path: request.path,
      route: context.routePath,
      type: context.routeType,
      message: error.message,
      stack: error.stack?.split("\n").slice(0, 15).join("\n"),
      digest: (err as { digest?: string })?.digest,
    });
  } catch {
    // Logging must never cause a second failure.
  }
}
