import api from "@/config/api";
import { CronjobMonitor } from "@/types/db";
import { message } from "antd";
import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
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
    const [isLoading, setIsLoading] = useState<boolean>(false);

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

    const handleDownload = async () => {
        try {
            setIsLoading(true);
            message.loading({ content: `Đang tải xuống dữ liệu ${type}...`, key: `download-${type}-${job.id}` });

            const response = await api.get(`/data/download/${type}/${job.id}`, {
                responseType: "blob",
            });

            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${type}_data_${date}_${job.id}.zip`);
            document.body.appendChild(link);
            link.click();

            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
            message.success({ content: `Tải xuống dữ liệu ${type} thành công!`, key: `download-${type}-${job.id}` });
        } catch (error) {
            console.error(`Error downloading ${type} data:`, error);
            message.error({ content: `Lỗi khi tải xuống dữ liệu ${type}!`, key: `download-${type}-${job.id}` });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
                <TableStatusBadge status={getStatus(job)} />
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{formatTime(job.timestamp)}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDownload();
                        }}
                        disabled={getStatus(job) !== 1 || isLoading}
                        className={`flex items-center space-x-1 rounded-md px-2 py-1 text-xs font-medium ${
                            getStatus(job) === 1 && !isLoading
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                : "cursor-not-allowed bg-gray-100 text-gray-400"
                        }`}>
                        <FiDownload className={`h-3 w-3 ${isLoading ? "animate-pulse" : ""}`} />
                        <span>{isLoading ? "Đang tải..." : "Tải xuống"}</span>
                    </button>
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
