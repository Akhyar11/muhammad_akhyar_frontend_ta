import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import RiwayatComponent from "@/components/Riwayat";

export const metadata: Metadata = {
  title: "BMI Sistem - Riwayat",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Page() {
  return (
    <DefaultLayout>
      <RiwayatComponent />
    </DefaultLayout>
  );
}
