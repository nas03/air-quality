import { getAllCronjobs } from "@/api";
import api from "@/config/api";
import { CronjobMonitor } from "@/types/db";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { PageHeader } from "./components";
import { CronjobDateDetail } from "./components/CronjobDateGroup/CronjobDateDetail";
import { CronjobDateGroup } from "./components/CronjobDateGroup/CronjobDateGroup";
import { DataDateDetail, DataDateGroup } from "./components/DataDateGroup";

interface GroupedCronjobs {
  [date: string]: {
    raster: CronjobMonitor | null;
    wind: CronjobMonitor[];
    station: CronjobMonitor[];
  };
}

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<"cron" | "data">("cron");
  const [groupedCronjobs, setGroupedCronjobs] = useState<GroupedCronjobs>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'days'),
    dayjs()
  ]);

  const [rerunStatus, setRerunStatus] = useState<{ loading: boolean; success: boolean; error: string | null }>({
    loading: false,
    success: false,
    error: null,
  });

  const useCronJobs = useQuery({
    queryKey: ["cronjob_monitor", "*", dateRange],
    queryFn: () => getAllCronjobs(),
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
      const date = new Date(job.timestamp).toISOString().split("T")[0];

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
        useCronJobs.refetch();
      } else {
        setRerunStatus({ loading: false, success: false, error: "Failed to rerun cronjob" });
      }
    } catch (err) {
      console.error("Error rerunning cronjob:", err);
      setRerunStatus({ loading: false, success: false, error: "Error triggering cronjob rerun" });
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
    switch (activeTab) {
      case "cron":
        return (
          <div className={`grid grid-cols-1 ${selectedDate ? 'lg:grid-cols-3' : ''} gap-6`}>
            <div className={`${selectedDate ? 'lg:col-span-1' : ''} h-[calc(100vh-12rem)] overflow-auto`}>
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
                    />
                  ))}
              </div>
            </div>
            {selectedDate && groupedCronjobs[selectedDate] && (
              <CronjobDateDetail
                date={selectedDate}
                jobs={groupedCronjobs[selectedDate]}
                onRerun={handleRerunCronjob}
                rerunStatus={rerunStatus}
              />
            )}
          </div>
        );
      case "data":
        return (
          <div className={`grid grid-cols-1 ${selectedDate ? 'lg:grid-cols-3' : ''} gap-6`}>
            <div className={`${selectedDate ? 'lg:col-span-1' : ''} h-[calc(100vh-12rem)] overflow-auto`}>
              <div className="space-y-4">
                {Object.entries(groupedCronjobs)
                  .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                  .map(([date, jobs]) => (
                    <DataDateGroup
                      key={date}
                      date={date}
                      jobs={jobs}
                      isSelected={date === selectedDate}
                      onDateClick={() => handleDateClick(date)}
                    />
                  ))}
              </div>
            </div>
            {selectedDate && groupedCronjobs[selectedDate] && (
              <DataDateDetail
                date={selectedDate}
                jobs={groupedCronjobs[selectedDate]}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
      <PageHeader
        title="Bảng Điều Khiển"
        subtitle="Giám sát và quản lý Cronjob"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />
      <div className="container mx-auto px-5 pb-5">{renderContent()}</div>
    </div>
  );
};

export default AdminPage;
