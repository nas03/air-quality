import { FiClock } from "react-icons/fi";
import TableStatusBadge from "./TableStatusBadge";

interface Cronjob {
    id: number;
    raster_data_status: number;
    wind_data_status: number;
    station_data_status: number;
    wind_data_log: string;
    station_data_log: string;
    timestamp: string;
}

interface CronjobTableProps {
    cronjobs: Cronjob[];
    loading: boolean;
    selectedCronjob: Cronjob | null;
    onSelectCronjob: (cronjob: Cronjob) => void;
}

const CronjobTable = ({ cronjobs, loading, selectedCronjob, onSelectCronjob }: CronjobTableProps) => {
    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className={`rounded-lg bg-white p-4 shadow-md ${selectedCronjob ? "lg:col-span-1" : "lg:col-span-3"}`}>
            <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-700">
                <FiClock className="mr-2 h-5 w-5" />
                Cronjobs
            </h2>

            <div className={`scrollbar h-[calc(100vh-18rem)] overflow-auto`}>
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
                                    Raster data
                                </th>
                                <th className="border-b-2 border-gray-200 bg-gray-50 p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    Wind data
                                </th>
                                <th className="border-b-2 border-gray-200 bg-gray-50 p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    Station data
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {cronjobs.map((job) => (
                                <tr
                                    key={job.id}
                                    onClick={() => onSelectCronjob(job)}
                                    className={`transition-colors ${
                                        selectedCronjob?.id === job.id
                                            ? "border-l-4 border-blue-500 bg-blue-50"
                                            : "border-l-4 border-transparent hover:bg-gray-50"
                                    }`}>
                                    <td className="border-b border-gray-200 p-3">{job.id}</td>
                                    <td className="border-b border-gray-200 p-3 text-sm">
                                        {formatTimestamp(job.timestamp)}
                                    </td>
                                    <td className="border-b border-gray-200 p-3">
                                        <TableStatusBadge status={job.raster_data_status} />
                                    </td>
                                    <td className="border-b border-gray-200 p-3">
                                        <TableStatusBadge status={job.wind_data_status} />
                                    </td>
                                    <td className="border-b border-gray-200 p-3">
                                        <TableStatusBadge status={job.station_data_status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CronjobTable;
