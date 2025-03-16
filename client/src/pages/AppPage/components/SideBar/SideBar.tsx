import { getAllDistricts } from "@/api/districts";
import { IPropsSideBar } from "@/components/types";
import { TimeContext } from "@/context";
import useDistrictRanking from "@/hooks/useDistrictRanking";
import { cn } from "@/lib/utils";
import { BarChartOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Collapse, CollapseProps } from "antd";
import { useContext, useEffect, useState } from "react";
import LocationDataCard from "./components/Location/LineChart/LocationDataCard";
import WarningTab from "./components/Location/WarningTab/WarningTab";
import RankTable from "./components/RankTable";
import SearchBar from "./components/SearchBar";
import TabButton, { IPropsTabButton } from "./components/TabButton";
import TabContent from "./components/TabContent";

const DEFAULT_DISTRICT = "VNM.27.12_1";

const getCollapseItems = (
  tabIndex: number,
  TabButton: React.FC<IPropsTabButton>,
  tabComponents: Array<{ component: React.ReactNode }>,
  setTabIndex: (index: number) => void,
): CollapseProps["items"] => [
  {
    key: "1",
    label: (
      <div className="flex w-full">
        <TabButton index={0} icon={EnvironmentOutlined} activeIndex={tabIndex} setTabIndex={setTabIndex} />
        <TabButton index={1} icon={BarChartOutlined} activeIndex={tabIndex} setTabIndex={setTabIndex} />
      </div>
    ),
    className: "m-0 w-full rounded-md bg-white p-0 [&_.ant-collapse-content-box]:p-0",
    styles: { body: { paddingRight: 0 } },
    children: tabComponents[tabIndex].component,
  },
];

const SideBar: React.FC<IPropsSideBar> = ({ setExpanded, className }) => {
  const [targetDistrictID, setTargetDistrictID] = useState<string>(DEFAULT_DISTRICT);
  const [tabIndex, setTabIndex] = useState(0);

  const { data: districts = [] } = useQuery({
    queryKey: ["districts:*"],
    queryFn: getAllDistricts,
  });

  const { time } = useContext(TimeContext);
  const { mutation, tableData } = useDistrictRanking(time);

  useEffect(() => {
    mutation.mutate(time);
  }, [time]);

  const tabComponents = [
    {
      component: (
        <TabContent title="Điểm đang chọn" className="scrollbar overflow-y-auto scroll-smooth">
          <WarningTab className="" district_id={targetDistrictID} />
          <LocationDataCard className="h-1/2 w-full" district_id={targetDistrictID} />
        </TabContent>
      ),
    },
    {
      component: (
        <TabContent title="Bảng xếp hạng">
          <RankTable tableData={tableData} loading={!mutation.isSuccess} />
        </TabContent>
      ),
    },
  ];

  const items = getCollapseItems(tabIndex, TabButton, tabComponents, setTabIndex);

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <SearchBar districts={districts} setTargetDistrict={setTargetDistrictID} className="relative" />
      <Collapse
        onChange={() => setExpanded((prev) => !prev)}
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
