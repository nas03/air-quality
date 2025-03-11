import Loading from "@/components/Loading";
import { RankData } from "@/hooks/useDistrictRanking";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
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
      <p className="col-span-2 flex items-center justify-start pl-3 pr-2 font-medium">{data.vn_district}</p>
      <div className="flex flex-row items-center justify-center text-white">
        <p
          className="flex h-2/3 items-center rounded-full px-4 py-1.5 text-sm font-medium transition-all"
          style={{ backgroundColor: style.color }}>
          {data.aqi_index}
        </p>
      </div>
      <p className="col-span-3 text-center text-sm">{style.status}</p>
      {!isLast && <div className="col-span-7 my-2 border-b border-gray-100" />}
    </>
  );
};

const RankTable: React.FC<RankTableProps> = ({ className, tableData }) => {
  const [data, setData] = useState<RankData[]>([]);

  useEffect(() => {
    if (tableData) setData(tableData);
  }, [tableData]);

  return (
    <Loading loading={!data} className="h-[95%]">
      <div className={cn(className, "mt-3 h-full rounded-md font-sans shadow-sm")}>
        <div
          className="grid grid-cols-7 rounded-t-md bg-gray-50 p-2.5 uppercase text-slate-500 opacity-100 shadow-sm"
          id="table-header">
          <p className="text-center text-xs font-semibold">#</p>
          <p className="col-span-2 pl-3 pr-2 text-start text-xs font-semibold">Địa điểm</p>
          <p className="text-center text-xs font-semibold">AQI</p>
          <p className="col-span-3 text-center text-xs font-semibold">Lưu ý</p>
        </div>
        <div
          id="table-body"
          className="scrollbar relative grid h-[calc(100%-3.5rem)] grid-cols-7 gap-1 overflow-y-auto py-2 font-medium"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 #f8fafc",
          }}>
          {data.map((d, index) => (
            <TableRow key={d.vn_district} data={d} num={index + 1} isLast={index === data.length - 1} />
          ))}
        </div>
      </div>
    </Loading>
  );
};

export default RankTable;
