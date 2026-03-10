import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// This ensures we don't create a new pool every time Next.js hot-reloads
const globalForDb = global as unknown as { pool: Pool };

const pool = globalForDb.pool || new Pool({
  connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" 
    ? { rejectUnauthorized: false } 
    : false,
});

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export const db = drizzle(pool, { schema });