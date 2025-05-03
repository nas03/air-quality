import api from "@/config/api";
import { CronjobMonitor } from "@/types/db";
import { useEffect, useState } from "react";
import { FiInfo, FiRefreshCw } from "react-icons/fi";
import TableStatusBadge from "../CronjobTable/TableStatusBadge";

interface CronjobDateDetailProps {
    date: string;
    jobs: {
        raster: CronjobMonitor | null;
        wind: CronjobMonitor[];
        station: CronjobMonitor[];
    };
    onRerun: (jobId: number) => void;
    rerunStatus: {
        loading: boolean;
        success: boolean;
        error: string | null;
    };
}

const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
};

const formatLogText = (logText: string) => {
    return logText.split("\n").map((line, i) => {
        const isError = line.includes("ERROR");
        const className = isError ? "text-red-500" : "text-blue-600";
        return (
            <div key={i} className={className}>
                {line}
            </div>
        );
    });
};

// Format file size to human readable format
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

interface LogSectionProps {
    title: string;
    jobs: CronjobMonitor[];
    getStatus: (job: CronjobMonitor) => number;
    getLog: (job: CronjobMonitor) => string;
    type: "raster" | "wind" | "station";
    date: string;
}

const LogSection = ({ title, jobs, getStatus, getLog, /* type */ }: LogSectionProps) => {
    const latestFirst = [...jobs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // const [fileSizes, setFileSizes] = useState<{ [key: number]: number | null }>({});

   /*  useEffect(() => {
        latestFirst.forEach((job) => {
            if (getStatus(job) === 1) {
                api.get(`/data/size/${type}/${job.id}`)
                    .then((response) => {
                        if (response.data && response.data.size) {
                            setFileSizes((prev) => ({ ...prev, [job.id]: response.data.size }));
                        }
                    })
                    .catch((error) => {
                        console.error(`Error fetching ${type} data size:`, error);
                    });
            }
        });
    }, [jobs, type]); */

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">
                    {title} ({jobs.length} bản ghi)
                </h4>
             {/*    {jobs.length > 0 && (
                    <div className="text-xs text-gray-500">
                        Cập nhật gần nhất: {formatTime(latestFirst[0].timestamp)}
                    </div>
                )} */}
            </div>
            <div className="max-h-[300px] space-y-2 overflow-y-auto">
                {latestFirst.map((job) => (
                    <div key={job.id} className="space-y-2 rounded-lg bg-gray-50 p-3">
                        <div className="flex items-center justify-between">
                            <TableStatusBadge status={getStatus(job)} />
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">{formatTime(job.timestamp)}</span>
                              {/*   {fileSizes[job.id] !== undefined && (
                                    <span className="text-xs font-medium text-gray-500">
                                        {formatFileSize(fileSizes[job.id]!)}
                                    </span>
                                )} */}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300 max-h-[200px] overflow-y-auto rounded-lg bg-gray-900 p-2 font-mono text-xs">
                                {formatLogText(getLog(job))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const CronjobDateDetail = ({ date, jobs, onRerun, rerunStatus }: CronjobDateDetailProps) => {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const [rasterFileSize, setRasterFileSize] = useState<number | null>(null);

    useEffect(() => {
        if (jobs.raster && jobs.raster.raster_data_status === 1) {
            api.get(`/data/size/raster/${jobs.raster.id}`)
                .then((response) => {
                    if (response.data && response.data.size) {
                        setRasterFileSize(response.data.size);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching raster data size:", error);
                });
        }
    }, [jobs.raster]);

    return (
        <div className="flex h-[calc(100vh-12rem)] flex-col rounded-lg bg-white shadow-md lg:col-span-2">
            <div className="flex-none border-b border-gray-100 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center text-xl font-semibold text-gray-700">
                        <FiInfo className="mr-2 h-5 w-5" />
                        {formatDate(date)}
                    </h2>
                    <button
                        onClick={() => jobs.raster && onRerun(jobs.raster.id)}
                        disabled={rerunStatus.loading || !jobs.raster}
                        className={`flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors ${
                            rerunStatus.loading ? "cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                        }`}>
                        <FiRefreshCw className={`mr-1.5 h-4 w-4 ${rerunStatus.loading ? "animate-spin" : ""}`} />
                        {rerunStatus.loading ? "Đang xử lý..." : "Chạy lại"}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
                <div className="space-y-6 divide-y divide-gray-100">
                    {/* Raster Data Section */}
                    <div className="pb-4">
                        <h4 className="mb-2 font-medium text-gray-700">Dữ liệu Raster</h4>
                        {jobs.raster ? (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-500">Trạng thái:</span>
                                        <TableStatusBadge status={jobs.raster.raster_data_status} />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {rasterFileSize !== null && (
                                            <span className="text-xs font-medium text-gray-500">
                                                {formatFileSize(rasterFileSize)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Thời gian: {formatTime(jobs.raster.timestamp)}
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">Không có dữ liệu raster cho ngày này</div>
                        )}
                    </div>

                    {/* Wind Data Section */}
                    <div className="py-4">
                        <LogSection
                            title="Dữ liệu Gió"
                            jobs={jobs.wind}
                            getStatus={(job) => job.wind_data_status}
                            getLog={(job) => job.wind_data_log}
                            type="wind"
                            date={date}
                        />
                    </div>

                    {/* Station Data Section */}
                    <div className="pt-4">
                        <LogSection
                            title="Dữ liệu Trạm"
                            jobs={jobs.station}
                            getStatus={(job) => job.station_data_status}
                            getLog={(job) => job.station_data_log}
                            type="station"
                            date={date}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
