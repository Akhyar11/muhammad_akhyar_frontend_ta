"use client";
import Link from "next/link";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import ButtonProgres from "../button/button.progres";
import { useAuth } from "@/store/auth.store";

const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().min(6).required("Password is required"),
});

export default function SignInForm() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      login(values.username, values.password, () => router.push("/"));
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

      <div className="mb-5">
        <ButtonProgres
          label="Sign In"
          model="success"
          type="submit"
          open={loading}
        />
      </div>

      <div className="mt-6 text-center">
        <p>
          Don’t have any account?{" "}
          <Link href="/auth/register" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  );
}
