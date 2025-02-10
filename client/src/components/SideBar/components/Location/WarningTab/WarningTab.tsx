import AirQualityInfoPanel from "@/components/SideBar/components/Location/WarningTab/AirQualityInfoPanel";

import { GeoContext, TimeContext } from "@/context";
import { convertCoordinate } from "@/lib/utils";
import { AreaChartOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import { useContext, useEffect, useState } from "react";

interface DataType {
  aqi_index: number;
  pm_25: number;
  status: string;
  time: string;
  name: string;
  location: string | string[];
  source: string;
}
interface IPropsWarningTab {
  district_id: string;
}
const WarningTab: React.FC<IPropsWarningTab> = ({ district_id }) => {
  const [selectedValue, setSelectedValue] = useState<0 | 1>(0);
  const { time } = useContext(TimeContext);
  const geoContext = useContext(GeoContext);
  const [data, setData] = useState<DataType>({
    aqi_index: 0,
    pm_25: 0,
    status: "string",
    time: time,
    name: "",
    location: "",
    source: "",
  });

  const chartOptions = [
    { label: "Mô hình", value: 0 },
    { label: "Trạm", value: 1 },
  ] as const;

  const getData = () => {
    const getProjectedCoordinates = () => {
      const sourceProjection = "EPSG:3857";
      const targetProjection = geoContext.type === 0 ? "EPSG:4326" : "EPSG:3857";
      return convertCoordinate(sourceProjection, targetProjection, geoContext.coordinate);
    };

    const projectedCoordinate = getProjectedCoordinates();
    if (geoContext.type === 0 && !projectedCoordinate) return;

    const updatedData = {
      aqi_index: geoContext.value ?? 0,
      pm_25: geoContext.value ?? 0,
      status: "Có hại cho sức khoẻ",
      time,
      name: geoContext.location,
      location: projectedCoordinate ? [projectedCoordinate[0], projectedCoordinate[1]] : ["--", "--"],
      source: "Trạm",
    };

    setData((prev) => ({ ...prev, ...updatedData }));
  };

  useEffect(() => {
    getData();
  }, [geoContext.coordinate]);

  useEffect(() => {
    setSelectedValue(geoContext.type);
  }, [geoContext.type]);

  const DataTypeSelector = () => (
    <div className="flex w-full flex-row items-center gap-3">
      <AreaChartOutlined className="text-3xl text-blue-600" />
      <div className="flex w-full flex-wrap items-center gap-2">
        <p className="text-xs font-semibold">Loại dữ liệu</p>
        <div className="flex flex-row gap-3 text-xs text-white">
          {chartOptions.map(({ label, value }) => (
            <button
              disabled
              key={value}
              className={`rounded-full ${selectedValue === value ? "bg-blue-500" : "bg-slate-400"} px-4 py-1`}
              onClick={() => setSelectedValue(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Collapse
        expandIconPosition="end"
        defaultActiveKey={["1"]}
        className="relative h-fit w-full rounded-md p-0"
        bordered={false}
        collapsible="icon"
      >
        <Collapse.Panel key={1} header={<DataTypeSelector />} className="w-full rounded-md bg-white p-0 first:p-0">
          <AirQualityInfoPanel
            aqi_index={data?.pm_25 ? String(data?.pm_25) : "--"}
            district_id={district_id}
            name={data?.name || ""}
            location={data?.location}
            pm_25={data?.pm_25 ? String(data?.pm_25) : "--"}
            recommendation="Nhóm người nhạy cảm có thể chịu ảnh hưởng sức khỏe. Số đông không có nguy cơ bị tác động"
            type={selectedValue === 0 ? "model" : "station"}
          />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default WarningTab;
