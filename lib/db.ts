import { MongoClient, type Db } from "mongodb";

// Serverless functions can be reused ("warm") across requests, and each
// fresh MongoClient opens its own connection pool — without caching, a
// warm function would open a new pool on every invocation and eventually
// exhaust the database's connection limit. Caching the client (and the
// connect() promise, not just the client, so concurrent requests during
// a cold start all await the same connection attempt instead of racing
// to open several) is the standard pattern for Mongo + serverless.
const globalForMongo = global as unknown as { _mongoClientPromise?: Promise<MongoClient> };

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  if (!globalForMongo._mongoClientPromise) {
    // family: 4 forces IPv4 resolution. Without it, Node tries IPv6 first
    // against Atlas's *.mongodb.net hosts, which surfaced as a confusing
    // TLS-layer failure ("tlsv1 alert internal error" / SSL alert 80)
    // rather than a connectivity error — reproduced identically from two
    // different networks (this only started making sense once the same
    // error showed up from Vercel's own servers too, ruling out a local
    // network problem). This is a documented, common fix for this exact
    // symptom with MongoDB Atlas + Node.js.
    const client = new MongoClient(uri, { family: 4 });
    globalForMongo._mongoClientPromise = client.connect();
  }
  return globalForMongo._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db();
}
