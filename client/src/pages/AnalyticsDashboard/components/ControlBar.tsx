import { AnalyticContext } from "@/context";
import useAllProvinces from "@/hooks/useDistrictsData";
import { cn } from "@/lib/utils";
import { MonitoringData } from "@/types/consts";
import { AnalyticData, MonitoringOutputDataType } from "@/types/types";
import { Link } from "@tanstack/react-router";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useContext, useEffect } from "react";

dayjs.extend(isSameOrBefore);

interface IPropsControlBar extends React.ComponentPropsWithoutRef<"div"> {}

type DayJsTimeRange = [dayjs.Dayjs | null, dayjs.Dayjs | null] | null;

const DEFAULT_DATE_RANGE: DayJsTimeRange = [dayjs("2024-11-01"), dayjs("2024-11-06")];
const DATA_TYPE_OPTIONS = [
  { value: MonitoringData.OUTPUT.AQI, label: "AQI" },
  { value: MonitoringData.OUTPUT.PM25, label: "PM 2.5" },
];
const ControlBar: React.FC<IPropsControlBar> = ({ className }) => {
  const { setAnalyticData } = useContext(AnalyticContext);
  const provincesData = useAllProvinces();
  const getDateRange = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): string[] => {
    const dates: string[] = [];
    let currentDate = startDate.clone();

    while (currentDate.isSameOrBefore(endDate)) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }

    return dates;
  };

  const handleTimeRangeChange = (dateRange: DayJsTimeRange) => {
    if (!dateRange?.[0] || !dateRange?.[1]) return;

    const dates = getDateRange(dateRange[0], dateRange[1]);
    setAnalyticData((prev: AnalyticData) => ({ ...prev, dateRange: dates }));
  };

  const handleDataTypeChange = (value: number) => {
    setAnalyticData((prev) => ({
      ...prev,
      dataType: value as MonitoringOutputDataType,
    }));
  };

  const handleLocationChange = (location: string) => {
    setAnalyticData((prev) => ({ ...prev, province_id: location }));
  };

  useEffect(() => {
    handleTimeRangeChange(DEFAULT_DATE_RANGE);
    handleDataTypeChange(0);
    handleLocationChange("VNM.27_1");
  }, []);
  return (
    <div className={cn(className, "flex flex-row items-center justify-between bg-[#0A192F] px-5 py-3")}>
      <Link to="/">
        <img src="logo.svg" alt="logo" className="h-full" /* onClick={}  */ />
      </Link>
      <div className="flex flex-row items-center gap-5">
        <Select
          className="w-[8rem]"
          defaultValue="VNM.27_1"
          options={provincesData.data}
          onSelect={handleLocationChange}
        />
        <DatePicker.RangePicker
          placement="bottomRight"
          defaultValue={DEFAULT_DATE_RANGE}
          onChange={handleTimeRangeChange}
        />
        <Select className="w-[5.5rem]" defaultValue={0} options={DATA_TYPE_OPTIONS} onSelect={handleDataTypeChange} />
      </div>
    </div>
  );
};

export default ControlBar;
