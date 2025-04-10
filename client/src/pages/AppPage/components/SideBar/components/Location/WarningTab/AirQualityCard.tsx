import { cn } from "@/lib/utils";
import { colorMap } from "@/types/consts";
import { FieldTimeOutlined } from "@ant-design/icons";
import React from "react";
import { AirQualityCardProps } from "./types";

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
                        <img
                            src={`aqi/${data.icon}`}
                            className="h-14 w-14 object-contain"
                            alt="Air quality indicator"
                        />
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

export default AirQualityCard;
