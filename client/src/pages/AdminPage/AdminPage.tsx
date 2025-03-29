import api from "@/config/api";
import { useEffect, useState } from "react";

// Define interfaces for the cronjob data
interface Cronjob {
  id: number;
  raster_data_status: number;
  wind_data_status: number;
  station_data_status: number;
  wind_data_log: string;
  station_data_log: string;
  timestamp: string;
}

interface CronjobResponse {
  status: string;
  data: Cronjob[];
}

const AdminPage = () => {
  const [cronjobs, setCronjobs] = useState<Cronjob[]>([]);
  const [selectedCronjob, setSelectedCronjob] = useState<Cronjob | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rerunStatus, setRerunStatus] = useState<{ loading: boolean; success: boolean; error: string | null }>({
    loading: false,
    success: false,
    error: null,
  });

  useEffect(() => {
    fetchCronjobs();
  }, []);

  const fetchCronjobs = async () => {
    try {
      setLoading(true);
      const response = await api.get<CronjobResponse>(`/cronjob/record/all`);

      if (response.data.status === "success") {
        setCronjobs(response.data.data);
      } else {
        setError("Failed to fetch cronjobs");
      }
    } catch (err) {
      setError("Error fetching cronjobs data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCronjobClick = (cronjob: Cronjob) => {
    setSelectedCronjob(cronjob);
  };

  const handleDeselectCronjob = () => {
    setSelectedCronjob(null);
  };

  const handleRerunCronjob = async () => {
    if (!selectedCronjob) return;

    try {
      setRerunStatus({ loading: true, success: false, error: null });

      const response = await api.post(`/cronjob/rerun/${selectedCronjob.id}`);

      if (response.data.status === "success") {
        setRerunStatus({ loading: false, success: true, error: null });
        // Refresh the cronjobs list to show updated status
        fetchCronjobs();

        // Clear success message after 3 seconds
        setTimeout(() => {
          setRerunStatus((prev) => ({ ...prev, success: false }));
        }, 3000);
      } else {
        setRerunStatus({ loading: false, success: false, error: "Failed to rerun cronjob" });
      }
    } catch (err) {
      console.error("Error rerunning cronjob:", err);
      setRerunStatus({ loading: false, success: false, error: "Error triggering cronjob rerun" });
    }
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

  const getStatusClass = (status: number) => {
    return status === 1 ? "text-green-500 font-bold" : "text-red-500 font-bold";
  };

  const getStatusText = (status: number) => {
    return status === 1 ? "SUCCESS" : "FAILED";
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // New function to render status with icons
  const renderStatusBadge = (label: string, status: number) => {
    const isSuccess = status === 1;
    return (
      <div
        className={`flex items-center space-x-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
          isSuccess
            ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 shadow-sm shadow-green-100"
            : "bg-gradient-to-r from-red-50 to-red-100 text-red-700 shadow-sm shadow-red-100"
        }`}>
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full ${
            isSuccess ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
          }`}>
          {isSuccess ? (
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl bg-gray-50 p-5">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Cronjobs Management</h1>

      {loading && <div className="my-4 animate-pulse rounded-lg bg-white p-4 shadow-sm">Loading cronjobs...</div>}
      {error && <div className="my-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div
          className={`overflow-hidden rounded-lg bg-white p-4 shadow-md ${selectedCronjob ? "lg:col-span-1" : "lg:col-span-3"}`}>
          <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-700">
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Cronjobs
          </h2>

          <div className={`${selectedCronjob ? "h-[calc(100vh-220px)]" : "h-auto"} overflow-auto`}>
            {cronjobs.length === 0 && !loading ? (
              <p className="my-4 italic text-gray-500">No cronjobs available</p>
            ) : (
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    <th className="border-b-2 border-gray-200 bg-gray-50 p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      ID
                    </th>
                    <th className="border-b-2 border-gray-200 bg-gray-50 p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Timestamp
                    </th>
                    <th className="border-b-2 border-gray-200 bg-gray-50 p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Raster
                    </th>
                    <th className="border-b-2 border-gray-200 bg-gray-50 p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Wind
                    </th>
                    <th className="border-b-2 border-gray-200 bg-gray-50 p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Station
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cronjobs.map((job) => (
                    <tr
                      key={job.id}
                      onClick={() => handleCronjobClick(job)}
                      className={`transition-colors ${
                        selectedCronjob?.id === job.id
                          ? "border-l-4 border-blue-500 bg-blue-50"
                          : "border-l-4 border-transparent hover:bg-gray-50"
                      }`}>
                      <td className="border-b border-gray-200 p-3">{job.id}</td>
                      <td className="border-b border-gray-200 p-3 text-sm">{formatTimestamp(job.timestamp)}</td>
                      <td className={`border-b border-gray-200 p-3 ${getStatusClass(job.raster_data_status)}`}>
                        {getStatusText(job.raster_data_status)}
                      </td>
                      <td className={`border-b border-gray-200 p-3 ${getStatusClass(job.wind_data_status)}`}>
                        {getStatusText(job.wind_data_status)}
                      </td>
                      <td className={`border-b border-gray-200 p-3 ${getStatusClass(job.station_data_status)}`}>
                        {getStatusText(job.station_data_status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {selectedCronjob && (
          <div className="rounded-lg bg-white p-4 shadow-md lg:col-span-2">
            <h2 className="mb-4 flex items-center justify-between text-xl font-semibold text-gray-700">
              <div className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Cronjob Details
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRerunCronjob}
                  disabled={rerunStatus.loading}
                  className={`flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors ${
                    rerunStatus.loading ? "cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  title="Force rerun this cronjob"
                  aria-label="Force rerun cronjob">
                  {rerunStatus.loading ? (
                    <>
                      <svg className="mr-1.5 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="mr-1.5 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Force Rerun
                    </>
                  )}
                </button>
                <button
                  onClick={handleDeselectCronjob}
                  className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
                  title="Close details"
                  aria-label="Close cronjob details">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </h2>

            {/* Status messages */}
            {rerunStatus.success && (
              <div className="animate-fadeIn mb-4 rounded-md border border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-3 text-green-700 shadow-inner">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-200">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Cronjob rerun successfully triggered!</p>
                    <p className="text-xs opacity-80">The system is now processing your request.</p>
                  </div>
                </div>
              </div>
            )}

            {rerunStatus.error && (
              <div className="animate-fadeIn mb-4 rounded-md border border-red-200 bg-gradient-to-r from-red-50 to-red-100 p-3 text-red-700 shadow-inner">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-200">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Failed to rerun cronjob</p>
                    <p className="text-xs opacity-80">{rerunStatus.error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="h-[calc(100vh-220px)] overflow-auto">
              <div className="mb-4 border-b border-gray-100 pb-3">
                <div className="mb-2 flex items-center">
                  <span className="w-24 font-medium text-gray-600">ID:</span>
                  <span className="rounded bg-gray-100 px-2 py-1 font-mono text-gray-800">{selectedCronjob.id}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 font-medium text-gray-600">Timestamp:</span>
                  <span className="rounded bg-gray-100 px-2 py-1 font-mono text-gray-800">
                    {formatTimestamp(selectedCronjob.timestamp)}
                  </span>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2.5">
                {renderStatusBadge("Raster", selectedCronjob.raster_data_status)}
                {renderStatusBadge("Wind", selectedCronjob.wind_data_status)}
                {renderStatusBadge("Station", selectedCronjob.station_data_status)}
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="mb-2 flex items-center text-sm font-medium uppercase tracking-wide text-gray-700">
                    <svg
                      className="mr-1 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Wind Data Log
                  </h3>
                  <div className="max-h-[200px] overflow-y-auto rounded-lg bg-gray-800 p-3 font-mono text-xs text-gray-200">
                    {formatLogText(selectedCronjob.wind_data_log)}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 flex items-center text-sm font-medium uppercase tracking-wide text-gray-700">
                    <svg
                      className="mr-1 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Station Data Log
                  </h3>
                  <div className="max-h-[200px] overflow-y-auto rounded-lg bg-gray-800 p-3 font-mono text-xs text-gray-200">
                    {formatLogText(selectedCronjob.station_data_log)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add this at the top of your CSS (you can add it to your global CSS or use a style tag)
export default AdminPage;

/* Add these to your global CSS file */
