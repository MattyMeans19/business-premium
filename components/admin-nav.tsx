'use client';

import Link from "next/link";
import { Logout } from "@/app/(admin)/actions";

export default function AdminNav() {
  return (
    <nav className="flex gap-4 justify-center mb-4">
      <Link
        href="/admin-portal"
        className="px-4 py-2 bg-(--primary-color)/80 hover:bg-(--primary-color) text-white rounded"
      >
        Dashboard
      </Link>
      <Link
        href="/admin-portal/inventory"
        className="px-4 py-2 bg-(--primary-color)/80 hover:bg-(--primary-color) text-white rounded"
      >
        Inventory
      </Link>
      <button
        className="px-4 py-2 bg-(--primary-color)/80 hover:bg-(--primary-color) text-white rounded"
        onClick={() => Logout()}
      >
        Logout
      </button>
    </nav>
  );
}
