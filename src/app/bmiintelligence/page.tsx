import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ChatCard from "@/components/Chat/ChatCard";

export const metadata: Metadata = {
  title: "BMI Sistem - BMI Intelligence",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Page() {
  return (
    <DefaultLayout>
      <ChatCard />
    </DefaultLayout>
  );
}
