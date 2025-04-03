import { AlertInfo, deleteUserAlertById, getUserAlertByDistrict } from "@/api/alertSetting";
import { cn } from "@/lib/utils";
import { AlertSetting } from "@/types/db";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { Card, Tooltip, Typography } from "antd";
import React, { useRef, useState } from "react";
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
  if (isToday(itemDate)) return "Today";

  const month = itemDate.getMonth() + 1;
  const date = itemDate.getDate();
  return `${date < 10 ? `0${date}` : date}/${month < 10 ? `0${month}` : month}`;
};

const getAqiColor = (value: number): string => {
  if (value <= 50) return "bg-green-500";
  if (value <= 100) return "bg-yellow-500";
  if (value <= 150) return "bg-orange-500";
  return "bg-red-500";
};

const getAqiLabel = (value: number): string => {
  if (value <= 50) return "Good";
  if (value <= 100) return "Moderate";
  if (value <= 150) return "Poor";
  return "Bad";
};

const InfoCard: React.FC<IPropsInfoCard> = ({ className, data, onDelete, ...props }) => {
  console.log({ data });
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

  return (
    <Card className={cn("w-full rounded-lg shadow-md", className)} {...props}>
      <div className="items-cen mb-3 flex w-full flex-row justify-between">
        <Typography.Title level={5} className="">
          {currentWeatherData?.location}
        </Typography.Title>
        <Tooltip title={"Delete this alert"} getPopupContainer={() => document.body}>
          <div ref={deleteIconRef}>
            <MdDeleteOutline onClick={handleDelete} size={30} className="cursor-pointer p-1 text-red-500" />
          </div>
        </Tooltip>
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex h-full flex-col">
          <p className="text-4xl font-bold text-gray-800">{currentWeatherData?.temperature.avg}&#8451;</p>
          <p className="mt-1 text-sm text-gray-600">Wind: {currentWeatherData?.wind_speed}m/s</p>
        </div>
        <div className="flex h-full flex-col items-center">
          <IoCloudy size={32} className="mb-1 text-blue-500" />
          <p className="text-sm font-medium">{currentWeatherData?.weather}</p>
          <div className="mt-1 flex flex-row gap-2">
            <p className="text-xs text-orange-500">H: {currentWeatherData?.temperature.max}&#8451;</p>
            <p className="text-xs text-blue-400">L: {currentWeatherData?.temperature.min}&#8451;</p>
          </div>
        </div>
      </div>
      <div className="mt-4 w-full border-t border-gray-200 pt-3">
        <Typography.Text strong className="mb-2 flex w-full items-center justify-center text-sm text-gray-700">
          AQI VN Index Forecast
        </Typography.Text>
        <div className="overflow-x-auto">
          <div className="flex w-full flex-wrap justify-start">
            {values.labels.map((day, index) => (
              <Tooltip
                key={index}
                title={getAqiLabel(values.data[index])}
                className="max-2xl:basis-1/4 2xl:basis-[1/8]">
                <div className="flex flex-col items-center px-1" style={{ width: `${100 / values.labels.length}%` }}>
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-white",
                      getAqiColor(values.data[index]),
                    )}>
                    {values.data[index]}
                  </div>
                  <span className="mt-1 text-xs font-medium text-gray-600">{day}</span>
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
