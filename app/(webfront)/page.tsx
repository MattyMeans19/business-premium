import { db } from "@/db";
import { CustomMessage } from "@/db/schema";
import Link from "next/link";

export default async function Home() {
  const customMessage = await db.select().from(CustomMessage);

  return (
    <div className="container grow grid w-full gap-8 p-6 md:grid-cols-2 md:gap-10">
      <section className="flex flex-col items-center place-content-center text-center gap-6">
        <h1 className="text-4xl font-bold text-black">Welcome to our website</h1>
        <p className="text-xl text-black">
          We are a company that sells products to our customers.
        </p>
        <Link href="/products" className="text-blue-500 underline text-4xl">
          View our products
        </Link>
        <div className="mt-10 bg-slate-300 shadow-lg shadow-black/50 rounded-full p-6 w-full">
          <p className="text-4xl">{customMessage[0]?.message}</p>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm flex flex-col gap-5">
        <h2 className="mb-4 text-2xl font-semibold text-black text-center">
          About our business
        </h2>
        <div className="aspect-4/3 bg-slate-200 rounded-lg flex items-center justify-center text-4xl border p-4">
          Photo of business can go here!
        </div>
        <p className="text-black/90 text-3xl text-center">
          We deliver quality products and exceptional service. Our team is
          dedicated to meeting your needs and building lasting relationships
          with our customers.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-6 h-fit shadow-sm col-span-full">
        <p className="text-black/90 text-center text-3xl">Located at: Business Address goes here.</p>
      </section>
    </div>
  );
}
