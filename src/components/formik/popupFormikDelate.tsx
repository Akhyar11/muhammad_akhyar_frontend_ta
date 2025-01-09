import React from "react";
import { useFormik } from "formik";

interface PopupFormikDeleteProps {
  onDelete: () => void;
  onCancel: () => void;
  name?: string;
}

const PopupFormikDelete: React.FC<PopupFormikDeleteProps> = ({
  onDelete,
  onCancel,
  name = "",
}) => {
  const formik = useFormik({
    initialValues: {
      confirm: "",
    },
    onSubmit: (values) => {
      if (values.confirm === "DELETE") {
        onDelete();
      }
    },
  });

  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <form
        onSubmit={formik.handleSubmit}
        className="w-96 rounded bg-white p-6 shadow-md"
      >
        <label htmlFor="confirm" className="mb-2 block text-gray-700">
          Type DELETE to confirm {name}:
        </label>
        <input
          id="confirm"
          name="confirm"
          type="text"
          autoFocus
          autoComplete="new-password"
          onChange={formik.handleChange}
          value={formik.values.confirm}
          className="mb-4 w-full rounded border border-gray-300 p-2"
          list="datalistOptions"
          aria-autocomplete="none"
          placeholder="DELETE"
        />
        <datalist id="datalistOptions"></datalist>
        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PopupFormikDelete;
