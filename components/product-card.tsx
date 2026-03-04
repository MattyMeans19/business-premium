'use client'

import { CldImage } from "next-cloudinary";
import Link from "next/link";

export default function ProductCard({ name, description, price, photo, count }: { name: string, description: string, price: number, photo: string, count: number }) {
    const slug = name.replace(/\s+/g, '-');
    return (
        <Link href={"/products/" + slug}
            className="border border-(--secondary-color) rounded-lg p-4 shadow-md relative">
            <CldImage src={photo} alt={name} width={300} height={200} className="w-full h-auto object-cover mb-4 
            rounded" />
            <h2 className="text-xl font-semibold mb-2">{name}</h2>
            <p className="text-gray-600 mb-4">{description}</p>
            <p className="text-lg font-bold">${price.toFixed(2)}</p>
            {count === 0 && (
            <span className="absolute inset-0 bg-slate-700/40 
            text-red-500 text-outline-black text-center content-center text-6xl">
            Sold Out
            </span>
            )}
        </Link>
    );
}