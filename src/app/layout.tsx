"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect } from "react";
import useAuth from "@/store/auth/auth.hook";
import { useRouter } from "next/navigation";
import useUser from "@/store/user/user.hook";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // get token from local storage
  const { initAuth } = useAuth();
  const { me } = useUser();
  const router = useRouter();

  useEffect(() => {
    initAuth();

    // get path from url
    const path = window.location.pathname;
    const token = localStorage.getItem("token");

    // apply check token if path is not signin or register
    const allowedPaths = ["/auth/signin", "/auth/register"];
    if (!allowedPaths.includes(path))
      if (!token) router.push("/auth/signin");
      else me(token);
  }, []);
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">{children}</div>
      </body>
    </html>
  );
}
