'use client';

import { useState } from "react";
import InventoryManagement from "./inventory-management";
import NewProduct from "./new-product";
import AdminNav from "@/components/admin-nav";


interface AdminInventoryProps {
  inventory: any[];
}

export default function AdminInventory({ inventory }: AdminInventoryProps) {
  const [addInventory, setAddInventory] = useState(false);

  return (
    <div className="w-full h-full md:px-6 py-2 max-h-screen flex flex-col gap-10 relative">
        <AdminNav />
        <div className="ConsoleBox h-full col-span-full max-h-fit overflow-y-clip">
        <button
            className="bg-(--primary-color)/75 hover:bg-(--primary-color) text-white px-4 py-2 rounded-md w-full self-center"
            onClick={() => setAddInventory(true)}
        >
            Add New Inventory Item
        </button>
        <InventoryManagement inventory={inventory} />

        {addInventory && (
            <div className="fixed inset-0 w-full h-full bg-black/40 bg-opacity-50 flex items-center justify-center z-50 text-2xl">
            <NewProduct viewModal={addInventory} toggleAddInventory={setAddInventory} />
            </div>
        )}
        </div>
    </div>
  );
}
