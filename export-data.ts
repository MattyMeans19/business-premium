import 'dotenv/config';
import { db } from '@/db'; // Your drizzle connection
import { products, AdminCredentials, CustomMessage } from '@/db/schema'; // Your appliances table
import * as fs from 'fs';

async function exportData() {
  console.log("Pulling data from DB...");
  
  // 1. Fetch all records
  const allProducts = await db.select().from(products);
  const allAdminCredentials = await db.select().from(AdminCredentials);
  const allCustomMessages = await db.select().from(CustomMessage);

  // 2. Convert to JSON string
  const data = JSON.stringify({
    products: allProducts,
    adminCredentials: allAdminCredentials,
    customMessages: allCustomMessages
  }, null, 2);

  // 3. Save to a file in your project
  fs.writeFileSync('./data-backup.json', data);

  console.log("Done! Data saved to data-backup.json");
  process.exit(0);
}

exportData();