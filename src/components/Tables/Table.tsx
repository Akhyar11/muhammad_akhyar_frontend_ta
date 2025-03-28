import React, { useState } from "react";

export interface ColumnConfig {
  header: string;
  accessColumn: string;
  width?: number;
  isSorting?: boolean;
  cell?: (row: { [key: string]: any }) => React.ReactNode;
}

interface TableProps {
  columns: ColumnConfig[];
  data: { [key: string]: any }[];
  itemsPerPage?: number;
  children?: React.ReactNode;
}

const Table = ({
  columns,
  data,
  itemsPerPage = 10,
  children = <></>,
}: TableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageClick = (page: number) => setCurrentPage(page);
  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const toggleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
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
    <div className="rounded-lg border border-stroke bg-white p-4 shadow-md dark:border-strokedark dark:bg-boxdark sm:p-6">
      {children}

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          {/* Desktop/Mobile Header */}
          <thead className="bg-gray-100 text-left font-semibold uppercase text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  style={{ width: column.width || "auto" }}
                  className={`
                    p-3 text-xs sm:text-sm 
                    ${index === 0 ? "rounded-tl-md" : index === columns.length - 1 ? "rounded-tr-md" : ""}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{column.header}</span>
                    {column.isSorting && (
                      <button
                        onClick={() => toggleSort(column.accessColumn)}
                        className="ml-2 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                      >
                        {sortConfig?.key === column.accessColumn &&
                        sortConfig.direction === "asc"
                          ? "\u25B2"
                          : "\u25BC"}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b even:bg-gray-50 dark:even:bg-gray-800"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    style={{ width: column.width || "auto" }}
                    className="p-3 text-xs text-gray-800 dark:text-gray-200 sm:text-sm"
                  >
                    {column.cell ? column.cell(row) : row[column.accessColumn]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="rounded-md bg-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:text-sm"
        >
          Previous
        </button>
        <div className="flex space-x-2">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`rounded-md px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                page === currentPage
                  ? "bg-blue-500 text-white dark:bg-blue-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="rounded-md bg-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
