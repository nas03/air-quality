import { getAllCronjobs } from "@/api";
import { downloadByDate, downloadFilesAsZip } from "@/api/data";
import api from "@/config/api";
import type { CronjobMonitor } from "@/types/db";
import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FiDownload, FiLoader } from "react-icons/fi";
import { PageHeader } from "./components";
import { CronjobDateDetail } from "./components/CronjobDateGroup/CronjobDateDetail";
import { CronjobDateGroup } from "./components/CronjobDateGroup/CronjobDateGroup";

interface GroupedCronjobs {
    [date: string]: {
        raster: CronjobMonitor | null;
        wind: CronjobMonitor[];
        station: CronjobMonitor[];
    };
}

const AdminPage = () => {
    const [groupedCronjobs, setGroupedCronjobs] = useState<GroupedCronjobs>({});
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().subtract(7, "days"), dayjs()]);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const [rerunStatus, setRerunStatus] = useState<{ loading: boolean; success: boolean; error: string | null }>({
        loading: false,
        success: false,
        error: null,
    });

    const useCronJobs = useQuery({
        queryKey: ["cronjob_monitor", "*", dateRange],
        queryFn: () => getAllCronjobs(dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD")),
    });

    const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        if (!dates || !dates[0] || !dates[1]) return;
        setDateRange([dates[0], dates[1]]);
    };

    useEffect(() => {
        setLoading(true);
        if (useCronJobs.isError) setError("Failed to fetch cronjobs");
        if (!useCronJobs.isSuccess) return;
        if (!useCronJobs.data?.length) setError("No data found");
        else {
            const filtered = useCronJobs.data.filter((job) => {
                const jobDate = dayjs(job.timestamp);
                return jobDate.isAfter(dateRange[0].startOf("day")) && jobDate.isBefore(dateRange[1].endOf("day"));
            });
            const grouped = groupCronjobsByDate(filtered);
            setGroupedCronjobs(grouped);
        }
        setLoading(false);
    }, [useCronJobs.data, dateRange]);

    const groupCronjobsByDate = (jobs: CronjobMonitor[]): GroupedCronjobs => {
        const grouped: GroupedCronjobs = {};

        jobs.forEach((job) => {
            const hour = dayjs(job.timestamp).get("hour");
            const date = dayjs(job.timestamp)
                .set("hour", hour + 7)
                .toISOString()
                .split("T")[0];

            if (!grouped[date]) {
                grouped[date] = {
                    raster: null,
                    wind: [],
                    station: [],
                };
            }

            if (job.raster_data_status !== undefined) {
                grouped[date].raster = job;
            }
            if (job.wind_data_status !== undefined) {
                grouped[date].wind.push(job);
            }
            if (job.station_data_status !== undefined) {
                grouped[date].station.push(job);
            }
        });

        return grouped;
    };

    const handleDateClick = (date: string) => {
        setSelectedDate(date === selectedDate ? null : date);
    };

    const handleRerunCronjob = async (jobId: number) => {
        try {
            setRerunStatus({ loading: true, success: false, error: null });
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 300000);

            const response = await api.post(`/cronjob/rerun`, {
                id: jobId,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.data.status === "success") {
                setRerunStatus({ loading: false, success: true, error: null });
                message.success("Chạy cronjob thành công");
                useCronJobs.refetch();
            } else {
                message.success("Chạy cronjob thất bại");
                setRerunStatus({ loading: false, success: false, error: "Failed to rerun cronjob" });
            }
        } catch (err) {
            console.error("Error rerunning cronjob:", err);
            setRerunStatus({ loading: false, success: false, error: "Error triggering cronjob rerun" });
        }
    };

    const handleDownloadFiles = async () => {
        try {
            setIsDownloading(true);
            setDownloadError(null);

            const startDate = dateRange[0].format("YYYY-MM-DD");
            const endDate = dateRange[1].format("YYYY-MM-DD");

            await downloadFilesAsZip(startDate, endDate);

            setIsDownloading(false);
        } catch (error) {
            console.error("Error downloading files:", error);
            setDownloadError("Failed to download files. Please try again.");
            setIsDownloading(false);
        }
    };

    const handleDownloadDateGroup = async (date: string) => {
        if (!groupedCronjobs[date]) {
            message.error("No data available for this date");
            return;
        }

        try {
            message.loading({ content: `Đang tải xuống dữ liệu cho ngày ${date}...`, key: `download-date-${date}` });
            downloadByDate(date);
            message.success({ content: `Tải xuống dữ liệu thành công!`, key: `download-date-${date}` });
        } catch (error) {
            console.error("Error downloading files for date:", error);
            message.error({ content: `Lỗi khi tải xuống dữ liệu!`, key: `download-date-${date}` });
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="my-4 animate-pulse rounded-lg bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                    Đang tải dữ liệu...
                </div>
            );
        }
        if (error) {
            return (
                <div className="my-4 rounded-lg border-l-4 border-red-500 bg-red-50/90 p-4 text-red-700 backdrop-blur-sm">
                    {error}
                </div>
            );
        }

        return (
            <>
                <div className="mb-4 mt-3 flex justify-end">
                    <button
                        onClick={handleDownloadFiles}
                        disabled={isDownloading}
                        className={`flex items-center gap-2.5 rounded-md px-5 py-2.5 font-medium transition duration-200 ${
                            isDownloading
                                ? "bg-blue-100 text-blue-700"
                                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-[0.98] active:transform"
                        } disabled:cursor-not-allowed disabled:opacity-70`}>
                        {isDownloading ? (
                            <>
                                <FiLoader className="h-4 w-4 animate-spin" />
                                <span>Đang tải xuống...</span>
                            </>
                        ) : (
                            <>
                                <FiDownload className="h-4 w-4" />
                                <span>Xuất toàn bộ dữ liệu</span>
                            </>
                        )}
                    </button>
                </div>
                {downloadError && (
                    <div className="mb-4 rounded-lg border-l-4 border-red-500 bg-red-50/90 p-3 text-sm text-red-700 backdrop-blur-sm">
                        {downloadError}
                    </div>
                )}
                <div className={`grid grid-cols-1 ${selectedDate ? "lg:grid-cols-3" : ""} gap-6`}>
                    <div className={`${selectedDate ? "lg:col-span-1" : ""} h-[calc(100vh-12rem)] overflow-auto`}>
                        <div className="space-y-4">
                            {Object.entries(groupedCronjobs)
                                .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                                .map(([date, jobs]) => (
                                    <CronjobDateGroup
                                        key={date}
                                        date={date}
                                        jobs={jobs}
                                        isSelected={date === selectedDate}
                                        onDateClick={() => handleDateClick(date)}
                                        onDownloadClick={(e) => {
                                            e.stopPropagation();
                                            handleDownloadDateGroup(date);
                                        }}
                                    />
                                ))}
                        </div>
                    </div>
                    {selectedDate && groupedCronjobs[selectedDate] && (
                        <div className="space-y-6 lg:col-span-2">
                            <CronjobDateDetail
                                date={selectedDate}
                                jobs={groupedCronjobs[selectedDate]}
                                onRerun={handleRerunCronjob}
                                rerunStatus={rerunStatus}
                            />
                            {/* <DataDateDetail
                  date={selectedDate}
                  jobs={groupedCronjobs[selectedDate]}
                /> */}
                        </div>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
            <PageHeader
                title="Bảng Điều Khiển"
                subtitle="Giám sát và quản lý Cronjob & Dữ liệu"
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
            />
            <div className="container mx-auto px-5 pb-5">{renderContent()}</div>
        </div>
    );
};

export default AdminPage;
