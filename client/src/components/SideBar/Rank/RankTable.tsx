import { getRankByDate } from "@/api";
import Loading from "@/components/Loading";
import { getStyleRankTable } from "@/components/SideBar/config";
import { TimeContext } from "@/context";
import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
export interface IPropsRankTable {
  className?: string;
}
const RankTable: React.FC<IPropsRankTable> = (props) => {
  const timeContext = useContext(TimeContext);
  const mutation = useMutation({
    mutationKey: ["rank", timeContext.time],
    mutationFn: (date: string) => getRankByDate(date),
    networkMode: 'offlineFirst'
  });
  const [tableData, setTableData] = useState<{ vn_district: string; aqi_index: number }[]>([]);

  useEffect(() => {
    mutation.mutate(timeContext.time);
  }, [timeContext.time]);

  useEffect(() => {
    if (mutation.data) {
      const data = mutation.data;
      let resultData = data
        .map((el) => ({
          vn_district: el.vn_district,
          aqi_index: el.aqi_index,
        }))
        .sort((a, b) => b.aqi_index - a.aqi_index);

      setTableData(resultData);
    }
  }, [mutation.data]);

  return (
    <Loading loading={mutation.isPending}>
      <div className={`${props.className}`}>
        <div className="grid grid-cols-5 text-lg" id="table-header">
          <p className="col-span-2 text-start font-semibold">Province</p>
          <p className="text-center font-semibold">AQI</p>
          <p className="col-span-2 text-center font-semibold">Status</p>
        </div>
        <div id="table-body" className="grid grid-cols-5 gap-1">
          {tableData.map((el, index) => {
            const style = getStyleRankTable(el.aqi_index);
            return (
              <>
                <p className="col-span-2 flex items-center justify-start text-base font-normal">{el.vn_district}</p>
                <p className="flex items-center justify-center text-white" style={{ backgroundColor: style.color }}>
                  {el.aqi_index}
                </p>
                <p className="col-span-2 text-center">{style.status}</p>
                {index !== tableData.length - 1 && <div className="col-span-5 my-2 border-b border-gray-200"></div>}
              </>
            );
          })}
        </div>
      </div>
    </Loading>
  );
};

export default RankTable;
