import { CronjobMonitor } from "@/types/db";
import DataItem from "./DataItem";

interface DataSectionProps {
    title: string;
    type: "raster" | "wind" | "station";
    data: CronjobMonitor[] | CronjobMonitor | null;
    date: string;
    getStatus: (job: CronjobMonitor) => number;
}

const DataSection = ({ title, type, data, date, getStatus }: DataSectionProps) => {
    if (!data) {
        return (
            <div className="py-4">
                <h4 className="font-medium text-gray-700">{title}</h4>
                <p className="mt-2 text-sm text-gray-500">Không có dữ liệu cho loại này</p>
            </div>
        );
    }

    const jobs = Array.isArray(data) ? data : [data];
    const latestFirst = [...jobs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Format timestamp to local time
    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    return (
        <div className="py-4">
            <div className="mb-3 flex items-center justify-between">
                <h4 className="font-medium text-gray-700">
                    {title} ({jobs.length} bản ghi)
                </h4>
                {jobs.length > 0 && (
                    <div className="text-xs text-gray-500">
                        Cập nhật gần nhất: {formatTime(latestFirst[0].timestamp)}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {latestFirst.map((job) => (
                    <DataItem key={job.id} job={job} type={type} date={date} getStatus={getStatus} />
                ))}
            </div>
        </div>
    );
};

export default DataSection;
