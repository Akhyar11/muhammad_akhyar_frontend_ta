import React, { useMemo } from "react";

const DateKMSChart = ({
  birthDate = "2023-01-01",
  weight = 11,
  gender = "male",
}) => {
  // Calculate age in months from birthdate
  const ageInMonths = useMemo(() => {
    const today = new Date();
    const birth = new Date(birthDate);

    // Calculate the difference in months
    let months = (today.getFullYear() - birth.getFullYear()) * 12;
    months += today.getMonth() - birth.getMonth();

    // Adjust for days of the month
    if (today.getDate() < birth.getDate()) {
      months--;
    }

    return Math.max(0, months); // Ensure age is not negative
  }, [birthDate]);

  // KMS reference lines (age in months, weight in kg)
  // Simplified version of Indonesian KMS standards
  const kmsReferenceBoy = {
    // -3SD (severely underweight)
    severelyUnderweight: [
      { age: 0, weight: 2.1 },
      { age: 2, weight: 3.4 },
      { age: 4, weight: 4.4 },
      { age: 6, weight: 5.3 },
      { age: 8, weight: 6.0 },
      { age: 10, weight: 6.6 },
      { age: 12, weight: 7.1 },
      { age: 24, weight: 9.0 },
      { age: 36, weight: 10.8 },
      { age: 48, weight: 12.2 },
      { age: 60, weight: 13.7 },
    ],
    // -2SD (underweight)
    underweight: [
      { age: 0, weight: 2.5 },
      { age: 2, weight: 4.3 },
      { age: 4, weight: 5.6 },
      { age: 6, weight: 6.4 },
      { age: 8, weight: 7.1 },
      { age: 10, weight: 7.7 },
      { age: 12, weight: 8.3 },
      { age: 24, weight: 10.5 },
      { age: 36, weight: 12.7 },
      { age: 48, weight: 14.3 },
      { age: 60, weight: 16.0 },
    ],
    // Median
    normal: [
      { age: 0, weight: 3.3 },
      { age: 2, weight: 5.5 },
      { age: 4, weight: 7.0 },
      { age: 6, weight: 7.9 },
      { age: 8, weight: 8.7 },
      { age: 10, weight: 9.4 },
      { age: 12, weight: 10.0 },
      { age: 24, weight: 12.4 },
      { age: 36, weight: 14.6 },
      { age: 48, weight: 16.7 },
      { age: 60, weight: 18.7 },
    ],
    // +2SD (overweight)
    overweight: [
      { age: 0, weight: 4.2 },
      { age: 2, weight: 7.0 },
      { age: 4, weight: 8.6 },
      { age: 6, weight: 9.8 },
      { age: 8, weight: 10.7 },
      { age: 10, weight: 11.6 },
      { age: 12, weight: 12.4 },
      { age: 24, weight: 15.0 },
      { age: 36, weight: 17.4 },
      { age: 48, weight: 19.8 },
      { age: 60, weight: 22.4 },
    ],
  };

  const kmsReferenceGirl = {
    // -3SD (severely underweight)
    severelyUnderweight: [
      { age: 0, weight: 2.0 },
      { age: 2, weight: 3.2 },
      { age: 4, weight: 4.2 },
      { age: 6, weight: 4.9 },
      { age: 8, weight: 5.5 },
      { age: 10, weight: 6.0 },
      { age: 12, weight: 6.5 },
      { age: 24, weight: 8.5 },
      { age: 36, weight: 10.2 },
      { age: 48, weight: 11.7 },
      { age: 60, weight: 13.0 },
    ],
    // -2SD (underweight)
    underweight: [
      { age: 0, weight: 2.4 },
      { age: 2, weight: 3.9 },
      { age: 4, weight: 5.1 },
      { age: 6, weight: 5.9 },
      { age: 8, weight: 6.6 },
      { age: 10, weight: 7.2 },
      { age: 12, weight: 7.7 },
      { age: 24, weight: 9.9 },
      { age: 36, weight: 11.9 },
      { age: 48, weight: 13.5 },
      { age: 60, weight: 15.1 },
    ],
    // Median
    normal: [
      { age: 0, weight: 3.2 },
      { age: 2, weight: 5.0 },
      { age: 4, weight: 6.4 },
      { age: 6, weight: 7.3 },
      { age: 8, weight: 8.0 },
      { age: 10, weight: 8.7 },
      { age: 12, weight: 9.3 },
      { age: 24, weight: 11.8 },
      { age: 36, weight: 14.1 },
      { age: 48, weight: 16.1 },
      { age: 60, weight: 18.0 },
    ],
    // +2SD (overweight)
    overweight: [
      { age: 0, weight: 4.2 },
      { age: 2, weight: 6.5 },
      { age: 4, weight: 8.1 },
      { age: 6, weight: 9.3 },
      { age: 8, weight: 10.2 },
      { age: 10, weight: 11.0 },
      { age: 12, weight: 11.7 },
      { age: 24, weight: 14.4 },
      { age: 36, weight: 16.9 },
      { age: 48, weight: 19.4 },
      { age: 60, weight: 21.7 },
    ],
  };

  // Get reference data based on gender
  const referenceData = gender === "male" ? kmsReferenceBoy : kmsReferenceGirl;

  // Calculate status based on child's weight and reference data
  const calculateStatus = (childAge, childWeight) => {
    const closestAgeIndex = referenceData.normal.findIndex(
      (data) => data.age >= childAge,
    );

    if (closestAgeIndex === -1) return "Unknown";

    const normalWeight = referenceData.normal[closestAgeIndex].weight;
    const underweightThreshold =
      referenceData.underweight[closestAgeIndex].weight;
    const severelyUnderweightThreshold =
      referenceData.severelyUnderweight[closestAgeIndex].weight;
    const overweightThreshold =
      referenceData.overweight[closestAgeIndex].weight;

    if (childWeight < severelyUnderweightThreshold)
      return "Severely Underweight";
    if (childWeight < underweightThreshold) return "Underweight";
    if (childWeight > overweightThreshold) return "Overweight";
    return "Normal";
  };

  // Format birthdate for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Define the chart dimensions and padding
  const chartWidth = 800;
  const chartHeight = 400;
  const padding = { top: 20, right: 30, bottom: 50, left: 50 };

  // Calculate chart scales
  const maxAge = 60; // 60 months (5 years)
  const maxWeight = 25; // 25 kg

  // Calculate pixel positions for data points
  const getX = (pointAge) =>
    (pointAge / maxAge) * (chartWidth - padding.left - padding.right) +
    padding.left;
  const getY = (pointWeight) =>
    chartHeight -
    padding.bottom -
    (pointWeight / maxWeight) * (chartHeight - padding.top - padding.bottom);

  // Create path strings for the reference lines
  const createPathString = (dataPoints) => {
    return dataPoints
      .map(
        (point, i) =>
          `${i === 0 ? "M" : "L"} ${getX(point.age)} ${getY(point.weight)}`,
      )
      .join(" ");
  };

  // Generate paths for reference lines
  const severelyUnderweightPath = createPathString(
    referenceData.severelyUnderweight,
  );
  const underweightPath = createPathString(referenceData.underweight);
  const normalPath = createPathString(referenceData.normal);
  const overweightPath = createPathString(referenceData.overweight);

  // Generate grid lines
  const ageGridLines = Array.from({ length: 7 }, (_, i) => i * 10);
  const weightGridLines = Array.from({ length: 11 }, (_, i) => i * 2.5);

  // Get status for current child
  const status = calculateStatus(ageInMonths, weight);

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-gray-800">
          KMS Weight Chart
        </h2>
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Birth Date:</span>
            <span>{formatDate(birthDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Age:</span>
            <span>{ageInMonths} months</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Weight:</span>
            <span>{weight} kg</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Gender:</span>
            <span>{gender === "male" ? "Male" : "Female"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <span
              className={`rounded px-2 py-1 text-sm font-medium ${
                status === "Normal"
                  ? "bg-green-100 text-green-800"
                  : status === "Underweight"
                    ? "bg-yellow-100 text-yellow-800"
                    : status === "Severely Underweight"
                      ? "bg-red-100 text-red-800"
                      : "bg-orange-100 text-orange-800"
              }`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="border border-gray-200"
        >
          {/* Grid lines */}
          {ageGridLines.map((gridAge) => (
            <line
              key={`age-${gridAge}`}
              x1={getX(gridAge)}
              y1={padding.top}
              x2={getX(gridAge)}
              y2={chartHeight - padding.bottom}
              stroke="#e5e7eb"
              strokeDasharray="4 4"
            />
          ))}
          {weightGridLines.map((gridWeight) => (
            <line
              key={`weight-${gridWeight}`}
              x1={padding.left}
              y1={getY(gridWeight)}
              x2={chartWidth - padding.right}
              y2={getY(gridWeight)}
              stroke="#e5e7eb"
              strokeDasharray="4 4"
            />
          ))}

          {/* Reference lines */}
          <path
            d={severelyUnderweightPath}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          />
          <path
            d={underweightPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <path d={normalPath} fill="none" stroke="#10b981" strokeWidth="2" />
          <path
            d={overweightPath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
          />

          {/* Child data point */}
          <circle
            cx={getX(ageInMonths)}
            cy={getY(weight)}
            r="6"
            fill="white"
            stroke="#000"
            strokeWidth="2"
          />

          {/* X and Y axis */}
          <line
            x1={padding.left}
            y1={chartHeight - padding.bottom}
            x2={chartWidth - padding.right}
            y2={chartHeight - padding.bottom}
            stroke="#374151"
            strokeWidth="2"
          />
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={chartHeight - padding.bottom}
            stroke="#374151"
            strokeWidth="2"
          />

          {/* Axis labels */}
          {ageGridLines.map((gridAge) => (
            <text
              key={`age-label-${gridAge}`}
              x={getX(gridAge)}
              y={chartHeight - padding.bottom + 20}
              textAnchor="middle"
              fill="#4b5563"
              fontSize="12"
            >
              {gridAge}
            </text>
          ))}
          {weightGridLines.map((gridWeight) => (
            <text
              key={`weight-label-${gridWeight}`}
              x={padding.left - 10}
              y={getY(gridWeight) + 4}
              textAnchor="end"
              fill="#4b5563"
              fontSize="12"
            >
              {gridWeight}
            </text>
          ))}

          {/* Axis titles */}
          <text
            x={chartWidth / 2}
            y={chartHeight - 10}
            textAnchor="middle"
            fill="#1f2937"
            fontSize="14"
            fontWeight="bold"
          >
            Age (months)
          </text>
          <text
            transform={`rotate(-90, 15, ${chartHeight / 2})`}
            x="15"
            y={chartHeight / 2}
            textAnchor="middle"
            fill="#1f2937"
            fontSize="14"
            fontWeight="bold"
          >
            Weight (kg)
          </text>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="mr-2 h-2 w-6 bg-green-500"></div>
          <span className="text-sm">Normal</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-2 w-6 bg-yellow-500"></div>
          <span className="text-sm">Underweight (-2SD)</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-2 w-6 bg-red-500"></div>
          <span className="text-sm">Severely Underweight (-3SD)</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-2 w-6 bg-indigo-500"></div>
          <span className="text-sm">Overweight (+2SD)</span>
        </div>
      </div>
    </div>
  );
};

export default DateKMSChart;
