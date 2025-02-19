import { AnalyticContext } from "@/context";
import { AnalyticData } from "@/types/types";
import { useState } from "react";
import { ControlBar, DataBarChart, DataDescriptionCard, DataLineChart, SelectionMap } from "./components";
import { CardData } from "./components/DataDescriptionCard";

interface IPropsAnalyticsBoard extends React.ComponentPropsWithoutRef<"div"> {}

const AnalyticsDashboard: React.FC<IPropsAnalyticsBoard> = () => {
  const [analyticData, setAnalyticData] = useState<AnalyticData>({
    dateRange: ["", ""],
    location: "",
    dataType: 1,
  });

  const infoCardData: CardData[] = [
    {
      data: [{ content: 22, unit: "Ngày" }],
      header: "số ngày ô nhiễm",
    },
    {
      data: [{ content: 30, unit: "Quận" }],
      header: "Số quận ô nhiễm",
    },
    {
      data: [
        { content: "Mỹ Đức", unit: "" },
        { content: 22, unit: "(AQI Index)" },
      ],
      header: "Ít ô nhiễm nhất",
    },
    {
      data: [
        { content: "Mỹ Đức", unit: "" },
        { content: 22, unit: "(AQI Index)" },
      ],
      header: "Ô nhiễm nhất",
    },
  ];
  return (
    <AnalyticContext.Provider
      value={{
        setAnalyticData: setAnalyticData,
        dateRange: analyticData.dateRange,
        location: analyticData.location,
        dataType: analyticData.dataType,
      }}
    >
      <div className="h-screen w-screen">
        <ControlBar className="h-[5%] w-screen" />
        <div className="flex h-[95%] flex-col gap-5 bg-[#f4f4f4] px-5 pt-5">
          <div className="flex max-h-[10%] w-full flex-row gap-5">
            {infoCardData.map((el, index) => (
              <DataDescriptionCard data={el.data} key={index} header={el.header} className="w-1/4" />
            ))}
          </div>
          <div className="flex h-[calc(85%/2)] w-full flex-row gap-5">
            <DataLineChart data={[]} className="h-full w-[30%]" />
            <SelectionMap className="h-full w-[70%]" />
          </div>
          <div className="flex h-[calc(85%/2)] w-full flex-row gap-5">
            <DataLineChart data={[]} className="h-full w-[30%]" />
            <DataBarChart data={[]} className="h-full w-[70%]" />
          </div>
        </div>
      </div>
    </AnalyticContext.Provider>
  );
};

export default AnalyticsDashboard;
