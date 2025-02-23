import { GeoContext, TimeContext } from "@/context";
import useAirQualityData from "@/hooks/useAirQualityData";
import { cn } from "@/lib/utils";
import { MonitoringData } from "@/types/consts";
import { AreaChartOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
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
    <AreaChartOutlined className="text-3xl text-blue-600" />
    <div className="flex w-full flex-wrap items-center gap-2">
      <p className="text-xs font-semibold">Loại dữ liệu</p>
      <div className="flex flex-row gap-3 text-xs text-white">
        {CHART_OPTIONS.map(({ label, value }) => (
          <button
            disabled
            key={value}
            className={`rounded-full ${selectedValue === value ? "bg-blue-500" : "bg-slate-400"} px-4 py-1`}
          >
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

  return (
    <Collapse
      expandIconPosition="end"
      defaultActiveKey={["1"]}
      className={cn("relative h-fit w-full rounded-md p-0", className)}
      bordered={false}
      collapsible="icon"
    >
      <Collapse.Panel
        key={1}
        header={<LayerSelector selectedValue={selectedValue} />}
        className="w-full rounded-md bg-white p-0 first:p-0"
      >
        <AirQualityInfoPanel
          aqi_index={data?.aqi_index ? String(data?.aqi_index) : "--"}
          district_id={district_id}
          name={data?.name || ""}
          location={data?.location}
          pm_25={data?.pm_25 ? String(data?.pm_25.toFixed(2)) : "--"}
          recommendation={data.recommendation}
          type={selectedValue === 0 ? "model" : "station"}
          status={data.status}
        />
      </Collapse.Panel>
    </Collapse>
  );
};

export default WarningTab;
