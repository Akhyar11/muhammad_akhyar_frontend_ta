import useProfil from "@/store/profil/profil.hook";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import PopupFormikError from "../formik/popupFormikError";
import PopupFormikDelete from "../formik/popupFormikDelate";
import PopupStatus from "../alerts/popupStatus";
import { useUser } from "@/store/user.store";
import ButtonProgres from "../button/button.progres";

// Validation schema using yup
const validationSchema = yup.object().shape({
  avatar: yup
    .mixed()
    .required("A file is required")
    .test(
      "fileSize",
      "File too large",
      (value) => value && (value as File).size <= 800 * 800,
    )
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) =>
        value &&
        ["image/jpg", "image/jpeg", "image/png", "image/gif"].includes(
          (value as File).type,
        ),
    ),
});

function ImageFormComp() {
  const [userAvatarUrl, setAvatarUrl] = useState<any>(undefined);
  const [isDelete, setDelete] = useState(false);
  const { profil, deleteAvatar, status, error, updatePicture } = useProfil();
  const { getUser, me } = useUser();
  const user = getUser();

  const [showPopup, setShowPopup] = useState(false);
  const [popupStatus, setPopupStatus] = useState<"success" | "error">(
    "success",
  );

  const [popupMessage, setPopupMessage] = useState("");
  const [loadingPicture, setLoadingPicture] = useState(false);

  // Fungsi untuk memunculkan popup
  const triggerPopup = (status: "success" | "error", message: string) => {
    setPopupStatus(status);
    setPopupMessage(message);
    setShowPopup(true);
  };

  // Fungsi untuk menutup popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      avatar: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (user) {
        setLoadingPicture(true);
        const formData = new FormData();
        formData.append("picture", values.avatar as any);
        await updatePicture(user.id, formData, () => {
          triggerPopup("success", "Profile picture uploaded successfully.");
          formik.resetForm();
        });

        await me();
        setLoadingPicture(false);
      }
    },
  });

  useEffect(() => {
    if (profil && profil.avatarUrl !== "") {
      setAvatarUrl(profil.avatarUrl);
    } else {
      setAvatarUrl(undefined);
    }
  }, [profil]);

  useEffect(() => {
    if (status === "failed") {
      triggerPopup("error", error);
    }
  }, [error, status]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4 flex gap-3">
          <div className="h-14 w-14 rounded-full">
            {user && (
              <Image
                src={user.avatarUrl}
                onError={(e) =>
                  ((e.target as any).src = "/images/icon/icon-user-man.jpg")
                }
                onLoad={(e) => {
                  (e.target as any).src = "/images/loading-image.svg";
                }}
                width={55}
                height={55}
                alt="User"
                className="rounded-full"
              />
            )}
          </div>
          <div>
            <span className="mb-1.5 text-black dark:text-white">
              Edit your photo
            </span>
            <span className="flex gap-2.5">
              <button
                className="text-sm hover:text-primary"
                onClick={() => setDelete(true)}
                type="button"
              >
                Delete
              </button>
            </span>
          </div>
        </div>

        <div
          id="FileUpload"
          className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
        >
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) {
                formik.setFieldValue("avatar", file);
              }
            }}
            className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
          />
          {formik.values.avatar ? (
            <div className="flex flex-col items-center justify-center space-y-3">
              <img
                src={URL.createObjectURL(formik.values.avatar)}
                alt="Preview"
                className="h-64 border border-stroke bg-white dark:border-strokedark dark:bg-boxdark"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                    fill="#3C50E0"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                    fill="#3C50E0"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                    fill="#3C50E0"
                  />
                </svg>
              </span>
              <p>
                <span className="text-primary">Click to upload</span> or drag
                and drop
              </p>
              <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
              <p>(max, 800 X 800px)</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4.5">
          <button
            className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            type="button"
            onClick={() => {
              formik.resetForm();
              if (profil) setAvatarUrl(profil.avatarUrl);
            }}
          >
            Cancel
          </button>
          <ButtonProgres
            label="Save"
            model="success"
            type="submit"
            open={loadingPicture}
            disabled={loadingPicture}
          />
        </div>
      </form>

      <PopupFormikError formik={formik} title="Image Form" />
      {isDelete && (
        <PopupFormikDelete
          onDelete={() => {
            deleteAvatar(() => {
              triggerPopup("success", "Success delete photo");
              setDelete(false);
            });
          }}
          onCancel={() => setDelete(false)}
          name="photo"
        />
      )}

      {showPopup && (
        <PopupStatus
          status={popupStatus}
          message={popupMessage}
          onClose={closePopup}
        />
      )}
    </>
  );
}

export default function ImageForm() {
  return (
    <div className="col-span-5 xl:col-span-2">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Your Photo</h3>
        </div>
        <div className="p-7">
          <ImageFormComp />
        </div>
      </div>
    </div>
  );
}
