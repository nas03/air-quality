import { CronjobMonitor } from "@/types/db";
import { FiInfo } from "react-icons/fi";
import DataSection from "./DataSection";

interface DataDateDetailProps {
  date: string;
  jobs: {
    raster: CronjobMonitor | null;
    wind: CronjobMonitor[];
    station: CronjobMonitor[];
  };
}

const DataDateDetail = ({ date, jobs }: DataDateDetailProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col rounded-lg bg-white shadow-md lg:col-span-2">
      <div className="flex-none border-b border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold text-gray-700">
            <FiInfo className="mr-2 h-5 w-5" />
            {formatDate(date)}
          </h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6 divide-y divide-gray-100">
          {/* Raster Data Section */}
          <DataSection 
            title="Dữ liệu Raster" 
            type="raster"
            data={jobs.raster} 
            date={date}
            getStatus={(job) => job.raster_data_status} 
          />

          {/* Wind Data Section */}
          <DataSection 
            title="Dữ liệu Gió" 
            type="wind"
            data={jobs.wind}
            date={date}
            getStatus={(job) => job.wind_data_status} 
          />
          
          {/* Station Data Section */}
          <DataSection 
            title="Dữ liệu Trạm" 
            type="station"
            data={jobs.station}
            date={date}
            getStatus={(job) => job.station_data_status} 
          />
        </div>
      </div>
    </div>
  );
};

export default DataDateDetail;