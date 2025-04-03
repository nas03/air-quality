import { cn } from "@/lib/utils";
import { colorMap } from "@/types/consts";
import { AimOutlined, FieldTimeOutlined, HeartOutlined } from "@ant-design/icons";
import { Card } from "antd";
import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { IoCloudy } from "react-icons/io5";
import {
  AirQualityCardProps,
  DataSourceCardProps,
  HealthRecommendationCardProps,
  IPropsWeatherInfoCard,
} from "./types";

// DataSource Card Components
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

// AQI Card Components
const AirQualityStatus = ({ status, bgClass }: { status: string; bgClass: string }) => (
  <div className={`rounded-lg ${bgClass} p-2 text-center`}>
    <p className="font-semibold tracking-wide">{status || ""}</p>
  </div>
);

const AqiMetric = ({
  label,
  value,
  textColorClass,
}: {
  label: string;
  value: number | string;
  textColorClass: string;
}) => (
  <div className="text-center">
    <h4 className={`text-xs font-medium ${textColorClass}`}>{label}</h4>
    <p className="mt-1 text-xl font-bold">{value}</p>
  </div>
);

const TimeDisplay = ({ time }: { time: string }) => {
  const formattedTime = time ? time.split("-").reverse().join("/") : "";

  return (
    <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs">
      <FieldTimeOutlined />
      <span>{formattedTime}</span>
    </div>
  );
};

const AirQualityCard: React.FC<AirQualityCardProps> = ({ data }) => {
  const isYellow = data.color === colorMap[1];
  const textColor = isYellow ? "text-gray-800" : "text-white";
  const labelTextColor = isYellow ? "text-gray-600" : "text-white/70";

  return (
    <div
      className={cn("overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md", textColor)}
      style={{
        backgroundColor: data.color,
        borderColor: data.color,
      }}>
      <div className="space-y-4 p-4">
        <div className="flex flex-row items-center justify-between">
          <h3 className={cn("text-sm font-bold", textColor)}>Chất lượng không khí</h3>
          <TimeDisplay time={data.time} />
        </div>

        <AirQualityStatus status={data.status} bgClass="bg-white/10" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={`aqi/${data.icon}`} className="h-14 w-14 object-contain" alt="Air quality indicator" />
          </div>

          <div className="flex gap-6">
            <AqiMetric label="AQI VN" value={data.aqi_index} textColorClass={labelTextColor} />
            <AqiMetric label="PM2.5 (µg/m3)" value={data.pm_25} textColorClass={labelTextColor} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Health Recommendation Card
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

// Weather Info Card
const TemperatureDisplay = ({ avg, max, min }: { avg: number; max: number; min: number }) => (
  <div className="flex h-full flex-col">
    <p className="text-4xl font-bold text-gray-800">{avg}&#8451;</p>
    <div className="mt-1 flex flex-row gap-2">
      <p className="text-xs text-orange-500">H: {max}&#8451;</p>
      <p className="text-xs text-blue-400">L: {min}&#8451;</p>
    </div>
  </div>
);

const WeatherDisplay = ({ weather, windSpeed }: { weather: string; windSpeed: number }) => (
  <div className="flex h-full flex-col items-center">
    <IoCloudy size={32} className="mb-1 text-blue-500" />
    <p className="text-sm font-medium">{weather}</p>
    <p className="mt-1 text-sm text-gray-600">Wind: {windSpeed}m/s</p>
  </div>
);

const WeatherInfoCard: React.FC<IPropsWeatherInfoCard> = ({ className, data, ...props }) => {
  const { temperature, weather, wind_speed } = data;

  return (
    <Card className={cn("w-full rounded-lg border border-gray-200 hover:shadow-md", className)} {...props}>
      <div className="flex w-full flex-row items-center justify-between">
        <TemperatureDisplay avg={temperature.avg} max={temperature.max} min={temperature.min} />
        <WeatherDisplay weather={weather} windSpeed={wind_speed} />
      </div>
    </Card>
  );
};

export const WarningTabInfoCards = {
  HealthRecommendationCard,
  DataSourceCard,
  AirQualityCard,
  WeatherInfoCard,
};
