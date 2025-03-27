"use client";
import Link from "next/link";
import { useFormik } from "formik";
import * as yup from "yup";
import ButtonProgres from "../button/button.progres";
import { useAuth } from "@/store/auth.store";
import { useRouter } from "next/navigation";

const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().min(6).required("Password is required"),
  jk: yup.string().required("Jenis Kelamin is required"),
  tgl_lahir: yup.string().required("Tanggal Lahir is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match"),
});

export default function SignUpForm() {
  const { register, loading } = useAuth();
  const router = useRouter();
  // Formik
  const formik = useFormik({
    initialValues: {
      confirmPassword: "",
      username: "",
      password: "",
      jk: "",
      tgl_lahir: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      register({ ...values }, () => {
        formik.resetForm();
        router.push("/auth/login");
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Username
        </label>
        <div className="relative">
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            onChange={formik.handleChange}
          />
        </div>

        {formik.touched.username && formik.errors.username ? (
          <div className="text-sm text-red-500">{formik.errors.username}</div>
        ) : null}
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Password
        </label>
        <div className="relative">
          <input
            type="password"
            name="password"
            placeholder="6+ Characters, 1 Capital letter"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            onChange={formik.handleChange}
          />
        </div>

        {formik.touched.password && formik.errors.password ? (
          <div className="text-sm text-red-500">{formik.errors.password}</div>
        ) : null}
      </div>

      {/* Validate password */}
      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            onChange={formik.handleChange}
          />
        </div>

        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div className="text-sm text-red-500">
            {formik.errors.confirmPassword}
          </div>
        ) : null}
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Jenis kelamin
        </label>
        <div className="relative">
          <select
            name="jk"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            onChange={formik.handleChange}
            value={formik.values.jk}
          >
            <option value="" label="Select your gender" />
            <option value="Laki-laki" label="Laki-laki" />
            <option value="Perempuan" label="Perempuan" />
          </select>
        </div>

        {formik.touched.jk && formik.errors.jk ? (
          <div className="text-sm text-red-500">{formik.errors.jk}</div>
        ) : null}
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Tanggal Lahir
        </label>
        <div className="relative">
          <input
            type="date"
            name="tgl_lahir"
            placeholder="Enter your tgl_lahir"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none hover:cursor-pointer focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            onChange={formik.handleChange}
          />
        </div>

        {formik.touched.tgl_lahir && formik.errors.tgl_lahir ? (
          <div className="text-sm text-red-500">{formik.errors.tgl_lahir}</div>
        ) : null}
      </div>

      <div className="mb-5">
        <ButtonProgres
          label="Sign Up"
          model="success"
          type="submit"
          disabled={loading}
          open={loading}
        />
      </div>

      <div className="mt-6 text-center">
        <p>
          Do you have account?{" "}
          <Link href="/auth/login" className="text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
}
