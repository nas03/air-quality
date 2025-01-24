import { getRankByDate } from "@/api";
import Loading from "@/components/Loading";
import { getStyleRankTable } from "@/components/SideBar/utils";
import { TimeContext } from "@/context";
import { MDistrict, Statistic } from "@/types/db";
import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";

interface RankData {
  vn_district: string;
  aqi_index: number;
}

interface RankTableProps {
  className?: string;
}

const TableRow = ({ data, isLast }: { data: RankData; isLast: boolean }) => {
  const style = getStyleRankTable(data.aqi_index);

  return (
    <>
      <p className="col-span-2 flex items-center justify-start text-base font-normal">{data.vn_district}</p>
      <p className="flex items-center justify-center text-white" style={{ backgroundColor: style.color }}>
        {data.aqi_index}
      </p>
      <p className="col-span-2 text-center">{style.status}</p>
      {!isLast && <div className="col-span-5 my-2 border-b border-gray-200" />}
    </>
  );
};

const RankTable: React.FC<RankTableProps> = ({ className }) => {
  const { time } = useContext(TimeContext);
  const [tableData, setTableData] = useState<RankData[]>([]);

  const mutation = useMutation({
    mutationKey: ["rank", time],
    mutationFn: (date: string) => getRankByDate(date),
    networkMode: "offlineFirst",
    onSuccess: (data: (Statistic & MDistrict)[] | null) => {
      const resultData =
        data
          ?.map((el) => ({
            vn_district: el.vn_district,
            aqi_index: el.aqi_index,
          }))
          .sort((a, b) => b.aqi_index - a.aqi_index) ?? [];

      setTableData(resultData);
    },
  });

  useEffect(() => {
    mutation.mutate(time);
  }, [time]);

  return (
    <Loading loading={mutation.isPending}>
      <div className={className}>
        <div className="grid grid-cols-5 text-lg" id="table-header">
          <p className="col-span-2 text-start font-semibold">Province</p>
          <p className="text-center font-semibold">AQI</p>
          <p className="col-span-2 text-center font-semibold">Status</p>
        </div>
        <div id="table-body" className="grid grid-cols-5 gap-1">
          {tableData.map((data, index) => (
            <TableRow key={data.vn_district} data={data} isLast={index === tableData.length - 1} />
          ))}
        </div>
      </div>
    </Loading>
  );
};

export default RankTable;
