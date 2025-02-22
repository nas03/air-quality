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
      }}
    >
      <div className="h-screen w-screen">
        <ControlBar className="h-[5%] w-full" />
        <div className="flex h-[95%] w-full flex-col gap-5 bg-[#f4f4f4] px-5 pt-5">
          <OverviewCards />
          <div className="flex h-[85%] flex-col gap-3">
            <div className="flex h-1/2 w-full flex-row gap-3">
              <DataLineChart key={1} chartID={1} className="h-full w-[30%] rounded-md bg-white" />
              <SelectionMap className="h-full w-[70%] rounded-md" />
            </div>
            <div className="flex h-1/2 w-full flex-row gap-3">
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
