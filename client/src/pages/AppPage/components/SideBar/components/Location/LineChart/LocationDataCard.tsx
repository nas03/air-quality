import { CHART_CONFIGS } from "@/pages/AnalyticsDashboard/components/DataChart/config";
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
      <AreaChartOutlined className="text-3xl text-blue-600" />
      <div className="flex w-full flex-wrap items-center gap-2">
        <p className="text-xs font-semibold">{descriptionText}</p>
        <div className="flex flex-row gap-3 text-xs text-white">
          {chartOptions.map((option: ChartOptions) => (
            <button
              key={option.value}
              className={`rounded-full ${selectedValue === option.value ? "bg-blue-500" : "bg-slate-400"} px-4 py-1`}
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
      className: "h-full w-full rounded-md bg-white p-0",
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
        className="relative h-full w-full rounded-md p-0"
        bordered={false}
        collapsible="icon"
        items={items}
      />
    </div>
  );
};

export default LocationDataCard;
