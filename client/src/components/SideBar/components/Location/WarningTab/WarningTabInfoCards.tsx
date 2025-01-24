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
  aqi_index: number | null;
  pm_25: number | null;
}

interface HealthRecommendationCardProps {
  recommendation: string;
}

const DataSourceCard: React.FC<DataSourceCardProps> = ({ source, name, location }) => {
  const isModelSource = source === "Mô hình";

  const renderLocation = () => {
    if (isModelSource) {
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
    }
    return <p>{location}</p>;
  };

  const renderName = () => {
    if (isModelSource) {
      return (
        <div className="grid grid-cols-5 gap-1">
          <p className="">Vị trí:</p>
          <p className="col-span-4">{name}</p>
        </div>
      );
    }
    return name;
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
            <p className="text-sm font-semibold">{renderName()}</p>
            {renderLocation()}
          </div>
        </div>
      </div>
    </div>
  );
};

const AirQualityCard: React.FC<AirQualityCardProps> = ({ status, time, aqi_index = 0, pm_25 = 0 }) => {
  const formattedTime = time ? time.split("-").reverse().join("/") : "";

  return (
    <div className="rounded-lg border-2 border-[#eb5c33] bg-[#eb5c33] px-[1rem] py-5 text-white">
      <div className="flex flex-row items-center justify-between text-xs">
        <p className="font-semibold">Chất lượng không khí ngày hiện tại: {status}</p>
        <p className="flex flex-row gap-1">
          <FieldTimeOutlined />
          {formattedTime}
        </p>
      </div>
      <div className="mt-4 flex w-full flex-row items-center justify-between">
        <img
          loading="lazy"
          src="face_mask_icon.png"
          className="h-full border-r-2 border-slate-200 px-4"
          alt="Face mask icon"
        />
        <div className="gap-1">
          <h6 className="text-xs text-white opacity-60">AQI VN</h6>
          <p className="text-base">{aqi_index}</p>
        </div>
        <div className="gap-1 border-l-2 border-slate-200 pl-4">
          <h6 className="text-xs text-white opacity-60">PM2.5 (µg/m3)</h6>
          <p className="text-base">{pm_25}</p>
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

export default WarningTabInfoCards;
