import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import useProfil from "../../store/profil/profil.hook";
import { useAnthropometry } from "@/store/anthropometry.store";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

interface HealthAdvice {
  message: string;
  recommendations: string[];
  urgency_level: "low" | "moderate" | "high" | "critical";
  risk_factors: string[];
}

interface HealthData {
  summary: string;
  important_info: string[];
  health_advice: HealthAdvice;
}

export default function BMIIntelligence() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [rawContent, setRawContent] = useState<string>("");
  const { data } = useAnthropometry();
  const { getProfil, profil } = useProfil();

  useEffect(() => {
    getProfil();
  }, [data]);

  useEffect(() => {
    if (profil) {
      try {
        const parsedData: HealthData = JSON.parse(profil.summary);
        setHealthData(parsedData);
      } catch (error) {
        console.error("Error parsing health data:", error);
        setRawContent(profil.summary || "tidak ada summary");
      }
    }
  }, [profil]);

  if (!healthData && !rawContent) {
    return <div>Loading...</div>;
  }

  if (rawContent && !healthData) {
    return (
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-md dark:border-strokedark dark:bg-boxdark sm:px-8">
        <h4 className="mb-4 text-xl font-bold">
          BMI Intelligence <span className="text-xs text-gray-500">(BETA)</span>
        </h4>
        <ReactMarkdown className="prose dark:prose-invert">
          {rawContent}
        </ReactMarkdown>
      </div>
    );
  }

  const { summary, important_info, health_advice } = healthData!;
  const { message, recommendations, urgency_level, risk_factors } =
    health_advice;

  const urgencyColors: Record<string, string> = {
    low: "bg-green-100 text-green-800",
    moderate: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };

  const urgencyIcons: Record<string, JSX.Element> = {
    low: <CheckCircle className="h-5 w-5 text-green-500" />,
    moderate: <Info className="h-5 w-5 text-yellow-500" />,
    high: <AlertCircle className="h-5 w-5 text-orange-500" />,
    critical: <XCircle className="h-5 w-5 text-red-500" />,
  };

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-md dark:border-strokedark dark:bg-boxdark sm:px-8">
      <h4 className="mb-4 text-xl font-bold">
        BMI Intelligence <span className="text-xs text-gray-500">(BETA)</span>
      </h4>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {urgencyIcons[urgency_level]}
          <span
            className={`rounded-lg px-3 py-1 text-sm font-medium ${urgencyColors[urgency_level]}`}
          >
            {urgency_level.toUpperCase()} URGENCY
          </span>
        </div>

        <p className="font-medium text-gray-700 dark:text-gray-300">
          {summary}
        </p>

        <div>
          <h5 className="text-lg font-semibold">📌 Informasi Penting</h5>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
            {important_info.map((info, index) => (
              <li key={index}>{info}</li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-lg font-semibold">💡 Saran Kesehatan</h5>
          <p className="text-gray-700 dark:text-gray-300">{message}</p>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>

        {risk_factors.length > 0 && (
          <div>
            <h5 className="text-lg font-semibold text-red-600">
              ⚠️ Faktor Risiko
            </h5>
            <ul className="list-disc pl-5 text-red-500 dark:text-red-400">
              {risk_factors.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
