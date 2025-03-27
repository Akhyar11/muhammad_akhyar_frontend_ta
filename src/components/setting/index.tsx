"use client";
import useProfil from "@/store/profil/profil.hook";
import { useEffect } from "react";
import ImageForm from "./imageForm";
import { useState } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import calculateAge from "@/utils/calculate.age";
import * as yup from "yup";
import { useFormik } from "formik";
import PopupStatus from "../alerts/popupStatus";
import { Loader2 } from "lucide-react";
import { useUser } from "@/store/user.store";
import QRCodeGenerator from "./qrCode";
import { saveToLocalStorage } from "@/utils/utils";
import { axiosInstance } from "@/utils/axios.config";

interface PersonalInformation {
  nama_lengkap: string;
  tanggal_lahir: string;
  username: string;
  jenis_kelamin: boolean;
}

const validationSchema = yup.object().shape({
  nama_lengkap: yup.string().required("Nama lengkap is required"),
  tanggal_lahir: yup.date().required("Tanggal lahir is required"),
  username: yup.string().required("Username is required"),
  jenis_kelamin: yup.boolean().required("Jenis kelamin is required"),
});

const validationSchemaUbahPassword = yup.object().shape({
  password_lama: yup.string().required("Password is required"),
  password_baru: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  konfirmasi_password: yup
    .string()
    .oneOf([yup.ref("password_baru"), undefined], "Passwords must match")
    .required("Konfirmasi password is required"),
});

export default function SettingComponent() {
  const [date, setDate] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [umur, setUmur] = useState<any>("");
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const { updateProfil, status: profilStatus } = useProfil();
  const { updateUser, error: userError, resetError, getUser } = useUser();
  const user = getUser();

  const [showPopup, setShowPopup] = useState(false);
  const [popupStatus, setPopupStatus] = useState<"success" | "error">(
    "success",
  );
  const [popupMessage, setPopupMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      nama_lengkap: user.nama_lengkap || "",
      tanggal_lahir: user.tgl_lahir || "",
      username: user.username || "",
      jenis_kelamin: user.jk,
      password: "",
      konfirmasi_password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmittingProfile(true);
      try {
        const body = {
          username: values.username,
          jk: values.jenis_kelamin,
          tgl_lahir: values.tanggal_lahir,
        };

        if (user) {
          await updateUser(user.id, body);
          await updateProfil(user.id, { nama_lengkap: values.nama_lengkap });

          const newUserData = {
            ...user,
            ...body,
            nama_lengkap: values.nama_lengkap,
          };

          saveToLocalStorage("user_bmi_sistem", newUserData);
        }
      } catch (error) {
        triggerPopup("error", "Failed to update profile");
      } finally {
        setIsSubmittingProfile(false);
      }
    },
  });

  const formikUbahPassword = useFormik({
    initialValues: {
      password_lama: "",
      password_baru: "",
      konfirmasi_password: "",
    },
    validationSchema: validationSchemaUbahPassword,
    onSubmit: async (values) => {
      setIsSubmittingPassword(true);
      try {
        await axiosInstance.put("/users/" + user.id + "/password", values, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        formikUbahPassword.resetForm();
        triggerPopup("success", "Success to update password");
      } catch (error) {
        triggerPopup("error", "Failed to update password");
      } finally {
        setIsSubmittingPassword(false);
      }
    },
  });

  const triggerPopup = (status: "success" | "error", message: string) => {
    setPopupStatus(status);
    setPopupMessage(message);
    setShowPopup(true);
    if (status === "success") {
      setTimeout(() => {
        closePopup();
      }, 3000);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    if (date?.startDate) {
      const value = date.startDate.toDateString();
      setUmur(calculateAge(value));
    }
  }, [date]);

  useEffect(() => {
    if (user) {
      setUmur(calculateAge(user.tgl_lahir));
      setDate({
        startDate: new Date(user.tgl_lahir),
        endDate: new Date(user.tgl_lahir),
      });
    }
  }, []);

  useEffect(() => {
    if (profilStatus === "succeeded") {
      triggerPopup("success", "Profile updated successfully");
    }
  }, [profilStatus]);

  return (
    <>
      <div className="mt-8 grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="col-span-5 mb-8 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                fill=""
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="nama_lengkap"
                          id="nama_lengkap"
                          placeholder="Nama Lengkap"
                          value={formik.values.nama_lengkap}
                          onChange={formik.handleChange}
                        />
                      </div>
                      {formik.touched.nama_lengkap &&
                      formik.errors.nama_lengkap ? (
                        <div className="text-sm text-red-500">
                          {formik.errors.nama_lengkap}
                        </div>
                      ) : null}
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="username"
                      >
                        Username login
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username Login"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.username && formik.errors.username ? (
                        <div className="text-sm text-red-500">
                          {formik.errors.username}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="emailAddress"
                      >
                        Tanggal Lahir
                      </label>
                      <Datepicker
                        useRange={false}
                        asSingle={true}
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        placeholder="Tanggal Lahir"
                        maxDate={new Date()}
                        inputClassName="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                      {formik.touched.tanggal_lahir &&
                      formik.errors.tanggal_lahir ? (
                        <div className="text-sm text-red-500">
                          {formik.errors.tanggal_lahir}
                        </div>
                      ) : null}
                    </div>

                    <div className="sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Umur
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="umur"
                        id="umur"
                        placeholder="Umur"
                        disabled
                        value={umur}
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="jk"
                    >
                      Jenis Kelamin
                    </label>
                    <select
                      name="jk"
                      id="jk"
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      onChange={(e) =>
                        formik.setFieldValue(
                          "jenis_kelamin",
                          e.target.value === "Laki-Laki",
                        )
                      }
                      value={
                        formik.values.jenis_kelamin ? "Laki-Laki" : "Perempuan"
                      }
                    >
                      <option value="Laki-Laki">Laki-Laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                    {formik.touched.jenis_kelamin &&
                    formik.errors.jenis_kelamin ? (
                      <div className="text-sm text-red-500">
                        {formik.errors.jenis_kelamin}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 disabled:opacity-70 dark:border-strokedark dark:text-white"
                      type="button"
                      disabled={isSubmittingProfile}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:opacity-70"
                      type="submit"
                      disabled={isSubmittingProfile}
                    >
                      {isSubmittingProfile ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Ubah Password
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={formikUbahPassword.handleSubmit}>
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="password_lama"
                    >
                      Password Lama
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="password"
                      name="password_lama"
                      id="password_lama"
                      placeholder="Password Lama"
                      value={formikUbahPassword.values.password_lama}
                      onChange={formikUbahPassword.handleChange}
                    />
                    {formikUbahPassword.touched.password_lama &&
                    formikUbahPassword.errors.password_lama ? (
                      <div className="text-sm text-red-500">
                        {formikUbahPassword.errors.password_lama}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="password_baru"
                    >
                      Password Baru
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="password"
                      name="password_baru"
                      id="password_baru"
                      placeholder="Password Baru"
                      value={formikUbahPassword.values.password_baru}
                      onChange={formikUbahPassword.handleChange}
                    />
                    {formikUbahPassword.touched.password_baru &&
                    formikUbahPassword.errors.password_baru ? (
                      <div className="text-sm text-red-500">
                        {formikUbahPassword.errors.password_baru}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="konfirmasi_password"
                    >
                      Konfirmasi Password Baru
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="password"
                      name="konfirmasi_password"
                      id="konfirmasi_password"
                      placeholder="Konfirmasi Password"
                      value={formikUbahPassword.values.konfirmasi_password}
                      onChange={formikUbahPassword.handleChange}
                    />
                    {formikUbahPassword.touched.konfirmasi_password &&
                    formikUbahPassword.errors.konfirmasi_password ? (
                      <div className="text-sm text-red-500">
                        {formikUbahPassword.errors.konfirmasi_password}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 disabled:opacity-70 dark:border-strokedark dark:text-white"
                      type="button"
                      disabled={isSubmittingPassword}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:opacity-70"
                      type="submit"
                      disabled={isSubmittingPassword}
                    >
                      {isSubmittingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-5 xl:col-span-2">
          <ImageForm />
          <QRCodeGenerator />
        </div>
      </div>

      {showPopup && (
        <PopupStatus
          status={popupStatus}
          message={popupMessage}
          onClose={closePopup}
        />
      )}

      {/* get data error */}
      {userError.read && (
        <PopupStatus
          status={"error"}
          message={userError.read}
          onClose={resetError}
        />
      )}
    </>
  );
}
