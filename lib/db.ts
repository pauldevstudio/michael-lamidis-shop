/**
 * Mongoose connection helper — gracefully skips if MONGODB_URI is not set
 * so local dev without a database still works via the JSON file fallback.
 */
import dns from "node:dns";
import mongoose from "mongoose";

// Atlas SRV records time out on Windows' default IPv6 resolver. Force public
// DNS so local dev can reach the cluster. No-op on Linux (Vercel runtime).
if (process.platform === "win32") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache =
  global._mongooseCache ?? (global._mongooseCache = { conn: null, promise: null });

export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null; // fall back to local JSON

  // 1 = connected. Anything else (0 disconnected, 2 connecting, 3 disconnecting)
  // means the cached connection is unusable — drop it and reconnect.
  const ready = cache.conn?.connection?.readyState;
  if (cache.conn && ready === 1) return cache.conn;
  if (cache.conn && ready !== 1) {
    cache.conn = null;
    cache.promise = null;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 8000 })
      .catch((err) => {
        // Clear the rejected promise so the next call retries instead of
        // awaiting the same rejection forever.
        cache.promise = null;
        throw err;
      });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
