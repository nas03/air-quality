import { getAllDistricts } from "@/api/districts";
import AverageLineChart from "@/components/SideBar/Location/AverageLineChartTab";
import WarningTab from "@/components/SideBar/Location/WarningTab/WarningTab";
import RankTable from "@/components/SideBar/Rank/RankTable";

import SearchBar from "@/components/SideBar/SearchBar";

import { IPropsSideBar } from "@/components/types";
import { BarChartOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Collapse, CollapseProps } from "antd";
import { useState } from "react";

const SideBar: React.FC<IPropsSideBar> = (props) => {
  const [targetDistrictID, setTargetDistrictID] = useState<string>("VNM.27.12_1");
  const [tabIndex, setTabIndex] = useState(0);
  const { data } = useQuery({
    queryKey: ["districts:*"],
    queryFn: getAllDistricts,
  });

  const Tabs = () => {
    return (
      <div className="flex w-full">
        <button
          className={`flex w-full items-center justify-center border-r border-gray-200 ${tabIndex === 0 ? "text-blue-600" : "text-gray-400"} transition-colors hover:text-blue-500`}
          onClick={() => setTabIndex(0)}
        >
          <EnvironmentOutlined className="text-base" />
        </button>
        <button
          className={`flex w-full items-center justify-center ${tabIndex === 1 ? "text-blue-600" : "text-gray-400"} transition-colors hover:text-blue-500`}
          onClick={() => setTabIndex(1)}
        >
          <BarChartOutlined className="text-base" />
        </button>
      </div>
    );
  };
  const TabItems: { component: React.ReactNode }[] = [
    {
      component: (
        <>
          <div className="h-[calc(100vh-10.3rem)] overflow-y-auto scroll-smooth">
            <h3 className="text-lg font-bold">Điểm đang chọn</h3>
            <WarningTab district_id={targetDistrictID} />
            <AverageLineChart className="w-full" district_id={targetDistrictID} />
          </div>
        </>
      ),
    },
    {
      component: (
        <div className="h-[calc(100vh-10.3rem)] overflow-y-auto scroll-smooth">
          <h3 className="text-lg font-bold">Bảng xếp hạng</h3>
          <RankTable />
        </div>
      ),
    },
  ];
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <Tabs />,
      className: "m-0 w-full rounded-md bg-white p-0 [&_.ant-collapse-content-box]:p-0",
      styles: {
        body: {
          paddingRight: 0,
        },
      },
      children: TabItems[tabIndex].component,
    },
  ];

  return (
    <div className="absolute ml-[3rem] mt-[1rem] flex max-h-screen w-[23rem] flex-col gap-5">
      <SearchBar districts={data || []} setTargetDistrict={setTargetDistrictID} className="relative" />
      <Collapse
        onChange={() => props.setExpanded((prev: boolean) => !prev)}
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
