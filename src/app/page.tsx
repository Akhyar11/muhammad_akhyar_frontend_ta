import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DashboardComponent from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "BMI Sistem - Dashboard",
  description:
    "BMI System - Your Body Mass Index Calculator and Health Monitoring Dashboard",
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
