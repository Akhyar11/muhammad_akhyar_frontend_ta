import React from "react";

interface ButtonProps {
  type: "submit" | "reset" | "button";
  model: "success" | "warning" | "attantion"; // Representing theme
  open: boolean; // Handle progress when open, text on button set to progress component
  label: string;
  onclick?: React.MouseEventHandler<HTMLButtonElement>;
}

const buttonStyles = {
  success: "bg-primary",
  attantion: "bg-warning",
  warning: "bg-danger",
};

export default function ButtonProgres({
  type,
  model,
  open,
  label,
  onclick = () => {},
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`flex w-full items-center justify-center rounded-lg px-4 py-2 font-semibold text-white ${buttonStyles[model]}`}
      onClick={onclick}
    >
      {open ? (
        <svg
          className="mr-3 h-5 w-5 animate-spin text-white"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      ) : (
        <>{label}</>
      )}
    </button>
  );
}
