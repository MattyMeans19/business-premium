'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '@/lib/cart-context'; // Adjust path to your context file

export default function ClearCartOnSuccess() {
  const { clearCart } = useCart();
  const cleared = useRef(false);

  useEffect(() => {
    // We use a ref to ensure this only runs once even in React Strict Mode
    if (!cleared.current) {
      clearCart();
      cleared.current = true;
    }
  }, [clearCart]);

  // This component doesn't need to render anything visible
  return null;
}