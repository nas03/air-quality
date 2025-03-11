import Loading from "@/components/Loading";
import { RankData } from "@/hooks/useDistrictRanking";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { getStyleRankTable } from "../config";

interface RankTableProps {
  className?: string;
  tableData?: RankData[];
}

const TableRow = ({ data, isLast, num }: { data: RankData; isLast: boolean; num: number }) => {
  const style = getStyleRankTable(data.aqi_index);

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
          {num}
        </div>
      </div>
      <p className="col-span-2 flex items-center justify-start overflow-hidden truncate pl-3 pr-2 font-medium">
        {data.vn_district}
      </p>
      <div className="flex flex-row items-center justify-center text-white">
        <p
          className="flex h-2/3 items-center rounded-full px-4 py-1.5 text-sm font-medium transition-all"
          style={{ backgroundColor: style.color }}>
          {data.aqi_index}
        </p>
      </div>
      <p className="col-span-3 overflow-hidden px-1 text-center text-sm">{style.status}</p>
      {!isLast && <div className="col-span-7 my-2 border-b border-gray-100" />}
    </>
  );
};

const RankTable: React.FC<RankTableProps> = ({ className, tableData }) => {
  const [data, setData] = useState<RankData[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc"); // Default to descending
  const [sortField, setSortField] = useState<string>("aqi_index"); // Default to sorting by AQI

  // Simplified province extraction with proper deduplication
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

    // Apply sorting if active
    if (sortField === "aqi_index" && sortDirection) {
      processedData.sort((a, b) => (sortDirection === "desc" ? b.aqi_index - a.aqi_index : a.aqi_index - b.aqi_index));
    }

    setData(processedData);
  }, [tableData, selectedProvince, sortField, sortDirection]);

  return (
    <Loading loading={!data} className="h-[95%]">
      <div className={cn(className, "mt-3 h-full rounded-md font-sans shadow-sm")}>
        <div className="mb-2 flex flex-row items-center gap-3 px-2.5">
          <label htmlFor="province-select" className="mb-1 block text-sm font-semibold tracking-tight text-gray-600">
            Tỉnh/Thành phố
          </label>
          <select
            id="province-select"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="flex-grow rounded-md border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Toàn bộ</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>
        </div>
        <div
          className="grid grid-cols-7 rounded-t-md bg-gray-50 p-2.5 uppercase text-slate-500 opacity-100 shadow-sm"
          id="table-header">
          <p className="text-center text-xs font-semibold">#</p>
          <p className="col-span-2 pl-3 pr-2 text-start text-xs font-semibold">Địa điểm</p>
          <p
            className="flex cursor-pointer items-center justify-center gap-1 text-center text-xs font-semibold hover:text-slate-700"
            onClick={() => toggleSort("aqi_index")}>
            AQI
            {sortField === "aqi_index" && <span className="text-xs">{sortDirection === "desc" ? "↓" : "↑"}</span>}
          </p>
          <p className="col-span-3 text-center text-xs font-semibold">Lưu ý</p>
        </div>
        <div
          id="table-body"
          className="scrollbar relative grid max-h-[calc(100%-6rem)] grid-cols-7 gap-1 overflow-y-auto py-2 font-medium"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 #f8fafc",
          }}>
          {data.map((d, index) => (
            <TableRow key={index} data={d} num={index + 1} isLast={index === data.length - 1} />
          ))}
        </div>
      </div>
    </Loading>
  );
};

export default RankTable;
