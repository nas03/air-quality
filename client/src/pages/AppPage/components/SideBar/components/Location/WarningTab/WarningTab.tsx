import { getWeatherByDistrict } from "@/api/alertSetting";
import { GeoContext, TimeContext } from "@/context";
import useAirQualityData from "@/hooks/useAirQualityData";
import { cn } from "@/lib/utils";
import { MonitoringData } from "@/types/consts";
import { AreaChartOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Collapse, CollapseProps } from "antd";
import { useContext, useEffect, useState } from "react";
import AirQualityInfoPanel from "./AirQualityInfoPanel";

interface WarningTabProps extends React.ComponentPropsWithRef<"div"> {
  district_id: string;
}

type DataType = 0 | 1;

const CHART_OPTIONS = [
  { label: "Mô hình", value: MonitoringData.INPUT.MODEL },
  { label: "Trạm", value: MonitoringData.INPUT.STATION },
] as const;

const LayerSelector = ({ selectedValue }: { selectedValue: DataType }) => (
  <div className="flex w-full flex-row items-center gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
      <AreaChartOutlined className="text-xl" />
    </div>
    <div className="flex w-full flex-wrap items-center gap-2">
      <p className="text-xs font-semibold dark:text-slate-200">Loại dữ liệu</p>
      <div className="flex flex-row gap-3 text-xs text-white">
        {CHART_OPTIONS.map(({ label, value }) => (
          <button
            disabled
            key={value}
            className={`rounded-full ${selectedValue === value ? "bg-blue-500 dark:bg-blue-600" : "bg-slate-400 dark:bg-slate-600"} px-4 py-1`}>
            {label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const WarningTab: React.FC<WarningTabProps> = ({ district_id, className }) => {
  const [selectedValue, setSelectedValue] = useState<DataType>(0);
  const { time } = useContext(TimeContext);
  const geoContext = useContext(GeoContext);
  const { data, updateData } = useAirQualityData(time, geoContext);

  useEffect(() => {
    updateData();
  }, [geoContext.coordinate]);

  useEffect(() => {
    setSelectedValue(geoContext.type);
  }, [geoContext.type]);

  const weatherData = useMutation({
    mutationKey: ["weather", district_id],
    mutationFn: (district_id: string) => getWeatherByDistrict(district_id),
  });

  useEffect(() => {
    weatherData.mutate(district_id);
  }, [district_id]);

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <LayerSelector selectedValue={selectedValue} />,
      className: "w-full rounded-md bg-white p-0 first:p-0 dark:bg-slate-900",
      children: (
        <AirQualityInfoPanel
          aqi_index={data?.aqi_index ? String(data?.aqi_index) : "--"}
          district_id={district_id}
          name={data?.name || ""}
          location={data?.location}
          pm_25={data?.pm_25 ? String(data?.pm_25.toFixed(2)) : "--"}
          recommendation={data.recommendation}
          type={selectedValue === 0 ? "model" : "station"}
          status={data.status}
          weatherData={weatherData.data || null}
        />
      ),
    },
  ];
  return (
    <Collapse
      expandIconPosition="end"
      defaultActiveKey={["1"]}
      className={cn("relative h-fit w-full rounded-md border-slate-200 shadow-sm dark:border-slate-700", className)}
      bordered={false}
      collapsible="icon"
      items={items}
    />
  );
};

export default WarningTab;
