"use client";

import { useCart } from "@/lib/cart-context"; 
import { createCheckoutSession, verifyProductAvailability } from "@/app/(webfront)/actions";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useCallback, useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutForm() {
  // Use 'items' because that's what your CartContextType defines
  const { items } = useCart();
  const [error, setError] = useState<string | null>(null);

  const fetchClientSecret = useCallback(async () => {
    setError(null);
    
    // 1. Validate that we actually have items
    if (!items || items.length === 0) {
      throw new Error("Your cart is empty. Please add an appliance before checking out.");
    }

    // 2. Verify all products are still available
    const availability = await verifyProductAvailability(items);
    if (!availability.available) {
      const errorMsg = availability.message || "Some items in your cart are no longer available.";
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    // 3. Pass the 'items' array from your context to the Server Action
    const res = await createCheckoutSession(items);
    
    if (!res?.clientSecret) {
      throw new Error("Could not initialize payment session.");
    }

    return res.clientSecret;
  }, [items]);

    if (!items || items.length === 0) {
    return (
      <div className="grow p-10 text-center place-content-center text-(--secondary-color) animate-pulse text-4xl border rounded-xl">
        <p>Loading your secure checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grow p-10 text-center place-content-center border rounded-xl bg-red-50">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Checkout Error</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <p className="text-gray-600 text-sm">Please review your cart and try again.</p>
        </div>
      </div>
    );
  }

  const options = { fetchClientSecret };

  return (
    <div id="checkout" className="grow place-content-center w-full border rounded-xl bg-slate-50 p-2">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}