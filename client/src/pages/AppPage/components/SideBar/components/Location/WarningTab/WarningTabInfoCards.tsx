import { cn } from "@/lib/utils";
import { colorMap } from "@/types/consts";
import { AimOutlined, FieldTimeOutlined, HeartOutlined } from "@ant-design/icons";
import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

interface DataSourceCardProps {
  source: string;
  name: string;
  location: string | string[];
  type?: string;
}

interface AirQualityCardProps {
  status: string;
  time: string;
  aqi_index: string;
  pm_25: string;
  color: string;
  icon: string;
}

interface HealthRecommendationCardProps {
  recommendation: string;
}

const DataSourceCard: React.FC<DataSourceCardProps> = ({ source, name, location }) => {
  const isModelSource = source === "Mô hình";

  const renderLocation = () => {
    return (
      <div className="grid grid-cols-2 gap-1">
        <p className="text-xs">
          <span className="font-semibold text-gray-600">Vĩ độ: </span>
          <span className="font-medium">{location[0]}</span>
        </p>
        <p className="text-xs">
          <span className="font-semibold text-gray-600">Kinh độ: </span>
          <span className="font-medium">{location[1]}</span>
        </p>
      </div>
    );
  };

  const renderName = () => {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-600">{isModelSource ? "Vị trí" : "Trạm"}:</span>
        <span className="line-clamp-2 text-sm font-semibold">{name}</span>
      </div>
    );
  };

  return (
    <div className="flex w-full flex-row items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <AimOutlined className="text-xl" />
      </div>
      <div className="flex flex-grow flex-col gap-3">
        <p className="flex flex-row items-center gap-2 text-sm font-semibold text-blue-600">
          Nguồn <AiOutlineArrowRight className="text-xs" /> {source}
        </p>
        <div className="flex flex-col gap-2">
          {renderName()}
          {renderLocation()}
        </div>
      </div>
    </div>
  );
};

const AirQualityCard: React.FC<AirQualityCardProps> = ({ status, time, aqi_index, pm_25, color, icon }) => {
  const formattedTime = time ? time.split("-").reverse().join("/") : "";
  const isYellow = color === colorMap[1];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md",
        isYellow ? "text-gray-800" : "text-white",
      )}
      style={{
        backgroundColor: color,
        borderColor: color,
      }}>
      <div className="space-y-4 p-4">
        <div className="flex flex-row items-center justify-between">
          <h3 className={cn("text-sm font-bold", isYellow ? "text-gray-800" : "text-white")}>Chất lượng không khí</h3>
          <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs">
            <FieldTimeOutlined />
            <span>{formattedTime}</span>
          </div>
        </div>

        <div className="rounded-lg bg-white/10 p-2 text-center">
          <p className="font-semibold tracking-wide">{status}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={`aqi/${icon}`} className="h-14 w-14 object-contain" alt="Air quality indicator" />
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <h4 className={cn("text-xs font-medium", isYellow ? "text-gray-600" : "text-white/70")}>AQI VN</h4>
              <p className="mt-1 text-xl font-bold">{aqi_index}</p>
            </div>

            <div className="text-center">
              <h4 className={cn("text-xs font-medium", isYellow ? "text-gray-600" : "text-white/70")}>PM2.5 (µg/m3)</h4>
              <p className="mt-1 text-xl font-bold">{pm_25}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HealthRecommendationCard: React.FC<HealthRecommendationCardProps> = ({ recommendation }) => (
  <div className="overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-emerald-100 shadow-sm transition-all hover:shadow-md">
    <div className="flex gap-4 p-4">
      <div className="flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm">
          <HeartOutlined className="text-lg" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-emerald-800">Khuyến cáo sức khỏe</h3>
        <p className="text-sm leading-relaxed text-emerald-700">{recommendation}</p>
      </div>
    </div>
  </div>
);

export const WarningTabInfoCards = {
  HealthRecommendationCard,
  DataSourceCard,
  AirQualityCard,
};
