import { Loading } from "@/components";
import { cn } from "@/lib/utils";
import { Card } from "antd";
import React from "react";
import { IoCloudy, IoRainy, IoSnow, IoSunny, IoThunderstorm } from "react-icons/io5";
import { IPropsWeatherInfoCard } from "./types";

const getIcon = (weatherId: number) => {
    if (weatherId - 800 > 0) return <IoCloudy size={32} className="mb-1 text-blue-500" />;
    else if (weatherId - 800 == 0) return <IoSunny size={32} className="mb-1 text-blue-500" />;
    else if (weatherId - 700 > 0) return <img src="https://openweathermap.org/img/wn/50d.png" />;
    else if (weatherId - 600 >= 0) return <IoSnow size={32} className="mb-1 text-blue-500" />;
    else if (weatherId - 500 >= 0) return <IoRainy size={32} className="mb-1 text-blue-500" />;
    else if (weatherId - 200 >= 0) return <IoThunderstorm size={32} className="mb-1 text-blue-500" />;
};

const getWeatherVi = (weather: string | undefined) => {
    switch (weather) {
        case "Thunderstorm":
            return "Dông";
        case "Drizzle":
            return "Mưa phùn";
        case "Rain":
            return "Mưa";
        case "Snow":
            return "Tuyết";
        case "Clear":
            return "Quang đãng";
        case "Clouds":
            return "Có mây";
        default:
            return "";
    }
};

const TemperatureDisplay = ({ avg }: { avg: number; max: number; min: number }) => (
    <div className="flex h-full flex-col">
        <p className="text-4xl font-bold text-gray-800">{avg}&#8451;</p>
        {/*  <div className="mt-1 flex flex-row gap-2">
            <p className="text-xs text-orange-500">H: {max}&#8451;</p>
            <p className="text-xs text-blue-400">L: {min}&#8451;</p>
        </div> */}
    </div>
);

const WeatherDisplay = ({
    weather,
    windSpeed,
}: {
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    };
    windSpeed: number;
}) => (
    <div className="flex h-full flex-col items-center">
        {getIcon(weather.id)}
        {/* <img src={`https://rodrigokamada.github.io/openweathermap/images/${weather.icon}_t.png`} className="mb-1 h-[64px] w-[64px] text-blue-500" /> */}
        <p className="text-sm font-medium">
            {/*  {weather.description
                ? [
                      weather.description[0].toUpperCase(),
                      ...weather.description.slice(1, weather.description.length),
                  ].join("")
                : ""} */}{" "}
            {getWeatherVi(weather.main)}
        </p>
        <p className="mt-1 text-sm text-gray-600">Tốc độ gió: {windSpeed}m/s</p>
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
