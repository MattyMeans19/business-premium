import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import PageLoader from "@/components/page-loader";
import { CartProvider } from "@/lib/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Business Premium Template",
  description: "Template for premium tier business website built with Next.js and Tailwind CSS. Created by Matthew Means.",
  metadataBase: new URL('https://your-store.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col w-full min-h-screen`}
      >
        <PageLoader />
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}
