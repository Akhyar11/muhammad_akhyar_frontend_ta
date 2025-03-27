"use client";
import React, { useEffect, useState } from "react";
import Table, { ColumnConfig } from "../Tables/Table";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import ButtonProgres from "../button/button.progres";
import { useAnthropometry } from "@/store/anthropometry.store";
import BMIIntelligence from "../BMIIntelligence";
import DateKMSChart from "./Chart";
import { useUser } from "@/store/user.store";
import { calculateAge } from "@/utils/calculate.age";

const DashboardComponent: React.FC = () => {
  const { loading, fetchAnthropometry, data } = useAnthropometry();
  const { getUser } = useUser();
  const user = getUser();

  const [bb, setBB] = useState();

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

  const colomnsKSM: ColumnConfig[] = [
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
      header: "Status KSM",
      accessColumn: "ksm",
      cell: (row) => {
        let status = row.kms ? row.kms : "Normal";
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

  useEffect(() => {
    fetchAnthropometry();
  }, []);

  useEffect(() => {
    if (user && data[0]) {
      setBB(data.slice(-1)[0].weight);
    }
  }, [user]);

  return (
    <>
      <div className="mt-4 flex min-h-screen flex-col gap-6">
        <div className="flex justify-between">
          <Breadcrumb pageName="DATA BMI" />
          <div>
            <ButtonProgres
              label="Sync"
              model="attantion"
              open={loading.read}
              type="button"
              onclick={fetchAnthropometry}
            />
          </div>
        </div>
        {user && (
          <>
            <DateKMSChart
              birthDate={user?.tgl_lahir}
              gender={user?.jk ? "male" : "female"}
              weight={bb}
            />
            <Table
              columns={
                calculateAge(new Date(user?.tgl_lahir)).age > 5
                  ? colomns
                  : colomnsKSM
              }
              data={data}
            />
          </>
        )}

        <BMIIntelligence />
      </div>
    </>
  );
};

export default DashboardComponent;
