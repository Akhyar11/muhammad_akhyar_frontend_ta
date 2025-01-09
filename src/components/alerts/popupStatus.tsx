import React, { useEffect } from "react";

interface PopupStatusProps {
  message: string;
  status: "success" | "error"; // Status untuk menentukan warna pesan
  onClose: () => void; // Callback untuk menutup popup setelah waktu tertentu
}

const PopupStatus: React.FC<PopupStatusProps> = ({
  message,
  status,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Menutup popup setelah 3 detik
    }, 3000);

    return () => clearTimeout(timer); // Bersihkan timer jika komponen di-unmount
  }, [onClose]);

  const statusColors = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
  };

  const statusIcons = {
    success: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mb-2 h-8 w-8 text-white"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mb-2 h-8 w-8 text-white"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div
        className={`w-96 rounded p-4 shadow-md ${
          statusColors[status]
        } text-center`}
      >
        {statusIcons[status]}
        <p className="text-lg font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default PopupStatus;
