import 'dotenv/config'; // Crucial for your DB URL
import { db } from '@/db'; // Your drizzle connection
import { products, AdminCredentials, CustomMessage } from '@/db/schema'; 
import * as fs from 'fs';

async function seedData() {
  console.log("Reading data from file...");

  // 1. Read and parse the JSON file
  const rawData = fs.readFileSync('./data-backup.json', 'utf-8');
  const data = JSON.parse(rawData);

  console.log(`Found ${data.length} items. Starting seed...`);

  // 2. Insert into Database
  // Using .onConflictDoUpdate ensures we don't crash on duplicate IDs
  for (const item of data.products) {
    await db.insert(products)
      .values(item)
      .onConflictDoUpdate({
        target: products.id,
        set: item,
      });
  }

  for (const item of data.adminCredentials) {
    await db.insert(AdminCredentials)
      .values(item)
      .onConflictDoUpdate({
        target: AdminCredentials.id,
        set: item,
      });
  }

  for (const item of data.customMessages) {
    await db.insert(CustomMessage)
      .values(item)
      .onConflictDoUpdate({
        target: CustomMessage.id,
        set: item,
      });
  }

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

seedData().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});