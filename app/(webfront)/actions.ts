"use server";

import { CartItem } from "@/lib/definitions";
import Stripe from "stripe";
import { db } from "@/db";
import { Orders, OrderItems, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function verifyProductAvailability(items: CartItem[]): Promise<{ available: boolean; message?: string }> {
  try {
    for (const item of items) {
      const product = await db.select().from(products).where(eq(products.id, item.id)).limit(1);
      
      if (!product || product[0].count === 0) {
        return { available: false, message: `Product "${item.name}" is no longer available` };
      }

      if (product[0].count < item.quantity) {
        return { available: false, message: `Only ${product[0].count} of "${item.name}" available (you requested ${item.quantity})` };
      }
    }

    return { available: true };
  } catch (error) {
    console.error("Error verifying product availability:", error);
    return { available: false, message: "Could not verify product availability" };
  }
}

export async function decrementProductCounts(items: Array<{ productId: number; quantity: number }>): Promise<boolean> {
  try {
    for (const item of items) {
      await db
        .update(products)
        .set({ count: sql`${products.count} - ${item.quantity}` })
        .where(eq(products.id, item.productId));
    }
    return true;
  } catch (error) {
    console.error("Error decrementing product counts:", error);
    return false;
  }
}

export async function createCheckoutSession(items: CartItem[]) {
  
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    automatic_tax: { enabled: true },
    phone_number_collection: {
      enabled: true,
    },
    billing_address_collection: 'required',
    line_items: items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: item.price * 100,
        tax_behavior: 'exclusive', // Stripe uses cents
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    // For your receipt logic, we pass the session ID back to your success page
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  });

  return { clientSecret: session.client_secret };
}

export async function LogOrder(
  customerName: string,
  customerEmail: string,
  customerPhone: string | undefined,
  subtotal: number,
  taxAmount: number,
  totalAmount: number,
  items: Array<{ name: string; quantity: number; price: number }>,
  orderNumber: string
) {
  try {
    const existing = await db
      .select()
      .from(Orders)
      .where(eq(Orders.orderNumber, orderNumber)) // Use whatever your property name is
      .limit(1);

    if (existing.length > 0) {
      // Order already exists! Return success so the UI knows it's okay.
      return { success: true, message: "Order already logged" };
    }
    // Insert the order
    const orderResult = await db.insert(Orders).values({
      customerName,
      customerEmail,
      customerPhone: customerPhone || null,
      subtotal,
      taxAmount,
      totalAmount,
      status: 'pending',
      orderNumber,
    }).returning({ id: Orders.id });

    console.log("Order inserted:", orderResult);

    const orderId = orderResult[0]?.id;

    if (!orderId) {
      console.error("Failed to get order ID from result");
      return { success: false, message: "Failed to create order" };
    }

    console.log("Order created with ID:", orderId);

    // Insert order items
    const itemsToInsert = items.map((item) => ({
      orderId,
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.price * item.quantity,
    }));

    console.log("Inserting order items:", itemsToInsert);

    const itemsResult = await db.insert(OrderItems).values(itemsToInsert);

    console.log("Order items inserted successfully");

    return { success: true, message: "Order saved successfully", orderId };
  } catch (error) {
    console.error("Error saving order:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return { success: false, message: `Failed to save order: ${error instanceof Error ? error.message : String(error)}` };
  }
}