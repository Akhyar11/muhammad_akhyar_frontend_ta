interface TableOneProps {
  headers: string[];
  data: { [key: string]: any }[];
}

const TableOne = ({ headers, data }: TableOneProps) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Top Channels
      </h4>

      <div className="flex max-w-180 flex-col overflow-x-scroll">
        <div className="grid w-max grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4">
          {headers.map((header, index) => (
            <div key={index} className="w-45 p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                {header}
              </h5>
            </div>
          ))}
        </div>

        {data.map((row, rowIndex) => (
          <div
            className={`grid w-max grid-cols-6 ${
              rowIndex === data.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={rowIndex}
          >
            {headers.map((header, colIndex) => (
              <div
                key={colIndex}
                className="flex w-45 items-center justify-center p-2.5 xl:p-5"
              >
                <p className="text-black dark:text-white">{row[header]}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
