"use client";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white dark:bg-boxdark">
      <div className="container">
        <div className="flex flex-col items-center justify-center px-4 text-center md:px-8 lg:px-0">
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/illustration/illustration-404.svg"
              width={400}
              height={350}
              alt="404 Illustration"
              priority
              className="dark:hidden"
            />
            <Image
              src="/images/illustration/illustration-404-dark.svg"
              width={400}
              height={350}
              alt="404 Illustration"
              priority
              className="hidden dark:block"
            />
          </div>

          <h1 className="mb-3 text-4xl font-bold text-black dark:text-white md:text-5xl">
            Page Not Found
          </h1>

          <p className="text-body-color mb-8 text-lg dark:text-bodydark">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>

          <Link
            href="/"
            className="hover:shadow-signUp rounded-md bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-opacity-80"
          >
            Back To Home
          </Link>
        </div>
      </div>
    </div>
  );
}
