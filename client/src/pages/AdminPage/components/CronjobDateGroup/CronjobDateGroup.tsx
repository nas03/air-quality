import { CronjobMonitor } from "@/types/db";
import { FiCalendar, FiChevronRight, FiDownload } from "react-icons/fi";
import TableStatusBadge from "../CronjobTable/TableStatusBadge";

interface CronjobDateGroupProps {
    date: string;
    jobs: {
        raster: CronjobMonitor | null;
        wind: CronjobMonitor[];
        station: CronjobMonitor[];
    };
    isSelected: boolean;
    onDateClick: () => void;
    onDownloadClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

export const CronjobDateGroup = ({ date, jobs, isSelected, onDateClick, onDownloadClick }: CronjobDateGroupProps) => {
    const getTotalJobCount = () => jobs.wind.length + jobs.station.length + (jobs.raster ? 1 : 0);
    const hasSuccessfulData = () => {
        return (
            (jobs.raster && jobs.raster.raster_data_status === 1) ||
            jobs.wind.some((job) => job.wind_data_status === 1) ||
            jobs.station.some((job) => job.station_data_status === 1)
        );
    };

    return (
        <div
            onClick={onDateClick}
            className={`flex cursor-pointer flex-col rounded-lg bg-white shadow-sm transition-all ${
                isSelected ? "bg-blue-50 ring-2 ring-blue-500" : "hover:bg-gray-50"
            }`}>
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-2">
                    <FiCalendar className="h-5 w-5 text-gray-500" />
                    <div>
                        <h3 className="font-medium text-gray-700">{formatDate(date)}</h3>
                        <p className="text-xs text-gray-500">{getTotalJobCount()} bản ghi</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onDownloadClick}
                        disabled={!hasSuccessfulData()}
                        className={`flex items-center space-x-1 rounded-md px-2 py-1 text-xs ${
                            hasSuccessfulData()
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                : "cursor-not-allowed bg-gray-100 text-gray-400"
                        }`}>
                        <FiDownload className="h-3 w-3" />
                        <span>Xuất dữ liệu</span>
                    </button>
                    <div className="flex space-x-2">
                        {jobs.raster && <TableStatusBadge status={jobs.raster.raster_data_status} />}
                    </div>
                    <FiChevronRight className="h-5 w-5 text-gray-500" />
                </div>
            </div>
        </div>
    );
};
