"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect } from "react";
import { useUser } from "@/store/user.store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // get token from local storage
  const { me } = useUser();

  useEffect(() => {
    me();
  }, [me]);
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">{children}</div>
      </body>
    </html>
  );
}
