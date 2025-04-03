import { AreaChartOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Collapse, CollapseProps } from "antd";
import { useContext, useEffect, useState } from "react";

import AirQualityCard from "./AirQualityCard";
import DataSourceCard from "./DataSourceCard";
import HealthRecommendationCard from "./HealthRecommendationCard";
import WeatherInfoCard from "./WeatherInfoCard";

import { getWeatherByDistrict } from "@/api/alertSetting";
import useAirQualityData from "@/hooks/useAirQualityData";
import { cn } from "@/lib/utils";
import { getSvgAndColorByAQI } from "../../../config";

import { GeoContext, TimeContext } from "@/context";
import { MonitoringData } from "@/types/consts";
import { AirQualityInfo, DataSourceInfo, WarningTabProps, WeatherInfo } from "./types";

type DataType = 0 | 1;

const CHART_OPTIONS = [
  { label: "Mô hình", value: MonitoringData.INPUT.MODEL },
  { label: "Trạm", value: MonitoringData.INPUT.STATION },
] as const;

const DEFAULT_TEMPERATURE = {
  max: 0,
  min: 0,
  avg: 0,
};

const DataTypeButton = ({ label, isSelected }: { label: string; isSelected: boolean }) => (
  <button
    disabled
    className={cn(
      "rounded-full px-4 py-1 text-xs text-white",
      isSelected ? "bg-blue-500 dark:bg-blue-600" : "bg-slate-400 dark:bg-slate-600",
    )}>
    {label}
  </button>
);

const DataTypeSelector = ({ selectedValue }: { selectedValue: DataType }) => (
  <div className="flex flex-row gap-3 text-xs text-white">
    {CHART_OPTIONS.map(({ label, value }) => (
      <DataTypeButton key={value} label={label} isSelected={selectedValue === value} />
    ))}
  </div>
);

const LayerSelector = ({ selectedValue }: { selectedValue: DataType }) => (
  <div className="flex w-full flex-row items-center gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
      <AreaChartOutlined className="text-xl" />
    </div>
    <div className="flex w-full flex-wrap items-center gap-2">
      <p className="text-xs font-semibold dark:text-slate-200">Loại dữ liệu</p>
      <DataTypeSelector selectedValue={selectedValue} />
    </div>
  </div>
);

const WarningTab: React.FC<WarningTabProps> = ({ district_id, className }) => {
  const [selectedValue, setSelectedValue] = useState<DataType>(0);
  const { time } = useContext(TimeContext);
  const geoContext = useContext(GeoContext);
  const { data, updateData, getProjectedCoordinates } = useAirQualityData(time, geoContext);

  const weatherQuery = useMutation({
    mutationKey: ["weather", district_id, geoContext.coordinate],
    mutationFn: (id: string | [number, number]) => getWeatherByDistrict(id),
  });

  useEffect(() => {
    updateData();
  }, [geoContext.coordinate]);

  useEffect(() => {
    setSelectedValue(geoContext.type);
  }, [geoContext.type]);

  useEffect(() => {
    weatherQuery.mutate(district_id);
  }, [district_id]);

  useEffect(() => {
    const coordinate = getProjectedCoordinates(geoContext);
    if (!coordinate) return;
    const [lon, lat] = coordinate;
    weatherQuery.mutate([lon, lat]);
  }, [geoContext.coordinate]);
  const prepareAirQualityData = (): AirQualityInfo => {
    const aqi = data?.aqi_index ? data?.aqi_index.toString() : "--";
    const { color, icon } = getSvgAndColorByAQI(Number(aqi));

    return {
      aqi_index: aqi,
      pm_25: data?.pm_25 ? data?.pm_25.toFixed(1) : "--",
      status: data.status || "",
      time: data.time || "",
      color,
      icon,
    };
  };

  const prepareDataSourceInfo = (): DataSourceInfo => {
    return {
      name: data?.name || "",
      location: data?.location || [],
      source: selectedValue === 0 ? "Mô hình" : "Trạm",
    };
  };

  const prepareWeatherInfo = (): WeatherInfo => {
    return {
      temperature: weatherQuery.data?.temperature || DEFAULT_TEMPERATURE,
      weather: weatherQuery.data?.weather || "",
      wind_speed: weatherQuery.data?.wind_speed || 0,
    };
  };

  const createCollapseItems = (): CollapseProps["items"] => {
    return [
      {
        key: "1",
        label: <LayerSelector selectedValue={selectedValue} />,
        className: "w-full rounded-md bg-white p-0 first:p-0 dark:bg-slate-900",
        children: (
          <div className="flex w-full flex-col gap-3">
            <DataSourceCard data={prepareDataSourceInfo()} />
            <WeatherInfoCard data={prepareWeatherInfo()} loading={weatherQuery.isPending} />
            <AirQualityCard data={prepareAirQualityData()} />
            <HealthRecommendationCard data={data.recommendation || ""} />
          </div>
        ),
      },
    ];
  };

  return (
    <Collapse
      expandIconPosition="end"
      defaultActiveKey={["1"]}
      className={cn("relative h-fit w-full rounded-md border-slate-200 shadow-sm dark:border-slate-700", className)}
      bordered={false}
      collapsible="icon"
      items={createCollapseItems()}
    />
  );
};

export default WarningTab;
