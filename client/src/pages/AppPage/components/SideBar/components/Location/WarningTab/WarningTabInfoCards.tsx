import { cn } from "@/lib/utils";
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
    // if (isModelSource) {
    return (
      <div className="grid grid-cols-2">
        <p>
          <span className="text-sm font-semibold">Vĩ độ: </span>
          {location[0]}
        </p>
        <p>
          <span className="text-sm font-semibold">Kinh độ: </span>
          {location[1]}
        </p>
      </div>
    );
  };

  const renderName = () => {
    // if (isModelSource) {
    return (
      <div className="grid grid-cols-5">
        <span className="">{isModelSource ? "Vị trí" : "Trạm"}:</span>
        <span className="col-span-4">{name}</span>
      </div>
    );
  };

  return (
    <div className="flex h-[7rem] w-full flex-row items-start gap-3 rounded-md border-2 border-[#E7E7E7] bg-[#E7E7E7] p-3">
      <AimOutlined className="flex-shrink text-3xl" />
      <div className="flex flex-grow flex-col gap-3">
        <p className="flex flex-row items-center gap-2 text-sm font-semibold">
          Nguồn <AiOutlineArrowRight />
          {source}
        </p>
        <div className="flex flex-col gap-1 text-xs font-medium">
          <div className="grid grid-rows-2 gap-1 text-xs font-medium">
            <span className="line-clamp-3 text-sm font-semibold">{renderName()}</span>
            {renderLocation()}
          </div>
        </div>
      </div>
    </div>
  );
};

const AirQualityCard: React.FC<AirQualityCardProps> = ({ status, time, aqi_index, pm_25, color, icon }) => {
  const formattedTime = time ? time.split("-").reverse().join("/") : "";

  const isYellow = color === "#facf39";

  return (
    <div
      className={cn("rounded-lg border-2 px-[1rem] py-5", isYellow ? "text-black" : "text-white")}
      style={{
        backgroundColor: color,
        borderColor: color,
      }}
    >
      <div className="flex flex-row items-center justify-between text-xs">
        <p className="font-semibold">Chất lượng không khí ngày hiện tại: {status}</p>
        <p className="flex flex-row gap-1">
          <FieldTimeOutlined />
          {formattedTime}
        </p>
      </div>
      <div className="mt-4 flex w-full flex-row items-center justify-between">
        <img
          src={`aqi/${icon}`}
          className={cn("h-full border-r-2 px-4", isYellow ? "border-slate-600" : "border-x-slate-200")}
          alt="Face mask icon"
        />
        <div className="gap-1">
          <h6 className={cn("text-xs opacity-60", isYellow ? "text-black" : "text-white")}>AQI VN</h6>
          <p className="text-center text-base">{aqi_index}</p>
        </div>
        <div className={cn("gap-1 border-l-2 pl-4", isYellow ? "border-slate-600" : "border-x-slate-200")}>
          <h6 className={cn("text-xs opacity-60", isYellow ? "text-black" : "text-white")}>PM2.5 (µg/m3)</h6>
          <p className="text-center text-base">{pm_25}</p>
        </div>
      </div>
    </div>
  );
};

const HealthRecommendationCard: React.FC<HealthRecommendationCardProps> = ({ recommendation }) => (
  <div className="flex w-full flex-row gap-3 rounded-md border-2 border-[#D5EFE6] bg-[#D5EFE6] p-3 text-[#005B3F]">
    <HeartOutlined className="h-fit flex-shrink rounded-full bg-[rgb(0,171,120)] p-3 text-xl text-white" />
    <div className="flex flex-grow flex-col gap-3">
      <p className="text-xs font-bold">Khuyến cáo</p>
      <p className="text-xs font-medium">{recommendation}</p>
    </div>
  </div>
);

export const WarningTabInfoCards = {
  HealthRecommendationCard,
  DataSourceCard,
  AirQualityCard,
};
