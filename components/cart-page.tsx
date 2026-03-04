'use client';

import { useCart } from "@/lib/cart-context";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);

  // Prevent hydration mismatch by only rendering after client-side load
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <div className="grow m-10 text-center">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="grow m-10 flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold">Shopping Cart</h1>
        <p className="text-xl text-gray-600">Your cart is empty</p>
        <Link href="/products" className="bg-(--primary-color) hover:bg-(--secondary-color) text-white font-semibold py-2 px-6 rounded">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grow m-10 flex flex-col gap-8">
      <h1 className="text-4xl font-bold">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-8 p-8 border rounded-lg shadow-md hover:shadow-lg transition"
            >
              {/* Item Image */}
              <div className="shrink-0 w-64 h-32 place-self-center">
                <CldImage
                  src={item.photo}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* Item Details */}
              <div className="grow flex flex-col justify-between gap-4 place-items-center">
                <div>
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-lg font-bold text-(--secondary-color)">${item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Item Subtotal and Remove */}
              <div className="flex flex-col items-end justify-between">
                <p className="text-lg font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="p-6 border rounded-lg shadow-md h-fit sticky top-20">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Tax:</span>
                <span>TBD</span>
              </div>
            </div>

            <div className="border-t-2 pt-4 mb-6">
              <div className="flex justify-between text-2xl font-bold">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block w-full bg-(--primary-color)/75 hover:bg-(--primary-color) text-white font-bold py-3 rounded mb-3 transition text-center">
              Proceed to Checkout
            </Link>

            <button
              onClick={() => clearCart()}
              className="w-full bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 rounded mb-3 transition"
            >
              Clear Cart
            </button>

            <Link
              href="/products"
              className="block text-center text-blue-500 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
