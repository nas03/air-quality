import { IPropsAirQualityCard, IPropsDataSourceCard, IPropsHealthRecommendationCard } from "@/components/SideBar/components/Location/WarningTab/types";
import { AimOutlined, FieldTimeOutlined, HeartOutlined } from "@ant-design/icons";
import React from "react";

const DataSourceCard: React.FC<IPropsDataSourceCard> = ({ source, content }) => {
  return (
    <>
      <div className="flex w-full flex-row items-start gap-3 rounded-md border-2 border-[#E7E7E7] bg-[#E7E7E7] p-3">
        <AimOutlined className="flex-shrink text-3xl" />
        <div className="flex flex-grow flex-col gap-3">
          <p className="text-sm font-semibold">
            Nguồn-{">"}
            {source}
          </p>
          <div className="flex flex-col gap-1 text-xs font-medium">{content}</div>
        </div>
      </div>
    </>
  );
};

const AirQualityCard: React.FC<IPropsAirQualityCard> = ({ status, time, aqi_index, pm_25 }) => {
  return (
    <div className="rounded-lg border-2 border-[#eb5c33] bg-[#eb5c33] px-[1rem] py-5 text-white">
      <div className="flex flex-row items-center justify-between text-xs">
        <p className="font-semibold">Chất lượng không khí ngày hiện tại: {status}</p>
        <p className="flex flex-row gap-1">
          <FieldTimeOutlined />
          {time.split("-").reverse().join("/")}
        </p>
      </div>
      <div className="mt-4 flex w-full flex-row items-center justify-between">
        <img loading="lazy" src="face_mask_icon.png" className="h-full border-r-2 border-slate-200 px-4" />
        <div className="gap-1">
          <h6 className="text-xs text-white opacity-60">AQI VN</h6>
          <p className="text-base">{aqi_index || "null"}</p>
        </div>
        <div className="gap-1 border-l-2 border-slate-200 pl-4">
          <h6 className="text-xs text-white opacity-60">PM2.5 (µg/m3)</h6>
          <p className="text-base">{pm_25 || "null"}</p>
        </div>
      </div>
    </div>
  );
};

const HealthRecommendationCard: React.FC<IPropsHealthRecommendationCard> = ({ recommendation }) => {
  return (
    <>
      <div className="flex w-full flex-row gap-3 rounded-md border-2 border-[#D5EFE6] bg-[#D5EFE6] p-3 text-[#005B3F]">
        <HeartOutlined className="h-fit flex-shrink rounded-full bg-[rgb(0,171,120)] p-3 text-xl text-white" />
        <div className="flex flex-grow flex-col gap-3">
          <p className="text-xs font-bold">Khuyến cáo</p>
          <p className="text-xs font-medium">{recommendation}</p>
        </div>
      </div>
    </>
  );
};

const InfoCards = {
  HealthRecommendationCard,
  DataSourceCard,
  AirQualityCard,
};

export default InfoCards;
