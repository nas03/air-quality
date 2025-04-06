import { getAllCronjobs } from "@/api";
import api from "@/config/api";
import { CronjobMonitor } from "@/types/db";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CronjobDetail, CronjobTable, PageHeader } from "./components";

// Define interfaces for the cronjob data

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<"cron" | "data">("cron");
  const [cronjobs, setCronjobs] = useState<CronjobMonitor[]>([]);
  const [selectedCronjob, setSelectedCronjob] = useState<CronjobMonitor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const useCronJobs = useQuery({
    queryKey: ["cronjob_monitor", "*"],
    queryFn: () => getAllCronjobs(),
  });

  const [rerunStatus, setRerunStatus] = useState<{ loading: boolean; success: boolean; error: string | null }>({
    loading: false,
    success: false,
    error: null,
  });

  useEffect(() => {
    setLoading(true);
    if (useCronJobs.isError) setError("Failed to fetch cronjobs");
    if (!useCronJobs.isSuccess) return;
    if (!useCronJobs.data?.length) setError("No data found");
    else setCronjobs(useCronJobs.data);

    setLoading(false);
  }, [useCronJobs.data]);

  const handleCronjobClick = (cronjob: CronjobMonitor) => {
    setSelectedCronjob(cronjob);
  };

  const handleDeselectCronjob = () => {
    setSelectedCronjob(null);
  };

  const handleRerunCronjob = async () => {
    if (!selectedCronjob) return;

    try {
      setRerunStatus({ loading: true, success: false, error: null });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);

      const response = await api.post(`/cronjob/rerun`, {
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
      return <div className="my-4 animate-pulse rounded-lg bg-white p-4 shadow-sm">Loading cronjobs...</div>;
    }
    if (error) {
      return <div className="my-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 text-red-700">{error}</div>;
    }
    switch (activeTab) {
      case "cron":
        return (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <CronjobTable
              cronjobs={cronjobs}
              loading={loading}
              selectedCronjob={selectedCronjob}
              onSelectCronjob={handleCronjobClick}
            />
            {selectedCronjob && (
              <CronjobDetail
                cronjob={selectedCronjob}
                onClose={handleDeselectCronjob}
                onRerun={handleRerunCronjob}
                rerunStatus={rerunStatus}
              />
            )}
          </div>
        );
      case "data":
        return (
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p>Data Management section coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-50">
      <PageHeader
        title="Admin Console"
        subtitle="Monitor and manage scheduled data collection tasks"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="px-5 pb-5">{renderContent()}</div>
    </div>
  );
};

export default AdminPage;
