import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // 1. Where your schema definitions live
  schema: "./db/schema.ts",
  // 2. Where the SQL migration files will be saved
  out: "./drizzle",
  // 3. The database engine
  dialect: "postgresql",
  // 4. Connection details (reads from your .env file)
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: ['business_premium_*']
});