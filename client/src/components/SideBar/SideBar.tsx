import { getAllDistricts } from "@/api/districts";
import AirQualityHistoryChart from "@/components/SideBar/components/Location/LineChart/AirQualityHistoryChart";
import WarningTab from "@/components/SideBar/components/Location/WarningTab/WarningTab";
import RankTable from "@/components/SideBar/components/RankTable";
import SearchBar from "@/components/SideBar/components/SearchBar";
import { IPropsSideBar } from "@/components/types";
import { BarChartOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Collapse, CollapseProps } from "antd";
import { useState } from "react";

const SideBar: React.FC<IPropsSideBar> = ({ setExpanded }) => {
  const [targetDistrictID, setTargetDistrictID] = useState<string>("VNM.27.12_1");
  const [tabIndex, setTabIndex] = useState(0);

  const { data: districts = [] } = useQuery({
    queryKey: ["districts:*"],
    queryFn: getAllDistricts,
  });

  const TabButton = ({ index, icon: Icon }: { index: number; icon: typeof EnvironmentOutlined }) => (
    <button
      className={`flex w-full items-center justify-center ${
        index === tabIndex ? "text-blue-600" : "text-gray-400"
      } ${index === 0 ? "border-r border-gray-200" : ""} transition-colors hover:text-blue-500`}
      onClick={() => setTabIndex(index)}
    >
      <Icon className="text-base" />
    </button>
  );

  const TabContent = ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div className="h-[calc(100vh-10.3rem)] overflow-y-auto scroll-smooth">
      <h3 className="text-lg font-bold">{title}</h3>
      {children}
    </div>
  );

  const tabComponents = [
    {
      component: (
        <TabContent title="Điểm đang chọn">
          <WarningTab district_id={targetDistrictID} />
          <AirQualityHistoryChart className="w-full" district_id={targetDistrictID} />
        </TabContent>
      ),
    },
    {
      component: (
        <TabContent title="Bảng xếp hạng">
          <RankTable />
        </TabContent>
      ),
    },
  ];

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex w-full">
          <TabButton index={0} icon={EnvironmentOutlined} />
          <TabButton index={1} icon={BarChartOutlined} />
        </div>
      ),
      className: "m-0 w-full rounded-md bg-white p-0 [&_.ant-collapse-content-box]:p-0",
      styles: {
        body: {
          paddingRight: 0,
        },
      },
      children: tabComponents[tabIndex].component,
    },
  ];

  return (
    <div className="absolute ml-[3rem] mt-[1rem] flex max-h-screen w-[23rem] flex-col gap-5">
      <SearchBar districts={districts} setTargetDistrict={setTargetDistrictID} className="relative" />
      <Collapse
        onChange={() => setExpanded((prev: boolean) => !prev)}
        expandIconPosition="end"
        defaultActiveKey={["1"]}
        collapsible="icon"
        className="relative w-full rounded-md p-0"
        items={items}
      />
    </div>
  );
};

export default SideBar;
