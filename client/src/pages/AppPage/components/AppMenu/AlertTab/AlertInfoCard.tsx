import { AlertInfo, deleteUserAlertById, getUserAlertByDistrict } from "@/api/alertSetting";
import { cn } from "@/lib/utils";
import { AlertSetting } from "@/types/db";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { Button, Card, Tooltip, Typography } from "antd";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { IoCloudy } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";

interface IPropsAlertInfoCards extends React.ComponentPropsWithRef<"div"> {
    alertSettingData: AlertSetting[];
}

interface IPropsInfoCard extends React.ComponentPropsWithRef<"div"> {
    query: UseQueryResult<AlertInfo, Error>;
    data: AlertInfo;
    onDelete: () => void;
}

const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return "Today";

    const itemDate = new Date(dateStr);
    // if (isToday(itemDate)) return dateStr;

    const month = itemDate.getMonth() + 1;
    const date = itemDate.getDate();
    return `${date < 10 ? `0${date}` : date}/${month < 10 ? `0${month}` : month}`;
};

const getAqiColor = (value: number): string => {
    if (value <= 50) return "bg-green-500";
    if (value <= 100) return "bg-yellow-500";
    if (value <= 150) return "bg-orange-500";
    if (value <= 200) return "bg-red-500";
    if (value <= 300) return "bg-[#70006a]";
    else return "bg-[#7e0023]";
};

const getAqiLabel = (value: number): string => {
    if (value <= 50) return "Tốt";
    if (value <= 100) return "Trung bình";
    if (value <= 150) return "Không tốt";
    if (value <= 200) return "Có hại";
    if (value <= 300) return "Rất có hại";
    return "Nguy hiểm";
};

const InfoCard: React.FC<IPropsInfoCard> = ({ className, data, onDelete, ...props }) => {
    const values = {
        labels: data.weather.map((item) => formatDate(item.date)),
        data: data.forecast,
    };
    const currentWeatherData = data.weather.find((item) => item.date && isToday(new Date(item.date)));
    const deleteIconRef = useRef(null);

    const handleDelete = async () => {
        try {
            await deleteUserAlertById(currentWeatherData?.id || -1);
            onDelete();
        } catch (error) {
            console.error("Failed to delete alert:", error);
        }
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
    return (
        <Card
            className={cn(
                "w-full rounded-2xl border-[2pt] border-gray-100 bg-white/80 p-6 backdrop-blur-md transition-shadow hover:shadow-2xl",
                className,
            )}
            {...props}>
            <div className="mb-4 flex w-full flex-row items-center justify-between">
                <Typography.Title level={5} className="!mb-0 !text-lg !font-semibold tracking-tight text-gray-900">
                    {currentWeatherData?.location}
                </Typography.Title>
                <Tooltip title={"Xoá"} getPopupContainer={() => document.body}>
                    <div ref={deleteIconRef}>
                        <motion.div
                            whileHover={{ scale: 1.12, rotate: -10 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-block transition-transform duration-200">
                            <Button
                                shape="circle"
                                danger
                                ghost
                                size="small"
                                icon={<MdDeleteOutline size={18} />}
                                onClick={handleDelete}
                                className="flex items-center justify-center border-none bg-red-50 text-red-500 shadow-sm transition-colors duration-200 hover:bg-red-100 hover:text-red-600"
                                style={{ boxShadow: "0 2px 8px 0 rgba(255,77,79,0.08)" }}
                            />
                        </motion.div>
                    </div>
                </Tooltip>
            </div>
            <div className="flex w-full flex-row items-center justify-between gap-4">
                <div className="flex h-full flex-col justify-center">
                    <p className="text-4xl font-extrabold leading-tight text-gray-800 2xl:text-5xl">
                        {currentWeatherData?.temperature.avg}&#8451;
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-500 2xl:text-base">
                        Tốc độ gió:{" "}
                        <span className="font-semibold text-blue-500">{currentWeatherData?.wind_speed}m/s</span>
                    </p>
                </div>
                <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-blue-100 bg-blue-50 px-4 py-2">
                    <IoCloudy size={36} className="mb-1 text-blue-400" />
                    <p className="text-sm font-semibold text-blue-700">{getWeatherVi(currentWeatherData?.weather)}</p>
                </div>
            </div>
            <div className="mt-6 w-full border-t border-gray-100 pt-4">
                <Typography.Text
                    strong
                    className="mb-3 flex w-full items-center justify-center text-base tracking-wide text-gray-700">
                    Dự báo chỉ số AQI VN
                </Typography.Text>
                <div className="w-full">
                    <div className="grid grid-cols-4 grid-rows-2 gap-2">
                        {values.labels.map((day, index) => (
                            <Tooltip key={index} title={getAqiLabel(values.data[index])} className="flex-shrink-0">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={cn(
                                            "flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-base font-bold text-white shadow-md transition-transform duration-200 hover:scale-105",
                                            getAqiColor(values.data[index]),
                                        )}>
                                        {values.data[index]}
                                    </div>
                                    <span className="mt-2 text-xs font-medium tracking-tight text-gray-500">{day}</span>
                                </div>
                            </Tooltip>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

const AlertInfoCards: React.FC<IPropsAlertInfoCards> = ({ className, alertSettingData, ...props }) => {
    const [activeAlerts, setActiveAlerts] = useState<AlertSetting[]>(alertSettingData);

    const queries = useQueries({
        queries: activeAlerts.map((data) => ({
            queryKey: ["alert", data.district_id, data.user_id],
            queryFn: () => getUserAlertByDistrict(data.user_id, data.district_id),
        })),
    });

    const handleDeleteCard = (index: number) => {
        setActiveAlerts((prev) => prev.filter((_, i) => i !== index));
    };
    useEffect(() => {
        setActiveAlerts(alertSettingData);
        queries.forEach((query) => query.refetch());
    }, [alertSettingData]);
    return (
        <div className="flex h-full w-full flex-col gap-5" {...props}>
            {queries.map((query, index) => (
                <InfoCard
                    key={index}
                    query={query}
                    data={query.data || { weather: [], forecast: [] }}
                    onDelete={() => handleDeleteCard(index)}
                />
            ))}
        </div>
    );
};

export default AlertInfoCards;
