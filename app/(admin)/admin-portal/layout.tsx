import React from "react";

export const metadata = {
  title: "Business Admin Portal",
};

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full px-6 max-h-screen flex flex-col gap-10">
      {children}
    </div>
  );
}
