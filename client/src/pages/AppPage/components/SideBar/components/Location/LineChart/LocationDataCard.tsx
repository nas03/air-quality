import { CHART_CONFIGS } from "@/pages/AnalyticsPage/components/DataChart/config";
import { MonitoringOutputDataType } from "@/types/types";
import { AreaChartOutlined } from "@ant-design/icons";
import { Collapse, CollapseProps } from "antd";
import { useState } from "react";
import AirQualityHistoryChart from "./AirQualityHistoryChart";

export interface ChartOptions {
  label: string;
  value: MonitoringOutputDataType;
  disabled?: boolean;
  default?: number;
}
interface IPropsTemplateCard {
  className?: string;
  title?: string;
  descriptionText?: string;
  district_id: string;
}

interface IPropsHeader {
  chartOptions: ChartOptions[];
  descriptionText?: string;
  selectedValue: 0 | 1;
  onValueChange: (value: 0 | 1) => void;
}
const Header: React.FC<IPropsHeader> = ({ chartOptions, descriptionText, selectedValue, onValueChange }) => {
  return (
    <div className="flex w-full flex-row items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
        <AreaChartOutlined className="text-xl" />
      </div>
      <div className="flex w-full flex-wrap items-center gap-2">
        <p className="text-xs font-semibold dark:text-slate-200">{descriptionText}</p>
        <div className="flex flex-row gap-3 text-xs text-white">
          {chartOptions.map((option: ChartOptions) => (
            <button
              key={option.value}
              className={`rounded-full ${selectedValue === option.value ? "bg-blue-500 dark:bg-blue-600" : "bg-slate-400 dark:bg-slate-600"} px-4 py-1`}
              disabled={option.disabled && true}
              onClick={() => onValueChange(option.value)}>
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const LocationDataCard: React.FC<IPropsTemplateCard> = ({ className, district_id }) => {
  const [dataType, setDataType] = useState<MonitoringOutputDataType>(0);
  const [location, setLocation] = useState<string>("");
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <Header
          chartOptions={Object.values(CHART_CONFIGS)}
          descriptionText={`Diễn biến AQI và PM2.5 trung bình ngày của ${location}`}
          selectedValue={dataType}
          onValueChange={setDataType}
        />
      ),
      className: "h-full w-full rounded-md bg-white p-0 dark:bg-slate-900",
      children: (
        <AirQualityHistoryChart
          className="w-full"
          setLocation={setLocation}
          dataType={dataType}
          district_id={district_id}
        />
      ),
    },
  ];
  return (
    <div className={className}>
      <Collapse
        expandIconPosition="end"
        defaultActiveKey={["1"]}
        className="relative h-full w-full rounded-md border-slate-200 dark:border-slate-700 shadow-sm p-0"
        bordered={false}
        collapsible="icon"
        items={items}
      />
    </div>
  );
};

export default LocationDataCard;
