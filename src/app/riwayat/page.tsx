import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import RiwayatComponent from "@/components/Riwayat";

export const metadata: Metadata = {
  title: "BMI Sistem - Riwayat",
  description: "BMI System - History page for tracking your BMI calculations",
};

export default function Page() {
  return (
    <DefaultLayout>
      <RiwayatComponent />
    </DefaultLayout>
  );
}
