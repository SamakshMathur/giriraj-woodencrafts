import { getDb } from "./db";

const COLLECTION = "rateLimits";

type RateLimitDoc = { _id: string; count: number; expiresAt: Date };

// The TTL index makes MongoDB delete expired counters by itself. Creating
// it is idempotent; the flag just avoids repeating the call in a warm
// instance.
let indexReady = false;

/**
 * Counts one attempt for `key` in the current fixed time window and says
 * whether it is still within `limit`. Counters live in MongoDB because
 * Cloudflare runs the site on many separate instances that share no memory.
 */
export async function consumeRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; count: number }> {
  const db = await getDb();
  const collection = db.collection<RateLimitDoc>(COLLECTION);
  if (!indexReady) {
    await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    indexReady = true;
  }

  const windowMs = windowSeconds * 1000;
  const bucket = Math.floor(Date.now() / windowMs);
  const doc = await collection.findOneAndUpdate(
    { _id: `${key}:${bucket}` },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 1) * windowMs) } },
    { upsert: true, returnDocument: "after" }
  );
  const count = doc?.count ?? 1;
  return { allowed: count <= limit, count };
}
