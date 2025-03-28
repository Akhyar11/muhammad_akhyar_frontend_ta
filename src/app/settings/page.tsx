import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SettingComponent from "@/components/setting";

export const metadata: Metadata = {
  title: "Settings | Sistem Health Management",
  description:
    "Settings page for managing system configurations and preferences",
};

const Settings = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />
        <SettingComponent />
      </div>
    </DefaultLayout>
  );
};

export default Settings;
