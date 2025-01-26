import React, { useState } from "react";

interface ColumnConfig {
  header: string;
  accessColumn: string;
  cell?: (row: { [key: string]: any }) => React.ReactNode;
}

interface TableOneProps {
  columns: ColumnConfig[];
  data: { [key: string]: any }[];
  itemsPerPage?: number;
}

const TableOne = ({ columns, data, itemsPerPage = 10 }: TableOneProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Top Channels
      </h4>

      <div className="flex max-w-180 flex-col overflow-x-scroll">
        <div className="grid w-max grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4">
          {columns.map((column, index) => (
            <div key={index} className="w-45 p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                {column.header}
              </h5>
            </div>
          ))}
        </div>

        {paginatedData.map((row, rowIndex) => (
          <div
            className={`grid w-max grid-cols-6 ${
              rowIndex === paginatedData.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={rowIndex}
          >
            {columns.map((column, colIndex) => (
              <div
                key={colIndex}
                className="flex w-45 items-center justify-center p-2.5 xl:p-5"
              >
                {column.cell ? (
                  column.cell(row)
                ) : (
                  <p className="text-black dark:text-white">
                    {row[column.accessColumn]}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50 dark:bg-gray-700"
        >
          Previous
        </button>
        <div className="flex space-x-2">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`rounded px-3 py-1 ${
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50 dark:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableOne;
