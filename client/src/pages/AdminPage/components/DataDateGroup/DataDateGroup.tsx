import { CronjobMonitor } from "@/types/db";
import { FiCalendar, FiChevronRight } from "react-icons/fi";
import TableStatusBadge from "../CronjobTable/TableStatusBadge";

interface DataDateGroupProps {
  date: string;
  jobs: {
    raster: CronjobMonitor | null;
    wind: CronjobMonitor[];
    station: CronjobMonitor[];
  };
  isSelected: boolean;
  onDateClick: () => void;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
};

const DataDateGroup = ({ date, jobs, isSelected, onDateClick }: DataDateGroupProps) => {
  const getTotalJobCount = () => jobs.wind.length + jobs.station.length + (jobs.raster ? 1 : 0);

  return (
    <div
      onClick={onDateClick}
      className={`flex flex-col rounded-lg bg-white shadow-sm transition-all cursor-pointer ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
      }`}>
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-2">
          <FiCalendar className="h-5 w-5 text-gray-500" />
          <div>
            <h3 className="font-medium text-gray-700">{formatDate(date)}</h3>
            <p className="text-xs text-gray-500">{getTotalJobCount()} bản ghi</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {jobs.raster && (
              <TableStatusBadge status={jobs.raster.raster_data_status} />
            )}
          </div>
          <FiChevronRight className="h-5 w-5 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default DataDateGroup;