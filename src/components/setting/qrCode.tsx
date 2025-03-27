"use client";
import { QRCodeSVG } from "qrcode.react";
import { useUser } from "@/store/user.store";

export default function QRCodeGenerator() {
  const { getUser } = useUser();
  const user = getUser();
  return (
    <div className="col-span-5 mt-8 xl:col-span-2">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Your QR Code
          </h3>
        </div>
        <div className="flex items-center justify-center p-7">
          {user.id && <QRCodeSVG value={user.id} size={200} />}
        </div>
      </div>
    </div>
  );
}
