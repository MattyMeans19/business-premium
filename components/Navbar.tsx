"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
  }, [drawerOpen]);

  const navLinks = (
    <>
      <Link href="/" className="NavItem" onClick={() => setDrawerOpen(false)}>
        Home
      </Link>
      <Link href="/products" className="NavItem" onClick={() => setDrawerOpen(false)}>
        Products
      </Link>
      <Link href="/contact" className="NavItem" onClick={() => setDrawerOpen(false)}>
        Contact
      </Link>
      <Link href="/cart" className="NavItem relative" onClick={() => setDrawerOpen(false)}>
        🛒
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link>
    </>
  );

  return (
    <>
      <nav className="NavBar">
        <div className="NavBarLogo block">Your Logo Here</div>
        <button
          type="button"
          aria-label="Open menu"
          className="NavBarHamburger md:hidden"
          onClick={() => setDrawerOpen(true)}
        >
          <span className="NavBarHamburgerLine" />
          <span className="NavBarHamburgerLine" />
          <span className="NavBarHamburgerLine" />
        </button>
        <div className="NavBarLinks hidden md:flex">{navLinks}</div>
      </nav>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`${drawerOpen ? "NavBarDrawerBackdrop NavBarDrawerBackdropOpen" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className={`NavBarDrawer ${drawerOpen ? "NavBarDrawerOpen" : ""}`}
        aria-hidden={!drawerOpen}
      >
        <div className="NavBarDrawerHeader">
          <span className="NavBarLogo NavBarDrawerLogo">Your Logo Here</span>
          <button
            type="button"
            aria-label="Close menu"
            className="NavBarDrawerClose"
            onClick={() => setDrawerOpen(false)}
          >
            ×
          </button>
        </div>
        <div className="NavBarDrawerLinks">{navLinks}</div>
      </aside>
    </>
  );
}
