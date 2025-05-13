import { cn } from "@/lib/utils";
import { Card, Skeleton } from "antd";
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

const TemperatureDisplay = ({ avg, loading }: { avg: number | string; max: number; min: number; loading: boolean }) => (
    <div className="flex h-full flex-col justify-center">
        {loading ? (
            <Skeleton.Input active size="large" style={{ width: 60, height: 40, borderRadius: 8 }} />
        ) : (
            <p className="text-4xl font-bold text-gray-800">{avg}&#8451;</p>
        )}
        {/*  <div className="mt-1 flex flex-row gap-2">
            <p className="text-xs text-orange-500">H: {max}&#8451;</p>
            <p className="text-xs text-blue-400">L: {min}&#8451;</p>
        </div> */}
    </div>
);

const WeatherDisplay = ({
    weather,
    windSpeed,
    loading,
}: {
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    };
    windSpeed: number;
    loading: boolean;
}) => (
    <div className="flex h-full flex-col items-center justify-center">
        {loading ? <Skeleton.Avatar active size={32} shape="circle" className="mb-1" /> : getIcon(weather.id)}
        <p className="flex min-h-[20px] items-center text-sm font-medium">
            {loading ? (
                <Skeleton.Input active size="small" style={{ width: 60, height: 16, borderRadius: 4 }} />
            ) : weather.main ? (
                getWeatherVi(weather.main)
            ) : (
                "--"
            )}
        </p>
        <p className="mt-1 flex min-h-[20px] items-center text-sm text-gray-600">
            {loading ? (
                <Skeleton.Input active size="small" style={{ width: 80, height: 16, borderRadius: 4 }} />
            ) : (
                `Tốc độ gió: ${windSpeed}m/s`
            )}
        </p>
    </div>
);

const WeatherInfoCard: React.FC<IPropsWeatherInfoCard> = ({ className, loading = false, data, ...props }) => {
    const { temperature, weather, wind_speed } = data;

    return (
        <Card className={cn("w-full rounded-lg border border-gray-200 hover:shadow-md", className)} {...props}>
            <div className="mb-2 flex w-full items-center justify-between">
                <span className="text-lg font-semibold tracking-tight text-gray-900">Thời tiết hiện tại</span>
            </div>
            {loading ? (
                <div className="flex h-[5rem] w-full items-center justify-center">
                    <Skeleton active paragraph={false} />
                </div>
            ) : (
                <div className="flex w-full flex-row items-center justify-between">
                    <TemperatureDisplay
                        avg={temperature.avg}
                        max={temperature.max}
                        min={temperature.min}
                        loading={false}
                    />
                    <WeatherDisplay weather={weather} windSpeed={wind_speed} loading={false} />
                </div>
            )}
        </Card>
    );
};

export default WeatherInfoCard;
