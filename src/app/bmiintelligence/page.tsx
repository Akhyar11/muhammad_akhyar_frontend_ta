import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ChatCard from "@/components/Chat/ChatCard";

export const metadata: Metadata = {
  title: "BMI Sistem - BMI Intelligence",
  description:
    "BMI Intelligence - AI-powered chat interface for BMI System analysis and insights",
};

export default function Page() {
  return (
    <DefaultLayout>
      <ChatCard />
    </DefaultLayout>
  );
}
