import { HeartOutlined } from "@ant-design/icons";
import React from "react";
import { HealthRecommendationCardProps } from "./types";

const HealthRecommendationCard: React.FC<HealthRecommendationCardProps> = ({ data }) => (
  <div className="overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-emerald-100 shadow-sm transition-all hover:shadow-md">
    <div className="flex gap-4 p-4">
      <div className="flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm">
          <HeartOutlined className="text-lg" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-emerald-800">Khuyến cáo sức khỏe</h3>
        <p className="text-sm leading-relaxed text-emerald-700">{data}</p>
      </div>
    </div>
  </div>
);

export default HealthRecommendationCard;
