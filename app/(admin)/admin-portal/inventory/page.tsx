import AdminInventory from "@/components/admin-inventory";
import { db } from "@/db";
import { products } from "@/db/schema";
import { asc } from "drizzle-orm";


export default async function InventoryPage() {
  const inventory = await db.select().from(products).orderBy(asc(products.id));

  return (
    <div className="w-full px-6 max-h-screen flex flex-col gap-10">
      <h1 className="text-3xl md:text-5xl font-bold text-center w-full border-b-10 
        border-double rounded-3xl border-(--primary-color) pb-5 shadow-xl shadow-slate-600/50">
        Inventory Management
      </h1>
      <AdminInventory inventory={inventory} />
    </div>
  );
}
