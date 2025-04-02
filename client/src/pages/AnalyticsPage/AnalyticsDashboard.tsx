import { AnalyticContext } from "@/context";
import { AnalyticData } from "@/types/types";
import { useState } from "react";
import { ControlBar, DataBarChart, DataLineChart, OverviewCards, SelectionMap } from "./components";
import SelectedDistrictChart from "./components/DataChart/SelectedDistrictChart";

interface IPropsAnalyticsBoard extends React.ComponentPropsWithoutRef<"div"> {}

const AnalyticsDashboard: React.FC<IPropsAnalyticsBoard> = () => {
  const [analyticData, setAnalyticData] = useState<AnalyticData>({
    dateRange: ["", ""],
    province_id: "",
    dataType: 1,
    selectedDistrict: "",
  });

  return (
    <AnalyticContext.Provider
      value={{
        setAnalyticData: setAnalyticData,
        dateRange: analyticData.dateRange,
        province_id: analyticData.province_id,
        dataType: analyticData.dataType,
        selectedDistrict: analyticData.selectedDistrict,
      }}>
      <div className="h-screen w-screen">
        <ControlBar className="h-[6%] w-full" />
        <div className="flex h-[94%] w-full flex-col gap-5 bg-[#f4f4f4] px-0 pt-5 lg:px-5">
          <OverviewCards className="flex-shrink" />
          <div className="flex flex-grow flex-col gap-3">
            <div className="flex h-[49%] w-full flex-row gap-3">
              <DataLineChart key={1} chartID={1} className="h-full w-[30%] rounded-md bg-white" />
              <SelectionMap className="h-full w-[70%] rounded-md" />
            </div>
            <div className="flex h-[49%] w-full flex-row gap-3">
              <SelectedDistrictChart key={2} chartID={2} className="h-full w-[30%] rounded-md bg-white" />
              <DataBarChart className="h-full w-[70%] rounded-md bg-white" />
            </div>
          </div>
        </div>
      </div>
    </AnalyticContext.Provider>
  );
};

export default AnalyticsDashboard;
