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
    const client = new MongoClient(uri);
    globalForMongo._mongoClientPromise = client.connect();
  }
  return globalForMongo._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db();
}
