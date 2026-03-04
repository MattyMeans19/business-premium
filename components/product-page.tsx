'use client';

import { Product } from "@/lib/definitions";
import { useCart } from "@/lib/cart-context";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useState } from "react";

interface ProductProps {
  product: Product; // Make sure this line exists!
}

export default function ProductDetails({ product }: ProductProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      photo: product.photo,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity > 0 && newQuantity <= product.count) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="grow m-10 flex flex-col items-center justify-center gap-10 relative rounded-4xl shadow-xl shadow-slate-600/20 p-10">
      <h2 className="text-5xl font-semibold mb-2">{product.name}</h2>
      <CldImage src={product.photo} alt={product.name} width={300} height={200} className="size-[50%] object-cover mb-4 rounded" />
      <p className="text-gray-600 text-3xl mb-4">{product.description}</p>
      <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
      <p className="text-lg text-gray-600">Available: {product.count} units</p>
      {product.count === 0 && (
        <span className="absolute inset-0 rounded-4xl bg-slate-700/40 text-outline-black text-center content-center text-8xl tracking-widest w-full">
          Sold Out
        </span>
      )}
      
      {product.count > 0 && (
        <div className="flex flex-col gap-4 items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              −
            </button>
            <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.count === 0}
            className="bg-(--primary-color)/75 hover:bg-(--primary-color) disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded transition"
          >
            {product.count === 0 ? "Out of Stock" : addedToCart ? "✓ Added to Cart" : "Add to Cart"}
          </button>
        </div>
      )}
      
      <p className="text-gray-600 text-2xl mt-4">
        <Link href="/contact" className="text-blue-500 hover:underline">
          Contact
        </Link> us to purchase this product or for more information. Don't miss out on this amazing deal!
      </p>
    </div>
  );
}
