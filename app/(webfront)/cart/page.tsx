import CartPage from "@/components/cart-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | Business Name",
  description: "View and manage your shopping cart",
};

export default function Cart() {
  return <CartPage />;
}
