import { AimOutlined } from "@ant-design/icons";
import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { DataSourceCardProps } from "./types";

const LocationInfo = ({ location }: { location: string | string[] }) => {
  const [latitude, longitude] = Array.isArray(location) ? location : location.split(",");
  return (
    <div className="grid grid-cols-2">
      <p className="text-xs">
        <span className="font-semibold text-gray-600">Vĩ độ: </span>
        <span className="font-medium">{latitude}</span>
      </p>
      <p className="text-xs">
        <span className="font-semibold text-gray-600">Kinh độ: </span>
        <span className="font-medium">{longitude}</span>
      </p>
    </div>
  );
};

const NameInfo = ({ name, isModelSource }: { name: string; isModelSource: boolean }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs font-medium text-gray-600">{isModelSource ? "Vị trí" : "Trạm"}:</span>
    <span className="line-clamp-2 text-sm font-semibold">{name}</span>
  </div>
);

const DataSourceCard: React.FC<DataSourceCardProps> = ({ data }) => {
  const isModelSource = data.source === "Mô hình";

  return (
    <div className="flex w-full flex-row items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <AimOutlined className="text-xl" />
      </div>
      <div className="flex flex-grow flex-col gap-3">
        <p className="flex flex-row items-center gap-2 text-sm font-semibold text-blue-600">
          Nguồn <AiOutlineArrowRight className="text-xs" /> {data.source}
        </p>
        <div className="flex flex-col gap-2">
          <NameInfo name={data.name} isModelSource={isModelSource} />
          <LocationInfo location={data.location} />
        </div>
      </div>
    </div>
  );
};

export default DataSourceCard;
