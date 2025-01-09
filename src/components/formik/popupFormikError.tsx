import React from "react";
import { FormikProps } from "formik";

interface PopupFormikErrorProps {
  formik: FormikProps<any>;
  title?: string; // Tambahkan opsi judul kustom
}

const PopupFormikError: React.FC<PopupFormikErrorProps> = ({
  formik,
  title = "Form Errors",
}) => {
  const handleClose = () => {
    // Opsi untuk hanya menyembunyikan popup tanpa menghapus error
    // (Misalnya, bisa menggunakan state tambahan untuk mengatur visibilitas popup)
    formik.setErrors({});
  };

  return (
    <>
      {formik.errors && Object.keys(formik.errors).length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="alert"
          aria-live="assertive"
        >
          <div className="rounde relative w-96 rounded bg-white shadow-lg">
            <div className="flex justify-between border-b px-6 py-4">
              <h2 className="text-lg font-bold">{title}</h2>

              <button
                className="rounded bg-red-500 px-2 py-1 text-white"
                onClick={handleClose}
                aria-label="Close"
              >
                Close
              </button>
            </div>
            <div className="px-8 py-4">
              <ul className="list-disc pl-5">
                {Object.keys(formik.errors).map((key) => (
                  <li key={key} className="mb-1">
                    {String(formik.errors[key])}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupFormikError;
