import Loading from "@/components/Loading";
import { RankData } from "@/hooks/useRankMutation";
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
        <p>{num}</p>
      </div>
      <p className="col-span-2 flex items-center justify-start pl-3 pr-2">{data.vn_district}</p>
      <div className="flex flex-row items-center justify-center text-white">
        <p className="flex h-2/3 items-center rounded-3xl px-5 py-2" style={{ backgroundColor: style.color }}>
          {data.aqi_index}
        </p>
      </div>
      <p className="col-span-3 text-center">{style.status}</p>
      {!isLast && <div className="col-span-7 my-2 border-b border-gray-200" />}
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
      <div className={cn(className, "mt-3 h-full font-sans")}>
        <div className="grid grid-cols-7 bg-white pb-2 uppercase text-slate-400 opacity-100" id="table-header">
          <p className="text-center font-semibold">#</p>
          <p className="col-span-2 pl-3 pr-2 text-start font-semibold">Địa điểm</p>
          <p className="text-center font-semibold">AQI</p>
          <p className="col-span-3 text-center font-semibold">Lưu ý</p>
        </div>
        <div
          id="table-body"
          className="scrollbar relative grid h-[calc(100%-3rem)] grid-cols-7 gap-1 overflow-y-auto font-[500]"
        >
          {data.map((d, index) => (
            <TableRow key={d.vn_district} data={d} num={index + 1} isLast={index === data.length - 1} />
          ))}
        </div>
      </div>
    </Loading>
  );
};

export default RankTable;
