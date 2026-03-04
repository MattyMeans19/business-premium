import Stripe from "stripe";
import { LogOrder, decrementProductCounts } from "@/app/(webfront)/actions";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import ClearCartOnSuccess from "@/components/clear-cart-on-success";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const params = await searchParams;
  
  if (!params.session_id) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p>Missing session ID. Please contact support.</p>
      </div>
    );
  }

  const session = await stripe.checkout.sessions.retrieve(params.session_id, {
    expand: ['line_items', 'line_items.data.price.product'],
    });

  const name = session.customer_details?.name;
  const phone = session.customer_details?.phone;
  const email = session.customer_details?.email;
  const items = session.line_items?.data;
  const taxAmount = session.total_details?.amount_tax || 0;
  const subtotal = session.amount_subtotal || 0;
  const total = session.amount_total || 0;

  // Save order to database and update inventory
  let orderSaved = false;
  if (name && email && items) {
    const orderItems = items.map((item) => ({
      name: item.description || "Unknown Product",
      quantity: item.quantity || 0,
      price: (item.amount_total || 0) / 100 / (item.quantity || 1), // Calculate unit price
    }));

    const result = await LogOrder(
      name,
      email,
      phone || undefined,
      subtotal / 100,
      taxAmount / 100,
      total / 100,
      orderItems,
      params.session_id,
    );
    orderSaved = result?.success || false;
    
    if (orderSaved) {
      // Look up product IDs by name and decrement counts
      const productDecrements = await Promise.all(
        items.map(async (item) => {
          const productName = item.description || "Unknown Product";
          const productResult = await db
            .select()
            .from(products)
            .where(eq(products.name, productName))
            .limit(1)
            .catch(() => []);
          
          const product = productResult?.[0];
          return {
            productId: product?.id || 0,
            quantity: item.quantity || 0,
          };
        })
      );

      const validDecrements = productDecrements.filter(item => item.productId > 0);
      if (validDecrements.length > 0) {
        await decrementProductCounts(validDecrements);
      }
    } else {
      console.error("Failed to save order:", result?.message);
    }
  }

  return (
    <div className="grow p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">✓ Order Confirmed!</h1>
          <p className="text-lg text-gray-600">Thank you for your purchase, {name}.</p>
          {!orderSaved && <p className="text-orange-600 mt-2">⚠️ Note: Order details are being processed. You'll receive a confirmation email shortly.</p>}
        </div>

        {/* Order Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{email}</p>
            </div>
            {phone && (
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <h2 className="text-2xl font-semibold mb-4">Items Ordered</h2>
        <div className="border rounded-lg divide-y mb-8">
          {items?.map((item) => (
            <div key={item.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-medium text-lg">{item.description}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">${((item.amount_total || 0) / 100 / (item.quantity || 1)).toFixed(2)} each</p>
                <p className="font-semibold text-lg">${((item.amount_total || 0) / 100).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-gray-600">Subtotal</p>
              <p className="font-medium">${(subtotal / 100).toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Tax</p>
              <p className="font-medium">${(taxAmount / 100).toFixed(2)}</p>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <p className="text-lg font-bold">Total</p>
              <p className="text-lg font-bold">${(total / 100).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold mb-2">What's Next?</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ A confirmation email has been sent to <strong>{email}</strong></li>
          </ul>
        </div>
      </div>

      {orderSaved && <ClearCartOnSuccess />}
    </div>
  );
}