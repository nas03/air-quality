import { Loading } from "@/components";
import { cn } from "@/lib/utils";
import { Card } from "antd";
import React from "react";
import { IoCloudy } from "react-icons/io5";
import { IPropsWeatherInfoCard } from "./types";

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

const WeatherInfoCard: React.FC<IPropsWeatherInfoCard> = ({ className, loading = false, data, ...props }) => {
  const { temperature, weather, wind_speed } = data;

  return (
    <Card className={cn("h-[8rem] w-full rounded-lg border border-gray-200 hover:shadow-md", className)} {...props}>
      <Loading loading={loading} className="h-full w-full">
        <div className="flex w-full flex-row items-center justify-between">
          <TemperatureDisplay avg={temperature.avg} max={temperature.max} min={temperature.min} />
          <WeatherDisplay weather={weather} windSpeed={wind_speed} />
        </div>
      </Loading>
    </Card>
  );
};

export default WeatherInfoCard;
