"use client";
import useProfil from "@/store/profil/profil.hook";
import useUser from "@/store/user/user.hook";
import { useEffect } from "react";
import ImageForm from "./imageForm";
import { useState } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import calculateAge from "@/utils/calculate.age";
import * as yup from "yup";
import { useFormik } from "formik";
import PopupStatus from "../alerts/popupStatus";

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
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  konfirmasi_password: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match")
    .required("Konfirmasi password is required"),
});

export default function SettingComponent() {
  const [date, setDate] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [umur, setUmur] = useState<any>("");
  const [personalInformation, setPersonalInformation] =
    useState<PersonalInformation>();

  const {
    getProfil,
    profil,
    updateProfil,
    status: profilStatus,
    error: profilError,
  } = useProfil();
  const { user, updateUser, status: userStatus, error: userError } = useUser();

  const [showPopup, setShowPopup] = useState(false);
  const [popupStatus, setPopupStatus] = useState<"success" | "error">(
    "success",
  );
  const [popupMessage, setPopupMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      nama_lengkap: personalInformation?.nama_lengkap || "",
      tanggal_lahir: personalInformation?.tanggal_lahir || "",
      username: personalInformation?.username || "",
      jenis_kelamin: personalInformation?.jenis_kelamin,
      password: "",
      konfirmasi_password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const body = {
        username: values.username,
        password: values.password,
        jk: values.jenis_kelamin,
        tgl_lahir: values.tanggal_lahir,
      };

      updateUser(body);
      updateProfil({ nama_lengkap: values.nama_lengkap });
    },
  });

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

  useEffect(() => {
    if (user && user.id) getProfil();
  }, [user?.id]);

  useEffect(() => {
    if (date?.startDate) {
      const value = date.startDate.toDateString();
      setUmur(calculateAge(value));
    }
  }, [date]);

  useEffect(() => {
    if (profilStatus === "failed") {
      triggerPopup("error", profilError);
    }

    if (userStatus === "failed") {
      triggerPopup("error", userError);
    }
  }, [profilError, userError, profilStatus, userStatus]);

  useEffect(() => {
    if (profilStatus === "succeeded" && userStatus === "succeeded") {
      triggerPopup("success", "Profil update succeeded");
    }
  }, [profilStatus, userStatus]);

  useEffect(() => {
    if (profil && profil.nama_lengkap !== "" && user && user.id !== "") {
      setPersonalInformation({
        username: user.username,
        jenis_kelamin: user.jk,
        nama_lengkap: profil.nama_lengkap,
        tanggal_lahir: user.tgl_lahir,
      });

      formik.setValues({
        nama_lengkap: profil.nama_lengkap,
        tanggal_lahir: user.tgl_lahir,
        username: user.username,
        jenis_kelamin: user.jk,
        password: "",
        konfirmasi_password: "",
      });

      setDate({
        startDate: new Date(user.tgl_lahir),
        endDate: new Date(user.tgl_lahir),
      });
    }
  }, [profil, user]);

  return (
    <>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
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
                  </div>
                  {formik.touched.username && formik.errors.username ? (
                    <div className="text-sm text-red-500">
                      {formik.errors.username}
                    </div>
                  ) : null}
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
                      inputClassName={
                        "w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      }
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

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    onChange={formik.handleChange}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-sm text-red-500">
                      {formik.errors.password}
                    </div>
                  ) : null}
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="konfirmasi_password"
                  >
                    Konfirmasi Password
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="password"
                    name="konfirmasi_password"
                    id="konfirmasi_password"
                    placeholder="Konfirmasi Password"
                    onChange={formik.handleChange}
                  />
                  {formik.touched.konfirmasi_password &&
                  formik.errors.konfirmasi_password ? (
                    <div className="text-sm text-red-500">
                      {formik.errors.konfirmasi_password}
                    </div>
                  ) : null}
                </div>

                <div className="flex justify-end gap-4.5">
                  <button
                    className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <ImageForm />
      </div>
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
