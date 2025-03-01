"use client";

import { useAnthropometry } from "@/store/anthropometry.store";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import Table, { ColumnConfig } from "../Tables/Table";
import { useFormik } from "formik";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import ButtonProgres from "../button/button.progres";
import { axiosInstance } from "@/utils/axios.config";
import { useUser } from "@/store/user.store";
import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth.store";

const colomns: ColumnConfig[] = [
  {
    isSorting: true,
    header: "Weight",
    accessColumn: "weight",
  },
  {
    isSorting: true,
    header: "Height",
    accessColumn: "height",
  },
  {
    isSorting: true,
    header: "BMI",
    accessColumn: "bmi",
    cell: (row) => {
      const bmi = Number(Number(row.bmi).toFixed(2));
      let color = "bg-green-500"; // default color
      if (bmi < 18.5) color = "bg-yellow-500";
      else if (bmi >= 25) color = "bg-red-500";
      return (
        <span className={`rounded-full px-3 py-1 text-white ${color}`}>
          {bmi}
        </span>
      );
    },
  },
  {
    header: "Status BMI",
    accessColumn: "bmi",
    cell: (row) => {
      const bmi = Number(row.bmi);
      let status = "Normal";
      if (bmi < 18.5) status = "Underweight";
      else if (bmi >= 25 && bmi < 30) status = "Overweight";
      else if (bmi >= 30) status = "Obese";
      return (
        <span
          className={`rounded-full px-3 py-1 text-white ${status === "Normal" ? "bg-green-500" : status === "Underweight" ? "bg-yellow-500" : status === "Overweight" ? "bg-orange-500" : "bg-red-500"}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    isSorting: true,
    header: "Date",
    accessColumn: "date",
    cell: (row) => {
      const date = new Date(row.date);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      return <span>{formattedDate}</span>;
    },
  },
];

export default function RiwayatComponent() {
  const { data, loading, error, fetchAnthropometry } = useAnthropometry();
  const { user, me } = useUser();
  const { getToken } = useAuth();
  const token = getToken();

  const [cetakLoading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      periode_awal: {
        startDate: null,
        endDate: null,
      },
      periode_akhir: {
        startDate: null,
        endDate: null,
      },
    },
    onSubmit: (values) => {
      fetchAnthropometry({
        periode_awal: values.periode_awal.startDate,
        periode_akhir: values.periode_akhir.startDate,
      });
    },
  });

  const cetak = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/antropomerty/download/${(user as any).id}`,
        {
          params: {
            periode_awal: formik.values.periode_awal.startDate,
            periode_akhir: formik.values.periode_akhir.startDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Pastikan format blob agar bisa di-download sebagai file
        },
      );

      // Buat URL dari blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Anthropometry_${(user as any).id}.xlsx`); // Nama file
      document.body.appendChild(link);
      link.click();

      // Hapus elemen setelah download
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!(user as any)?.id) {
      me();
    }
  }, []);

  const FilterComponent = () => {
    return (
      <form onSubmit={formik.handleSubmit} className="mb-4">
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="sm:w-1/2">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="periode_awal"
            >
              Periode Awal
            </label>
            <Datepicker
              useRange={false}
              asSingle={true}
              value={formik.values.periode_awal}
              onChange={(newValue) =>
                formik.setFieldValue("periode_awal", newValue)
              }
              placeholder="Periode Awal"
              maxDate={new Date()}
              inputClassName="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="sm:w-1/2">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="periode_akhir"
            >
              Periode Akhir
            </label>
            <Datepicker
              useRange={false}
              asSingle={true}
              value={formik.values.periode_akhir}
              onChange={(newValue) =>
                formik.setFieldValue("periode_akhir", newValue)
              }
              placeholder="Periode Akhir"
              maxDate={new Date()}
              inputClassName="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        <div className="flex w-full justify-end">
          <div className="flex w-40 gap-2">
            <ButtonProgres
              label="Filter"
              model="success"
              open={loading.read}
              type="submit"
            />
            <ButtonProgres
              label="Cetak"
              model="attantion"
              open={cetakLoading}
              type="button"
              onclick={cetak}
            />
          </div>
        </div>
      </form>
    );
  };

  return (
    <div className="mt-4 flex min-h-screen flex-col gap-6">
      <div className="flex justify-between">
        <Breadcrumb pageName="Riwayat" />
      </div>

      <Table
        columns={colomns}
        data={data}
        itemsPerPage={10}
        children={<FilterComponent />}
      />
    </div>
  );
}
