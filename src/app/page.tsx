import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DashboardComponent from "@/components/Dashboard";

export const metadata: Metadata = {
  title:
    "BMI Sistem - Dashboard",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <DashboardComponent />
      </DefaultLayout>
    </>
  );
}
