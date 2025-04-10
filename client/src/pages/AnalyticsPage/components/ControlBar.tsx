import { AnalyticContext } from "@/context";
import useGetAllDistricts from "@/hooks/useGetAllDistricts";
import { cn } from "@/lib/utils";
import { MonitoringData } from "@/types/consts";
import { AnalyticData, MonitoringOutputDataType } from "@/types/types";
import { Link } from "@tanstack/react-router";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useContext, useEffect } from "react";

dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(timezone);

// Đặt múi giờ thành GMT+7
dayjs.tz.setDefault("Asia/Bangkok");

interface IPropsControlBar extends React.ComponentPropsWithoutRef<"div"> {}

type DayJsTimeRange = [dayjs.Dayjs | null, dayjs.Dayjs | null] | null;

const DEFAULT_DATE_RANGE: DayJsTimeRange = [
    dayjs().tz().subtract(3, "days").startOf("day"),
    dayjs().tz().add(7, "days").endOf("day"),
];

const DATA_TYPE_OPTIONS = [
    { value: MonitoringData.OUTPUT.AQI, label: "Chỉ số AQI" },
    { value: MonitoringData.OUTPUT.PM25, label: "Bụi PM 2.5" },
];

const ControlBar: React.FC<IPropsControlBar> = ({ className }) => {
    const { setAnalyticData } = useContext(AnalyticContext);
    const provincesData = useGetAllDistricts();

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
        <div
            className={cn(
                "relative flex flex-row items-center justify-between bg-gradient-to-r from-[#003366] to-[#1a237e] px-6 py-4",
                className,
            )}>
            <div className="flex items-center space-x-4">
                <Link to="/" className="group relative">
                    <img
                        src="/logo_no_text.svg"
                        alt="Logo Air Quality"
                        className="h-8 w-auto transition-transform duration-200 group-hover:scale-105"
                    />
                </Link>
                <div>
                    <h1 className="bg-gradient-to-r from-blue-100 to-blue-50 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                        Bảng Điều Khiển Phân Tích
                    </h1>
                    <p className="text-xs font-medium text-gray-200">
                        Phân tích và trực quan hóa dữ liệu chất lượng không khí
                    </p>
                </div>
            </div>

            <div className="flex flex-row items-center gap-5 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-100">Tỉnh/Thành:</span>
                    <Select
                        className="w-[8.5rem]"
                        size="small"
                        defaultValue="VNM.27_1"
                        options={
                            provincesData.data
                                ? Array.from(
                                      new Map(
                                          provincesData.data.map((d: any) => [
                                              d.province_id,
                                              { value: d.province_id, label: d.vn_province },
                                          ]),
                                      ).values(),
                                  )
                                : []
                        }
                        onSelect={handleLocationChange}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-100">Khoảng Thời Gian:</span>
                    <DatePicker.RangePicker
                        size="small"
                        placement="bottomRight"
                        defaultValue={DEFAULT_DATE_RANGE}
                        onChange={handleTimeRangeChange}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-100">Loại Dữ Liệu:</span>
                    <Select
                        className="w-[7.5rem]"
                        size="small"
                        defaultValue={0}
                        options={DATA_TYPE_OPTIONS}
                        onSelect={handleDataTypeChange}
                    />
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400/30 via-indigo-400/30 to-transparent"></div>
        </div>
    );
};

export default ControlBar;
