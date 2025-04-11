import api from "@/config/api";
import { CronjobMonitor } from "@/types/db";
import { useEffect, useState } from "react";
import TableStatusBadge from "../CronjobTable/TableStatusBadge";

interface DataItemProps {
    job: CronjobMonitor;
    type: "raster" | "wind" | "station";
    date: string;
    getStatus: (job: CronjobMonitor) => number;
}

// Format file size to human readable format (KB, MB, GB)
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const DataItem = ({ job, type, date, getStatus }: DataItemProps) => {
    const [fileSize, setFileSize] = useState<number | null>(null);

    // Format timestamp to local time
    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    // Fetch file size on component mount
    useEffect(() => {
        if (getStatus(job) === 1) {
            api.get(`/data/size/${type}/${job.id}`)
                .then((response) => {
                    if (response.data && response.data.size) {
                        setFileSize(response.data.size);
                    }
                })
                .catch((error) => {
                    console.error(`Error fetching ${type} data size:`, error);
                });
        }
    }, [job.id, type, getStatus, job]);

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
                <TableStatusBadge status={getStatus(job)} />
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{formatTime(job.timestamp)}</span>
                </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-600">ID: {job.id}</div>
                {fileSize !== null && (
                    <div className="text-xs font-medium text-gray-500">{formatFileSize(fileSize)}</div>
                )}
            </div>
        </div>
    );
};

export default DataItem;
