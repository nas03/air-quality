import Loading from "@/components/Loading";
import { RankData } from "@/hooks/useDistrictRanking";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { getStyleRankTable } from "../config";

interface RankTableProps {
  className?: string;
  tableData?: RankData[];
  loading: boolean;
}

const TableRow = ({ data, isLast, num }: { data: RankData; isLast: boolean; num: number }) => {
  const style = getStyleRankTable(data.aqi_index);

  return (
    <div className="grid grid-cols-8 items-center px-4 py-3 transition-colors hover:bg-gray-50">
      <div className="flex items-center justify-center text-xs">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-700">
          {num}
        </div>
      </div>
      <p className="col-span-3 text-sm font-medium text-gray-800">{data.vn_district}</p>
      <div className="col-span-1 flex items-center justify-center">
        <div
          className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-full px-2 text-sm font-bold text-white shadow-sm"
          style={{ backgroundColor: style.color }}>
          {data.aqi_index}
        </div>
      </div>
      <p className="col-span-3 text-center text-xs font-medium text-gray-600">
        {data.aqi_change > 0 ? data.aqi_change + "↑" : Math.abs(data.aqi_change) + "↓"}
      </p>
    </div>
  );
};

const RankTable: React.FC<RankTableProps> = ({ className, tableData, loading }) => {
  const [data, setData] = useState<RankData[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [sortField, setSortField] = useState<string>("aqi_index");

  const provinces = useMemo(() => {
    if (!tableData || !tableData.length) return [];

    const uniqueProvinces = new Map();
    tableData.forEach((item) => {
      if (item.province_id && item.vn_province && !uniqueProvinces.has(item.province_id)) {
        uniqueProvinces.set(item.province_id, item.vn_province);
      }
    });

    return Array.from(uniqueProvinces.entries()).map(([id, name]) => ({ id, name }));
  }, [tableData]);

  const toggleSort = (field: string) => {
    const newDirection = sortField === field && sortDirection === "desc" ? "asc" : "desc";
    setSortField(field);
    setSortDirection(newDirection);

    if (data.length) {
      const sortedData = [...data].sort((a, b) => {
        if (field === "aqi_index") {
          return newDirection === "desc" ? b.aqi_index - a.aqi_index : a.aqi_index - b.aqi_index;
        }
        return 0;
      });
      setData(sortedData);
    }
  };

  useEffect(() => {
    if (!tableData) return;

    let processedData;
    if (selectedProvince) {
      processedData = tableData.filter((item) => item.vn_province === selectedProvince);
    } else {
      processedData = [...tableData];
    }

    if (sortField === "aqi_index" && sortDirection) {
      processedData.sort((a, b) => (sortDirection === "desc" ? b.aqi_index - a.aqi_index : a.aqi_index - b.aqi_index));
    }

    setData(processedData);
  }, [tableData, selectedProvince, sortField, sortDirection]);

  return (
    <Loading loading={!data || loading} className="h-[95%]">
      <div className={cn(className, "mt-3 h-full overflow-hidden rounded-lg bg-white font-sans shadow-sm")}>
        {/* Filter section */}
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <label htmlFor="province-select" className="whitespace-nowrap text-sm font-medium text-gray-700">
              Tỉnh/Thành phố:
            </label>
            <div className="relative flex-grow">
              <select
                id="province-select"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 shadow-sm focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300">
                <option value="">Toàn bộ</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table header */}
        <div
          className="grid grid-cols-8 items-center border-b border-gray-200 bg-gray-50 px-4 py-3 text-gray-600"
          id="table-header">
          <p className="text-center text-xs font-semibold">#</p>
          <p className="col-span-3 text-start text-xs font-semibold">Địa điểm</p>
          <div
            className="col-span-1 flex cursor-pointer items-center justify-center gap-1 text-xs font-semibold transition-colors hover:text-gray-800"
            onClick={() => toggleSort("aqi_index")}>
            AQI
            {sortField === "aqi_index" && (
              <span className="ml-1 text-blue-500">{sortDirection === "desc" ? "↓" : "↑"}</span>
            )}
          </div>
          <p className="col-span-3 text-center text-xs font-semibold">Hôm qua</p>
        </div>

        {/* Table body */}
        <div
          id="table-body"
          className="h-full divide-y divide-gray-100 overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#e2e8f0 #ffffff",
          }}>
          {data.length === 0 ? (
            <div className="py-8 text-center text-gray-500">Không có dữ liệu</div>
          ) : (
            data.map((d, index) => <TableRow key={index} data={d} num={index + 1} isLast={index === data.length - 1} />)
          )}
        </div>
      </div>
    </Loading>
  );
};

export default RankTable;
