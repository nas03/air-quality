import api from "@/config/api";
import { useEffect, useState } from "react";
import { FiChevronRight, FiInfo, FiLoader, FiRefreshCw, FiX } from "react-icons/fi";
import StatusAlert from "./StatusAlert";
import StatusBadge from "./StatusBadge";

interface Cronjob {
    id: number;
    raster_data_status: number;
    wind_data_status: number;
    station_data_status: number;
    wind_data_log: string;
    station_data_log: string;
    timestamp: string;
}

interface CronjobDetailProps {
    cronjob: Cronjob;
    onClose: () => void;
    onRerun: () => void;
    rerunStatus: { loading: boolean; success: boolean; error: string | null };
}

// Format file size to human readable format (KB, MB, GB)
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const CronjobDetail = ({ cronjob, onClose, onRerun, rerunStatus }: CronjobDetailProps) => {
    const [loading, setLoading] = useState<{
        raster: boolean;
        wind: boolean;
        station: boolean;
    }>({
        raster: false,
        wind: false,
        station: false,
    });
    const [fileSizes, setFileSizes] = useState<{
        raster: number | null;
        wind: number | null;
        station: number | null;
    }>({
        raster: null,
        wind: null,
        station: null,
    });

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
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

    useEffect(() => {
        // Fetch file sizes if status is success (1)
        if (cronjob.raster_data_status === 1) {
            api.get(`/data/size/raster/${cronjob.id}`)
                .then((response) => {
                    if (response.data && response.data.size) {
                        setFileSizes((prev) => ({ ...prev, raster: response.data.size }));
                    }
                })
                .catch((error) => {
                    console.error("Error fetching raster data size:", error);
                });
        }

        if (cronjob.wind_data_status === 1) {
            api.get(`/data/size/wind/${cronjob.id}`)
                .then((response) => {
                    if (response.data && response.data.size) {
                        setFileSizes((prev) => ({ ...prev, wind: response.data.size }));
                    }
                })
                .catch((error) => {
                    console.error("Error fetching wind data size:", error);
                });
        }

        if (cronjob.station_data_status === 1) {
            api.get(`/data/size/station/${cronjob.id}`)
                .then((response) => {
                    if (response.data && response.data.size) {
                        setFileSizes((prev) => ({ ...prev, station: response.data.size }));
                    }
                })
                .catch((error) => {
                    console.error("Error fetching station data size:", error);
                });
        }
    }, [cronjob.id, cronjob.raster_data_status, cronjob.wind_data_status, cronjob.station_data_status]);

    return (
        <div className="h-full overflow-scroll rounded-lg bg-white p-4 shadow-md lg:col-span-2">
            <h2 className="mb-4 flex items-center justify-between text-xl font-semibold text-gray-700">
                <div className="flex items-center">
                    <FiInfo className="mr-2 h-5 w-5" />
                    Cronjob Details
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onRerun}
                        disabled={rerunStatus.loading}
                        className={`flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors ${
                            rerunStatus.loading ? "cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        title="Force rerun this cronjob"
                        aria-label="Force rerun cronjob">
                        {rerunStatus.loading ? (
                            <>
                                <FiLoader className="mr-1.5 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <FiRefreshCw className="mr-1.5 h-4 w-4" />
                                Force Rerun
                            </>
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
                        title="Close details"
                        aria-label="Close cronjob details">
                        <FiX className="h-5 w-5" />
                    </button>
                </div>
            </h2>

            {/* Status messages */}
            {rerunStatus.success && (
                <StatusAlert
                    type="success"
                    title="Cronjob executed successfully!"
                    message="The data processing has been completed successfully."
                />
            )}

            {rerunStatus.error && (
                <StatusAlert type="error" title="Failed to rerun cronjob" message={rerunStatus.error} />
            )}

            <div className="max-h-[calc(100vh-220px)] overflow-auto">
                <div className="mb-4 border-b border-gray-100 pb-3">
                    <div className="mb-2 flex items-center">
                        <span className="w-24 font-medium text-gray-600">ID:</span>
                        <span className="rounded bg-gray-100 px-2 py-1 font-mono text-gray-800">{cronjob.id}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 font-medium text-gray-600">Timestamp:</span>
                        <span className="rounded bg-gray-100 px-2 py-1 font-mono text-gray-800">
                            {formatTimestamp(cronjob.timestamp)}
                        </span>
                    </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2.5">
                    <div className="flex flex-col items-center space-y-1">
                        <StatusBadge label="Raster" status={cronjob.raster_data_status} />
                        <div className="mt-1 flex items-center space-x-2">
                            {fileSizes.raster !== null && (
                                <span className="text-xs font-medium text-gray-500">
                                    {formatFileSize(fileSizes.raster)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-1">
                        <StatusBadge label="Wind" status={cronjob.wind_data_status} />
                        <div className="mt-1 flex items-center space-x-2">
                            {fileSizes.wind !== null && (
                                <span className="text-xs font-medium text-gray-500">
                                    {formatFileSize(fileSizes.wind)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-1">
                        <StatusBadge label="Station" status={cronjob.station_data_status} />
                        <div className="mt-1 flex items-center space-x-2">
                            {fileSizes.station !== null && (
                                <span className="text-xs font-medium text-gray-500">
                                    {formatFileSize(fileSizes.station)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <h3 className="mb-2 flex items-center text-sm font-medium uppercase tracking-wide text-gray-700">
                            <FiChevronRight className="mr-1 h-4 w-4" />
                            Wind Data Log
                        </h3>
                        <div className="max-h-[200px] overflow-y-auto rounded-lg bg-gray-800 p-3 font-mono text-xs text-gray-200">
                            {formatLogText(cronjob.wind_data_log)}
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-2 flex items-center text-sm font-medium uppercase tracking-wide text-gray-700">
                            <FiChevronRight className="mr-1 h-4 w-4" />
                            Station Data Log
                        </h3>
                        <div className="max-h-[200px] overflow-y-auto rounded-lg bg-gray-800 p-3 font-mono text-xs text-gray-200">
                            {formatLogText(cronjob.station_data_log)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CronjobDetail;
