import { MongoClient, type Db } from "mongodb";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// family: 4 forces IPv4 resolution. Without it, Node tries IPv6 first
// against Atlas's *.mongodb.net hosts, which surfaced as a confusing
// TLS-layer failure ("tlsv1 alert internal error" / SSL alert 80).
// serverSelectionTimeoutMS: fail after 5s instead of the driver's default
// 30s. Every page reads admin overrides through here, so with the default
// a database outage made every page hang for 30 seconds before falling
// back to default content.
const CLIENT_OPTIONS = { family: 4 as const, serverSelectionTimeoutMS: 5000 };

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  return uri;
}

/** True when running inside Cloudflare Workers (the OpenNext build). */
const isCloudflareWorkers =
  typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

// --- Cloudflare Workers -----------------------------------------------
// Workers forbid reusing a socket opened by one request in a later
// request: the later request waits forever and the runtime cancels it.
// So on Workers, each request gets its own client, shared only between
// the lookups of that one request (keyed by the request's context object).
const clientsByRequest = new WeakMap<object, Promise<MongoClient>>();

function getRequestClient(): Promise<MongoClient> {
  const { ctx } = getCloudflareContext();
  let promise = clientsByRequest.get(ctx);
  if (!promise) {
    promise = new MongoClient(getUri(), CLIENT_OPTIONS).connect();
    clientsByRequest.set(ctx, promise);
  }
  return promise;
}

// --- Node (Vercel, `next start`, `next dev`) -------------------------
// Serverless functions are reused ("warm") across requests, and each
// MongoClient opens its own connection pool, so the client is cached for
// the life of the process. The connect() promise itself is cached so
// concurrent requests during a cold start share one connection attempt.
const globalForMongo = global as unknown as { _mongoClientPromise?: Promise<MongoClient> };

function getSharedClient(): Promise<MongoClient> {
  if (!globalForMongo._mongoClientPromise) {
    const client = new MongoClient(getUri(), CLIENT_OPTIONS);
    // If connecting fails (e.g. the Atlas cluster is paused), forget the
    // failed attempt so the next request tries again instead of reusing
    // the rejected promise forever.
    globalForMongo._mongoClientPromise = client.connect().catch((err) => {
      globalForMongo._mongoClientPromise = undefined;
      throw err;
    });
  }
  return globalForMongo._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await (isCloudflareWorkers ? getRequestClient() : getSharedClient());
  return client.db();
}
