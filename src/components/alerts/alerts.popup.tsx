import { useEffect, useState } from "react";

interface AlertsProps {
  type: "success" | "warning" | "attantion";
  open: boolean;
  mainInfo: string;
  desc?: string;
}

export default function AlertPopup({
  type,
  mainInfo,
  desc,
  open,
}: AlertsProps) {
  // Create a alert popup widh tailwind-css and use 3 type into AlertsPorps, and please add animation when alert is active
  const alertStyles = {
    success: "bg-green-100 border-green-500 text-green-700",
    attantion: "bg-yellow-100 border-yellow-500 text-yellow-700",
    warning: "bg-red-100 border-red-500 text-red-700",
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) setIsVisible(true);
    if (open) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <div
      className={`fixed right-4 top-4 z-999999 border-l-4 p-4 ${alertStyles[type]} transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <strong>{mainInfo}</strong>
      {desc && <p>{desc}</p>}
    </div>
  );

  return <></>;
}
